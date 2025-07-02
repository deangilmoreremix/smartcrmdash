import { enhancedGeminiService } from './enhancedGeminiService';
import { openAIService } from './openAIService';
import { supabaseAIService } from './supabaseAIService';
import { aiTaskRecommender } from './aiTaskRecommender';

// Feature types for orchestration
export type AIFeature = 
  | 'email_generation'
  | 'pipeline_analysis' 
  | 'deal_insights'
  | 'meeting_agenda'
  | 'contact_scoring'
  | 'content_creation'
  | 'quick_response'
  | 'lead_qualification'
  | 'business_analysis';

interface TaskContext {
  customerId?: string;
  modelId?: string;
  complexity?: 'low' | 'medium' | 'high';
  priority?: 'speed' | 'quality' | 'cost';
  maxBudget?: number;
  promptTokens?: number;
}

interface ServiceResponse {
  content: any;
  model: string;
  provider: string;
  responseTime: number;
  cost?: number;
  tokensUsed?: number;
  success: boolean;
  error?: string;
}

class AIOrchestratorService {
  // Track usage statistics for smart routing
  private usageStats: Record<string, {
    callCount: number;
    successCount: number;
    avgResponseTime: number;
    avgCost: number;
  }> = {};

  constructor() {
    this.initializeStats();
    
    // Check if API keys are available
    this.checkApiKeys();
  }
  
