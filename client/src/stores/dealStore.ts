import { create } from 'zustand';
import { Deal } from '../types/deal';

interface DealStore {
  deals: Record<string, Deal>;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDeals: () => Promise<void>;
  getStageValues: () => Record<string, number>;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
}

export const useDealStore = create<DealStore>((set, get) => ({
  deals: {},
  isLoading: false,
  error: null,

  fetchDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch deals', isLoading: false });
    }
  },

  getStageValues: () => {
    const deals = get().deals;
    const stageValues: Record<string, number> = {};

    Object.values(deals).forEach(deal => {
      const stage = deal.stage_id || 'qualification';
      stageValues[stage] = (stageValues[stage] || 0) + deal.value;
    });

    return stageValues;
  },

  addDeal: (dealData) => {
    const newDeal: Deal = {
      ...dealData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    set(state => ({
      deals: { ...state.deals, [newDeal.id]: newDeal }
    }));

    return newDeal;
  },

  updateDeal: (id, updates) => {
    set(state => ({
      deals: {
        ...state.deals,
        [id]: {
          ...state.deals[id],
          ...updates,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },

  deleteDeal: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.deals;
      return { deals: rest };
    });
  }
}));