import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from 'openai';
import { supabase, isSupabaseConfigured } from './supabase';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize OpenAI client
  const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

  // Partner Management Routes
  app.get('/api/partners/pending', async (req, res) => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock data if Supabase not configured
        const pendingPartners = [
          {
            id: 'partner_1',
            name: 'TechCorp Solutions',
            contact_email: 'contact@techcorp.com',
            subdomain: 'techcorp',
            created_at: new Date().toISOString(),
            status: 'pending'
          },
          {
            id: 'partner_2',
            name: 'Digital Marketing Pro',
            contact_email: 'hello@digitalmarketing.com',
            subdomain: 'digitalpro',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'pending'
          }
        ];
        return res.json(pendingPartners);
      }

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching pending partners:', error);
      res.status(500).json({ error: 'Failed to fetch pending partners' });
    }
  });

  app.get('/api/partners/active', async (req, res) => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock data if Supabase not configured
        const activePartners = [
          {
            id: 'partner_3',
            name: 'SalesForce Plus',
            contact_email: 'admin@salesforceplus.com',
            subdomain: 'salesforceplus',
            created_at: new Date(Date.now() - 604800000).toISOString(),
            status: 'active'
          }
        ];
        return res.json(activePartners);
      }

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching active partners:', error);
      res.status(500).json({ error: 'Failed to fetch active partners' });
    }
  });

  app.get('/api/partners/:partnerId/stats', async (req, res) => {
    try {
      const { partnerId } = req.params;

      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock data if Supabase not configured
        const stats = {
          total_customers: 42,
          active_customers: 38,
          total_revenue: 14200,
          monthly_revenue: 14200,
          customer_growth_rate: 23
        };
        return res.json(stats);
      }

      // Get partner stats from database
      const { data: stats, error: statsError } = await supabase
        .from('partner_stats')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw statsError;
      }

      // If no stats found, calculate from partner customers
      if (!stats) {
        const { data: customers, error: customersError } = await supabase
          .from('partner_customers')
          .select('monthly_revenue, status')
          .eq('partner_id', partnerId);

        if (customersError) throw customersError;

        const totalCustomers = customers?.length || 0;
        const activeCustomers = customers?.filter(c => c.status === 'active').length || 0;
        const totalRevenue = customers?.reduce((sum, c) => sum + (c.monthly_revenue || 0), 0) || 0;

        const calculatedStats = {
          total_customers: totalCustomers,
          active_customers: activeCustomers,
          total_revenue: totalRevenue,
          monthly_revenue: totalRevenue,
          customer_growth_rate: 0 // Would need historical data to calculate
        };

        return res.json(calculatedStats);
      }

      res.json(stats);
    } catch (error) {
      console.error('Error fetching partner stats:', error);
      res.status(500).json({ error: 'Failed to fetch partner stats' });
    }
  });

  app.get('/api/partners/:partnerId/customers', async (req, res) => {
    try {
      const { partnerId } = req.params;

      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock data if Supabase not configured
        const customers = [
          {
            id: '1',
            name: 'Acme Corp',
            subdomain: 'acme',
            status: 'active',
            plan: 'enterprise',
            monthly_revenue: 299,
            created_at: '2024-01-15T00:00:00Z',
            last_active: '2024-06-28T00:00:00Z'
          },
          {
            id: '2',
            name: 'TechStart Inc',
            subdomain: 'techstart',
            status: 'active',
            plan: 'pro',
            monthly_revenue: 149,
            created_at: '2024-02-20T00:00:00Z',
            last_active: '2024-06-27T00:00:00Z'
          }
        ];
        return res.json(customers);
      }

      const { data, error } = await supabase
        .from('partner_customers')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching partner customers:', error);
      res.status(500).json({ error: 'Failed to fetch partner customers' });
    }
  });

  app.post('/api/partners/:partnerId/customers', (req, res) => {
    const { partnerId } = req.params;
    const { companyName, contactEmail, plan } = req.body;

    // Mock customer creation
    const newCustomer = {
      id: `customer_${Date.now()}`,
      name: companyName,
      subdomain: companyName.toLowerCase().replace(/\s+/g, ''),
      status: 'active',
      plan: plan || 'basic',
      monthlyRevenue: plan === 'enterprise' ? 299 : plan === 'pro' ? 149 : 49,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    res.json(newCustomer);
  });

  app.post('/api/partners/onboard', (req, res) => {
    const partnerData = req.body;

    // Mock partner onboarding
    const newPartner = {
      id: `partner_${Date.now()}`,
      name: partnerData.companyName,
      contactEmail: partnerData.contactEmail,
      subdomain: partnerData.subdomain,
      status: 'pending',
      createdAt: new Date().toISOString(),
      brandingConfig: partnerData.brandingConfig
    };

    res.json(newPartner);
  });

  app.post('/api/partners/:partnerId/approve', (req, res) => {
    const { partnerId } = req.params;

    // Mock partner approval
    const approvedPartner = {
      id: partnerId,
      status: 'active',
      approvedAt: new Date().toISOString()
    };

    res.json(approvedPartner);
  });

  app.get('/api/partners', async (req, res) => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock data if Supabase not configured
        const partners = [
          {
            id: 'partner_1',
            name: 'TechCorp Solutions',
            status: 'active',
            contact_email: 'contact@techcorp.com',
            subdomain: 'techcorp',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 'partner_2',
            name: 'Digital Marketing Pro',
            status: 'active',
            contact_email: 'hello@digitalmarketing.com',
            subdomain: 'digitalpro',
            created_at: '2024-02-01T00:00:00Z'
          }
        ];
        return res.json(partners);
      }

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
      res.status(500).json({ error: 'Failed to fetch partners' });
    }
  });

  // White-label tenant management routes
  app.get('/api/white-label/tenants', async (req, res) => {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock data if Supabase not configured
        const tenants = [
          {
            id: 'tenant_1',
            name: 'Acme Corp',
            subdomain: 'acme',
            custom_domain: null,
            status: 'active',
            type: 'customer',
            plan: 'enterprise',
            contact_email: 'admin@acme.com',
            monthly_revenue: 299,
            user_count: 25,
            created_at: '2024-01-15T00:00:00Z',
            parent_partner_id: 'partner_1'
          },
          {
            id: 'tenant_2',
            name: 'TechStart Inc',
            subdomain: 'techstart',
            custom_domain: null,
            status: 'active',
            type: 'customer',
            plan: 'pro',
            contact_email: 'admin@techstart.com',
            monthly_revenue: 149,
            user_count: 12,
            created_at: '2024-02-20T00:00:00Z',
            parent_partner_id: 'partner_2'
          },
          {
            id: 'tenant_3',
            name: 'SalesForce Plus',
            subdomain: 'salesforceplus',
            custom_domain: 'crm.salesforceplus.com',
            status: 'active',
            type: 'partner',
            plan: 'enterprise',
            contact_email: 'admin@salesforceplus.com',
            monthly_revenue: 499,
            user_count: 50,
            created_at: '2024-01-01T00:00:00Z'
          }
        ];
        return res.json(tenants);
      }

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      res.status(500).json({ error: 'Failed to fetch tenants' });
    }
  });

  app.put('/api/white-label/tenants/:tenantId', async (req, res) => {
    try {
      const { tenantId } = req.params;
      const updates = req.body;

      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock response if Supabase not configured
        const updatedTenant = {
          id: tenantId,
          ...updates,
          updated_at: new Date().toISOString()
        };
        return res.json(updatedTenant);
      }

      const { data, error } = await supabase
        .from('tenants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', tenantId)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating tenant:', error);
      res.status(500).json({ error: 'Failed to update tenant' });
    }
  });

  app.delete('/api/white-label/tenants/:tenantId', async (req, res) => {
    try {
      const { tenantId } = req.params;

      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock response if Supabase not configured
        return res.json({ message: 'Tenant deleted successfully', id: tenantId });
      }

      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId);

      if (error) throw error;
      res.json({ message: 'Tenant deleted successfully', id: tenantId });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      res.status(500).json({ error: 'Failed to delete tenant' });
    }
  });

  // Get white-label configuration for a tenant
  app.get('/api/white-label/config/:tenantId', async (req, res) => {
    try {
      const { tenantId } = req.params;

      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock data if Supabase not configured
        const mockConfig = {
          id: 'config_1',
          tenant_id: tenantId,
          company_name: 'Demo Company',
          logo_url: null,
          primary_color: '#3B82F6',
          secondary_color: '#6366F1',
          hero_title: 'Welcome to Our Platform',
          hero_subtitle: 'Transform your business with our solutions',
          cta_buttons: [],
          redirect_mappings: {},
          show_pricing: true,
          show_testimonials: true,
          show_features: true,
          support_email: 'support@demo.com',
          support_phone: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return res.json(mockConfig);
      }

      const { data, error } = await supabase
        .from('white_label_configs')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (!data) {
        return res.status(404).json({ error: 'White-label configuration not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching white-label config:', error);
      res.status(500).json({ error: 'Failed to fetch white-label configuration' });
    }
  });

  // Update white-label configuration
  app.put('/api/white-label/config/:tenantId', async (req, res) => {
    try {
      const { tenantId } = req.params;
      const updates = req.body;

      if (!isSupabaseConfigured() || !supabase) {
        // Fallback to mock response if Supabase not configured
        const updatedConfig = {
          id: 'config_1',
          tenant_id: tenantId,
          ...updates,
          updated_at: new Date().toISOString()
        };
        return res.json(updatedConfig);
      }

      // First check if config exists
      const { data: existingConfig } = await supabase
        .from('white_label_configs')
        .select('id')
        .eq('tenant_id', tenantId)
        .single();

      let result;
      if (existingConfig) {
        // Update existing config
        const { data, error } = await supabase
          .from('white_label_configs')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('tenant_id', tenantId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new config
        const { data, error } = await supabase
          .from('white_label_configs')
          .insert({
            tenant_id: tenantId,
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      res.json(result);
    } catch (error) {
      console.error('Error updating white-label config:', error);
      res.status(500).json({ error: 'Failed to update white-label configuration' });
    }
  });

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
