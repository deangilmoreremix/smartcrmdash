import { supabase } from '../lib/supabase';

/**
 * Class for interacting with AI Edge Functions
 */
export class AIApi {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    // Get environment variables with fallbacks
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }

  /**
   * Check if Supabase is properly configured
   */
  private isSupabaseConfigured(): boolean {
    return (
      !!this.supabaseUrl &&
      !!this.supabaseAnonKey &&
      this.supabaseUrl.length > 10 &&
      this.supabaseAnonKey.length > 10 &&
      !this.supabaseUrl.includes('your_') &&
      !this.supabaseAnonKey.includes('your_')
    );
  }

  /**
   * Call a Supabase Edge Function
   */
  private async callEdgeFunction(functionName: string, payload: any): Promise<any> {
    if (!this.isSupabaseConfigured()) {
      throw new Error('Supabase configuration is missing or invalid');
    }

    try {
      const functionUrl = `${this.supabaseUrl}/functions/v1/${functionName}`;
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Edge function error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Summarize customer notes
   */
  async summarizeCustomerNotes(notes: string, options?: { 
    customerId?: string;
    model?: string;
  }): Promise<{ summary: string }> {
    return this.callEdgeFunction('summarize-customer-notes', {
      notes,
      customerId: options?.customerId,
      model: options?.model
    });
  }

  /**
   * Generate a sales pitch based on lead data
   */
  async generateSalesPitch(leadData: any, options?: {
    customerId?: string;
    model?: string;
    pitchStyle?: 'professional' | 'casual' | 'technical' | 'friendly';
  }): Promise<{ pitch: string }> {
    return this.callEdgeFunction('generate-sales-pitch', {
      leadData,
      customerId: options?.customerId,
      model: options?.model,
      pitchStyle: options?.pitchStyle
    });
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string, options?: {
    customerId?: string;
    model?: string;
  }): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    tones: string[];
  }> {
    return this.callEdgeFunction('analyze-sentiment', {
      text,
      customerId: options?.customerId,
      model: options?.model
    });
  }

  /**
   * Process a natural language query against CRM data
   */
  async processNaturalLanguageQuery(query: string, contextData: any, options?: {
    customerId?: string;
    model?: string;
  }): Promise<{
    response: any;
    explanation?: string;
  }> {
    return this.callEdgeFunction('natural-language-query', {
      query,
      contextData,
      customerId: options?.customerId,
      model: options?.model
    });
  }

  /**
   * Prioritize tasks based on various factors
   */
  async prioritizeTasks(tasks: any[], options?: {
    customerId?: string;
    model?: string;
    criteria?: {
      urgency?: number;
      importance?: number;
      customerValue?: number;
    }
  }): Promise<{
    prioritizedTasks: any[];
    reasoning?: string[];
  }> {
    return this.callEdgeFunction('prioritize-tasks', {
      tasks,
      customerId: options?.customerId,
      model: options?.model,
      criteria: options?.criteria
    });
  }

  /**
   * Draft email response based on incoming email and context
   */
  async draftEmailResponse(incomingEmail: string, context: any, options?: {
    customerId?: string;
    model?: string;
    tone?: 'formal' | 'casual' | 'friendly' | 'professional';
    includeGreeting?: boolean;
    includeSignature?: boolean;
  }): Promise<{
    subject: string;
    body: string;
  }> {
    return this.callEdgeFunction('draft-email-response', {
      incomingEmail,
      context,
      customerId: options?.customerId,
      model: options?.model,
      tone: options?.tone,
      includeGreeting: options?.includeGreeting,
      includeSignature: options?.includeSignature
    });
  }
}

// Create a singleton instance
export const aiApi = new AIApi();
export default aiApi;