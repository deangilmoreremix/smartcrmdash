import { callEdgeFunction } from './supabaseClient';
import { Contact, Deal } from '../types';

// Email generation
const generateEmailContent = async (contactName: string, purpose: string): Promise<string> => {
  try {
    const response = await callEdgeFunction('ai-content-generator', {
      contentType: 'email',
      purpose,
      data: { contactName }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error generating email content:', error);
    throw error;
  }
};

// Text message generation
const generateTextMessage = async (contactName: string, purpose: string): Promise<string> => {
  try {
    const response = await callEdgeFunction('ai-content-generator', {
      contentType: 'text',
      purpose,
      data: { contactName }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error generating text message:', error);
    throw error;
  }
};

// Call script generation
export const generateCallScript = async (
  contact: Partial<Contact>, 
  callPurpose: string, 
  previousInteractions: string[]
): Promise<string> => {
  try {
    const response = await callEdgeFunction('ai-content-generator', {
      contentType: 'call',
      purpose: callPurpose,
      data: { 
        contact,
        previousInteractions
      }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error generating call script:', error);
    throw error;
  }
};

// Market trend analysis
export const analyzeMarketTrends = async (
  industry: string, 
  targetMarket: string, 
  timeframe: string
): Promise<string> => {
  try {
    const response = await callEdgeFunction('ai-content-generator', {
      contentType: 'marketTrend',
      purpose: 'Market Analysis',
      data: { 
        industry,
        targetMarket,
        timeframe
      }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error analyzing market trends:', error);
    throw error;
  }
};

// Competitor analysis
export const analyzeCompetitor = async (
  competitorName: string, 
  industry: string, 
  strengths: string[]
): Promise<string> => {
  try {
    const response = await callEdgeFunction('ai-content-generator', {
      contentType: 'competitor',
      purpose: 'Competitive Analysis',
      data: { 
        competitorName,
        industry,
        strengths
      }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error analyzing competitor:', error);
    throw error;
  }
};

// Sales forecast
export const generateSalesForecast = async (
  deals: Partial<Deal>[], 
  timeframe: string
): Promise<string> => {
  try {
    const response = await callEdgeFunction('ai-content-generator', {
      contentType: 'salesForecast',
      purpose: 'Sales Forecast',
      data: { 
        deals,
        timeframe
      }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error generating sales forecast:', error);
    throw error;
  }
};

// Proposal generator
const generateProposal = async (
  contact: Partial<Contact>, 
  dealDetails: string, 
  previousInteractions: string[]
): Promise<string> => {
  try {
    const response = await callEdgeFunction('ai-content-generator', {
      contentType: 'proposal',
      purpose: 'Sales Proposal',
      data: { 
        contact,
        dealDetails,
        previousInteractions
      }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error generating proposal:', error);
    throw error;
  }
};

// Email analysis
export const analyzeCustomerEmail = async (emailContent: string): Promise<string> => {
  try {
    const response = await callEdgeFunction('email-analyzer', {
      emailContent
    });
    
    return response.result;
  } catch (error) {
    console.error('Error analyzing customer email:', error);
    throw error;
  }
};

// Meeting summarization
export const generateMeetingSummary = async (transcript: string): Promise<string> => {
  try {
    const response = await callEdgeFunction('meeting-summarizer', {
      transcript
    });
    
    return response.result;
  } catch (error) {
    console.error('Error generating meeting summary:', error);
    throw error;
  }
};

// Business analysis
export const analyzeBusinessData = async (
  businessData: any, 
  userId?: string
): Promise<string> => {
  try {
    const response = await callEdgeFunction('business-analyzer', {
      businessData,
      userId
    });
    
    return response.result;
  } catch (error) {
    console.error('Error analyzing business:', error);
    throw new Error('Failed to analyze business. Please try again later or check your data.');
  }
};

// Sales insights generation
export const generateSalesInsights = async (
  contacts: Partial<Contact>[], 
  deals: Partial<Deal>[]
): Promise<string> => {
  try {
    const response = await callEdgeFunction('sales-insights', {
      contacts,
      deals
    });
    
    return response.result;
  } catch (error) {
    console.error('Error generating sales insights:', error);
    throw error;
  }
};

// Real-time analysis functions
const analyzeSentimentRealTime = async (text: string): Promise<any> => {
  try {
    const response = await callEdgeFunction('realtime-analysis', {
      analysisType: 'sentiment',
      content: text
    });
    
    return response.result;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};

const provideEmailFeedback = async (emailContent: string): Promise<string> => {
  try {
    const response = await callEdgeFunction('realtime-analysis', {
      analysisType: 'email-feedback',
      content: emailContent
    });
    
    return response.result;
  } catch (error) {
    console.error('Error providing email feedback:', error);
    throw error;
  }
};

const validateFormField = async (
  fieldName: string, 
  fieldValue: string, 
  formContext: string = 'general'
): Promise<any> => {
  try {
    const response = await callEdgeFunction('realtime-analysis', {
      analysisType: 'form-validation',
      content: {
        fieldName,
        fieldValue,
        formContext
      }
    });
    
    return response.result;
  } catch (error) {
    console.error('Error validating form field:', error);
    throw error;
  }
};

const analyzeCallRealTime = async (transcript: string): Promise<any> => {
  try {
    const response = await callEdgeFunction('realtime-analysis', {
      analysisType: 'call-insights',
      content: transcript
    });
    
    return response.result;
  } catch (error) {
    console.error('Error analyzing call:', error);
    throw error;
  }
};

const summarizeMeetingRealTime = async (partialTranscript: string): Promise<string> => {
  try {
    const response = await callEdgeFunction('realtime-analysis', {
      analysisType: 'meeting-summary-realtime',
      content: partialTranscript
    });
    
    return response.result;
  } catch (error) {
    console.error('Error summarizing meeting:', error);
    throw error;
  }
};