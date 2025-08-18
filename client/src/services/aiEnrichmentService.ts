// AI Contact Enrichment Service - OpenAI & Gemini Integration
import { httpClient } from './http-client.service';
import { logger } from './logger.service';

export interface ContactEnrichmentData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  industry?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  avatar?: string;
  bio?: string;
  notes?: string;
  confidence?: number;
  // New Multimodal fields
  inferredPersonalityTraits?: Record<string, string>;
  communicationStyle?: string;
  professionalDemeanor?: string;
  imageAnalysisNotes?: string;
}

export interface AIProvider {
  name: 'openai' | 'gemini';
  enabled: boolean;
  apiKey?: string;
}

class AIEnrichmentService {
  private apiUrl: string;
  private isMockMode = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development';
  private openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  constructor() {
    // Get Supabase URL and anon key from environment
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Log API keys for debugging (without revealing full keys)
    console.log('OpenAI API Key:', openaiApiKey ? `${openaiApiKey.substring(0, 4)}...${openaiApiKey.substring(openaiApiKey.length - 4)}` : 'Not configured');
    console.log('Gemini API Key:', geminiApiKey ? `${geminiApiKey.substring(0, 4)}...${geminiApiKey.substring(geminiApiKey.length - 4)}` : 'Not configured');
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase environment variables not defined, using fallback mode');
      this.apiUrl = '/api/ai-enrichment';
      this.isMockMode = true;
    } else {
      this.apiUrl = `${supabaseUrl}/functions/v1/ai-enrichment`; 
      console.log('Using AI Enrichment Edge Function URL:', this.apiUrl); 
    }
  }

  private providers: AIProvider[] = [
    { name: 'openai', enabled: !!this.openaiApiKey, apiKey: this.openaiApiKey },
    { name: 'gemini', enabled: !!this.geminiApiKey, apiKey: this.geminiApiKey },
  ];

  private hasConfiguredProviders(): boolean {
    return this.providers.some(provider => provider.enabled);
  }

  private generateMockData(input: any): ContactEnrichmentData {
    return {
      ...input,
      confidence: 85,
      notes: 'Mock enrichment data for development',
      avatar: 'https://via.placeholder.com/100x100',
      industry: 'Technology',
      inferredPersonalityTraits: {
        'Professionalism': 'High',
        'Communication': 'Clear and direct',
        'Leadership': 'Collaborative'
      },
      communicationStyle: 'Professional and direct',
      professionalDemeanor: 'Confident and approachable',
      imageAnalysisNotes: 'Professional appearance, business attire'
    };
  }

  async enrichContactByEmail(email: string): Promise<ContactEnrichmentData> {
    console.log(`Enriching contact by email: ${email}`);
    
    // Check if any providers are configured before making the request
    if (!this.hasConfiguredProviders()) {
      console.warn(`No AI providers configured for email enrichment: ${email}`);
      return this.generateMockData({ email });
    }
    
    try {
      const response = await httpClient.post<ContactEnrichmentData>(
        this.apiUrl,
        { 
          authorization: 'anon-key',
          contactId: 'client-enrichment-request',
          enrichmentRequest: { email },
          type: 'email'
        },
        {
          timeout: 30000,
          retries: 2,
          headers: {
            'Authorization': `Bearer ${this.isMockMode ? '' : import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      );
      
      console.log(`Contact enriched successfully by email`);
      return response.data;
    } catch (error) {
      console.error('Contact enrichment by email failed', error);
      // Return graceful fallback data instead of throwing error
      return this.generateMockData({ email });
    }
  }

  async enrichContactByName(firstName: string, lastName: string, company?: string): Promise<ContactEnrichmentData> {
    console.log(`Enriching contact by name: ${firstName} ${lastName} ${company ? `at ${company}` : ''}`);
    
    // Check if any providers are configured before making the request
    if (!this.hasConfiguredProviders()) {
      console.warn(`No AI providers configured for name enrichment: ${firstName} ${lastName}`);
      return this.generateMockData({ firstName, lastName, company });
    }
    
    try {
      const response = await httpClient.post<ContactEnrichmentData>(
        this.apiUrl,
        { 
          contactId: 'client-enrichment-request',
          enrichmentRequest: { firstName, lastName, company },
          type: 'name'
        },
        {
          timeout: 30000,
          retries: 2,
          headers: {
            'Authorization': `Bearer ${this.isMockMode ? '' : import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      );
      
      console.log(`Contact enriched successfully by name`);
      return response.data;
    } catch (error) {
      console.error('Contact enrichment by name failed', error);
      return this.generateMockData({ firstName, lastName, company });
    }
  }

  async enrichContactMultimodal(contact: any, imageUrl: string): Promise<ContactEnrichmentData> {
    console.log(`Starting multimodal enrichment for contact: ${contact.id}`);
    
    if (!this.hasConfiguredProviders()) {
      console.warn(`No AI providers configured for multimodal enrichment`);
      return this.generateMockData({ imageUrl });
    }
    
    try {
      const response = await httpClient.post<ContactEnrichmentData>(
        this.apiUrl,
        {
          contactId: contact.id,
          enrichmentRequest: {
            contact: {
              name: contact.name,
              title: contact.title,
              company: contact.company,
              email: contact.email
            },
            imageUrl
          },
          type: 'multimodal'
        },
        {
          timeout: 45000,
          retries: 1,
          headers: {
            'Authorization': `Bearer ${this.isMockMode ? '' : import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      );
      
      console.log(`Multimodal enrichment completed successfully`);
      return response.data;
    } catch (error) {
      console.error('Multimodal enrichment failed', error);
      return this.generateMockData({ imageUrl });
    }
  }

  async findContactImage(name: string, company?: string): Promise<string> {
    console.log(`Finding image for: ${name} ${company ? `at ${company}` : ''}`);
    
    if (!this.hasConfiguredProviders()) {
      console.warn(`No AI providers configured for image search`);
      return 'https://via.placeholder.com/100x100';
    }
    
    try {
      const response = await httpClient.post<{ imageUrl: string }>(
        this.apiUrl,
        {
          contactId: 'image-search-request',
          enrichmentRequest: { name, company },
          type: 'image-search'
        },
        {
          timeout: 30000,
          retries: 2,
          headers: {
            'Authorization': `Bearer ${this.isMockMode ? '' : import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      );
      
      console.log(`Image found successfully`);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image search failed', error);
      return 'https://via.placeholder.com/100x100';
    }
  }

  getAvailableProviders(): AIProvider[] {
    return this.providers.filter(provider => provider.enabled);
  }

  isServiceAvailable(): boolean {
    return this.hasConfiguredProviders();
  }
}

export const aiEnrichmentService = new AIEnrichmentService();