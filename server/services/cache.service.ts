import Redis from 'ioredis';
import { logger } from './logger.service';

/**
 * Cache service for storing AI responses to reduce latency and API costs
 */
export class CacheService {
  private redis: Redis;
  private cacheEnabled: boolean;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl);
    this.cacheEnabled = process.env.REDIS_ENABLED !== 'false';

    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error', error);
      this.cacheEnabled = false;
    });
  }

  /**
   * Generate a cache key from the request object
   */
  private generateCacheKey(request: any): string {
    // Create a hash of the request to use as key
    const requestString = JSON.stringify(request);
    return `ai:${this.hashString(requestString)}`;
  }

  /**
   * Simple hash function for strings
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Get cached response if available
   */
  async getCachedResponse(request: any): Promise<any | null> {
    if (!this.cacheEnabled) return null;

    try {
      const key = this.generateCacheKey(request);
      const cached = await this.redis.get(key);
      if (cached) {
        logger.debug('Cache hit', { key });
        return JSON.parse(cached);
      }
      logger.debug('Cache miss', { key });
      return null;
    } catch (error) {
      logger.error('Cache get error', error);
      return null;
    }
  }

  /**
   * Store response in cache
   */
  async setCachedResponse(request: any, response: any, ttlSeconds: number = 3600): Promise<void> {
    if (!this.cacheEnabled) return;

    try {
      const key = this.generateCacheKey(request);
      await this.redis.setex(key, ttlSeconds, JSON.stringify(response));
      logger.debug('Response cached', { key, ttlSeconds });
    } catch (error) {
      logger.error('Cache set error', error);
    }
  }

  /**
   * Clear cache for a specific request or all cache
   */
  async clearCache(key?: string): Promise<void> {
    if (key) {
      await this.redis.del(key);
    } else {
      // Clear all AI cache keys
      const keys = await this.redis.keys('ai:*');
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    }
    logger.info('Cache cleared', { key });
  }

  /**
   * Check if cache is available
   */
  isCacheEnabled(): boolean {
    return this.cacheEnabled;
  }
}

// Singleton instance
export const cacheService = new CacheService();