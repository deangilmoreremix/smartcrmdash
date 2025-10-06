import { supabase } from './supabaseClient';

export const edgeFunctionService = {
  async callFunction(functionName: string, payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};

// Export helper functions for specific edge functions
export async function analyzeCustomerEmail(emailText: string) {
  return edgeFunctionService.callFunction('analyze-email', { emailText });
}

export async function generateMeetingSummary(transcript: string) {
  return edgeFunctionService.callFunction('meeting-summary', { transcript });
}

export async function analyzeMarketTrends(industry: string, query: string) {
  return edgeFunctionService.callFunction('market-trends', { industry, query });
}

export async function analyzeCompetitor(competitorName: string, industry: string) {
  return edgeFunctionService.callFunction('competitor-analysis', { competitorName, industry });
}

export async function generateSalesInsights(dealData: any) {
  return edgeFunctionService.callFunction('sales-insights', { dealData });
}

export async function generateSalesForecast(historicalData: any) {
  return edgeFunctionService.callFunction('sales-forecast', { historicalData });
}
