export interface ApiEndpoint {
  baseURL: string;
  timeout?: number;
  retries?: number;
}

export interface ApiConfig {
  auth: {
    endpoint: ApiEndpoint;
    tokenKey: string;
    refreshTokenKey: string;
  };
}

const apiConfig: ApiConfig = {
  auth: {
    endpoint: {
      baseURL: '/api/auth',
      timeout: 30000,
      retries: 2
    },
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token'
  }
};

export default apiConfig;