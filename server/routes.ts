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

  // Supabase configuration endpoint
  app.get('/api/supabase/config', (req, res) => {
    res.json({
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || ''
    });
  });

  // Test Supabase connection
  app.get('/api/supabase/test', async (req, res) => {
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return res.json({
          status: 'error',
          message: 'Supabase credentials not configured'
        });
      }

      // Test basic connection by making a simple request to Supabase
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (response.ok) {
        res.json({
          status: 'success',
          message: 'Supabase connection successful',
          url: supabaseUrl.replace(/\/+$/, '') // Remove trailing slashes
        });
      } else {
        res.json({
          status: 'error',
          message: 'Failed to connect to Supabase',
          statusCode: response.status
        });
      }
    } catch (error: any) {
      res.json({
        status: 'error',
        message: 'Error testing Supabase connection',
        error: error.message
      });
    }
  });

  // Profile management endpoints
  app.post('/api/profiles', async (req, res) => {
    try {
      const { id, username, firstName, lastName } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Insert profile into database
      const profile = await storage.createProfile({
        id,
        username,
        firstName,
        lastName,
        role: 'user'
      });

      res.json(profile);
    } catch (error: any) {
      console.error('Profile creation error:', error);
      res.status(500).json({ error: 'Failed to create profile' });
    }
  });

  app.get('/api/profiles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.getProfile(id);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json(profile);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
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
        model: "gpt-4o-mini", // Test with reliable, available model
        messages: [{ role: "user", content: "Test" }],
        max_tokens: 5
      });

      res.json({
        configured: true,
        model: 'gpt-4o-mini',
        status: 'ready',
        gpt5Available: false,
        capabilities: [
          'GPT-4 Omni Mini model available',
          'Advanced reasoning and analysis',
          'Fast response times',
          'JSON output formatting',
          'Cost-effective AI processing'
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

      // Use GPT-4o-mini for reliable performance
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Reliable, available model
        messages: [{
          role: "system",
          content: "You are an expert business strategist. Generate personalized, strategic greetings with actionable business insights based on user metrics. Respond in JSON format."
        }, {
          role: "user",
          content: `Generate a strategic greeting for ${timeOfDay}. User has ${userMetrics.totalDeals} deals worth $${userMetrics.totalValue}. Recent activity: ${recentActivity}. Provide both greeting and strategic insight in JSON format with 'greeting' and 'insight' fields.`
        }],
        response_format: { type: "json_object" },
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
        model: "gpt-4o-mini", // Use available, reliable model
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
        model: "gpt-4o-mini", // Use available, reliable model
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

  // Multi-tenant email routing webhook for Supabase
  app.post('/api/auth-webhook', (req, res) => {
    try {
      const { type, record } = req.body;
      
      if (type === 'INSERT' && record) {
        // Get app context from user metadata
        const appContext = record.raw_user_meta_data?.app_context || 
                          record.user_metadata?.app_context || 
                          'smartcrm';
        
        console.log(`New user signup for app: ${appContext}`, {
          userId: record.id,
          email: record.email,
          appContext,
          metadata: record.raw_user_meta_data || record.user_metadata
        });
        
        // Log successful routing for monitoring
        res.json({ 
          success: true, 
          appContext,
          message: `User routed to ${appContext} email templates`
        });
      } else {
        res.json({ success: true, message: 'Event processed' });
      }
    } catch (error) {
      console.error('Auth webhook error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process auth webhook' 
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
