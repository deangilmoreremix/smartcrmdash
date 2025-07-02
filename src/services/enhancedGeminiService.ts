import { supabaseAIService, type AIModelConfig } from './supabaseAIService';

interface GenerateContentRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  customerId?: string;
  featureUsed?: string;
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
  responseTime: number;
}

class EnhancedGeminiService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  private availableModels: AIModelConfig[] = [];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
    this.loadAvailableModels();
  }

  /**
   * Load available models from Supabase
   */
  private async loadAvailableModels(): Promise<void> {
    try {
      // Get Google AI models (Gemini and Gemma)
      const geminiModels = await supabaseAIService.getModelsByProvider('gemini');
      this.availableModels = geminiModels;
    } catch (error) {
      console.error('Error loading available models:', error);
    }
  }

  /**
   * Get available models for Google AI
   */
  async getAvailableModels(): Promise<AIModelConfig[]> {
    if (this.availableModels.length === 0) {
      await this.loadAvailableModels();
    }
    return this.availableModels;
  }

  /**
   * Generate content using Supabase-configured models
   */
  async generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    const startTime = Date.now();
    
    if (!this.apiKey) {
      throw new Error('Google AI API key is required. Please check your Supabase configuration.');
    }

    // Get model configuration from database
    const modelId = request.model || 'gemini-2.5-flash';
    const modelConfig = await supabaseAIService.getModelById(modelId);
    
    if (!modelConfig) {
      throw new Error(`Model ${modelId} not found in database configuration`);
    }

    const url = `${this.baseUrl}/models/${modelConfig.model_name}:generateContent`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: request.prompt
        }]
      }],
      generationConfig: {
        temperature: request.temperature || 0.7,
        maxOutputTokens: request.maxTokens || modelConfig.max_tokens,
        topP: 0.8,
        topK: 10
      }
    };

    // Add system instruction if provided and supported
    if (request.systemInstruction && modelConfig.capabilities.includes('system-instructions')) {
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
      const responseTime = Date.now() - startTime;
      
      const result: GenerateContentResponse = {
        content,
        model: modelId,
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        },
        finishReason: candidate.finishReason || 'completed',
        responseTime
      };

      // Log usage to Supabase
      if (request.customerId) {
        const cost = this.calculateCost(modelConfig, result.usage.totalTokens);
        
        await supabaseAIService.logUsage({
          customer_id: request.customerId,
          model_id: modelId,
          feature_used: request.featureUsed || 'text-generation',
          tokens_used: result.usage.totalTokens,
          cost,
          response_time_ms: responseTime,
          success: true
        });
      }

      return result;
    } catch (error) {
      // Log failed usage
      if (request.customerId) {
        await supabaseAIService.logUsage({
          customer_id: request.customerId,
          model_id: modelId,
          feature_used: request.featureUsed || 'text-generation',
          tokens_used: 0,
          cost: 0,
          response_time_ms: Date.now() - startTime,
          success: false,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      console.error('Gemini API error:', error);
      throw error;
    }
  }

  /**
   * Calculate cost based on model pricing
   */
  private calculateCost(model: AIModelConfig, totalTokens: number): number {
    if (!model.pricing) return 0;
    
    // Estimate input/output split (typically 70/30)
    const inputTokens = Math.floor(totalTokens * 0.7);
    const outputTokens = totalTokens - inputTokens;
    
    const inputCost = (inputTokens / 1_000_000) * model.pricing.input_per_1m_tokens;
    const outputCost = (outputTokens / 1_000_000) * model.pricing.output_per_1m_tokens;
    
    return inputCost + outputCost;
  }

  /**
   * Generate insights for CRM data
   */
  async generateInsights(data: any, customerId?: string, model?: string): Promise<any> {
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
        model: model || 'gemini-2.5-flash',
        customerId,
        featureUsed: 'crm-insights',
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
  }, customerId?: string, model?: string): Promise<{ subject: string; body: string }> {
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
        model: model || 'gemma-2-9b-it',
        customerId,
        featureUsed: 'email-generation',
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
   * Get recommended model for a specific use case
   */
  async getRecommendedModel(useCase: string): Promise<AIModelConfig | null> {
    try {
      const models = await supabaseAIService.getRecommendedModels(useCase);
      return models.length > 0 ? models[0] : null;
    } catch (error) {
      console.error('Error getting recommended model:', error);
      return null;
    }
  }
}

// Create singleton instance
export const enhancedGeminiService = new EnhancedGeminiService();

// Export the hook for React components
export const useEnhancedGemini = () => {
  return {
    generateInsights: (data: any, customerId?: string, model?: string) => 
      enhancedGeminiService.generateInsights(data, customerId, model),
    generateEmail: (context: any, customerId?: string, model?: string) => 
      enhancedGeminiService.generateEmail(context, customerId, model),
    generateContent: (request: GenerateContentRequest) => 
      enhancedGeminiService.generateContent(request),
    getAvailableModels: () => enhancedGeminiService.getAvailableModels(),
    getRecommendedModel: (useCase: string) => enhancedGeminiService.getRecommendedModel(useCase)
  };
};

export default enhancedGeminiService;