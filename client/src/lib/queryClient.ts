import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Default fetch function for API requests
const defaultFetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Helper function for API requests with mutations
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  return defaultFetcher(url, {
    method: 'GET',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
};

// Set default query function
queryClient.setQueryDefaults(['*'], {
  queryFn: ({ queryKey }) => defaultFetcher(queryKey[0] as string),
});

export { queryClient };
export default queryClient;