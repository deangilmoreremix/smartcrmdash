import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { logger } from './logger.service';
import { AIProviderError, mapProviderError } from '../errors/ai-errors';
import { metricsService } from './metrics.service';
import { cacheService } from './cache.service';

export interface AIRequest {
  model: string;
  messages: any[];
  response_format?: { type: 'json_object' | 'text' };
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface AIResponse {
  content: any;
  provider: string;
  latency: number;
}

class AIOrchestrator {
  private openai: OpenAI;
  private genAI: GoogleGenerativeAI;
  private providers: Map<string, any>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

    this.providers = new Map();
    this.providers.set('openai', this.openai);
    this.providers.set('gemini', this.genAI);
  }

  async getBestProvider(): Promise<string> {
    // Simple implementation: check API key availability and latency
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasGemini = !!process.env.GOOGLE_API_KEY;

    if (!hasOpenAI && !hasGemini) {
      throw new Error('No AI providers configured');
    }

    // Prefer OpenAI if both available, else fallback
    if (hasOpenAI) return 'openai';
    if (hasGemini) return 'gemini';

    return 'openai'; // Default
  }

  async executeRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    // Check cache first
    const cachedResponse = await cacheService.getCachedResponse(request);
    if (cachedResponse) {
      const latency = Date.now() - startTime;
      logger.info('AI request served from cache', {
        provider: cachedResponse.provider,
        latency,
        model: request.model
      });
      return cachedResponse;
    }

    const provider = await this.getBestProvider();

    // Record metrics for the request
    metricsService.incrementRequest(provider, request.model);

    try {
      let content;
      if (provider === 'openai') {
        // Ensure response_format is properly typed for OpenAI
        const openaiRequest = {
          ...request,
          response_format: request.response_format?.type === 'json_object'
            ? { type: 'json_object' as const }
            : undefined
        };
        const response = await this.openai.chat.completions.create(openaiRequest);
        // Handle both stream and non-stream responses
        if ('choices' in response) {
          content = response.choices[0]?.message?.content;
        } else {
          // For streaming responses, we need to collect the content
          let streamContent = '';
          for await (const chunk of response) {
            streamContent += chunk.choices[0]?.delta?.content || '';
          }
          content = streamContent;
        }
      } else {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = request.messages.map(m => m.content).join('\n');
        const result = await model.generateContent(prompt);
        content = result.response.text();
      }

      const latency = Date.now() - startTime;

      // Record latency and success
      metricsService.recordLatency(provider, request.model, latency);
      logger.info('AI request completed', {
        provider,
        latency,
        model: request.model
      });

      // Cache the response
      const response = { content, provider, latency };
      await cacheService.setCachedResponse(request, response);

      return response;
    } catch (error) {
      // Record error metrics
      const mappedError = mapProviderError(error, provider);
      metricsService.incrementError(provider, request.model, mappedError.code);
      logger.error('AI request failed', mappedError, { provider });
      throw mappedError;
    }
  }

  getProviderStatus() {
    return {
      openai: !!process.env.OPENAI_API_KEY,
      gemini: !!process.env.GOOGLE_API_KEY,
      timestamp: new Date().toISOString()
    };
  }

  getPerformanceMetrics() {
    // Placeholder for actual metrics collection
    return {
      averageLatency: 0,
      successRate: 1,
      lastUpdated: new Date().toISOString()
    };
  }

  clearCache() {
    // Clear any cached responses if needed
    logger.info('AI cache cleared');
  }
}

export const aiOrchestrator = new AIOrchestrator();
export { AIOrchestrator };