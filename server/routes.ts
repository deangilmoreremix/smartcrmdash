import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from 'openai';
import { registerBulkImportRoutes } from './bulk-import';
import { handleStripeWebhook } from './stripe-webhook';
import { handleZaxaaWebhook } from './zaxaa-webhook';
import { getUserEntitlement, isUserActive, handleSuccessfulPurchase } from './entitlements-utils';
import { db } from './db';
import { entitlements } from '@shared/schema';

// Google AI integration
interface GoogleAIResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize AI clients with fallback strategy
  const userOpenAIKey = process.env.OPENAI_API_KEY;
  const workingOpenAIKey = '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';
  const googleAIKey = process.env.GOOGLE_AI_API_KEY;
  
  // Use working key as fallback for production reliability
  const openaiApiKey = userOpenAIKey || workingOpenAIKey;
  const openai = new OpenAI({ apiKey: openaiApiKey });

  // Google AI helper function
  async function callGoogleAI(prompt: string, model: string = 'gemini-1.5-flash'): Promise<string> {
    if (!googleAIKey) {
      throw new Error('Google AI API key not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleAIKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleAIResponse = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Development bypass endpoint - Skip authentication in dev mode
  app.post('/api/auth/dev-bypass', (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        error: 'Dev bypass only available in development mode'
      });
    }

    // Create a temporary dev user session
    const devUser = {
      id: 'dev-user-12345',
      email: 'dev@smartcrm.local',
      username: 'developer',
      firstName: 'Development',
      lastName: 'User',
      role: 'super_admin',
      app_context: 'smartcrm',
      avatar_url: null,
      created_at: new Date().toISOString()
    };

    res.json({
      success: true,
      user: devUser,
      session: {
        access_token: 'dev-bypass-token-12345',
        refresh_token: 'dev-bypass-refresh-12345',
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        user: devUser
      },
      message: 'Development bypass authentication successful'
    });
  });

  // Quick dev access route - Direct redirect to dashboard in dev mode
  app.get('/dev', (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(404).send('Not found');
    }
    
    // Redirect to app with dev bypass token in URL
    res.redirect('/?dev=true');
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

  // AI API Status Check (tests both OpenAI and Google AI)
  app.get('/api/openai/status', async (req, res) => {
    const results = {
      openai: { available: false, model: 'none', error: null as string | null },
      googleai: { available: false, model: 'none', error: null as string | null }
    };

    // Test OpenAI
    try {
      const testResponse = await openai.responses.create({
        model: "gpt-5",
        input: "Test connection",
        reasoning: { effort: "minimal" }
      });
      
      results.openai = {
        available: true,
        model: 'gpt-5',
        error: null
      };
    } catch (error: any) {
      try {
        const fallbackResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Test" }],
          max_tokens: 10
        });
        
        results.openai = {
          available: true,
          model: 'gpt-4o-mini',
          error: null
        };
      } catch (fallbackError: any) {
        results.openai = {
          available: false,
          model: 'none',
          error: fallbackError.message
        };
      }
    }

    // Test Google AI
    try {
      const googleResponse = await callGoogleAI("Test connection", "gemini-1.5-flash");
      results.googleai = {
        available: true,
        model: 'gemini-1.5-flash',
        error: null
      };
    } catch (error: any) {
      results.googleai = {
        available: false,
        model: 'none',
        error: error.message
      };
    }

    // Return comprehensive status
    const anyWorking = results.openai.available || results.googleai.available;
    const primaryModel = results.openai.available ? results.openai.model : results.googleai.model;

    res.json({
      configured: anyWorking,
      model: primaryModel,
      status: anyWorking ? 'ready' : 'api_keys_invalid',
      openai: results.openai,
      googleai: results.googleai,
      capabilities: anyWorking ? [
        results.openai.available ? 'GPT-5/GPT-4 Processing' : null,
        results.googleai.available ? 'Google Gemini Processing' : null,
        'Intelligent AI fallback system',
        'Advanced business analysis'
      ].filter(Boolean) : ['Configure API keys for AI features']
    });
  });

  // Google AI Test Endpoint  
  app.post('/api/googleai/test', async (req, res) => {
    try {
      const prompt = req.body.prompt || "Generate a business insight in one sentence.";
      const response = await callGoogleAI(prompt);
      
      res.json({
        success: true,
        model: 'gemini-1.5-flash',
        output: response,
        message: 'Google AI working perfectly!'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Google AI test failed'
      });
    }
  });

  // GPT-5 Direct Test Endpoint (with hardcoded working key)
  app.post('/api/openai/test-gpt5-direct', async (req, res) => {
    try {
      const testClient = new OpenAI({ 
        apiKey: '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'
      });
      
      const response = await testClient.responses.create({
        model: "gpt-5",
        input: "Generate a business insight about CRM efficiency in exactly 1 sentence.",
        reasoning: { effort: "minimal" }
      });
      
      res.json({
        success: true,
        model: 'gpt-5',
        output: response.output_text,
        message: 'GPT-5 working perfectly!'
      });
      
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Unknown error'
      });
    }
  });

  // Advanced AI Smart Greeting Generation (with intelligent fallback)
  app.post('/api/openai/smart-greeting', async (req, res) => {
    const { userMetrics, timeOfDay, recentActivity } = req.body;

    // Try GPT-5 with working key first
    try {
      const workingClient = new OpenAI({ 
        apiKey: workingOpenAIKey 
      });

      const response = await workingClient.responses.create({
        model: "gpt-5",
        input: `You are an expert business strategist. Generate a personalized, strategic greeting for ${timeOfDay}. User has ${userMetrics?.totalDeals || 0} deals worth $${userMetrics?.totalValue || 0}. Recent activity: ${JSON.stringify(recentActivity)}. Provide both greeting and strategic insight in JSON format with 'greeting' and 'insight' fields.`,
        reasoning: { effort: "minimal" }
      });

      const result = JSON.parse(response.output_text || '{}');
      res.json({
        ...result,
        source: 'gpt-5',
        model: 'gpt-5'
      });

    } catch (error) {
      console.error('Smart greeting error:', error);
      
      // Intelligent fallback with dynamic data
      res.json({ 
        greeting: `Good ${timeOfDay}! You have ${userMetrics?.totalDeals || 0} deals worth $${(userMetrics?.totalValue || 0).toLocaleString()}.`,
        insight: userMetrics?.totalValue > 50000 
          ? 'Your pipeline shows strong momentum. Focus on your highest-value opportunities to maximize Q4 performance.'
          : 'Your pipeline is growing steadily. Consider expanding your outreach to increase deal flow.',
        source: 'intelligent_fallback',
        model: 'fallback'
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
      // Optional webhook signature verification
      const signature = req.headers['x-webhook-signature'] as string;
      const expectedSignature = process.env.SUPABASE_WEBHOOK_SECRET;
      
      if (expectedSignature && signature && signature !== expectedSignature) {
        console.warn('⚠️ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      const { type, record } = req.body;
      
      if (type === 'INSERT' && record) {
        // Get app context from user metadata
        const appContext = record.raw_user_meta_data?.app_context || 
                          record.user_metadata?.app_context || 
                          'smartcrm';
        
        // Enhanced logging for monitoring
        console.log(`🎯 Email routing: ${record.email} → ${appContext} templates`, {
          userId: record.id,
          email: record.email,
          appContext,
          timestamp: new Date().toISOString(),
          metadata: record.raw_user_meta_data || record.user_metadata
        });
        
        // Log successful routing for monitoring
        res.json({ 
          success: true, 
          appContext,
          message: `User routed to ${appContext} email templates`,
          timestamp: new Date().toISOString()
        });
      } else {
        res.json({ success: true, message: 'Event processed' });
      }
    } catch (error) {
      console.error('❌ Auth webhook error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process auth webhook',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Register bulk import routes
  registerBulkImportRoutes(app);

  // Entitlements API routes
  app.get('/api/entitlements/check', async (req, res) => {
    try {
      // Get user ID from session or authentication
      const userId = (req as any).user?.id; // Implement proper auth middleware
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const entitlement = await getUserEntitlement(userId);
      const isActive = isUserActive(entitlement);

      res.json({
        entitlement,
        isActive,
        hasAccess: isActive
      });
    } catch (error) {
      console.error('Error checking entitlement:', error);
      res.status(500).json({ error: 'Failed to check entitlement' });
    }
  });

  app.get('/api/entitlements/list', async (req, res) => {
    try {
      // For admin access - in production, add proper admin authentication
      const entitlementsList = await db.select().from(entitlements).limit(100);
      
      res.json({
        entitlements: entitlementsList || [],
        total: entitlementsList?.length || 0
      });
    } catch (error) {
      console.error('Error listing entitlements:', error);
      res.status(500).json({ error: 'Failed to list entitlements' });
    }
  });

  app.post('/api/entitlements/create', async (req, res) => {
    try {
      const { userId, productType, planName, planAmount, currency } = req.body;
      
      if (!userId || !productType || !planName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create entitlement using the utility function
      const entitlement = await handleSuccessfulPurchase(
        userId,
        productType,
        {
          planName,
          planAmount: planAmount?.toString(),
          currency: currency || 'USD',
        }
      );

      res.json({ success: true, entitlement });
    } catch (error) {
      console.error('Error creating entitlement:', error);
      res.status(500).json({ error: 'Failed to create entitlement' });
    }
  });

  // Webhook endpoints
  app.post('/api/webhooks/stripe', handleStripeWebhook);
  app.post('/api/webhooks/zaxaa', handleZaxaaWebhook);

  // Basic CRM routes (keeping minimal for Supabase integration)
  app.get('/api/test', (req, res) => {
    res.json({ message: 'CRM API is working', supabase: 'Edge Functions will handle AI operations' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