  private checkApiKeys() {
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      console.warn('Warning: Google AI API key not found in environment variables');
    }
    
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.warn('Warning: OpenAI API key not found in environment variables');
    }
  }

  private initializeStats() {
    const models = [
      'gemma-2-2b-it', 'gemma-2-9b-it', 'gemma-2-27b-it',
      'gemini-2.5-flash', 'gemini-2.5-flash-8b',
      'gpt-4o-mini', 'gpt-3.5-turbo'
    ];

    models.forEach(model => {
      this.usageStats[model] = {
        callCount: 0,
        successCount: 0,
        avgResponseTime: 0,
        avgCost: 0
      };
    });
  }

  /**
   * Get the optimal model for a given feature/task
   */
  private async getOptimalModel(feature: AIFeature, context: TaskContext): Promise<string> {
    // Check if user specified a model
    if (context.modelId) {
      return context.modelId;
    }

    // Get model recommendations
    const modelType = 
      feature === 'email_generation' ? 'email_generation' :
      feature === 'pipeline_analysis' ? 'business_analysis' :
      feature === 'deal_insights' ? 'business_analysis' :
      feature === 'meeting_agenda' ? 'content_creation' :
      feature === 'contact_scoring' ? 'contact_scoring' :
      feature === 'content_creation' ? 'content_creation' :
      feature === 'quick_response' ? 'categorization' :
      feature === 'lead_qualification' ? 'lead_qualification' : 
      'categorization';

    // Fixed: Changed getRecommendation to getModelRecommendation
    const recommendation = aiTaskRecommender.getModelRecommendation(modelType);

    // Additional criteria
    if (context.priority === 'speed') {
      // For speed priority, prefer smaller models
      return recommendation.modelId === 'gemini-2.5-flash' ? 'gemma-2-2b-it' : recommendation.modelId;
    } else if (context.priority === 'quality') {
      // For quality, prefer larger models
      return recommendation.modelId === 'gemma-2-2b-it' ? 'gemini-2.5-flash' : recommendation.modelId;
    } else if (context.priority === 'cost') {
      // For cost, always use most efficient models
      return 'gemma-2-2b-it';
    }

    // Default to recommendation
    return recommendation.modelId;
  }

  /**
   * Record usage statistics for smart routing
   */
  private updateStats(modelId: string, responseTime: number, cost: number, success: boolean) {
    if (!this.usageStats[modelId]) {
      this.usageStats[modelId] = {
        callCount: 0,
        successCount: 0,
        avgResponseTime: 0,
        avgCost: 0
      };
    }

    const stats = this.usageStats[modelId];
    stats.callCount++;
    if (success) stats.successCount++;

    // Update averages
    stats.avgResponseTime = (stats.avgResponseTime * (stats.callCount - 1) + responseTime) / stats.callCount;
    stats.avgCost = (stats.avgCost * (stats.callCount - 1) + cost) / stats.callCount;
  }

  /**
   * Check if a model is from Google (Gemini/Gemma)
   */
  private isGoogleModel(modelId: string): boolean {
    return modelId.startsWith('gemini') || modelId.startsWith('gemma');
  }

  /**
   * Get the appropriate service for a model
   */
  private getServiceForModel(modelId: string): any {
    return this.isGoogleModel(modelId) ? enhancedGeminiService : openAIService;
  }

  /**
   * Generate email with the optimal model
   */
  async generateEmail(
    context: {
      recipient: string;
      purpose: string;
      tone?: 'formal' | 'casual' | 'friendly';
      context?: string;
    },
    taskContext: TaskContext = {}
  ): Promise<ServiceResponse> {
    // Verify API keys before proceeding
    this.verifyRequiredApiKeys();
    
    const modelId = await this.getOptimalModel('email_generation', taskContext);
    const service = this.getServiceForModel(modelId);
    const startTime = Date.now();

    try {
      const email = await service.generateEmail(context, taskContext.customerId, modelId);
      const responseTime = Date.now() - startTime;

      // Estimate cost
      const tokensUsed = (context.purpose.length + (context.context?.length || 0) + email.subject.length + email.body.length) / 4;
      const cost = this.estimateCost(modelId, tokensUsed);

      this.updateStats(modelId, responseTime, cost, true);

      return {
        content: email,
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime,
        cost,
        tokensUsed,
        success: true
      };
    } catch (error) {
      // If primary model fails, try fallback
      console.error(`Error with ${modelId}:`, error);
      const fallbackModelId = this.isGoogleModel(modelId) ? 'gpt-4o-mini' : 'gemma-2-9b-it';
      const fallbackService = this.getServiceForModel(fallbackModelId);

      try {
        const email = await fallbackService.generateEmail(context, taskContext.customerId, fallbackModelId);
        const responseTime = Date.now() - startTime;
        const tokensUsed = (context.purpose.length + (context.context?.length || 0) + email.subject.length + email.body.length) / 4;
        const cost = this.estimateCost(fallbackModelId, tokensUsed);

        this.updateStats(fallbackModelId, responseTime, cost, true);
        this.updateStats(modelId, 0, 0, false);

        return {
          content: email,
          model: fallbackModelId,
          provider: this.isGoogleModel(fallbackModelId) ? 'Google' : 'OpenAI',
          responseTime,
          cost,
          tokensUsed,
          success: true
        };
      } catch (fallbackError) {
        return {
          content: {
            subject: `Following up: ${context.purpose}`,
            body: `Dear ${context.recipient},\n\nI hope this email finds you well.\n\n[Generated content unavailable - please try again]\n\nBest regards`
          },
          model: fallbackModelId,
          provider: this.isGoogleModel(fallbackModelId) ? 'Google' : 'OpenAI',
          responseTime: Date.now() - startTime,
          success: false,
          error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
        };
      }
    }
  }

  /**
   * Analyze pipeline health with the optimal model
   */
  async analyzePipelineHealth(
    pipelineData: any,
    taskContext: TaskContext = {}
  ): Promise<ServiceResponse> {
    // Verify API keys before proceeding
    this.verifyRequiredApiKeys();
    
    const modelId = await this.getOptimalModel('pipeline_analysis', taskContext);
    const startTime = Date.now();

    try {
      let result;
      if (this.isGoogleModel(modelId)) {
        result = await enhancedGeminiService.generateInsights(pipelineData, taskContext.customerId, modelId);
      } else {
        result = await openAIService.analyzePipelineHealth(pipelineData, taskContext.customerId, modelId);
      }

      const responseTime = Date.now() - startTime;
      // Estimate tokens from input/output size
      const inputSize = JSON.stringify(pipelineData).length;
      const outputSize = JSON.stringify(result).length;
      const tokensUsed = Math.ceil((inputSize + outputSize) / 4);
      const cost = this.estimateCost(modelId, tokensUsed);

      this.updateStats(modelId, responseTime, cost, true);

      return {
        content: result,
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime,
        cost,
        tokensUsed,
        success: true
      };
    } catch (error) {
      console.error(`Error analyzing pipeline with ${modelId}:`, error);
      
      // Fallback to other provider
      const fallbackModelId = this.isGoogleModel(modelId) ? 'gpt-4o-mini' : 'gemini-2.5-flash';
      return this.fallbackPipelineAnalysis(pipelineData, fallbackModelId, taskContext, startTime);
    }
  }

  /**
   * Fallback for pipeline analysis
   */
  private async fallbackPipelineAnalysis(pipelineData: any, modelId: string, taskContext: TaskContext, startTime: number): Promise<ServiceResponse> {
    try {
      let result;
      if (this.isGoogleModel(modelId)) {
        result = await enhancedGeminiService.generateInsights(pipelineData, taskContext.customerId, modelId);
      } else {
        result = await openAIService.analyzePipelineHealth(pipelineData, taskContext.customerId, modelId);
      }

      const responseTime = Date.now() - startTime;
      const inputSize = JSON.stringify(pipelineData).length;
      const outputSize = JSON.stringify(result).length;
      const tokensUsed = Math.ceil((inputSize + outputSize) / 4);
      const cost = this.estimateCost(modelId, tokensUsed);

      this.updateStats(modelId, responseTime, cost, true);

      return {
        content: result,
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime,
        cost,
        tokensUsed,
        success: true
      };
    } catch (error) {
      return {
        content: {
          healthScore: 0,
          keyInsights: ["Unable to analyze pipeline health. Please try again later."],
          bottlenecks: ["Analysis unavailable"],
          opportunities: ["Analysis unavailable"],
          forecastAccuracy: 0
        },
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate meeting agenda with the optimal model
   */
  async generateMeetingAgenda(
    context: {
      meetingTitle: string;
      attendees: string[];
      purpose: string;
      duration: number;
      previousNotes?: string;
    },
    taskContext: TaskContext = {}
  ): Promise<ServiceResponse> {
    // Verify API keys before proceeding
    this.verifyRequiredApiKeys();
    
    const modelId = await this.getOptimalModel('meeting_agenda', taskContext);
    const startTime = Date.now();

    try {
      // Generate meeting agenda using the appropriate service
      let result;
      if (this.isGoogleModel(modelId)) {
        // Format for Gemini
        const prompt = `
          Create a meeting agenda for:
          
          Meeting Title: ${context.meetingTitle}
          Attendees: ${context.attendees.join(', ')}
          Purpose: ${context.purpose}
          Duration: ${context.duration} minutes
          Previous Notes: ${context.previousNotes || 'None'}
          
          Format your response as JSON with the following structure:
          {
            "title": "string",
            "objective": "string",
            "agendaItems": [
              {
                "topic": "string",
                "duration": number,
                "owner": "string",
                "description": "string"
              }
            ],
            "notes": "string"
          }
        `;
        
        const geminiResponse = await enhancedGeminiService.generateContent({
          prompt,
          model: modelId,
          customerId: taskContext.customerId,
          featureUsed: 'meeting-agenda',
          systemInstruction: "You are an expert meeting facilitator. Create focused, efficient meeting agendas."
        });
        
        result = JSON.parse(geminiResponse.content);
      } else {
        result = await openAIService.generateMeetingAgenda(context, taskContext.customerId, modelId);
      }

      const responseTime = Date.now() - startTime;
      const inputSize = context.meetingTitle.length + JSON.stringify(context.attendees).length + 
        context.purpose.length + (context.previousNotes?.length || 0);
      const outputSize = JSON.stringify(result).length;
      const tokensUsed = Math.ceil((inputSize + outputSize) / 4);
      const cost = this.estimateCost(modelId, tokensUsed);

      this.updateStats(modelId, responseTime, cost, true);

      return {
        content: result,
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime,
        cost,
        tokensUsed,
        success: true
      };
    } catch (error) {
      console.error(`Error generating meeting agenda with ${modelId}:`, error);
      
      // Fallback to basic structure
      return {
        content: {
          title: context.meetingTitle,
          objective: context.purpose,
          agendaItems: [
            {
              topic: "Introduction",
              duration: 5,
              owner: context.attendees[0] || "Meeting organizer",
              description: "Welcome and meeting objectives"
            },
            {
              topic: "Main Discussion",
              duration: Math.max(context.duration - 10, 10),
              owner: "All",
              description: context.purpose
            },
            {
              topic: "Next Steps",
              duration: 5,
              owner: "All",
              description: "Action items and follow-up tasks"
            }
          ],
          notes: "Generated agenda is a fallback due to service error."
        },
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate deal insights with the optimal model
   */
  async analyzeDeal(
    dealData: any,
    taskContext: TaskContext = {}
  ): Promise<ServiceResponse> {
    // Verify API keys before proceeding
    this.verifyRequiredApiKeys();
    
    // For complex analytical tasks like deal analysis, prefer more capable models
    const useGPT4 = dealData.value > 100000 || taskContext.complexity === 'high';
    const defaultModelId = useGPT4 ? 'gpt-4o-mini' : 'gemini-2.5-flash';
    
    const modelId = await this.getOptimalModel('deal_insights', {
      ...taskContext,
      modelId: taskContext.modelId || defaultModelId
    });
    
    const startTime = Date.now();

    try {
      let result;
      if (this.isGoogleModel(modelId)) {
        // Format for Gemini
        const prompt = `
          Analyze this deal data and provide actionable insights:
          
          ${JSON.stringify(dealData, null, 2)}
          
          Format your response as JSON with the following structure:
          {
            "riskLevel": "low|medium|high",
            "keyInsights": ["string"],
            "recommendedActions": ["string"],
            "winProbability": number,
            "potentialBlockers": ["string"]
          }
        `;
        
        const geminiResponse = await enhancedGeminiService.generateContent({
          prompt,
          model: modelId,
          customerId: taskContext.customerId,
          featureUsed: 'deal-insights',
          systemInstruction: "You are a sales analytics expert specializing in deal risk assessment."
        });
        
        result = JSON.parse(geminiResponse.content);
      } else {
        result = await openAIService.generateDealInsights(dealData, taskContext.customerId, modelId);
      }

      const responseTime = Date.now() - startTime;
      const inputSize = JSON.stringify(dealData).length;
      const outputSize = JSON.stringify(result).length;
      const tokensUsed = Math.ceil((inputSize + outputSize) / 4);
      const cost = this.estimateCost(modelId, tokensUsed);

      this.updateStats(modelId, responseTime, cost, true);

      return {
        content: result,
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime,
        cost,
        tokensUsed,
        success: true
      };
    } catch (error) {
      console.error(`Error analyzing deal with ${modelId}:`, error);
      
      // Try fallback model from other provider
      const fallbackModelId = this.isGoogleModel(modelId) ? 'gpt-4o-mini' : 'gemini-2.5-flash';
      try {
        let result;
        if (this.isGoogleModel(fallbackModelId)) {
          const prompt = `
            Analyze this deal data and provide actionable insights:
            
            ${JSON.stringify(dealData, null, 2)}
            
            Format your response as JSON with the following structure:
            {
              "riskLevel": "low|medium|high",
              "keyInsights": ["string"],
              "recommendedActions": ["string"],
              "winProbability": number,
              "potentialBlockers": ["string"]
            }
          `;
          
          const geminiResponse = await enhancedGeminiService.generateContent({
            prompt,
            model: fallbackModelId,
            customerId: taskContext.customerId,
            featureUsed: 'deal-insights-fallback',
            systemInstruction: "You are a sales analytics expert specializing in deal risk assessment."
          });
          
          result = JSON.parse(geminiResponse.content);
        } else {
          result = await openAIService.generateDealInsights(dealData, taskContext.customerId, fallbackModelId);
        }

        const responseTime = Date.now() - startTime;
        const inputSize = JSON.stringify(dealData).length;
        const outputSize = JSON.stringify(result).length;
        const tokensUsed = Math.ceil((inputSize + outputSize) / 4);
        const cost = this.estimateCost(fallbackModelId, tokensUsed);

        this.updateStats(fallbackModelId, responseTime, cost, true);

        return {
          content: result,
          model: fallbackModelId,
          provider: this.isGoogleModel(fallbackModelId) ? 'Google' : 'OpenAI',
          responseTime,
          cost,
          tokensUsed,
          success: true
        };
      } catch (fallbackError) {
        return {
          content: {
            riskLevel: "unknown",
            keyInsights: ["Unable to analyze deal. Please try again later."],
            recommendedActions: ["Manual review required"],
            winProbability: 0,
            potentialBlockers: ["AI analysis service unavailable"]
          },
          model: fallbackModelId,
          provider: this.isGoogleModel(fallbackModelId) ? 'Google' : 'OpenAI',
          responseTime: Date.now() - startTime,
          success: false,
          error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
        };
      }
    }
  }

  /**
   * Generate content with the optimal model
   */
  async generateContent(
    prompt: string,
    feature: AIFeature,
    taskContext: TaskContext = {}
  ): Promise<ServiceResponse> {
    // Verify API keys before proceeding
    this.verifyRequiredApiKeys();
    
    const modelId = await this.getOptimalModel(feature, taskContext);
    const startTime = Date.now();

    try {
      let result;
      if (this.isGoogleModel(modelId)) {
        const geminiResponse = await enhancedGeminiService.generateContent({
          prompt,
          model: modelId,
          customerId: taskContext.customerId,
          featureUsed: feature,
          maxTokens: taskContext.maxBudget ? undefined : 1000
        });
        
        result = geminiResponse.content;
      } else {
        const openAIResponse = await openAIService.generateContent({
          messages: [
            { role: 'user', content: prompt }
          ],
          model: modelId,
          customerId: taskContext.customerId,
          featureUsed: feature,
          maxTokens: taskContext.maxBudget ? undefined : 1000
        });
        
        result = openAIResponse.content;
      }

      const responseTime = Date.now() - startTime;
      const tokensUsed = Math.ceil(prompt.length / 4) + Math.ceil(result.length / 4);
      const cost = this.estimateCost(modelId, tokensUsed);

      this.updateStats(modelId, responseTime, cost, true);

      return {
        content: result,
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime,
        cost,
        tokensUsed,
        success: true
      };
    } catch (error) {
      console.error(`Error generating content with ${modelId}:`, error);
      
      // Try fallback model
      const fallbackModelId = this.isGoogleModel(modelId) ? 'gpt-3.5-turbo' : 'gemma-2-2b-it';
      try {
        let result;
        if (this.isGoogleModel(fallbackModelId)) {
          const geminiResponse = await enhancedGeminiService.generateContent({
            prompt,
            model: fallbackModelId,
            customerId: taskContext.customerId,
            featureUsed: `${feature}-fallback`,
            maxTokens: taskContext.maxBudget ? undefined : 1000
          });
          
          result = geminiResponse.content;
        } else {
          const openAIResponse = await openAIService.generateContent({
            messages: [
              { role: 'user', content: prompt }
            ],
            model: fallbackModelId,
            customerId: taskContext.customerId,
            featureUsed: `${feature}-fallback`,
            maxTokens: taskContext.maxBudget ? undefined : 1000
          });
          
          result = openAIResponse.content;
        }

        const responseTime = Date.now() - startTime;
        const tokensUsed = Math.ceil(prompt.length / 4) + Math.ceil(result.length / 4);
        const cost = this.estimateCost(fallbackModelId, tokensUsed);

        this.updateStats(fallbackModelId, responseTime, cost, true);

        return {
          content: result,
          model: fallbackModelId,
          provider: this.isGoogleModel(fallbackModelId) ? 'Google' : 'OpenAI',
          responseTime,
          cost,
          tokensUsed,
          success: true
        };
      } catch (fallbackError) {
        return {
          content: "I couldn't generate a response at this time. Please try again later.",
          model: fallbackModelId,
          provider: this.isGoogleModel(fallbackModelId) ? 'Google' : 'OpenAI',
          responseTime: Date.now() - startTime,
          success: false,
          error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
        };
      }
    }
  }

  /**
   * Generate insights for contacts
   */
  async generateContactInsights(
    contacts: any[],
    taskContext: TaskContext = {}
  ): Promise<ServiceResponse> {
    // Verify API keys before proceeding
    this.verifyRequiredApiKeys();
    
    // For contact analysis, prefer models with good pattern recognition
    const modelId = await this.getOptimalModel('contact_scoring', {
      ...taskContext,
      modelId: taskContext.modelId || 'gemini-2.5-flash'
    });
    
    const startTime = Date.now();
    const prompt = `
      Analyze these contacts and provide insights:
      
      ${JSON.stringify(contacts, null, 2)}
      
      Identify:
      1. The highest value contacts
      2. Contacts that need follow-up
      3. Patterns in the data
      4. Contact scoring recommendations
      
      Format your response as JSON with the following structure:
      {
        "highValueContacts": ["string"],
        "needFollowUp": ["string"],
        "patterns": ["string"],
        "scoringRecommendations": ["string"]
      }
    `;

    try {
      let result;
      if (this.isGoogleModel(modelId)) {
        const geminiResponse = await enhancedGeminiService.generateContent({
          prompt,
          model: modelId,
          customerId: taskContext.customerId,
          featureUsed: 'contact-insights',
          systemInstruction: "You are a CRM analytics expert specialized in contact scoring and analysis."
        });
        
        result = JSON.parse(geminiResponse.content);
      } else {
        const openAIResponse = await openAIService.generateContent({
          messages: [
            { role: 'system', content: "You are a CRM analytics expert specialized in contact scoring and analysis." },
            { role: 'user', content: prompt }
          ],
          model: modelId,
          customerId: taskContext.customerId,
          featureUsed: 'contact-insights'
        });
        
        result = JSON.parse(openAIResponse.content);
      }

      const responseTime = Date.now() - startTime;
      const inputSize = JSON.stringify(contacts).length;
      const outputSize = JSON.stringify(result).length;
      const tokensUsed = Math.ceil((inputSize + outputSize) / 4);
      const cost = this.estimateCost(modelId, tokensUsed);

      this.updateStats(modelId, responseTime, cost, true);

      return {
        content: result,
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime,
        cost,
        tokensUsed,
        success: true
      };
    } catch (error) {
      console.error(`Error generating contact insights with ${modelId}:`, error);
      
      return {
        content: {
          highValueContacts: [],
          needFollowUp: [],
          patterns: ["Unable to analyze contacts at this time."],
          scoringRecommendations: ["Manual review recommended"]
        },
        model: modelId,
        provider: this.isGoogleModel(modelId) ? 'Google' : 'OpenAI',
        responseTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify that required API keys are available
   */
  private verifyRequiredApiKeys() {
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key is required. Please check your Supabase configuration.');
    }
    
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required');
    }
  }

  /**
   * Estimate cost based on model and tokens
   */
  private estimateCost(modelId: string, tokens: number): number {
    const pricing: Record<string, number> = {
      'gemma-2-2b-it': 0.00000035, // per token
      'gemma-2-9b-it': 0.00000050, // per token
      'gemma-2-27b-it': 0.00000125, // per token
      'gemini-2.5-flash': 0.00000075, // per token
      'gemini-2.5-flash-8b': 0.00000035, // per token
      'gpt-4o-mini': 0.00015, // per token
      'gpt-3.5-turbo': 0.0000015, // per token
    };

    return tokens * (pricing[modelId] || 0.0000015);
  }

  /**
   * Get usage statistics
   */
  getUsageStatistics(): any {
    return {
      modelStats: this.usageStats,
      totalCalls: Object.values(this.usageStats).reduce((sum, stat) => sum + stat.callCount, 0),
      totalSuccesses: Object.values(this.usageStats).reduce((sum, stat) => sum + stat.successCount, 0),
      avgResponseTime: this.calculateAverageResponseTime(),
      avgCost: this.calculateAverageCost(),
    };
  }

  private calculateAverageResponseTime(): number {
    const stats = Object.values(this.usageStats);
    if (stats.length === 0) return 0;

    const totalCalls = stats.reduce((sum, stat) => sum + stat.callCount, 0);
    if (totalCalls === 0) return 0;

    return stats.reduce((sum, stat) => sum + stat.avgResponseTime * stat.callCount, 0) / totalCalls;
  }

  private calculateAverageCost(): number {
    const stats = Object.values(this.usageStats);
    if (stats.length === 0) return 0;

    const totalCalls = stats.reduce((sum, stat) => sum + stat.callCount, 0);
    if (totalCalls === 0) return 0;

    return stats.reduce((sum, stat) => sum + stat.avgCost * stat.callCount, 0) / totalCalls;
  }
}

// Create singleton instance
export const aiOrchestratorService = new AIOrchestratorService();

// Export service for use in components
export default aiOrchestratorService;