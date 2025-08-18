import React, { createContext, useContext } from 'react';

interface AIContextValue {
  useContactAI: (contactId: string) => {
    scoreContact: (contact: any) => Promise<any>;
    generateInsights: (contact: any, types: string[]) => Promise<any>;
    contactScore: any;
    contactInsights: any[];
    isContactProcessing: boolean;
  };
  scoreBulkContacts: (contacts: any[]) => Promise<void>;
  generateBulkInsights: (contacts: any[]) => Promise<void>;
  isProcessing: boolean;
}

const AIContext = createContext<AIContextValue | null>(null);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const useContactAI = (contactId: string) => ({
    scoreContact: async (contact: any) => ({ overall: 75, reasoning: ['Good engagement'] }),
    generateInsights: async (contact: any, types: string[]) => ([]),
    contactScore: null,
    contactInsights: [],
    isContactProcessing: false
  });

  const value: AIContextValue = {
    useContactAI,
    scoreBulkContacts: async (contacts: any[]) => {},
    generateBulkInsights: async (contacts: any[]) => {},
    isProcessing: false
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
};

export const useContactAI = (contactId: string) => {
  const context = useContext(AIContext);
  if (!context) {
    return {
      scoreContact: async (contact: any) => ({ overall: 75, reasoning: ['Good engagement'] }),
      generateInsights: async (contact: any, types: string[]) => ([]),
      contactScore: null,
      contactInsights: [],
      isContactProcessing: false
    };
  }
  return context.useContactAI(contactId);
};