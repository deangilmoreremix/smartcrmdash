export interface ApiEndpoint {
  baseURL: string;
  timeout?: number;
  retries?: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

export interface ApiConfig {
   // Contact Management API
   contactsAPI: ApiEndpoint;

   auth: {
     endpoint: ApiEndpoint;
     tokenKey: string;
     refreshTokenKey: string;
   };
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'gemini' | 'anthropic';
  capabilities: string[];
  cost: 'high' | 'low' | 'medium' | 'free';
  speed: 'slow' | 'medium' | 'fast' | 'realtime';
  accuracy: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'medium' | 'complex' | 'expert';
  volume: 'single' | 'batch' | 'bulk' | 'streaming';
}

export interface ApiProvider {
  name: string;
  models: AIModel[];
  baseURL?: string;
  apiKey?: string;
}

// Get Supabase URL from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

// Updated base URL for API endpoints to use Supabase Edge Functions
const apiBaseUrl = supabaseUrl ?
  `${supabaseUrl}/functions/v1` :
  'http://localhost:3001/api';

const apiConfig: ApiConfig = {
  contactsAPI: {
    baseURL: apiBaseUrl,
    timeout: 30000,
    retries: 3,
    rateLimit: {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    },
  },

  auth: {
    endpoint: {
      baseURL: '/api/auth',
      timeout: 30000,
      retries: 2
    },
    tokenKey: 'supabase.auth.token',
    refreshTokenKey: 'supabase.auth.refresh_token'
  }
};

// Add validation for required endpoints
export const validateApiConfig = () => {
  const requiredEndpoints = ['/api/auth/user-role', '/api/auth/refresh'];
  const warnings: string[] = [];

  requiredEndpoints.forEach(endpoint => {
    // This would check if endpoints exist in production
    console.debug(`Checking endpoint: ${endpoint}`);
  });

  return warnings;
};

// AI Model configurations
const AIModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    capabilities: ['text-generation', 'analysis', 'reasoning'],
    cost: 'high',
    speed: 'medium',
    accuracy: 'high',
    complexity: 'expert',
    volume: 'single'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    capabilities: ['text-generation', 'analysis'],
    cost: 'medium',
    speed: 'fast',
    accuracy: 'medium',
    complexity: 'medium',
    volume: 'batch'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'gemini',
    capabilities: ['text-generation', 'analysis', 'multimodal'],
    cost: 'medium',
    speed: 'fast',
    accuracy: 'high',
    complexity: 'complex',
    volume: 'batch'
  }
];

export const getModelsByCapability = (capability: string): AIModel[] => {
  return AIModels.filter(model => model.capabilities.includes(capability));
};

export const getAIModels = (): AIModel[] => {
  return AIModels;
};

export default apiConfig;