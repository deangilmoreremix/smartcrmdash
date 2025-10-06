export const openaiImageService = {
  async generateImage(prompt: string) {
    return { data: null, error: 'Not implemented' };
  },
};

// Hook for React components
export function useOpenAIImage() {
  return openaiImageService;
}
