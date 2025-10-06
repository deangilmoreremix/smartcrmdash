export const openaiEmbeddingsService = {
  async createEmbedding(text: string) {
    return { data: null, error: 'Not implemented' };
  },
};

// Hook for React components
export function useOpenAIEmbeddings() {
  return openaiEmbeddingsService;
}
