export const openAiFunctionService = {
  async callFunction(name: string, args: any) {
    return { data: null, error: 'Not implemented' };
  },
};

// Hook for React components
export function useOpenAIFunctions() {
  return openAiFunctionService;
}
