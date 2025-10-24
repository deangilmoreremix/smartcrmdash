import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ApiStore {
  apiKeys: { openai: string; google: string };
  setApiKey: (service: 'openai' | 'google', key: string) => void;
  getApiKey: (service: 'openai' | 'google') => string;
  hasKeys: { openai: boolean; google: boolean };
  hydrated: boolean;
}

export const useApiStore = create<ApiStore>()(
  persist(
    (set, get) => ({
      apiKeys: { openai: '', google: '' },
      setApiKey: (service, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [service]: key },
          hasKeys: {
            ...state.hasKeys,
            [service]: Boolean(key && key.trim()),
          },
        })),
      getApiKey: (service) => get().apiKeys[service],
      hasKeys: { openai: false, google: false },
      hydrated: false,
    }),
    {
      name: 'ai-tools-api-keys',
      // ✅ Avoids touching localStorage during SSR/prerender
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,
      onRehydrateStorage: () => (state) => {
        // mark as hydrated so your UI can wait if needed
        if (state) state.hydrated = true;
      },
    }
  )
);