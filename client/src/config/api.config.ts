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

// Get Supabase URL from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const isDevMode = import.meta.env.DEV || import.meta.env.VITE_ENV === 'development';

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

export default apiConfig;