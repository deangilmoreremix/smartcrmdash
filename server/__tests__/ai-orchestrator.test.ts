import { AIOrchestrator } from '../services/ai-orchestrator.service';
import { cacheService } from '../services/cache.service';
import { metricsService } from '../services/metrics.service';

// Mock the dependencies
jest.mock('../services/cache.service');
jest.mock('../services/metrics.service');

describe('AIOrchestrator', () => {
  let orchestrator: AIOrchestrator;

  beforeEach(() => {
    orchestrator = new AIOrchestrator();
    jest.clearAllMocks();
  });

  describe('getBestProvider', () => {
    it('should return openai when both providers are available', async () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.GOOGLE_API_KEY = 'test-key';
      
      const provider = await orchestrator.getBestProvider();
      expect(provider).toBe('openai');
    });

    it('should return gemini when only gemini is available', async () => {
      process.env.OPENAI_API_KEY = '';
      process.env.GOOGLE_API_KEY = 'test-key';
      
      const provider = await orchestrator.getBestProvider();
      expect(provider).toBe('gemini');
    });

    it('should throw error when no providers are available', async () => {
      process.env.OPENAI_API_KEY = '';
      process.env.GOOGLE_API_KEY = '';
      
      await expect(orchestrator.getBestProvider()).rejects.toThrow('No AI providers configured');
    });
  });

  describe('executeRequest', () => {
    const mockRequest = {
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello' }],
      temperature: 0.7,
      max_tokens: 100
    };

    it('should return cached response if available', async () => {
      const cachedResponse = { content: 'cached', provider: 'openai', latency: 10 };
      (cacheService.getCachedResponse as jest.Mock).mockResolvedValue(cachedResponse);

      const result = await orchestrator.executeRequest(mockRequest);
      
      expect(cacheService.getCachedResponse).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(cachedResponse);
    });

    it('should execute openai request when provider is openai', async () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.GOOGLE_API_KEY = '';
      
      (cacheService.getCachedResponse as jest.Mock).mockResolvedValue(null);
      
      const result = await orchestrator.executeRequest(mockRequest);
      
      expect(metricsService.incrementRequest).toHaveBeenCalledWith('openai', 'gpt-4');
      expect(metricsService.recordLatency).toHaveBeenCalled();
      expect(cacheService.setCachedResponse).toHaveBeenCalled();
    });

    it('should handle errors and record metrics', async () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.GOOGLE_API_KEY = '';
      
      (cacheService.getCachedResponse as jest.Mock).mockResolvedValue(null);
      // Mock OpenAI to throw an error
      const openaiInstance = (orchestrator as any).openai;
      openaiInstance.chat.completions.create.mockRejectedValue(new Error('API error'));

      await expect(orchestrator.executeRequest(mockRequest)).rejects.toThrow();
      
      expect(metricsService.incrementError).toHaveBeenCalled();
    });
  });

  describe('getProviderStatus', () => {
    it('should return correct provider status', () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.GOOGLE_API_KEY = '';
      
      const status = orchestrator.getProviderStatus();
      
      expect(status).toEqual({
        openai: true,
        gemini: false,
        timestamp: expect.any(String)
      });
    });
  });

  describe('clearCache', () => {
    it('should call cache service clearCache', () => {
      orchestrator.clearCache();
      expect(cacheService.clearCache).toHaveBeenCalled();
    });
  });
});