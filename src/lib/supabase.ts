import { createClient } from '@supabase/supabase-js';

// Use runtime environment variables or empty strings to prevent build-time embedding
const supabaseUrl = typeof window !== 'undefined' 
  ? window.ENV_VARS?.SUPABASE_URL || '' 
  : '';
const supabaseAnonKey = typeof window !== 'undefined' 
  ? window.ENV_VARS?.SUPABASE_ANON_KEY || '' 
  : '';

// Only validate if values are provided
const isConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
  COMPANY_LOGOS: 'company-logos',
  PROFILE_AVATARS: 'profile-avatars',
  DOCUMENTS: 'documents'
} as const;

// Add a helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};