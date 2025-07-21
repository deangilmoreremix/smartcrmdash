import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Task, 
  SubTask, 
  TaskAttachment, 
  TaskReminder, 
  TaskTemplate, 
  TaskActivity, 
  TaskAnalytics, 
  CalendarEvent, 
  ActivityFilter, 
  TaskPriority, 
  TaskStatus 
} from '../types/task';

interface TaskStore {
  // State
  tasks: Task[];
  templates: TaskTemplate[];
  activities: TaskActivity[];
  calendarEvents: CalendarEvent[];
  analytics: TaskAnalytics;
  
  // Filter states
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  assigneeFilter: string | 'all';
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
  searchQuery: string;
  activityFilter: ActivityFilter;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  
  // Computed properties
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      templates: [],
      activities: [],
      calendarEvents: [],
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
