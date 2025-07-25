import { supabase } from './supabaseClient';
import { Deal } from '../types';

// Fetch all deals for the current user
const fetchDeals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    return { data, error };
  } catch (error) {
    console.error("Error fetching deals:", error);
    return { data: null, error };
  }
};

// Fetch deals by stage
const fetchDealsByStage = async (userId: string, stage: string) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', stage)
      .order('created_at', { ascending: false });
      
    return { data, error };
  } catch (error) {
    console.error("Error fetching deals by stage:", error);
    return { data: null, error };
  }
};

// Create a new deal
const createDeal = async (dealData: Partial<Deal>, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .insert([{ ...dealData, user_id: userId }])
      .select();
      
    return { data, error };
  } catch (error) {
    console.error("Error creating deal:", error);
    return { data: null, error };
  }
};

// Update an existing deal
const updateDeal = async (id: string, dealData: Partial<Deal>) => {
  try {
    // Add updated_at timestamp
    const updatedDealData = {
      ...dealData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('deals')
      .update(updatedDealData)
      .eq('id', id)
      .select();
      
    return { data, error };
  } catch (error) {
    console.error("Error updating deal:", error);
    return { data: null, error };
  }
};

// Delete a deal
const deleteDeal = async (id: string) => {
  try {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);
      
    return { error };
  } catch (error) {
    console.error("Error deleting deal:", error);
    return { error };
  }
};

// Update deal stage and handle stage transition logic
const updateDealStage = async (id: string, newStage: string, oldStage: string) => {
  try {
    // Get current deal data to calculate days in stage
    const { data: currentDealData, error: fetchError } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Reset days in stage when stage changes
    const daysInStage = newStage !== oldStage ? 0 : (currentDealData?.days_in_stage || 0);
    
    // Update probability based on stage
    let probability = currentDealData?.probability || 0;
    
    switch(newStage) {
      case 'qualification':
        probability = 10;
        break;
      case 'initial':
        probability = 25;
        break;
      case 'proposal':
        probability = 50;
        break;
      case 'negotiation':
        probability = 75;
        break;
      case 'closed-won':
        probability = 100;
        break;
      case 'closed-lost':
        probability = 0;
        break;
    }
    
    const { data, error } = await supabase
      .from('deals')
      .update({ 
        stage: newStage, 
        probability,
        days_in_stage: daysInStage,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
      
    return { data, error };
  } catch (error) {
    console.error("Error updating deal stage:", error);
    return { data: null, error };
  }
};

// Get deal statistics
const getDealStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Calculate statistics
    const totalDeals = data.length;
    const totalValue = data.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const closedWonValue = data
      .filter(deal => deal.stage === 'closed-won')
      .reduce((sum, deal) => sum + (deal.value || 0), 0);
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
    
    const dealsPerStage = {
      qualification: data.filter(deal => deal.stage === 'qualification').length,
      initial: data.filter(deal => deal.stage === 'initial').length,
      proposal: data.filter(deal => deal.stage === 'proposal').length,
      negotiation: data.filter(deal => deal.stage === 'negotiation').length,
      'closed-won': data.filter(deal => deal.stage === 'closed-won').length,
      'closed-lost': data.filter(deal => deal.stage === 'closed-lost').length,
    };
    
    return { 
      totalDeals,
      totalValue,
      closedWonValue,
      avgDealSize,
      dealsPerStage,
      error: null
    };
  } catch (error) {
    console.error("Error getting deal statistics:", error);
    return { error };
  }
};

// Fetch deals that need attention
const getHighPriorityDeals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .in('stage', ['qualification', 'proposal', 'negotiation'])
      .order('updated_at', { ascending: true })
      .limit(5);
      
    return { data, error };
  } catch (error) {
    console.error("Error fetching high priority deals:", error);
    return { data: null, error };
  }
};

// For development/demo purposes when Supabase isn't available
export const fetchDealsFromSupabase = async (userId?: string) => {
  try {
    // This is a simulated function since we don't have the actual deals table yet
    // In a real implementation, we would query Supabase
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return {
      data: [
        {
          id: 'deal-1',
          title: 'Enterprise License',
          amount: 75000,
          company: 'Acme Inc',
          contact: 'John Doe',
          dueDate: new Date('2025-07-15'),
          stage: 'qualification',
          value: 75000,
          probability: 10,
          days_in_stage: 5,
          priority: 'high'
        },
        {
          id: 'deal-2',
          title: 'Software Renewal',
          amount: 45000,
          company: 'Globex Corp',
          contact: 'Jane Smith',
          dueDate: new Date('2025-06-30'),
          stage: 'proposal',
          value: 45000,
          probability: 50,
          days_in_stage: 3,
          priority: 'medium'
        },
        {
          id: 'deal-3',
          title: 'Support Contract',
          amount: 25000,
          company: 'Initech',
          contact: 'Robert Johnson',
          dueDate: new Date('2025-07-10'),
          stage: 'negotiation',
          value: 25000,
          probability: 75,
          days_in_stage: 7,
          priority: 'low'
        },
        {
          id: 'deal-4',
          title: 'Implementation Services',
          amount: 50000,
          company: 'Umbrella Corp',
          contact: 'Sarah Williams',
          dueDate: new Date('2025-06-25'),
          stage: 'negotiation',
          value: 50000,
          probability: 75,
          days_in_stage: 2,
          priority: 'medium'
        },
        {
          id: 'deal-5',
          title: 'Cloud Migration',
          amount: 95000,
          company: 'Wayne Enterprises',
          contact: 'Bruce Wayne',
          dueDate: new Date('2025-08-05'),
          stage: 'qualification',
          value: 95000,
          probability: 10,
          days_in_stage: 1,
          priority: 'high'
        },
        {
          id: 'deal-6',
          title: 'Annual Subscription',
          amount: 36000,
          company: 'Stark Industries',
          contact: 'Tony Stark',
          dueDate: new Date('2025-07-20'),
          stage: 'closed-won',
          value: 36000,
          probability: 100,
          days_in_stage: 0,
          priority: 'medium'
        },
      ],
      error: null
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    return { data: null, error };
  }
};

// Create a new deal in Supabase
export const createDealInSupabase = async (dealData: any) => {
  try {
    // In a real implementation, we would insert into Supabase
    // For now, we'll simulate a successful response
    return {
      data: { 
        ...dealData, 
        id: `deal-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'demo-user-123'
      },
      error: null
    };
  } catch (error) {
    console.error("Error creating deal:", error);
    return { data: null, error };
  }
};

// Update a deal in Supabase
export const updateDealInSupabase = async (id: string, dealData: any) => {
  try {
    // In a real implementation, we would update in Supabase
    // For now, we'll simulate a successful response
    return {
      data: { 
        ...dealData, 
        id,
        updated_at: new Date().toISOString()
      },
      error: null
    };
  } catch (error) {
    console.error("Error updating deal:", error);
    return { data: null, error };
  }
};

// Delete a deal from Supabase
export const deleteDealFromSupabase = async (id: string) => {
  try {
    // In a real implementation, we would delete from Supabase
    // For now, we'll simulate a successful response
    return { error: null };
  } catch (error) {
    console.error("Error deleting deal:", error);
    return { error };
  }
};