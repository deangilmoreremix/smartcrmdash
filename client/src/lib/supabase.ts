import { createClient } from '@supabase/supabase-js';

// Get environment variables
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
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
        },
      },
    })
  : null;

// Export a flag to check if Supabase is available
export const isSupabaseConfigured = hasValidCredentials;

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  if (!supabase) {
    return { connected: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    return { connected: !error, error: error?.message };
  } catch (error) {
    return { connected: false, error: 'Connection failed' };
  }
};

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, options?: any) => {
    if (!supabase) throw new Error('Supabase client is not initialized.');
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        ...options,
        emailRedirectTo: undefined, // Disable email verification redirect
        data: {
          app_context: 'smartcrm',
          email_template_set: 'smartcrm',
          ...options?.data
        }
      }
    });
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client is not initialized.');
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    if (!supabase) throw new Error('Supabase client is not initialized.');
    return await supabase.auth.signOut();
  },

  getUser: async () => {
    if (!supabase) throw new Error('Supabase client is not initialized.');
    return supabase.auth.getUser();
  },

  onAuthStateChange: async (callback: (event: string, session: any) => void) => {
    if (!supabase) throw new Error('Supabase client is not initialized.');
    return supabase.auth.onAuthStateChange(callback);
  }
};