import rateLimit from 'express-rate-limit';

// Create a rate limiter for AI API requests
export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for certain conditions (e.g., health checks, internal IPs)
    return req.ip === '127.0.0.1' || req.ip === '::1';
  }
});

// More aggressive limiter for expensive operations
export const expensiveAILimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: {
    error: 'Rate limit exceeded',
    message: 'This operation is resource-intensive. Please try again in an hour.'
  }
});

// Per-user rate limiting (if you have user authentication)
export const userAILimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  keyGenerator: (req) => {
    // Use user ID if available, else fall back to IP
    return (req as any).user?.id || req.ip;
  },
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many requests from this user.'
  }
});