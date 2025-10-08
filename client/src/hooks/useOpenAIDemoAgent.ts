export const useOpenAIDemoAgent = () => {
  return {
    isLoading: false,
    error: null,
    sendMessage: async (message: string) => ({ data: null, error: null }),
  };
};
