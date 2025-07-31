import OpenAI from 'openai';
import { useApiStore } from '../store/apiStore';

export const useOpenAIVision = () => {
  const { apiKeys } = useApiStore();
  
  const getClient = () => {
    if (!apiKeys.openai) {
      throw new Error('OpenAI API key is not set');
    }
    
    return new OpenAI({
      apiKey: apiKeys.openai,
      dangerouslyAllowBrowser: true // Note: In production, proxy requests through a backend
    });
  };
  
  // Analyze an image with GPT-4 Vision
  const analyzeImage = async (imageUrl: string, prompt: string) => {
    const client = getClient();
    
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o", // Updated from gpt-4-vision-preview
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });
      
      return response.choices[0].message.content || 'No analysis generated';
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  };

  // Analyze competitor's product or website
  const analyzeCompetitorVisuals = async (imageUrl: string, competitorName: string) => {
    return analyzeImage(imageUrl, `This is a visual from my competitor ${competitorName}. Please analyze this image and provide insights about:
    1. Key features and selling points visible
    2. Visual design strengths and weaknesses
    3. Target audience they appear to be addressing
    4. Any differentiation points we should be aware of
    5. Recommendations for how we could position against this competitor based on what's visible
    `);
  };

  // Analyze a client's document or presentation
  const analyzeClientDocument = async (imageUrl: string) => {
    return analyzeImage(imageUrl, `This is a document from a prospective client. Please analyze it and provide insights about:
    1. Key information and requirements
    2. Pain points or needs mentioned
    3. Potential sales opportunities
    4. Any red flags or concerns
    5. Recommended approach for engaging with this client based on the document
    `);
  };
  
  return {
    analyzeImage,
    analyzeCompetitorVisuals,
    analyzeClientDocument
  };
};