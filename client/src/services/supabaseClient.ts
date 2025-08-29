
// Re-export from the main supabase client to avoid multiple instances
export { supabase, isSupabaseConfigured, checkSupabaseConnection, auth } from '../lib/supabase';

// Also export getSupabaseClient for backward compatibility
export const getSupabaseClient = () => {
  const { supabase } = require('../lib/supabase');
  return supabase;
};
