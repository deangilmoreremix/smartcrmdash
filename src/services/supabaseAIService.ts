import { supabase } from '../lib/supabase';

export interface AIModelConfig {
  id: string;
  provider: 'anthropic' | 'gemini' | 'mistral' | 'openai' | 'other';
  model_name: string;
  display_name: string;
  endpoint_url?: string;
  pricing?: {
    input_per_1m_tokens: number;
    output_per_1m_tokens: number;
  };
  capabilities: string[];
  context_window: number;
  max_tokens: number;
  is_active: boolean;
  is_recommended: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AIUsageLog {
  id: string;
  customer_id?: string;
  user_id?: string;
  model_id: string;
  feature_used: string;
  tokens_used: number;
  cost: number;
  response_time_ms: number;
  success: boolean;
  error_message?: string;
  created_at: Date;
}

class SupabaseAIService {
  /**
   * Get all available AI models from the database
   */
  async getAvailableModels(): Promise<AIModelConfig[]> {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('is_active', true)
        .order('is_recommended', { ascending: false })
        .order('display_name');

      if (error) throw error;

      return (data || []).map(model => ({
        ...model,
        created_at: new Date(model.created_at),
        updated_at: new Date(model.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching AI models:', error);
      return [];
    }
  }

  /**
   * Get models by provider
   */
  async getModelsByProvider(provider: string): Promise<AIModelConfig[]> {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('provider', provider)
        .eq('is_active', true)
        .order('display_name');

      if (error) throw error;

      return (data || []).map(model => ({
        ...model,
        created_at: new Date(model.created_at),
        updated_at: new Date(model.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching models by provider:', error);
      return [];
    }
  }

  /**
   * Get a specific model by ID
   */
  async getModelById(modelId: string): Promise<AIModelConfig | null> {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('id', modelId)
        .single();

      if (error) throw error;

      return data ? {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      } : null;
    } catch (error) {
      console.error('Error fetching model by ID:', error);
      return null;
    }
  }

  /**
   * Get recommended models for a specific use case
   */
  async getRecommendedModels(useCase?: string): Promise<AIModelConfig[]> {
    try {
      let query = supabase
        .from('ai_models')
        .select('*')
        .eq('is_active', true)
        .eq('is_recommended', true);

      // If use case is specified, filter by capabilities
      if (useCase) {
        query = query.contains('capabilities', [useCase]);
      }

      const { data, error } = await query.order('display_name');

      if (error) throw error;

      return (data || []).map(model => ({
        ...model,
        created_at: new Date(model.created_at),
        updated_at: new Date(model.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching recommended models:', error);
      return [];
    }
  }

  /**
   * Log AI usage for analytics
   */
  async logUsage(usage: Omit<AIUsageLog, 'id' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_usage_logs')
        .insert([usage]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging AI usage:', error);
    }
  }

  /**
   * Get usage statistics for a customer
   */
  async getUsageStats(customerId?: string, timeframe: 'day' | 'week' | 'month' = 'month') {
    try {
      const now = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      let query = supabase
        .from('ai_usage_logs')
        .select(`
          model_id,
          tokens_used,
          cost,
          response_time_ms,
          feature_used,
          success,
          ai_models!inner(display_name, provider)
        `)
        .gte('created_at', startDate.toISOString());

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process the data for statistics
      const stats = (data || []).reduce((acc, log) => {
        const modelId = log.model_id;
        
        if (!acc[modelId]) {
          acc[modelId] = {
            modelId,
            modelName: log.ai_models.display_name,
            provider: log.ai_models.provider,
            requests: 0,
            tokensUsed: 0,
            totalCost: 0,
            avgResponseTime: 0,
            successRate: 0,
            features: new Set()
          };
        }

        acc[modelId].requests++;
        acc[modelId].tokensUsed += log.tokens_used || 0;
        acc[modelId].totalCost += log.cost || 0;
        acc[modelId].avgResponseTime += log.response_time_ms || 0;
        acc[modelId].features.add(log.feature_used);
        
        if (log.success) {
          acc[modelId].successRate++;
        }

        return acc;
      }, {} as Record<string, any>);

      // Calculate averages and convert Sets to arrays
      Object.values(stats).forEach((stat: any) => {
        stat.avgResponseTime = stat.avgResponseTime / stat.requests / 1000; // Convert to seconds
        stat.successRate = (stat.successRate / stat.requests) * 100;
        stat.features = Array.from(stat.features);
      });

      return Object.values(stats);
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return [];
    }
  }

  /**
   * Get AI model configuration for agent metadata
   */
  async getAgentModels(): Promise<AIModelConfig[]> {
    try {
      // Get models that are suitable for agent tasks (reasoning, function calling, etc.)
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('is_active', true)
        .overlaps('capabilities', ['reasoning', 'function-calling', 'text-generation'])
        .order('is_recommended', { ascending: false });

      if (error) throw error;

      return (data || []).map(model => ({
        ...model,
        created_at: new Date(model.created_at),
        updated_at: new Date(model.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching agent models:', error);
      return [];
    }
  }

  /**
   * Update agent metadata with selected model
   */
  async updateAgentModel(agentId: string, modelId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('agent_metadata')
        .update({
          llm: modelId,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating agent model:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const supabaseAIService = new SupabaseAIService();
export default supabaseAIService;