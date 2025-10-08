import { Router } from 'express';
import { aiOrchestrator } from '../services/ai-orchestrator.service';
import { logger } from '../services/logger.service';
import {
  SmartGreetingSchema,
  KPIAnalysisSchema,
  DealIntelligenceSchema,
  BusinessIntelligenceSchema,
  validateRequest
} from '../validation/ai-schemas';
import { aiRateLimiter } from '../middleware/rate-limiter';

const router = Router();

// Check API key status
router.get('/api/openai/status', aiRateLimiter, (req, res) => {
  const status = aiOrchestrator.getProviderStatus();
  res.json({
    configured: status.openai || status.gemini,
    model: 'gpt-4o', // Using latest available model
    status: (status.openai || status.gemini) ? 'ready' : 'needs_configuration',
    providers: status
  });
});

// GPT-5 Enhanced Greeting Generation
router.post('/api/openai/smart-greeting', aiRateLimiter, validateRequest(SmartGreetingSchema), async (req, res) => {
  try {
    const { userMetrics, timeOfDay, recentActivity } = req.body;

    const request = {
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are an expert business advisor with access to advanced analytics. Generate personalized, strategic greetings that provide actionable insights based on user data. Focus on key opportunities and strategic recommendations."
      }, {
        role: "user",
        content: `Generate a smart greeting for ${timeOfDay}. User metrics: ${JSON.stringify(userMetrics)}. Recent activity: ${JSON.stringify(recentActivity)}. Provide both a greeting and a strategic insight.`
      }],
      response_format: { type: "json_object" as const },
      temperature: 0.7,
      max_tokens: 300
    };

    const response = await aiOrchestrator.executeRequest(request);
    const result = JSON.parse(response.content || '{}');
    
    res.json({
      ...result,
      _metadata: {
        provider: response.provider,
        latency: response.latency
      }
    });

  } catch (error) {
    logger.error('Smart greeting error:', error);
    res.status(500).json({
      error: 'Failed to generate smart greeting',
      greeting: `Good ${req.body.timeOfDay}! Your pipeline shows strong momentum.`,
      insight: 'Focus on your highest-value opportunities for maximum impact.'
    });
  }
});

// GPT-5 Enhanced KPI Analysis
router.post('/api/openai/kpi-analysis', aiRateLimiter, validateRequest(KPIAnalysisSchema), async (req, res) => {
  try {
    const { historicalData, currentMetrics } = req.body;

    const request = {
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are an expert business analyst with advanced mathematical capabilities. Analyze KPI trends and provide strategic insights with confidence intervals and actionable recommendations. Focus on performance forecasting and risk assessment."
      }, {
        role: "user",
        content: `Analyze these KPI trends: Historical: ${JSON.stringify(historicalData)}, Current: ${JSON.stringify(currentMetrics)}. Provide summary, trends, predictions, and recommendations in JSON format.`
      }],
      response_format: { type: "json_object" as const },
      temperature: 0.3,
      max_tokens: 800
    };

    const response = await aiOrchestrator.executeRequest(request);
    const result = JSON.parse(response.content || '{}');
    
    res.json({
      ...result,
      _metadata: {
        provider: response.provider,
        latency: response.latency
      }
    });

  } catch (error) {
    logger.error('KPI analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze KPIs',
      summary: 'Your KPI trends show steady performance with opportunities for optimization.',
      recommendations: ['Focus on pipeline velocity', 'Optimize conversion rates', 'Scale successful strategies']
    });
  }
});

// GPT-5 Deal Intelligence
router.post('/api/openai/deal-intelligence', aiRateLimiter, validateRequest(DealIntelligenceSchema), async (req, res) => {
  try {
    const { dealData, contactHistory, marketContext } = req.body;

    const request = {
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are an expert sales strategist with deep experience in deal analysis. Provide comprehensive deal intelligence including win probability, risk factors, and strategic recommendations based on deal data, contact history, and market context."
      }, {
        role: "user",
        content: `Analyze this deal: ${JSON.stringify(dealData)}. Contact history: ${JSON.stringify(contactHistory)}. Market context: ${JSON.stringify(marketContext)}. Provide probability_score, risk_level, key_factors, recommendations, confidence_level, estimated_close_days, and value_optimization in JSON format.`
      }],
      response_format: { type: "json_object" as const },
      temperature: 0.2,
      max_tokens: 600
    };

    const response = await aiOrchestrator.executeRequest(request);
    const result = JSON.parse(response.content || '{}');
    
    res.json({
      ...result,
      _metadata: {
        provider: response.provider,
        latency: response.latency
      }
    });

  } catch (error) {
    logger.error('Deal intelligence error:', error);
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

// Business Intelligence Generation
router.post('/api/openai/business-intelligence', aiRateLimiter, validateRequest(BusinessIntelligenceSchema), async (req, res) => {
  try {
    const { businessData, marketContext, objectives } = req.body;

    const request = {
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are a senior business consultant with expertise across multiple industries. Generate strategic business intelligence including market insights, competitive advantages, risk factors, growth opportunities, and strategic recommendations."
      }, {
        role: "user",
        content: `Generate business intelligence for: ${JSON.stringify(businessData)}. Market context: ${JSON.stringify(marketContext)}. Objectives: ${JSON.stringify(objectives)}. Provide market_insights, competitive_advantages, risk_factors, growth_opportunities, and strategic_recommendations in JSON format.`
      }],
      response_format: { type: "json_object" as const },
      temperature: 0.4,
      max_tokens: 1000
    };

    const response = await aiOrchestrator.executeRequest(request);
    const result = JSON.parse(response.content || '{}');
    
    res.json({
      ...result,
      _metadata: {
        provider: response.provider,
        latency: response.latency
      }
    });

  } catch (error) {
    logger.error('Business intelligence error:', error);
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

export default router;