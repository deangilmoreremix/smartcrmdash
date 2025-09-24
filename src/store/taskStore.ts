import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Task, 
  SubTask, 
  TaskAttachment, 
  TaskReminder, 
  TaskTemplate, 
  Activity, 
  TaskMetrics,
  CalendarEvent,
  TaskFilter
} from '../types/task';

type TaskStatus = Task['status'];
type TaskPriority = Task['priority'];

interface TaskStore {
  tasks: Task[];
  templates: TaskTemplate[];
  activities: Activity[];
  calendarEvents: CalendarEvent[];
  analytics: TaskMetrics;
  isLoading: boolean;
  
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  assigneeFilter: string | 'all';
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week' | 'month';
  searchQuery: string;
  activityFilter: TaskFilter;

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  fetchTasks: () => Promise<void>;

  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
}

const initialMetrics: TaskMetrics = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  overdueTasks: 0,
  tasksCompletedToday: 0,
  tasksCompletedThisWeek: 0,
  tasksCompletedThisMonth: 0,
  averageCompletionTime: 0,
  completionRate: 0,
  tasksByType: {
    'call': 0,
    'email': 0,
    'meeting': 0,
    'follow-up': 0,
    'proposal': 0,
    'demo': 0,
    'contract': 0,
    'research': 0,
    'administrative': 0,
    'other': 0
  },
  tasksByPriority: {
    'low': 0,
    'medium': 0,
    'high': 0,
    'urgent': 0
  },
  tasksByStatus: {
    'pending': 0,
    'in-progress': 0,
    'completed': 0,
    'cancelled': 0,
    'overdue': 0
  },
  tasksByUser: {},
  productivityScore: 0
};

const initialFilter: TaskFilter = {
  statuses: undefined,
  types: undefined,
  priorities: undefined,
  assignedUsers: undefined,
  tags: undefined,
  dateRange: undefined,
  dueDateRange: undefined,
  searchTerm: undefined,
  isOverdue: undefined,
  isDueToday: undefined,
  isDueTomorrow: undefined,
  isDueThisWeek: undefined,
  hasAttachments: undefined,
  hasSubtasks: undefined,
  contactId: undefined,
  dealId: undefined,
  companyId: undefined
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      templates: [],
      activities: [],
      calendarEvents: [],
      analytics: initialMetrics,
      isLoading: false,
      
      statusFilter: 'all',
      priorityFilter: 'all',
      assigneeFilter: 'all',
      dueDateFilter: 'all',
      searchQuery: '',
      activityFilter: initialFilter,

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
        
        set({ tasks: [...get().tasks, newTask] });
      },
      
      updateTask: (id, updates) => {
        set({
          tasks: get().tasks.map(task => 
            task.id === id 
              ? { ...task, ...updates, updatedAt: new Date() } 
              : task
          )
        });
      },
      
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter(task => task.id !== id) });
      },
      
      getTask: (id) => get().tasks.find(task => task.id === id),

      fetchTasks: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/tasks');
          if (response.ok) {
            const tasks = await response.json();
            set({ tasks, isLoading: false });
          }
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
          set({ isLoading: false });
        }
      },

      getFilteredTasks: () => {
        const state = get();
        return state.tasks.filter(task => {
          const statusMatch = state.statusFilter === 'all' || task.status === state.statusFilter;
          const priorityMatch = state.priorityFilter === 'all' || task.priority === state.priorityFilter;
          const searchMatch = !state.searchQuery || 
            task.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(state.searchQuery.toLowerCase());
          return statusMatch && priorityMatch && searchMatch;
        });
      },

      getTasksByStatus: (status) => get().tasks.filter(task => task.status === status)
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
