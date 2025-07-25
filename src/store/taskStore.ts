import { create } from 'zustand';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TaskState {
  tasks: Record<string, Task>;
  isLoading: boolean;
  error: string | null;
  selectedTask: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  selectTask: (id: string | null) => void;
  markTaskComplete: (id: string, completed: boolean) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Follow up with John Doe',
      description: 'Send proposal follow-up email',
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      completed: false,
      priority: 'high',
      relatedTo: {
        type: 'contact',
        id: '1'
      },
      category: 'follow-up',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'task-2': {
      id: 'task-2',
      title: 'Prepare demo for Acme Inc',
      description: 'Create custom demo showing enterprise features',
      dueDate: new Date(Date.now() + 172800000), // 2 days
      completed: false,
      priority: 'medium',
      relatedTo: {
        type: 'deal',
        id: 'deal-1'
      },
      category: 'meeting',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'task-3': {
      id: 'task-3',
      title: 'Update sales forecast',
      description: 'Review pipeline and update Q3 forecast',
      dueDate: new Date(Date.now() + 259200000), // 3 days
      completed: false,
      priority: 'medium',
      category: 'other',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'task-4': {
      id: 'task-4',
      title: 'Call Sarah Williams',
      description: 'Discuss renewal options',
      dueDate: new Date(Date.now() - 86400000), // yesterday
      completed: true,
      completedAt: new Date(Date.now() - 43200000), // 12 hours ago
      priority: 'high',
      relatedTo: {
        type: 'contact',
        id: '4'
      },
      category: 'call',
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 43200000)
    },
    'task-5': {
      id: 'task-5',
      title: 'Send contract to Globex Corp',
      description: 'Finalize and send contract for signature',
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      completed: false,
      priority: 'high',
      relatedTo: {
        type: 'deal',
        id: 'deal-2'
      },
      category: 'email',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  isLoading: false,
  error: null,
  selectedTask: null,
  
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would fetch tasks from the API here
      // For now, we'll just simulate a delay and use the mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, we would set the tasks from the API response
      // set({ tasks: fetchedTasks });
      
      set({ isLoading: false });
    } catch (err) {
      console.error('Error fetching tasks:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch tasks' 
      });
    }
  },
  
  createTask: async (taskData: Partial<Task>) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would create the task via API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskId = uuidv4();
      const newTask: Task = {
        id: taskId,
        title: taskData.title || 'New Task',
        description: taskData.description || '',
        dueDate: taskData.dueDate,
        completed: taskData.completed || false,
        priority: taskData.priority || 'medium',
        relatedTo: taskData.relatedTo,
        category: taskData.category || 'other',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: taskData.assignedTo,
        completedAt: taskData.completed ? new Date() : undefined,
        reminderDate: taskData.reminderDate,
        notes: taskData.notes,
        tags: taskData.tags
      };
      
      const { tasks } = get();
      
      set({ 
        tasks: { ...tasks, [taskId]: newTask },
        isLoading: false 
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error('Error creating task:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to create task' 
      });
      return Promise.reject(err);
    }
  },
  
  updateTask: async (id: string, taskData: Partial<Task>) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would update the task via API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { tasks } = get();
      const existingTask = tasks[id];
      
      if (!existingTask) {
        throw new Error(`Task with id ${id} not found`);
      }
      
      const updatedTask: Task = {
        ...existingTask,
        ...taskData,
        updatedAt: new Date()
      };
      
      if (taskData.completed === true && !existingTask.completed) {
        updatedTask.completedAt = new Date();
      }
      
      if (taskData.completed === false) {
        updatedTask.completedAt = undefined;
      }
      
      set({ 
        tasks: { ...tasks, [id]: updatedTask },
        isLoading: false 
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error('Error updating task:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to update task' 
      });
      return Promise.reject(err);
    }
  },
  
  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would delete the task via API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { tasks } = get();
      const { [id]: deletedTask, ...remainingTasks } = tasks;
      
      set({ 
        tasks: remainingTasks,
        isLoading: false,
        selectedTask: null 
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error('Error deleting task:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to delete task' 
      });
      return Promise.reject(err);
    }
  },
  
  selectTask: (id) => {
    set({ selectedTask: id });
  },
  
  markTaskComplete: async (id: string, completed: boolean) => {
    get().updateTask(id, { 
      completed,
      completedAt: completed ? new Date() : undefined 
    });
  }
}));