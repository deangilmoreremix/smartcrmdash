import { metrics } from '@opentelemetry/api';

/**
 * Metrics service for tracking AI API performance and usage
 */
export class MetricsService {
  private meter = metrics.getMeter('ai-orchestrator');
  
  // Counters for different types of requests
  private requestCounter = this.meter.createCounter('ai_requests_total', {
    description: 'Total number of AI API requests'
  });

  private errorCounter = this.meter.createCounter('ai_errors_total', {
    description: 'Total number of AI API errors'
  });

  private latencyHistogram = this.meter.createHistogram('ai_request_latency_ms', {
    description: 'Latency of AI requests in milliseconds',
    unit: 'ms'
  });

  private tokensCounter = this.meter.createCounter('ai_tokens_total', {
    description: 'Total tokens processed by AI models'
  });

  // Gauges for current state
  private activeRequestsGauge = this.meter.createObservableGauge('ai_active_requests', {
    description: 'Number of currently active AI requests'
  });

  private providerStatusGauge = this.meter.createObservableGauge('ai_provider_status', {
    description: 'Status of AI providers (1 = available, 0 = unavailable)'
  });

  private activeRequests = 0;

  constructor() {
    // Set up observable gauges
    this.activeRequestsGauge.addCallback((observableResult) => {
      observableResult.observe(this.activeRequests, {});
    });

    this.providerStatusGauge.addCallback((observableResult) => {
      const openaiStatus = process.env.OPENAI_API_KEY ? 1 : 0;
      const geminiStatus = process.env.GOOGLE_API_KEY ? 1 : 0;
      
      observableResult.observe(openaiStatus, { provider: 'openai' });
      observableResult.observe(geminiStatus, { provider: 'gemini' });
    });
  }

  incrementRequest(provider: string, model: string) {
    this.requestCounter.add(1, { provider, model });
    this.activeRequests++;
  }

  incrementError(provider: string, model: string, errorCode: string) {
    this.errorCounter.add(1, { provider, model, error_code: errorCode });
  }

  recordLatency(provider: string, model: string, latencyMs: number) {
    this.latencyHistogram.record(latencyMs, { provider, model });
  }

  recordTokens(provider: string, model: string, tokens: number) {
    this.tokensCounter.add(tokens, { provider, model });
  }

  decrementActiveRequests() {
    this.activeRequests--;
  }

  getMetrics() {
    return {
      activeRequests: this.activeRequests,
      providerStatus: {
        openai: !!process.env.OPENAI_API_KEY,
        gemini: !!process.env.GOOGLE_API_KEY
      }
    };
  }
}

// Singleton instance
export const metricsService = new MetricsService();