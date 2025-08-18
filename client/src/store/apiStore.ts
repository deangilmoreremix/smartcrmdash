import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiStore {
  openaiApiKey: string;
  geminiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  getOpenaiApiKey: () => string;
  getGeminiApiKey: () => string;
}

export const useApiStore = create<ApiStore>()(
  persist(
    (set, get) => ({
      openaiApiKey: '',
      geminiApiKey: '',
      
      setOpenaiApiKey: (key: string) => set({ openaiApiKey: key }),
      setGeminiApiKey: (key: string) => set({ geminiApiKey: key }),
      
      getOpenaiApiKey: () => get().openaiApiKey,
      getGeminiApiKey: () => get().geminiApiKey,
    }),
    {
      name: 'api-store',
      partialize: (state) => ({
        openaiApiKey: state.openaiApiKey,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
);