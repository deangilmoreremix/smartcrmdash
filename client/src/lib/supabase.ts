import { createClient } from '@supabase/supabase-js';

// Extend window interface for ENV_VARS
declare global {
  interface Window {
    ENV_VARS?: {
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
    };
  }
}

// Get environment variables with fallbacks
const getSupabaseUrl = () => {
  if (typeof window !== 'undefined' && window.ENV_VARS?.SUPABASE_URL) {
    return window.ENV_VARS.SUPABASE_URL;
  }
  return import.meta.env.VITE_SUPABASE_URL || '';
};

const getSupabaseAnonKey = () => {
  if (typeof window !== 'undefined' && window.ENV_VARS?.SUPABASE_ANON_KEY) {
    return window.ENV_VARS.SUPABASE_ANON_KEY;
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Check if configuration is valid
const isValidUrl = (url: string) => {
  try {
    // Only try to create URL if it's a non-empty string
    if (url) {
      new URL(url);
    }
    return url !== '' && !url.includes('your_') && !url.includes('placeholder');
  } catch {
    return false;
  }
};

const isValidKey = (key: string) => {
  return key !== '' && !key.includes('your_') && !key.includes('placeholder') && key.length > 20;
};

const isConfigured = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

// Create Supabase client with proper error handling
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : createClient('https://example.org', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        flowType: 'implicit'
      }
    });

// Storage bucket names
export const STORAGE_BUCKETS = {
  COMPANY_LOGOS: 'company-logos',
  PROFILE_AVATARS: 'profile-avatars',
  DOCUMENTS: 'documents'
} as const;

// Add a helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return isConfigured;
};

// Log configuration status for debugging
if (!isConfigured) {
  console.warn('Supabase is not properly configured. Some features may not work.');
}

// Auth helper functions with enhanced error handling
export const authHelpers = {
  async signIn(email: string, password: string) {
    if (!isConfigured) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  },

  async signUp(email: string, password: string, metadata?: any) {
    if (!isConfigured) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  },

  async signOut() {
    if (!isConfigured) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  },

  async resetPassword(email: string, redirectTo?: string) {
    if (!isConfigured) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to send reset password email');
    }
  },

  async updatePassword(password: string) {
    if (!isConfigured) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Update password error:', error);
      throw new Error(error.message || 'Failed to update password');
    }
  },

  async getCurrentUser() {
    if (!isConfigured) {
      return null;
    }
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async getSession() {
    if (!isConfigured) {
      return null;
    }
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error: any) {
      console.error('Get session error:', error);
      return null;
    }
  },
};