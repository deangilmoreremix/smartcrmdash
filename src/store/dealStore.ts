import { create } from 'zustand';
import { Deal } from '../types';
import { 
  fetchDealsFromSupabase, 
  createDealInSupabase, 
  updateDealInSupabase, 
  deleteDealFromSupabase 
} from '../services/dealService';

interface DealState {
  deals: Record<string, Deal>;
  columns: Record<string, Column>;
  columnOrder: string[];
  isLoading: boolean;
  error: string | null;
  selectedDeal: string | null;
  aiInsight: string | null;
  isAnalyzing: boolean;
  
  // Pipeline view statistics
  stageValues: Record<string, number>;
  totalPipelineValue: number;
  
  // Actions
  fetchDeals: () => Promise<void>;
  createDeal: (deal: Partial<Deal>) => Promise<void>;
  updateDeal: (id: string, deal: Partial<Deal>) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  moveDealToStage: (dealId: string, sourceStage: string, destinationStage: string, destinationIndex: number) => void;
  selectDeal: (dealId: string | null) => void;
  generateAiInsight: (dealId: string) => Promise<void>;
}

interface Column {
  id: string;
  title: string;
  dealIds: string[];
}

export const useDealStore = create<DealState>((set, get) => ({
  deals: {
    'deal-1': {
      id: 'deal-1',
      title: 'Enterprise License',
      value: 75000,
      stage: 'qualification',
      company: 'Acme Inc',
      contact: 'John Doe',
      contactId: 'contact-1',
      dueDate: new Date('2025-07-15'),
      createdAt: new Date('2025-06-01'),
      updatedAt: new Date('2025-06-01'),
      probability: 10,
      daysInStage: 5,
      priority: 'high'
    },
    'deal-2': {
      id: 'deal-2',
      title: 'Software Renewal',
      value: 45000,
      stage: 'proposal',
      company: 'Globex Corp',
      contact: 'Jane Smith',
      contactId: 'contact-2',
      dueDate: new Date('2025-06-30'),
      createdAt: new Date('2025-05-15'),
      updatedAt: new Date('2025-06-01'),
      probability: 50,
      daysInStage: 3,
      priority: 'medium'
    },
    'deal-3': {
      id: 'deal-3',
      title: 'Support Contract',
      value: 25000,
      stage: 'negotiation',
      company: 'Initech',
      contact: 'Robert Johnson',
      contactId: 'contact-3',
      dueDate: new Date('2025-07-10'),
      createdAt: new Date('2025-05-20'),
      updatedAt: new Date('2025-06-01'),
      probability: 75,
      daysInStage: 7,
      priority: 'low'
    },
    'deal-4': {
      id: 'deal-4',
      title: 'Implementation Services',
      value: 50000,
      stage: 'negotiation',
      company: 'Umbrella Corp',
      contact: 'Sarah Williams',
      contactId: 'contact-4',
      dueDate: new Date('2025-06-25'),
      createdAt: new Date('2025-05-25'),
      updatedAt: new Date('2025-06-01'),
      probability: 75,
      daysInStage: 2,
      priority: 'medium'
    },
    'deal-5': {
      id: 'deal-5',
      title: 'Cloud Migration',
      value: 95000,
      stage: 'qualification',
      company: 'Wayne Enterprises',
      contact: 'Bruce Wayne',
      contactId: 'contact-5',
      dueDate: new Date('2025-08-05'),
      createdAt: new Date('2025-06-01'),
      updatedAt: new Date('2025-06-01'),
      probability: 10,
      daysInStage: 1,
      priority: 'high'
    },
    'deal-6': {
      id: 'deal-6',
      title: 'Annual Subscription',
      value: 36000,
      stage: 'closed-won',
      company: 'Stark Industries',
      contact: 'Tony Stark',
      contactId: 'contact-6',
      dueDate: new Date('2025-07-20'),
      createdAt: new Date('2025-05-01'),
      updatedAt: new Date('2025-06-01'),
      probability: 100,
      daysInStage: 0,
      priority: 'medium'
    },
  },
  columns: {
    'qualification': {
      id: 'qualification',
      title: 'Qualification',
      dealIds: ['deal-1', 'deal-5']
    },
    'proposal': {
      id: 'proposal',
      title: 'Proposal',
      dealIds: ['deal-2']
    },
    'negotiation': {
      id: 'negotiation',
      title: 'Negotiation',
      dealIds: ['deal-3', 'deal-4']
    },
    'closed-won': {
      id: 'closed-won',
      title: 'Closed Won',
      dealIds: ['deal-6']
    },
    'closed-lost': {
      id: 'closed-lost',
      title: 'Closed Lost',
      dealIds: []
    }
  },
  columnOrder: ['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
  isLoading: false,
  error: null,
  selectedDeal: null,
  aiInsight: null,
  isAnalyzing: false,
  stageValues: {
    'qualification': 170000,
    'proposal': 45000,
    'negotiation': 75000,
    'closed-won': 36000,
    'closed-lost': 0
  },
  totalPipelineValue: 326000,
  
  fetchDeals: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await fetchDealsFromSupabase();
      
      if (error) throw new Error(error.message);
      
      if (!data) {
        set({ isLoading: false });
        return;
      }
      
      // Transform the deals into the required format
      const dealsRecord: Record<string, Deal> = {};
      const columnsRecord: Record<string, Column> = {
        'qualification': { id: 'qualification', title: 'Qualification', dealIds: [] },
        'proposal': { id: 'proposal', title: 'Proposal', dealIds: [] },
        'negotiation': { id: 'negotiation', title: 'Negotiation', dealIds: [] },
        'closed-won': { id: 'closed-won', title: 'Closed Won', dealIds: [] },
        'closed-lost': { id: 'closed-lost', title: 'Closed Lost', dealIds: [] }
      };
      
      data.forEach(deal => {
        // Map the API response to our Deal type
        dealsRecord[deal.id] = {
          id: deal.id,
          title: deal.title,
          value: deal.value || deal.amount,
          stage: deal.stage,
          contactId: deal.contact_id || 'unknown',
          company: deal.company,
          contact: deal.contact,
          dueDate: new Date(deal.dueDate),
          createdAt: new Date(deal.created_at || Date.now()),
          updatedAt: new Date(deal.updated_at || Date.now()),
          probability: deal.probability,
          priority: deal.priority,
          daysInStage: deal.days_in_stage
        };
        
        // Add deal ID to the appropriate column
        if (columnsRecord[deal.stage]) {
          columnsRecord[deal.stage].dealIds.push(deal.id);
        } else {
          // If the stage doesn't exist, default to qualification
          columnsRecord['qualification'].dealIds.push(deal.id);
        }
      });
      
      // Calculate stage values and total pipeline value
      const stageValues: Record<string, number> = {};
      
      Object.keys(columnsRecord).forEach(columnId => {
        const column = columnsRecord[columnId];
        const totalValue = column.dealIds.reduce((sum, dealId) => {
          return sum + dealsRecord[dealId].value;
        }, 0);
        
        stageValues[columnId] = totalValue;
      });
      
      const totalPipelineValue = Object.values(stageValues).reduce((a, b) => a + b, 0);
      
      // Use the mock data for now instead of the API response
      // In a real implementation, we would use the transformed data from the API
      // set({ deals: dealsRecord, columns: columnsRecord, isLoading: false });
      
      // Recalculate stage values based on the current deals in the store
      const currentDeals = get().deals;
      const currentColumns = get().columns;
      const currentStageValues = calculateStageValues(currentDeals, currentColumns);
      
      set({ 
        isLoading: false,
        stageValues: currentStageValues,
        totalPipelineValue: Object.values(currentStageValues).reduce((a, b) => a + b, 0)
      });
    } catch (err) {
      console.error('Error fetching deals:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch deals' 
      });
    }
  },
  
  createDeal: async (dealData: Partial<Deal>) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await createDealInSupabase(dealData);
      
      if (error) throw new Error(error.message);
      
      if (!data) {
        set({ isLoading: false });
        return;
      }
      
      // Update local state with the new deal
      const { deals, columns } = get();
      
      // Create a new deal object
      const newDeal: Deal = {
        ...data,
        id: data.id,
        contactId: data.contactId || 'unknown',
        createdAt: new Date(data.created_at || Date.now()),
        updatedAt: new Date(data.updated_at || Date.now()),
        stage: data.stage || 'qualification'
      };
      
      // Update the deals record
      const updatedDeals = {
        ...deals,
        [newDeal.id]: newDeal
      };
      
      // Update the column dealIds array
      const stage = newDeal.stage || 'qualification';
      const updatedColumns = {
        ...columns,
        [stage]: {
          ...columns[stage],
          dealIds: [...columns[stage].dealIds, newDeal.id]
        }
      };
      
      // Recalculate stage values
      const stageValues = calculateStageValues(updatedDeals, updatedColumns);
      
      set({ 
        deals: updatedDeals, 
        columns: updatedColumns,
        isLoading: false,
        stageValues,
        totalPipelineValue: Object.values(stageValues).reduce((a, b) => a + b, 0)
      });
    } catch (err) {
      console.error('Error creating deal:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to create deal' 
      });
    }
  },
  
  updateDeal: async (id: string, dealData: Partial<Deal>) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await updateDealInSupabase(id, dealData);
      
      if (error) throw new Error(error.message);
      
      if (!data) {
        set({ isLoading: false });
        return;
      }
      
      // Update local state with the updated deal
      const { deals } = get();
      
      const updatedDeal = {
        ...deals[id],
        ...data,
        updatedAt: new Date(data.updated_at || Date.now())
      };
      
      // Check if the stage has changed
      if (data.stage && data.stage !== deals[id].stage) {
        // Need to update columns
        const oldStage = deals[id].stage;
        const newStage = data.stage;
        
        get().moveDealToStage(id, oldStage, newStage, 0);
      } else {
        // Just update the deal
        const updatedDeals = {
          ...deals,
          [id]: updatedDeal
        };
        
        const stageValues = calculateStageValues(updatedDeals, get().columns);
        
        set({ 
          deals: updatedDeals,
          isLoading: false,
          stageValues,
          totalPipelineValue: Object.values(stageValues).reduce((a, b) => a + b, 0)
        });
      }
    } catch (err) {
      console.error('Error updating deal:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to update deal' 
      });
    }
  },
  
  deleteDeal: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await deleteDealFromSupabase(id);
      
      if (error) throw new Error(error.message);
      
      // Update local state
      const { deals, columns } = get();
      
      const stage = deals[id].stage;
      
      // Remove the deal from the deals object
      const { [id]: deletedDeal, ...remainingDeals } = deals;
      
      // Remove the deal ID from the column
      const updatedColumns = {
        ...columns,
        [stage]: {
          ...columns[stage],
          dealIds: columns[stage].dealIds.filter(dealId => dealId !== id)
        }
      };
      
      // Recalculate stage values
      const stageValues = calculateStageValues(remainingDeals, updatedColumns);
      
      set({ 
        deals: remainingDeals, 
        columns: updatedColumns,
        isLoading: false,
        stageValues,
        totalPipelineValue: Object.values(stageValues).reduce((a, b) => a + b, 0),
        selectedDeal: null
      });
    } catch (err) {
      console.error('Error deleting deal:', err);
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to delete deal' 
      });
    }
  },
  
  moveDealToStage: (dealId, sourceStage, destinationStage, destinationIndex) => {
    const { deals, columns } = get();
    
    // No change if the stages are the same
    if (sourceStage === destinationStage) return;
    
    // Start by removing the deal from the source column
    const sourceColumn = columns[sourceStage];
    const destinationColumn = columns[destinationStage];
    
    const newSourceDealIds = sourceColumn.dealIds.filter(id => id !== dealId);
    
    // Then add it to the destination column at the specified index
    const newDestinationDealIds = [...destinationColumn.dealIds];
    newDestinationDealIds.splice(destinationIndex, 0, dealId);
    
    // Update the columns
    const updatedColumns = {
      ...columns,
      [sourceStage]: {
        ...sourceColumn,
        dealIds: newSourceDealIds
      },
      [destinationStage]: {
        ...destinationColumn,
        dealIds: newDestinationDealIds
      }
    };
    
    // Update the deal's stage
    const updatedDeals = {
      ...deals,
      [dealId]: {
        ...deals[dealId],
        stage: destinationStage,
        updatedAt: new Date()
      }
    };
    
    // Recalculate stage values
    const stageValues = calculateStageValues(updatedDeals, updatedColumns);
    
    // Update state
    set({ 
      deals: updatedDeals,
      columns: updatedColumns,
      stageValues,
      totalPipelineValue: Object.values(stageValues).reduce((a, b) => a + b, 0)
    });
    
    // Persist the change to the backend
    updateDealInSupabase(dealId, { 
      stage: destinationStage,
      updated_at: new Date().toISOString()
    });
  },
  
  selectDeal: (dealId) => {
    set({ 
      selectedDeal: dealId,
      aiInsight: null 
    });
  },
  
  generateAiInsight: async (dealId) => {
    const { deals } = get();
    const deal = deals[dealId];
    
    if (!deal) return;
    
    set({ isAnalyzing: true });
    
    try {
      // In a real implementation, we would call the AI service
      // For demo purposes, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const randomProbability = Math.floor(Math.random() * (deal.stage === 'negotiation' ? 30 : 20) + 
                                (deal.stage === 'negotiation' ? 60 : 
                                 deal.stage === 'proposal' ? 40 : 
                                 deal.stage === 'qualification' ? 15 : 5));
                                 
      const insights = `# Deal Analysis for ${deal.title}

## Win Probability: ${randomProbability}%

### Key Risk Factors:
1. Competition from established vendors in this space
2. Budget constraints indicated in previous discussions
3. Decision timeline may be extended due to stakeholder alignment

### Opportunities:
1. Strong need for our specific features that solve their pain points
2. Champion within the organization is supportive
3. Potential for expanded deployment in other departments

### Recommended Actions:
1. Schedule a technical deep dive with their IT team
2. Prepare ROI analysis demonstrating 18-month value
3. Identify and engage additional stakeholders in the finance department
4. Consider offering phased implementation to reduce initial investment

This deal is currently in the ${deal.stage} stage and has been there for ${deal.daysInStage || 0} days. The average deal at this value point typically closes within 30 days from this stage.`;
      
      set({ 
        aiInsight: insights,
        isAnalyzing: false
      });
    } catch (error) {
      console.error('Error generating AI insight:', error);
      set({ 
        isAnalyzing: false,
        error: error instanceof Error ? error.message : 'Failed to generate AI insight'
      });
    }
  }
}));

// Helper function to calculate stage values
function calculateStageValues(deals: Record<string, Deal>, columns: Record<string, Column>) {
  const stageValues: Record<string, number> = {};
  
  Object.keys(columns).forEach(columnId => {
    const column = columns[columnId];
    const totalValue = column.dealIds.reduce((sum, dealId) => {
      return sum + (deals[dealId]?.value || 0);
    }, 0);
    
    stageValues[columnId] = totalValue;
  });
  
  return stageValues;
}