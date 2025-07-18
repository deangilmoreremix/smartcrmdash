export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  contactId?: string;
  dealId?: string;
  category: 'follow-up' | 'proposal' | 'meeting' | 'call' | 'email' | 'research' | 'administrative' | 'other';
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

export interface TaskFilters {
  status: 'all' | 'completed' | 'pending' | 'overdue';
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  category: 'all' | 'follow-up' | 'proposal' | 'meeting' | 'call' | 'email' | 'research' | 'administrative' | 'other';
  assignee: string;
}

export type TaskSort = 'dueDate' | 'priority' | 'title' | 'createdAt';
