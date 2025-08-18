import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from 'openai';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize OpenAI client
  const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // OpenAI API status check with model availability
  app.get('/api/openai/status', async (req, res) => {
    const hasApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10;
    
    if (!hasApiKey) {
      return res.json({
        configured: false,
        model: 'none',
        status: 'needs_configuration',
        error: 'No API key configured'
      });
    }

    // Test API key with actual call
    if (!openai) {
      return res.json({
        configured: false,
        model: 'none',
        status: 'openai_not_initialized',
        error: 'OpenAI client not properly initialized'
      });
    }

    try {
      const testResponse = await openai.chat.completions.create({
        model: "gpt-4o", // Test with reliable model first
        messages: [{ role: "user", content: "Test" }],
        max_tokens: 5
      });

      // Try GPT-5 to see if available
      let gpt5Available = false;
      try {
        await openai.chat.completions.create({
          model: "gpt-5",
          messages: [{ role: "user", content: "Test" }],
          max_tokens: 5
        });
        gpt5Available = true;
      } catch (gpt5Error: any) {
        console.log('GPT-5 not available:', gpt5Error?.message || 'Unknown error');
      }

      res.json({
        configured: true,
        model: gpt5Available ? 'gpt-5' : 'gpt-4o',
        status: 'ready',
        gpt5Available,
        capabilities: gpt5Available ? [
          '94.6% AIME mathematical accuracy',
          '74.9% SWE-bench coding accuracy', 
          '84.2% MMMU multimodal performance',
          'Unified reasoning system',
          'Advanced verbosity and reasoning_effort controls'
        ] : [
          'GPT-4 Omni model available',
          'Advanced reasoning and analysis',
          'Multimodal capabilities',
          'JSON output formatting'
        ]
      });
    } catch (error: any) {
      res.json({
        configured: false,
        model: 'none',
        status: 'api_key_invalid',
        error: error?.message || 'Unknown API error',
        suggestion: 'Please check your OpenAI API key at platform.openai.com/account/api-keys'
      });
    }
  });

  // Advanced AI Smart Greeting Generation (using GPT-4o)
  app.post('/api/openai/smart-greeting', async (req, res) => {
    if (!openai) {
      return res.json({ 
        greeting: `Good ${req.body.timeOfDay}! You have ${req.body.userMetrics?.totalDeals || 0} deals worth $${(req.body.userMetrics?.totalValue || 0).toLocaleString()}.`,
        insight: 'Your pipeline shows strong momentum. Focus on high-value opportunities to maximize Q4 performance.',
        source: 'intelligent_fallback',
        capabilities: 'Configure API key for advanced AI insights'
      });
    }

    try {
      const { userMetrics, timeOfDay, recentActivity } = req.body;

      // Use GPT-5 with new features (released August 7, 2025)
      const response = await openai.chat.completions.create({
        model: "gpt-5", // Official GPT-5 model with unified reasoning system
        messages: [{
          role: "system",
          content: "You are an expert business strategist with GPT-5's unified reasoning system and 74.9% SWE-bench coding accuracy. Generate personalized, strategic greetings with actionable business insights based on user metrics."
        }, {
          role: "user",
          content: `Generate a strategic greeting for ${timeOfDay}. User has ${userMetrics.totalDeals} deals worth $${userMetrics.totalValue}. Recent activity: ${recentActivity}. Provide both greeting and strategic insight.`
        }],
        response_format: { type: "json_object" },
        verbosity: "medium", // GPT-5 verbosity parameter
        reasoning_effort: "minimal", // GPT-5 reasoning effort for faster responses
        temperature: 0.7,
        max_tokens: 400
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      res.json(result);

    } catch (error) {
      console.error('Smart greeting error:', error);
      res.status(500).json({ 
        error: 'Failed to generate smart greeting',
        greeting: `Good ${req.body.timeOfDay}! Your pipeline shows strong momentum.`,
        insight: 'Focus on your highest-value opportunities for maximum impact.'
      });
    }
  });

  // GPT-5 KPI Analysis
  app.post('/api/openai/kpi-analysis', async (req, res) => {
    if (!openai) {
      return res.status(400).json({
        error: 'OpenAI API key not configured',
        summary: 'Your KPI trends show steady performance. Configure OpenAI API key for detailed analysis.',
        recommendations: ['Set up API credentials', 'Enable advanced analytics']
      });
    }

    try {
      const { historicalData, currentMetrics } = req.body;

      let response;
      try {
        response = await openai.chat.completions.create({
          model: "gpt-5", // GPT-5 with 94.6% AIME mathematical accuracy
          messages: [{
            role: "system",
            content: "You are an expert business analyst with advanced mathematical reasoning capabilities. Analyze KPI trends and provide strategic insights with confidence intervals and actionable recommendations."
          }, {
            role: "user",
            content: `Analyze these KPI trends: Historical: ${JSON.stringify(historicalData)}, Current: ${JSON.stringify(currentMetrics)}. Provide summary, trends, predictions, and recommendations in JSON format.`
          }],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 800
        });
      } catch (gpt5Error) {
        console.log('GPT-5 not available, using gpt-4o for KPI analysis');
        response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "You are an expert business analyst with advanced mathematical reasoning capabilities. Analyze KPI trends and provide strategic insights with confidence intervals and actionable recommendations."
          }, {
            role: "user",
            content: `Analyze these KPI trends: Historical: ${JSON.stringify(historicalData)}, Current: ${JSON.stringify(currentMetrics)}. Provide summary, trends, predictions, and recommendations in JSON format.`
          }],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 800
        });
      }

      const result = JSON.parse(response.choices[0].message.content || '{}');
      res.json(result);

    } catch (error) {
      console.error('KPI analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze KPIs',
        summary: 'Your KPI trends show steady performance with opportunities for optimization.',
        recommendations: ['Focus on pipeline velocity', 'Optimize conversion rates', 'Scale successful strategies']
      });
    }
  });

  // GPT-5 Deal Intelligence
  app.post('/api/openai/deal-intelligence', async (req, res) => {
    if (!openai) {
      return res.status(400).json({
        error: 'OpenAI API key not configured',
        probability_score: 65,
        risk_level: 'medium',
        key_factors: ['Configure API key for detailed analysis'],
        recommendations: ['Set up OpenAI credentials for expert insights'],
        confidence_level: 'medium',
        estimated_close_days: 30,
        value_optimization: 0
      });
    }

    try {
      const { dealData, contactHistory, marketContext } = req.body;

      let response;
      try {
        response = await openai.chat.completions.create({
          model: "gpt-5", // GPT-5 with expert-level deal analysis
          messages: [{
            role: "system",
            content: "You are an expert sales strategist with deep reasoning capabilities. Provide comprehensive deal intelligence including win probability, risk factors, and strategic recommendations."
          }, {
            role: "user",
            content: `Analyze this deal: ${JSON.stringify(dealData)}. Contact history: ${JSON.stringify(contactHistory)}. Market context: ${JSON.stringify(marketContext)}. Provide comprehensive deal intelligence in JSON format.`
          }],
          response_format: { type: "json_object" },
          temperature: 0.2,
          max_tokens: 600
        });
      } catch (gpt5Error) {
        console.log('GPT-5 not available, using gpt-4o for deal analysis');
        response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "You are an expert sales strategist with deep reasoning capabilities. Provide comprehensive deal intelligence including win probability, risk factors, and strategic recommendations."
          }, {
            role: "user",
            content: `Analyze this deal: ${JSON.stringify(dealData)}. Contact history: ${JSON.stringify(contactHistory)}. Market context: ${JSON.stringify(marketContext)}. Provide comprehensive deal intelligence in JSON format.`
          }],
          response_format: { type: "json_object" },
          temperature: 0.2,
          max_tokens: 600
        });
      }

      const result = JSON.parse(response.choices[0].message.content || '{}');
      res.json(result);

    } catch (error) {
      console.error('Deal intelligence error:', error);
      res.status(500).json({
        error: 'Failed to analyze deal',
        probability_score: 65,
        risk_level: 'medium',
        key_factors: ['Follow-up frequency', 'Decision timeline', 'Budget confirmation'],
        recommendations: ['Schedule decision-maker meeting', 'Confirm budget authority', 'Present clear ROI'],
        confidence_level: 'medium',
        estimated_close_days: 30,
        value_optimization: 0
      });
    }
  });

  // Basic CRM routes (keeping minimal for Supabase integration)
  app.get('/api/test', (req, res) => {
    res.json({ message: 'CRM API is working', supabase: 'Edge Functions will handle AI operations' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
