import { enhancedGeminiService, useEnhancedGemini } from './enhancedGeminiService';

// Export the enhanced service as the default Gemini service
export { enhancedGeminiService as geminiService };

// Export the hook that uses the database-backed service
export const useGemini = () => {
  return useEnhancedGemini();
};

export default enhancedGeminiService;