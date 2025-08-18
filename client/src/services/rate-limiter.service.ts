export const rateLimiter = {
  async checkLimit(
    endpoint: string, 
    identifier: string, 
    url: string, 
    options: { maxRequests: number; windowMs: number }
  ): Promise<{ allowed: boolean; remaining: number; reset: number }> {
    // Simple in-memory rate limiting for development
    const key = `${endpoint}_${identifier}`;
    const now = Date.now();
    const stored = localStorage.getItem(`rate_limit_${key}`);
    
    if (!stored) {
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({ count: 1, window: now }));
      return { allowed: true, remaining: options.maxRequests - 1, reset: now + options.windowMs };
    }
    
    const { count, window } = JSON.parse(stored);
    
    if (now - window > options.windowMs) {
      localStorage.setItem(`rate_limit_${key}`, JSON.stringify({ count: 1, window: now }));
      return { allowed: true, remaining: options.maxRequests - 1, reset: now + options.windowMs };
    }
    
    if (count >= options.maxRequests) {
      return { allowed: false, remaining: 0, reset: window + options.windowMs };
    }
    
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify({ count: count + 1, window }));
    return { allowed: true, remaining: options.maxRequests - count - 1, reset: window + options.windowMs };
  }
};