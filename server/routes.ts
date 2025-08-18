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

  // OpenAI API status check
  app.get('/api/openai/status', (req, res) => {
    const hasApiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10;
    res.json({
      configured: hasApiKey,
      model: 'gpt-5', // GPT-5 with unified reasoning system (released August 7, 2025)
      status: hasApiKey ? 'ready' : 'needs_configuration',
      capabilities: [
        '94.6% AIME mathematical accuracy',
        '74.9% SWE-bench coding accuracy', 
        '84.2% MMMU multimodal performance',
        'Unified reasoning system',
        'Advanced verbosity and reasoning_effort controls'
      ]
    });
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

      const response = await openai.chat.completions.create({
        model: "gpt-5", // GPT-5 with 94.6% AIME mathematical accuracy
        messages: [{
          role: "system",
          content: "You are an expert business analyst with GPT-5's advanced mathematical reasoning capabilities (94.6% AIME accuracy). Analyze KPI trends and provide strategic insights with confidence intervals and actionable recommendations."
        }, {
          role: "user",
          content: `Analyze these KPI trends: Historical: ${JSON.stringify(historicalData)}, Current: ${JSON.stringify(currentMetrics)}. Provide summary, trends, predictions, and recommendations.`
        }],
        response_format: { type: "json_object" },
        verbosity: "high", // Detailed analysis
        reasoning_effort: "high", // Deep mathematical analysis
        temperature: 0.3,
        max_tokens: 800
      });

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

      const response = await openai.chat.completions.create({
        model: "gpt-5", // GPT-5 with expert-level deal analysis
        messages: [{
          role: "system",
          content: "You are an expert sales strategist with GPT-5's deep reasoning capabilities. Provide comprehensive deal intelligence including win probability, risk factors, and strategic recommendations."
        }, {
          role: "user",
          content: `Analyze this deal: ${JSON.stringify(dealData)}. Contact history: ${JSON.stringify(contactHistory)}. Market context: ${JSON.stringify(marketContext)}. Provide comprehensive deal intelligence.`
        }],
        response_format: { type: "json_object" },
        verbosity: "medium",
        reasoning_effort: "high", // Complex multi-step analysis
        temperature: 0.2,
        max_tokens: 600
      });

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
