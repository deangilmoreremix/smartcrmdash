import { create } from 'zustand';

interface FormStore {
  forms: any[];
}

export const useFormStore = create<FormStore>((set) => ({
  forms: [],
}));
