import { useState } from 'react';
import { aiApi } from '../utils/aiApi';
import { useContactStore } from '../store/contactStore';
import { useDealStore } from '../store/dealStore';

/**
 * Custom hook for AI API interactions with state management
 */
export const useAiApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { contacts } = useContactStore();
  const { deals } = useDealStore();

  const resetState = () => {
    setError(null);
  };

  /**
   * Summarize customer notes with error handling and loading state
   */
  const summarizeNotes = async (notes: string, options?: {
    customerId?: string;
    model?: string;
  }) => {
    resetState();
    setLoading(true);
    
    try {
      const result = await aiApi.summarizeCustomerNotes(notes, options);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Generate a sales pitch based on contact/lead information
   */
  const generateSalesPitch = async (contactId: string, options?: {
    model?: string;
    pitchStyle?: 'professional' | 'casual' | 'technical' | 'friendly';
  }) => {
    resetState();
    setLoading(true);
    
    try {
      const contact = contacts[contactId];
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Get related deals for this contact
      const contactDeals = Object.values(deals)
        .filter(deal => deal.contactId === contactId)
        .map(deal => ({
          title: deal.title,
          value: deal.value,
          stage: deal.stage,
          probability: deal.probability
        }));
      
      // Prepare lead data with enriched context
      const leadData = {
        name: contact.name,
        company: contact.company || '',
        position: contact.position || contact.title || '',
        industry: contact.industry || '',
        interests: contact.tags || [],
        status: contact.status,
        painPoints: [],  // This could come from notes or custom fields
        interactions: contactDeals.length > 0 ? `Has ${contactDeals.length} deals in pipeline` : 'New contact',
        deals: contactDeals
      };
      
      const result = await aiApi.generateSalesPitch(leadData, {
        customerId: contactId,
        ...options
      });
      
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Analyze sentiment of text
   */
  const analyzeSentiment = async (text: string, options?: {
    customerId?: string;
    model?: string;
  }) => {
    resetState();
    setLoading(true);
    
    try {
      const result = await aiApi.analyzeSentiment(text, options);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Process natural language query with context from the CRM data
   */
  const processQuery = async (query: string, options?: {
    customerId?: string;
    model?: string;
    includeContacts?: boolean;
    includeDeals?: boolean;
  }) => {
    resetState();
    setLoading(true);
    
    try {
      // Build context data from store states
      const contextData: any = {};
      
      if (options?.includeContacts !== false) {
        contextData.contacts = Object.values(contacts);
      }
      
      if (options?.includeDeals !== false) {
        contextData.deals = Object.values(deals);
      }
      
      const result = await aiApi.processNaturalLanguageQuery(query, contextData, {
        customerId: options?.customerId,
        model: options?.model
      });
      
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Prioritize a list of tasks using AI
   */
  const prioritizeTasks = async (tasks: any[], options?: {
    customerId?: string;
    model?: string;
    criteria?: {
      urgency?: number;
      importance?: number;
      customerValue?: number;
    }
  }) => {
    resetState();
    setLoading(true);
    
    try {
      const result = await aiApi.prioritizeTasks(tasks, options);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Draft an email response
   */
  const draftEmailResponse = async (incomingEmail: string, contactId: string, options?: {
    customerId?: string;
    model?: string;
    tone?: 'formal' | 'casual' | 'friendly' | 'professional';
    includeGreeting?: boolean;
    includeSignature?: boolean;
  }) => {
    resetState();
    setLoading(true);
    
    try {
      const contact = contacts[contactId];
      if (!contact) {
        throw new Error('Contact not found');
      }
      
      // Get related deals for context
      const contactDeals = Object.values(deals)
        .filter(deal => deal.contactId === contactId)
        .map(deal => ({
          title: deal.title,
          value: deal.value,
          stage: deal.stage,
          probability: deal.probability
        }));
      
      // Build context for the email
      const context = {
        contact,
        deals: contactDeals,
        relationship: contact.interestLevel || contact.status || 'new',
        previousCorrespondence: []  // This would come from a real CRM's email history
      };
      
      const result = await aiApi.draftEmailResponse(incomingEmail, context, options);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    summarizeNotes,
    generateSalesPitch,
    analyzeSentiment,
    processQuery,
    prioritizeTasks,
    draftEmailResponse
  };
};

export default useAiApi;