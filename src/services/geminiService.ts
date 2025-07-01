// Gemini AI Service
export const useGemini = () => {
  const generateInsights = async (data: any) => {
    try {
      // This would normally call the Gemini API
      // For now, return a simulated response
      return {
        insights: "Based on your pipeline data, I recommend focusing on the high-value deals in negotiation stage. Consider offering incentives to close deals faster.",
        recommendations: [
          {
            type: "deal",
            title: "Accelerate Enterprise Deal",
            description: "The Microsoft deal has been in negotiation for 5 days. Consider scheduling a follow-up meeting.",
            priority: "high"
          }
        ]
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  return { generateInsights };
};