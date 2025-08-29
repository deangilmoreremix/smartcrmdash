
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are available
const hasValidCredentials = supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'your-supabase-url' &&
  supabaseAnonKey !== 'your-supabase-anon-key';

if (!hasValidCredentials) {
  console.warn('Supabase credentials not configured. Using development mode.');
}

// Create client with proper configuration
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (!hasValidCredentials) {
    console.warn('Supabase not configured properly');
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'smartcrm-auth-token'
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
        },
      },
    });
  }
  return supabaseInstance;
};

// Export the client instance directly as well
export const supabase = getSupabaseClient();

// Export a flag to check if Supabase is available
export const isSupabaseConfigured = hasValidCredentials;

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  const client = getSupabaseClient();
  if (!client) {
    return { connected: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await client.from('profiles').select('count').limit(1);
    return { connected: !error, error: error?.message };
  } catch (error) {
    return { connected: false, error: 'Connection failed' };
  }
};

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, options?: any) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client is not initialized.');
    return await client.auth.signUp({
      email,
      password,
      options: {
        ...options,
        emailRedirectTo: undefined,
        data: {
          app_context: 'smartcrm',
          email_template_set: 'smartcrm',
          ...options?.data
        }
      }
    });
  },

  signIn: async (email: string, password: string) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client is not initialized.');
    return await client.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client is not initialized.');
    return await client.auth.signOut();
  },

  getUser: async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client is not initialized.');
    return client.auth.getUser();
  },

  onAuthStateChange: async (callback: (event: string, session: any) => void) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client is not initialized.');
    return client.auth.onAuthStateChange(callback);
  }
};
