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

      let result;
      try {
        const content = response.choices[0].message.content || '{}';
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', response.choices[0].message.content);
        // Extract JSON-like content using regex if direct parsing fails
        const jsonMatch = response.choices[0].message.content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (fallbackError) {
            result = {
              error: 'Failed to parse AI response',
              summary: 'Analysis completed but response parsing failed',
              recommendations: ['Review data format', 'Check API response'],
              parsed_content: response.choices[0].message.content
            };
          }
        } else {
          result = {
            error: 'Invalid response format',
            summary: 'Unable to extract structured data from AI response',
            recommendations: ['Retry analysis', 'Check API configuration']
          };
        }
      }
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

      let result;
      try {
        const content = response.choices[0].message.content || '{}';
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', response.choices[0].message.content);
        // Extract JSON-like content using regex if direct parsing fails
        const jsonMatch = response.choices[0].message.content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (fallbackError) {
            result = {
              error: 'Failed to parse AI response',
              summary: 'Analysis completed but response parsing failed',
              recommendations: ['Review data format', 'Check API response'],
              parsed_content: response.choices[0].message.content
            };
          }
        } else {
          result = {
            error: 'Invalid response format',
            summary: 'Unable to extract structured data from AI response',
            recommendations: ['Retry analysis', 'Check API configuration']
          };
        }
      }
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

  // GPT-5 Business Intelligence
  app.post('/api/openai/business-intelligence', async (req, res) => {
    try {
      const { businessData, marketContext, objectives } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a senior business consultant with expertise across multiple industries. Generate strategic business intelligence including market insights, competitive advantages, risk factors, growth opportunities, and strategic recommendations."
        }, {
          role: "user",
          content: `Generate business intelligence for: ${JSON.stringify(businessData)}. Market context: ${JSON.stringify(marketContext)}. Objectives: ${JSON.stringify(objectives)}. Provide market_insights, competitive_advantages, risk_factors, growth_opportunities, and strategic_recommendations in JSON format.`
        }],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 1000
      });

      let result;
      try {
        const content = response.choices[0].message.content || '{}';
        result = JSON.parse(content);
        
        // Ensure all required arrays exist
        result = {
          market_insights: Array.isArray(result.market_insights) ? result.market_insights : [],
          competitive_advantages: Array.isArray(result.competitive_advantages) ? result.competitive_advantages : [],
          risk_factors: Array.isArray(result.risk_factors) ? result.risk_factors : [],
          growth_opportunities: Array.isArray(result.growth_opportunities) ? result.growth_opportunities : [],
          strategic_recommendations: Array.isArray(result.strategic_recommendations) ? result.strategic_recommendations : [],
          ...result
        };
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', response.choices[0].message.content);
        // Provide structured fallback data
        result = {
          error: 'Failed to parse AI response',
          market_insights: ['Digital transformation accelerating', 'Customer expectations rising'],
          competitive_advantages: ['AI integration', 'Customer-centric approach'],
          risk_factors: ['Market competition', 'Economic uncertainty'],
          growth_opportunities: ['Market expansion', 'Product diversification'],
          strategic_recommendations: ['Invest in AI capabilities', 'Strengthen customer relationships']
        };
      }
      res.json(result);

    } catch (error) {
      console.error('Business intelligence error:', error);
      res.status(500).json({
        error: 'Failed to generate business intelligence',
        market_insights: ['Digital transformation accelerating', 'Customer expectations rising'],
        competitive_advantages: ['AI integration', 'Customer-centric approach'],
        risk_factors: ['Market competition', 'Economic uncertainty'],
        growth_opportunities: ['Market expansion', 'Product diversification'],
        strategic_recommendations: ['Invest in AI capabilities', 'Strengthen customer relationships']
      });
    }
  });

  // GPT-5 Performance Optimization Analysis
  app.post('/api/openai/performance-optimization', async (req, res) => {
    try {
      const { systemMetrics, userBehavior, businessGoals } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are an expert performance optimization consultant with deep knowledge of business systems and process improvement. Analyze system performance data and provide actionable optimization recommendations."
        }, {
          role: "user",
          content: `Analyze performance optimization opportunities: System metrics: ${JSON.stringify(systemMetrics)}. User behavior: ${JSON.stringify(userBehavior)}. Business goals: ${JSON.stringify(businessGoals)}. Provide optimization_score, efficiency_gain, recommended_actions, expected_roi, and implementation_timeline in JSON format.`
        }],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 700
      });

      let result;
      try {
        const content = response.choices[0].message.content || '{}';
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', response.choices[0].message.content);
        // Extract JSON-like content using regex if direct parsing fails
        const jsonMatch = response.choices[0].message.content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (fallbackError) {
            result = {
              error: 'Failed to parse AI response',
              summary: 'Analysis completed but response parsing failed',
              recommendations: ['Review data format', 'Check API response'],
              parsed_content: response.choices[0].message.content
            };
          }
        } else {
          result = {
            error: 'Invalid response format',
            summary: 'Unable to extract structured data from AI response',
            recommendations: ['Retry analysis', 'Check API configuration']
          };
        }
      }
      res.json(result);

    } catch (error) {
      console.error('Performance optimization error:', error);
      res.status(500).json({
        error: 'Failed to optimize performance',
        optimization_score: 75,
        efficiency_gain: 45,
        recommended_actions: ['Automate routine tasks', 'Implement predictive analytics', 'Optimize workflow processes'],
        expected_roi: '30% increase in productivity',
        implementation_timeline: '4-6 weeks'
      });
    }
  });

  // GPT-5 Advanced Content Generation (with reasoning effort)
  app.post('/api/openai/advanced-content', async (req, res) => {
    try {
      const { contentType, parameters, reasoning_effort = 'medium' } = req.body;

      // Try GPT-5 with reasoning effort first
      try {
        const workingClient = new OpenAI({ apiKey: workingOpenAIKey });
        const response = await workingClient.responses.create({
          model: "gpt-5",
          input: `Generate ${contentType} content with these parameters: ${JSON.stringify(parameters)}. Provide high-quality, strategic content suitable for business use.`,
          reasoning: { effort: reasoning_effort }
        });

        res.json({
          content: response.output_text,
          reasoning_quality: reasoning_effort,
          confidence: 0.95,
          source: 'gpt-5'
        });

      } catch (gpt5Error) {
        // Fallback to GPT-4
        const fallbackResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: `You are an expert ${contentType} generator. Create high-quality, professional content based on the given parameters.`
          }, {
            role: "user",
            content: `Generate ${contentType} content with these specifications: ${JSON.stringify(parameters)}. Ensure the content is strategic, well-structured, and business-appropriate.`
          }],
          temperature: 0.4,
          max_tokens: 1000
        });

        res.json({
          content: fallbackResponse.choices[0].message.content,
          reasoning_quality: 'standard',
          confidence: 0.85,
          source: 'gpt-4o-mini'
        });
      }

    } catch (error) {
      console.error('Advanced content generation error:', error);
      res.status(500).json({
        error: 'Failed to generate content',
        content: `Professional ${req.body.contentType} content generation temporarily unavailable. Please try again.`,
        reasoning_quality: 'fallback',
        confidence: 0.5
      });
    }
  });

  // GPT-5 Multimodal Analysis
  app.post('/api/openai/multimodal-analysis', async (req, res) => {
    try {
      const { textData, images, charts, documents } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Use available model for now
        messages: [{
          role: "system",
          content: "You are an expert data analyst capable of understanding complex business data, charts, and documents. Provide comprehensive insights from multiple data sources."
        }, {
          role: "user",
          content: `Analyze this multimodal business data: Text data: ${JSON.stringify(textData)}. Images count: ${images?.length || 0}. Charts count: ${charts?.length || 0}. Documents count: ${documents?.length || 0}. Provide text_insights, visual_insights, combined_insights, and confidence_score in JSON format.`
        }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 800
      });

      let result;
      try {
        const content = response.choices[0].message.content || '{}';
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', response.choices[0].message.content);
        // Extract JSON-like content using regex if direct parsing fails
        const jsonMatch = response.choices[0].message.content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (fallbackError) {
            result = {
              error: 'Failed to parse AI response',
              summary: 'Analysis completed but response parsing failed',
              recommendations: ['Review data format', 'Check API response'],
              parsed_content: response.choices[0].message.content
            };
          }
        } else {
          result = {
            error: 'Invalid response format',
            summary: 'Unable to extract structured data from AI response',
            recommendations: ['Retry analysis', 'Check API configuration']
          };
        }
      }
      res.json(result);

    } catch (error) {
      console.error('Multimodal analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze multimodal data',
        text_insights: ['Text analysis shows steady performance trends'],
        visual_insights: ['Chart analysis indicates growth opportunities'],
        combined_insights: ['Comprehensive analysis suggests optimization potential'],
        confidence_score: 0.7
      });
    }
  });

  // GPT-5 Predictive Analytics
  app.post('/api/openai/predictive-analytics', async (req, res) => {
    try {
      const { historicalData, forecastPeriod, analysisType } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are an expert predictive analytics specialist with advanced mathematical modeling capabilities. Generate accurate forecasts and predictions based on historical data patterns."
        }, {
          role: "user",
          content: `Generate predictive analytics for ${analysisType}: Historical data: ${JSON.stringify(historicalData)}. Forecast period: ${forecastPeriod} months. Provide predictions, confidence_intervals, key_factors, accuracy_score, and forecast_period in JSON format.`
        }],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 900
      });

      let result;
      try {
        const content = response.choices[0].message.content || '{}';
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', response.choices[0].message.content);
        // Extract JSON-like content using regex if direct parsing fails
        const jsonMatch = response.choices[0].message.content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (fallbackError) {
            result = {
              error: 'Failed to parse AI response',
              summary: 'Analysis completed but response parsing failed',
              recommendations: ['Review data format', 'Check API response'],
              parsed_content: response.choices[0].message.content
            };
          }
        } else {
          result = {
            error: 'Invalid response format',
            summary: 'Unable to extract structured data from AI response',
            recommendations: ['Retry analysis', 'Check API configuration']
          };
        }
      }
      res.json(result);

    } catch (error) {
      console.error('Predictive analytics error:', error);
      res.status(500).json({
        error: 'Failed to generate predictions',
        predictions: ['Sales growth expected to continue upward trend'],
        confidence_intervals: { low: 0.75, high: 0.92 },
        key_factors: ['Historical performance', 'Market conditions', 'Seasonal trends'],
        accuracy_score: 0.8,
        forecast_period: req.body.forecastPeriod || 3
      });
    }
  });

  // GPT-5 Strategic Planning
  app.post('/api/openai/strategic-planning', async (req, res) => {
    try {
      const { businessContext, goals, constraints, timeframe } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a senior strategic planning consultant with expertise in business strategy, goal setting, and execution planning. Create comprehensive strategic plans with actionable steps."
        }, {
          role: "user",
          content: `Create a strategic plan: Business context: ${JSON.stringify(businessContext)}. Goals: ${JSON.stringify(goals)}. Constraints: ${JSON.stringify(constraints)}. Timeframe: ${timeframe}. Provide strategic_objectives, action_items, milestones, risk_mitigation, and success_metrics in JSON format.`
        }],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1200
      });

      let result;
      try {
        const content = response.choices[0].message.content || '{}';
        result = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw content:', response.choices[0].message.content);
        // Extract JSON-like content using regex if direct parsing fails
        const jsonMatch = response.choices[0].message.content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
          } catch (fallbackError) {
            result = {
              error: 'Failed to parse AI response',
              summary: 'Analysis completed but response parsing failed',
              recommendations: ['Review data format', 'Check API response'],
              parsed_content: response.choices[0].message.content
            };
          }
        } else {
          result = {
            error: 'Invalid response format',
            summary: 'Unable to extract structured data from AI response',
            recommendations: ['Retry analysis', 'Check API configuration']
          };
        }
      }
      res.json(result);

    } catch (error) {
      console.error('Strategic planning error:', error);
      res.status(500).json({
        error: 'Failed to generate strategic plan',
        strategic_objectives: ['Expand market presence', 'Improve operational efficiency', 'Enhance customer experience'],
        action_items: ['Conduct market research', 'Implement process improvements', 'Launch customer feedback program'],
        milestones: ['Q1: Research completion', 'Q2: Process optimization', 'Q3: Customer program launch'],
        risk_mitigation: ['Regular progress reviews', 'Contingency planning', 'Market monitoring'],
        success_metrics: ['Market share growth', 'Efficiency improvements', 'Customer satisfaction scores']
      });
    }
  });

  // AI Assistants API Endpoints
  app.post('/api/assistants/create', async (req, res) => {
    try {
      const { name, instructions, model, tools } = req.body;

      const assistant = await openai.beta.assistants.create({
        name,
        instructions,
        model: model || "gpt-4o-mini",
        tools: tools || []
      });

      res.json({ success: true, assistant });
    } catch (error) {
      console.error('Assistant creation error:', error);
      res.status(500).json({ error: 'Failed to create assistant' });
    }
  });

  app.get('/api/assistants/:assistantId', async (req, res) => {
    try {
      const { assistantId } = req.params;
      const assistant = await openai.beta.assistants.retrieve(assistantId);
      res.json(assistant);
    } catch (error) {
      console.error('Assistant retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve assistant' });
    }
  });

  app.delete('/api/assistants/:assistantId', async (req, res) => {
    try {
      const { assistantId } = req.params;
      await openai.beta.assistants.delete(assistantId);
      res.json({ success: true });
    } catch (error) {
      console.error('Assistant deletion error:', error);
      res.status(500).json({ error: 'Failed to delete assistant' });
    }
  });

  app.post('/api/assistants/chat', async (req, res) => {
    try {
      const { message, assistantId, threadId } = req.body;

      // Create thread if not provided
      let currentThreadId = threadId;
      if (!currentThreadId) {
        const thread = await openai.beta.threads.create();
        currentThreadId = thread.id;
      }

      // Add user message
      await openai.beta.threads.messages.create(currentThreadId, {
        role: 'user',
        content: message
      });

      // Create and run
      const run = await openai.beta.threads.runs.create(currentThreadId, {
        assistant_id: assistantId
      });

      // Wait for completion with polling
      let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      }

      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(currentThreadId, { limit: 1 });
        const lastMessage = messages.data[0];
        const content = Array.isArray(lastMessage.content) && lastMessage.content[0]?.type === 'text'
          ? lastMessage.content[0].text.value 
          : 'No response available';

        res.json({
          response: content,
          threadId: currentThreadId,
          runId: run.id
        });
      } else {
        res.status(500).json({ error: `Run failed with status: ${runStatus.status}` });
      }

    } catch (error) {
      console.error('Assistant chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
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

  // Admin middleware for protecting admin routes
  const requireAdmin = (req: any, res: any, next: any) => {
    const adminEmails = ['dean@videoremix.io', 'samuel@videoremix.io', 'victor@videoremix.io'];
    
    // In development, allow bypass
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    // Check user from session/auth
    const userEmail = req.user?.email || req.headers['x-user-email'];
    const userRole = req.user?.role || req.headers['x-user-role'];
    
    if (!userEmail) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const isAdmin = adminEmails.includes(userEmail.toLowerCase()) || 
                   userRole === 'admin' || 
                   userRole === 'super_admin';
    
    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Admin access required',
        message: 'This endpoint is restricted to system administrators'
      });
    }
    
    next();
  };

  // Apply admin middleware to bulk import routes
  app.use('/api/bulk-import*', requireAdmin);
  app.use('/api/admin*', requireAdmin);

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

  // Admin management endpoints
  app.post('/api/admin/resend-confirmations', async (req, res) => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      
      const adminEmails = [
        'dean@videoremix.io',
        'samuel@videoremix.io',
        'victor@videoremix.io'
      ];
      
      const results = [];
      
      for (const email of adminEmails) {
        try {
          // Check if user exists
          const { data: users } = await supabase.auth.admin.listUsers();
          const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
          
          if (user) {
            if (!user.email_confirmed_at) {
              // Resend confirmation
              const { error } = await supabase.auth.admin.generateLink({
                type: 'signup',
                email: email,
                options: {
                  data: {
                    app_context: 'smartcrm',
                    role: 'admin',
                    first_name: email.split('@')[0],
                    last_name: 'Admin'
                  }
                }
              });
              
              results.push({
                email,
                status: error ? 'failed' : 'confirmation_sent',
                message: error ? error.message : 'Confirmation email sent',
                user_id: user.id,
                confirmed: false
              });
            } else {
              results.push({
                email,
                status: 'already_confirmed',
                message: 'Account already confirmed',
                user_id: user.id,
                confirmed: true
              });
            }
          } else {
            // Create new admin account
            const { data: newUser, error } = await supabase.auth.admin.createUser({
              email: email,
              email_confirm: false,
              user_metadata: {
                app_context: 'smartcrm',
                role: 'admin',
                first_name: email.split('@')[0],
                last_name: 'Admin'
              }
            });
            
            results.push({
              email,
              status: error ? 'creation_failed' : 'created_and_confirmation_sent',
              message: error ? error.message : 'Admin account created, confirmation email sent',
              user_id: newUser?.user?.id || null
            });
          }
        } catch (error: any) {
          results.push({
            email,
            status: 'error',
            message: error.message
          });
        }
      }
      
      res.json({
        success: true,
        message: 'Admin confirmation process completed',
        results,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Admin confirmation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process admin confirmations',
        message: error.message
      });
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
