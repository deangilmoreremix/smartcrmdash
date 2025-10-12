import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging for environment variables
console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined');

// Create singleton Supabase client to avoid multiple GoTrueClient instances
let supabaseInstance: any = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'smartcrm-auth-token'
      }
    });
  }
  return supabaseInstance;
})();

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
        emailRedirectTo,
        ...options
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signInWithProvider: async (provider: 'google' | 'github' | 'discord') => {
    // Get dynamic redirect URL based on environment
    const currentOrigin = window.location.origin;
    const isDevelopment = currentOrigin.includes('localhost') || 
                         currentOrigin.includes('replit.dev') || 
                         currentOrigin.includes('replit.app');
    
    const redirectTo = isDevelopment 
      ? `${currentOrigin}/auth/callback`
      : 'https://smart-crm.videoremix.io/auth/callback';

    console.log('OAuth SignIn with redirectTo:', redirectTo);

    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo
      }
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    // Get dynamic redirect URL based on environment
    const currentOrigin = window.location.origin;
    const isDevelopment = currentOrigin.includes('localhost') || 
                         currentOrigin.includes('replit.dev') || 
                         currentOrigin.includes('replit.app');
    
    const redirectTo = isDevelopment 
      ? `${currentOrigin}/auth/reset-password`
      : 'https://smart-crm.videoremix.io/auth/reset-password';

    console.log('Password reset with redirectTo:', redirectTo);

    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });
  },

  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({
      password
    });
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  getUser: async () => {
    return await supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default supabase;