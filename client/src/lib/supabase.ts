import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client directly (like your working example)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'smartcrm-auth-token'
  }
});

// Export a flag to check if Supabase is available
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Helper function to check connection
export const checkSupabaseConnection = async () => {
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
    // Get dynamic redirect URL based on environment
    const currentOrigin = window.location.origin;
    const isDevelopment = currentOrigin.includes('localhost') || 
                         currentOrigin.includes('replit.dev') || 
                         currentOrigin.includes('replit.app');
    
    const emailRedirectTo = isDevelopment 
      ? `${currentOrigin}/auth/callback`
      : 'https://smart-crm.videoremix.io/auth/callback';

    console.log('SignUp with emailRedirectTo:', emailRedirectTo);

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        ...options,
        emailRedirectTo,
        data: {
          app_context: 'smartcrm',
          email_template_set: 'smartcrm',
          ...options?.data
        }
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getUser: async () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};