import { supabase } from '../lib/supabase';

export interface Deal {
  id: string;
  title: string;
  company: string;
  contact_id?: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const createDealInSupabase = async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert(deal)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create deal: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
};

export const updateDealInSupabase = async (id: string, updates: Partial<Deal>): Promise<Deal> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update deal: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
};

export const deleteDealFromSupabase = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete deal: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};

export const fetchDealsFromSupabase = async (): Promise<Deal[]> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch deals: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};

export const fetchDealById = async (id: string): Promise<Deal | null> => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Deal not found
      }
      throw new Error(`Failed to fetch deal: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching deal by ID:', error);
    throw error;
  }
};

// Mock data for demo purposes
export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise CRM Solution',
    company: 'Tech Corp Inc.',
    value: 50000,
    stage: 'Proposal',
    probability: 75,
    expected_close_date: '2025-02-15',
    description: 'Full CRM implementation for large enterprise client',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-20T15:30:00Z',
    user_id: 'user-1'
  },
  {
    id: '2',
    title: 'SMB Software Package',
    company: 'Small Business Ltd.',
    value: 15000,
    stage: 'Negotiation',
    probability: 60,
    expected_close_date: '2025-03-01',
    description: 'Small business CRM solution',
    created_at: '2025-01-15T09:00:00Z',
    updated_at: '2025-01-25T11:20:00Z',
    user_id: 'user-1'
  }
];
