import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  contactId?: string;
  dealId?: string;
  category: string;
  assigneeId?: string;
  relatedTo?: {
    type: 'contact' | 'deal';
    id: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  upcoming: number;
}

interface TaskStore {
  tasks: Record<string, Task>;
  selectedTask: string | null;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  markTaskComplete: (id: string, completed: boolean) => Promise<void>;
  selectTask: (id: string | null) => void;
  getTaskStats: () => TaskStats;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: {
    '1': {
      id: '1',
      title: 'Follow up with Jane Doe',
      description: 'Discuss enterprise software requirements',
      completed: false,
      priority: 'high',
      dueDate: new Date('2024-02-10'),
      contactId: '1',
      dealId: '1',
      category: 'follow-up',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    '2': {
      id: '2',
      title: 'Prepare proposal for Ford',
      description: 'Create detailed proposal for marketing automation',
      completed: false,
      priority: 'medium',
      dueDate: new Date('2024-02-08'),
      contactId: '2',
      dealId: '2',
      category: 'proposal',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18')
    },
    '3': {
      id: '3',
      title: 'Schedule demo with Zenith',
      description: 'Set up cloud infrastructure demo',
      completed: true,
      priority: 'medium',
      dueDate: new Date('2024-02-05'),
      contactId: '3',
      dealId: '3',
      category: 'meeting',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20'),
      completedAt: new Date('2024-01-20')
    }
  },
  selectedTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description,
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      contactId: taskData.contactId,
      dealId: taskData.dealId,
      category: taskData.category || 'other',
      assigneeId: taskData.assigneeId,
      relatedTo: taskData.relatedTo,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      tasks: { ...state.tasks, [newTask.id]: newTask }
    }));
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set(state => ({
      tasks: { ...state.tasks, [newTask.id]: newTask }
    }));
  },

  updateTask: (id, updates) => {
    set(state => ({
      tasks: {
        ...state.tasks,
        [id]: {
          ...state.tasks[id],
          ...updates,
          updatedAt: new Date()
        }
      }
    }));
  },

  deleteTask: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.tasks;
      return { tasks: rest };
    });
  },

  markTaskComplete: async (id, completed) => {
    const updates: Partial<Task> = {
      completed,
      completedAt: completed ? new Date() : undefined,
      updatedAt: new Date(),
    };

    set(state => ({
      tasks: {
        ...state.tasks,
        [id]: {
          ...state.tasks[id],
          ...updates
        }
      }
    }));
  },

  selectTask: (id) => {
    set({ selectedTask: id });
  },

  getTaskStats: () => {
    const tasks = Object.values(get().tasks);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate) < today
      ).length,
      dueToday: tasks.filter(t => 
        !t.completed && t.dueDate && 
        new Date(t.dueDate) >= today && new Date(t.dueDate) < tomorrow
      ).length,
      upcoming: tasks.filter(t => 
        !t.completed && t.dueDate && new Date(t.dueDate) >= tomorrow
      ).length,
    };
  },
}));