// Edge Function Service for Supabase functions
import { supabase } from '../lib/supabase';

interface ContactInfo {
  name?: string;
  position?: string;
  company?: string;
}

export async function generateCallScript(
  contactInfo: ContactInfo,
  callPurpose: string,
  previousInteractions: string[]
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-sales-pitch', {
      body: {
        contactInfo,
        callPurpose,
        previousInteractions
      }
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    return data?.script || 'Unable to generate call script at this time.';
  } catch (error) {
    console.error('Error calling edge function:', error);
    throw new Error('Failed to generate call script. Please try again.');
  }
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  summary: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
      body: { text }
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    return data || {
      sentiment: 'neutral',
      confidence: 0.5,
      summary: 'Unable to analyze sentiment at this time.'
    };
  } catch (error) {
    console.error('Error calling sentiment analysis:', error);
    throw new Error('Failed to analyze sentiment. Please try again.');
  }
}

export async function draftEmailResponse(originalEmail: string, context?: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('draft-email-response', {
      body: { originalEmail, context }
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    return data?.response || 'Unable to draft email response at this time.';
  } catch (error) {
    console.error('Error calling email draft function:', error);
    throw new Error('Failed to draft email response. Please try again.');
  }
}