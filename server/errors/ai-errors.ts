export class AIProviderError extends Error {
  constructor(
    public provider: string,
    public code: string,
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}

export class AIValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AIValidationError';
  }
}

export class AIRateLimitError extends Error {
  constructor(
    public limit: number,
    public windowMs: number,
    message: string = 'Rate limit exceeded'
  ) {
    super(message);
    this.name = 'AIRateLimitError';
  }
}

export class AIServiceUnavailableError extends Error {
  constructor(
    public service: string,
    message: string = 'Service temporarily unavailable'
  ) {
    super(message);
    this.name = 'AIServiceUnavailableError';
  }
}

// Error mapping utilities
export const mapProviderError = (error: any, provider: string): AIProviderError => {
  if (provider === 'openai') {
    return new AIProviderError(
      provider,
      'openai_api_error',
      error.message || 'OpenAI API error occurred',
      error
    );
  } else if (provider === 'gemini') {
    return new AIProviderError(
      provider,
      'gemini_api_error',
      error.message || 'Google Gemini API error occurred',
      error
    );
  }
  
  return new AIProviderError(
    'unknown',
    'unknown_provider_error',
    'Unknown AI provider error occurred',
    error
  );
};

// Error response formatter
export const formatErrorResponse = (error: Error) => {
  if (error instanceof AIProviderError) {
    return {
      error: 'AI Service Error',
      provider: error.provider,
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
  
  if (error instanceof AIValidationError) {
    return {
      error: 'Validation Error',
      field: error.field,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString()
    };
  }
  
  if (error instanceof AIRateLimitError) {
    return {
      error: 'Rate Limit Exceeded',
      limit: error.limit,
      windowMs: error.windowMs,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
  
  // Generic error
  return {
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  };
};