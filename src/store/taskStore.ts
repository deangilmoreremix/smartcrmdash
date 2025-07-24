import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSameDay, isWithinInterval, add } from 'date-fns';
import { 
  Task, 
  TaskTemplate, 
  CalendarEvent
} from '../types/task';

interface TaskStore {
  // State
  tasks: Task[];
  templates: TaskTemplate[];
  activities: any[];
  calendarEvents: CalendarEvent[];
  analytics: any;
  calendars: any[];
  selectedTask: Task | null;
  filters: any;
  
  // Filter states
  statusFilter: Task['status'] | 'all';
  priorityFilter: Task['priority'] | 'all';
  assigneeFilter: string | 'all';
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
  searchQuery: string;
  activityFilter: any;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  duplicateTask: (id: string) => void;
  
  // Subtask actions
  addSubtask: (taskId: string, subtask: any) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: any) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  completeSubtask: (taskId: string, subtaskId: string) => void;
  
  // Activity actions
  addActivity: (activity: any) => void;
  getActivitiesForEntity: (entityId: string, entityType: string) => any[];
  getRecentActivities: () => any[];
  
  // Template actions
  createTaskFromTemplate: (templateId: string) => void;
  
  // UI state actions
  setSelectedTask: (task: Task | null) => void;
  setFilters: (filters: any) => void;
  
  // Computed properties
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
  getTaskMetrics: () => {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    tasksDueToday: number;
    tasksDueThisWeek: number;
    completionRate: number;
    productivityScore: number;
    tasksByPriority: Record<string, number>;
    tasksByType: Record<string, number>;
    tasksByStatus: Record<string, number>;
    tasksCompletedThisWeek: number;
  };
  getOverdueTasks: () => Task[];
  getTasksDueToday: () => Task[];
  getTasksDueThisWeek: () => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      templates: [],
      activities: [],
      calendarEvents: [],
      calendars: [],
      selectedTask: null,
      filters: {
        status: 'all',
        priority: 'all',
        assignee: 'all',
        dueDate: 'all',
        search: ''
      },
      analytics: {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        tasksCreatedToday: 0,
        tasksCompletedToday: 0,
        averageCompletionTime: 0,
        productivityScore: 0,
        upcomingDeadlines: 0,
        tasksByPriority: { low: 0, medium: 0, high: 0 },
        tasksByStatus: { pending: 0, 'in-progress': 0, completed: 0, cancelled: 0, overdue: 0 },
        completionRate: 0,
        trendsData: []
      },
      
      // Filter initial states
      statusFilter: 'all',
      priorityFilter: 'all',
      assigneeFilter: 'all',
      dueDateFilter: 'all',
      searchQuery: '',
      activityFilter: {
        types: [],
        dateRange: null,
        users: []
      },
      
      // Task actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          attachments: taskData.attachments || [],
          subtasks: taskData.subtasks || [],
          reminders: taskData.reminders || [],
          tags: taskData.tags || [],
          dependencies: taskData.dependencies || [],
          customFields: taskData.customFields || {},
          createdBy: taskData.createdBy || 'current-user'
        };
        
        set((state) => ({ 
          tasks: [...state.tasks, newTask] 
        }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          )
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }));
      },
      
      getTask: (id) => {
        return get().tasks.find((task) => task.id === id);
      },

      duplicateTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        
        const duplicatedTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          title: `${task.title} (Copy)`,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({ 
          tasks: [...state.tasks, duplicatedTask] 
        }));
      },

      // Subtask actions
      addSubtask: (taskId, subtask) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { 
                  ...task, 
                  subtasks: [...(task.subtasks || []), { 
                    ...subtask, 
                    id: crypto.randomUUID(),
                    createdAt: new Date()
                  }],
                  updatedAt: new Date()
                }
              : task
          )
        }));
      },

      updateSubtask: (taskId, subtaskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { 
                  ...task, 
                  subtasks: (task.subtasks || []).map((subtask: any) =>
                    subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                  ),
                  updatedAt: new Date()
                }
              : task
          )
        }));
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { 
                  ...task, 
                  subtasks: (task.subtasks || []).filter((subtask: any) => subtask.id !== subtaskId),
                  updatedAt: new Date()
                }
              : task
          )
        }));
      },

      completeSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { 
                  ...task, 
                  subtasks: (task.subtasks || []).map((subtask: any) =>
                    subtask.id === subtaskId 
                      ? { ...subtask, completed: true, completedAt: new Date() } 
                      : subtask
                  ),
                  updatedAt: new Date()
                }
              : task
          )
        }));
      },

      // Activity actions
      addActivity: (activity) => {
        const newActivity = {
          ...activity,
          id: crypto.randomUUID(),
          timestamp: new Date()
        };
        
        set((state) => ({ 
          activities: [...state.activities, newActivity] 
        }));
      },

      getActivitiesForEntity: (entityId, entityType) => {
        return get().activities.filter(
          (activity: any) => activity.entityId === entityId && activity.entityType === entityType
        );
      },

      getRecentActivities: () => {
        return get().activities
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10);
      },

      // Template actions
      createTaskFromTemplate: (templateId) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) return;
        
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: template.name,
          description: template.description,
          priority: template.priority,
          status: 'pending',
          type: template.type,
          completed: false,
          category: template.type === 'call' ? 'call' : 
                   template.type === 'email' ? 'email' :
                   template.type === 'meeting' ? 'meeting' :
                   template.type === 'follow-up' ? 'follow-up' :
                   template.type === 'proposal' ? 'proposal' :
                   template.type === 'research' ? 'research' :
                   template.type === 'administrative' ? 'administrative' : 'other',
          tags: template.tags || [],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'current-user',
          attachments: [],
          subtasks: template.subtasks.map(st => ({
            ...st,
            id: crypto.randomUUID(),
            parentTaskId: '',
            createdAt: new Date(),
            updatedAt: new Date()
          })),
          reminders: [],
          dependencies: [],
          customFields: template.customFields || {}
        };
        
        // Update the parentTaskId for subtasks after creating the task
        newTask.subtasks = newTask.subtasks.map(st => ({
          ...st,
          parentTaskId: newTask.id
        }));
        
        set((state) => ({ 
          tasks: [...state.tasks, newTask] 
        }));
      },

      // UI state actions
      setSelectedTask: (task) => {
        set({ selectedTask: task });
      },

      setFilters: (filters) => {
        set({ filters });
      },
      
      // Computed properties
      getFilteredTasks: () => {
        const state = get();
        let filtered = state.tasks;
        
        // Status filter
        if (state.statusFilter !== 'all') {
          filtered = filtered.filter((task) => task.status === state.statusFilter);
        }
        
        // Priority filter
        if (state.priorityFilter !== 'all') {
          filtered = filtered.filter((task) => task.priority === state.priorityFilter);
        }
        
        // Search filter
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter((task) =>
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        }
        
        return filtered;
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getTaskMetrics: () => {
        const { tasks } = get();
        const now = new Date();
        const completedTasks = tasks.filter(t => t.status === 'completed');
        const overdueTasks = tasks.filter(t => 
          t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
        );
        const todayTasks = tasks.filter(t =>
          t.dueDate && isSameDay(new Date(t.dueDate), now)
        );
        const weekTasks = tasks.filter(t => {
          if (!t.dueDate) return false;
          const d = new Date(t.dueDate);
          return isWithinInterval(d, { start: now, end: add(now, { days: 7 }) });
        });

        // Count tasks by priority
        const tasksByPriority = tasks.reduce((acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Count tasks by type (using category as type)
        const tasksByType = tasks.reduce((acc, task) => {
          const type = task.category || 'uncategorized';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Count tasks by status
        const tasksByStatus = tasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
        const productivityScore = Math.min(100, completionRate + (tasks.length > 0 ? 20 : 0));

        return {
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          pendingTasks: tasks.filter(t => t.status === 'pending').length,
          overdueTasks: overdueTasks.length,
          tasksDueToday: todayTasks.length,
          tasksDueThisWeek: weekTasks.length,
          completionRate,
          productivityScore,
          tasksByPriority,
          tasksByType,
          tasksByStatus,
          tasksCompletedThisWeek: completedTasks.filter(t => {
            if (!t.updatedAt) return false;
            const weekStart = add(now, { days: -7 });
            return isWithinInterval(new Date(t.updatedAt), { start: weekStart, end: now });
          }).length
        };
      },

      getOverdueTasks: () => {
        return get().tasks.filter(t => 
          t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
        );
      },

      getTasksDueToday: () => {
        return get().tasks.filter(t =>
          t.dueDate ? isSameDay(new Date(t.dueDate), new Date()) : false
        );
      },

      getTasksDueThisWeek: () => {
        const now = new Date();
        return get().tasks.filter(t => {
          if (!t.dueDate) return false;
          const d = new Date(t.dueDate);
          return isWithinInterval(d, { start: now, end: add(now, { days: 7 }) });
        });
      }
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        templates: state.templates,
        activities: state.activities,
        calendarEvents: state.calendarEvents
      })
    }
  )
);
