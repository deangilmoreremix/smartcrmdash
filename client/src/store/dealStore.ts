import { create } from 'zustand';

interface Deal {
  id: string;
  name: string;
  value: number;
  status: string;
}

interface DealStore {
  deals: Deal[];
  selectedDeal: Deal | null;
  setDeals: (deals: Deal[]) => void;
  selectDeal: (deal: Deal) => void;
  clearSelectedDeal: () => void;
}

export const useDealStore = create<DealStore>((set) => ({
  deals: [],
  selectedDeal: null,
  setDeals: (deals) => set({ deals }),
  selectDeal: (deal) => set({ selectedDeal: deal }),
  clearSelectedDeal: () => set({ selectedDeal: null }),
}));