import { AI_MODELS, getModelById, type AIModel } from './aiModels';

interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

interface GenerateContentRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

interface GenerateContentResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  private defaultModel: string = 'gemini-2.5-flash';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google AI API key not found. Please set VITE_GOOGLE_AI_API_KEY in your environment variables.');
    }
  }

  /**
   * Set the API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Get available models
   */
  getAvailableModels(): AIModel[] {
    return Object.values(AI_MODELS).filter(model => 
      model.provider === 'google-ai' && model.isAvailable
    );
  }

  /**
   * Generate content using specified model
   */
  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    if (!this.apiKey) {
      throw new Error('Google AI API key is required. Please set VITE_GOOGLE_AI_API_KEY in your environment variables.');
    }

    const modelId = request.model || this.defaultModel;
    const model = getModelById(modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const url = `${this.baseUrl}/models/${modelId}:generateContent`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: request.prompt
        }]
      }],
      generationConfig: {
        temperature: request.temperature || 0.7,
        maxOutputTokens: request.maxTokens || model.maxTokens,
        topP: 0.8,
        topK: 10
      }
    };

    // Add system instruction if provided (for supported models)
    if (request.systemInstruction && this.supportsSystemInstruction(modelId)) {
      requestBody.systemInstruction = {
        parts: [{
          text: request.systemInstruction
        }]
      };
    }

    try {
      const response = await fetch(`${url}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Google AI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No content generated');
      }

      const candidate = data.candidates[0];
      const content = candidate.content?.parts?.[0]?.text || '';
      
      return {
        content,
        model: modelId,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        },
        finishReason: candidate.finishReason || 'completed'
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  /**
   * Generate insights for CRM data
   */
  async generateInsights(data: any, model: string = 'gemini-2.5-flash'): Promise<any> {
    const prompt = `
    Analyze the following CRM data and provide actionable insights:
    
    ${JSON.stringify(data, null, 2)}
    
    Please provide:
    1. Key insights about the sales pipeline
    2. Recommendations for improving conversion rates
    3. Identification of high-priority opportunities
    4. Potential risks or concerns
    
    Format your response as JSON with the following structure:
    {
      "insights": "string",
      "recommendations": [
        {
          "type": "deal|contact|general",
          "title": "string",
          "description": "string",
          "priority": "high|medium|low"
        }
      ],
      "opportunities": ["string"],
      "risks": ["string"]
    }
    `;

    try {
      const response = await this.generateContent({
        prompt,
        model,
        systemInstruction: "You are a CRM analytics expert. Provide concise, actionable insights in valid JSON format."
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error generating insights:', error);
      return {
        insights: "Unable to generate insights at this time. Please ensure your data is properly formatted and try again.",
        recommendations: [],
        opportunities: [],
        risks: []
      };
    }
  }

  /**
   * Generate email content
   */
  async generateEmail(context: {
    recipient: string;
    purpose: string;
    tone?: 'formal' | 'casual' | 'friendly';
    context?: string;
  }, model: string = 'gemini-2.5-flash'): Promise<{ subject: string; body: string }> {
    const tone = context.tone || 'professional';
    const prompt = `
    Generate a ${tone} email for the following context:
    
    Recipient: ${context.recipient}
    Purpose: ${context.purpose}
    Additional Context: ${context.context || 'None'}
    
    Please provide:
    1. A compelling subject line
    2. A well-structured email body
    
    Format as JSON:
    {
      "subject": "string",
      "body": "string"
    }
    `;

    try {
      const response = await this.generateContent({
        prompt,
        model,
        systemInstruction: "You are a professional email writing assistant. Write clear, engaging emails that drive action."
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error generating email:', error);
      return {
        subject: `Following up: ${context.purpose}`,
        body: `Dear ${context.recipient},\n\nI hope this email finds you well.\n\n[Generated content unavailable - please try again]\n\nBest regards`
      };
    }
  }

  /**
   * Generate meeting agenda
   */
  async generateMeetingAgenda(context: {
    participants: string[];
    duration: number;
    objective: string;
    topics?: string[];
  }, model: string = 'gemma-2-9b-it'): Promise<any> {
    const prompt = `
    Create a professional meeting agenda with the following details:
    
    Participants: ${context.participants.join(', ')}
    Duration: ${context.duration} minutes
    Objective: ${context.objective}
    Topics to cover: ${context.topics?.join(', ') || 'Not specified'}
    
    Format as JSON:
    {
      "title": "string",
      "duration": number,
      "agenda": [
        {
          "item": "string",
          "duration": number,
          "presenter": "string"
        }
      ]
    }
    `;

    try {
      const response = await this.generateContent({
        prompt,
        model,
        systemInstruction: "You are a meeting planning expert. Create structured, time-efficient agendas."
      });

      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error generating meeting agenda:', error);
      return {
        title: `Meeting: ${context.objective}`,
        duration: context.duration,
        agenda: [
          { item: "Welcome & Introductions", duration: 5, presenter: "Host" },
          { item: context.objective, duration: context.duration - 10, presenter: "Team" },
          { item: "Next Steps & Closing", duration: 5, presenter: "Host" }
        ]
      };
    }
  }

  /**
   * Check if model supports system instructions
   */
  private supportsSystemInstruction(modelId: string): boolean {
    const model = getModelById(modelId);
    return model?.capabilities.includes('function-calling') || false;
  }

  /**
   * Get model pricing information
   */
  getModelPricing(modelId: string): { input: number; output: number } | null {
    const model = getModelById(modelId);
    return model?.pricing || null;
  }

  /**
   * Estimate cost for a request
   */
  estimateCost(modelId: string, inputTokens: number, outputTokens: number): number {
    const pricing = this.getModelPricing(modelId);
    if (!pricing) return 0;

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    
    return inputCost + outputCost;
  }
}

// Create singleton instance
export const geminiService = new GeminiService();

// Export the hook for React components
export const useGemini = () => {
  return {
    generateInsights: (data: any, model?: string) => geminiService.generateInsights(data, model),
    generateEmail: (context: any, model?: string) => geminiService.generateEmail(context, model),
    generateMeetingAgenda: (context: any, model?: string) => geminiService.generateMeetingAgenda(context, model),
    generateContent: (request: GenerateContentRequest) => geminiService.generateContent(request),
    getAvailableModels: () => geminiService.getAvailableModels(),
    getModelPricing: (modelId: string) => geminiService.getModelPricing(modelId),
    estimateCost: (modelId: string, inputTokens: number, outputTokens: number) => 
      geminiService.estimateCost(modelId, inputTokens, outputTokens)
  };
};

export default geminiService;