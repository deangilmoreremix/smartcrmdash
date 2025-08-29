
// Re-export from the main supabase client to avoid multiple instances
export { supabase, isSupabaseConfigured, checkSupabaseConnection, auth } from '../lib/supabase';

// Also export getSupabaseClient for backward compatibility
export const getSupabaseClient = () => {
  // Use ES6 import instead of require for browser compatibility
  return supabase;
};
