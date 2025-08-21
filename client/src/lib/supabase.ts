import { createClient } from '@supabase/supabase-js'

// Fetch Supabase configuration from the server
const getSupabaseConfig = async () => {
  try {
    const response = await fetch('/api/supabase/config');
    const config = await response.json();
    return config;
  } catch (error) {
    console.warn('Failed to fetch Supabase config from server:', error);
    return {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    };
  }
};

// Initialize with default values, will be updated when config is fetched
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Try to get server config
getSupabaseConfig().then(config => {
  if (config.url && config.anonKey) {
    supabaseUrl = config.url;
    supabaseAnonKey = config.anonKey;
  }
});

// Create a placeholder client initially
let supabase: any = null

// Function to initialize Supabase client
const initializeSupabase = async () => {
  const config = await getSupabaseConfig()
  
  if (config.url && config.anonKey) {
    supabase = createClient(config.url, config.anonKey)
    return supabase
  } else {
    console.warn('Supabase environment variables not found, authentication may not work properly')
    // Create a dummy client that will throw meaningful errors
    supabase = {
      auth: {
        signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    }
    return supabase
  }
}

// Initialize on first import
initializeSupabase()

// Export function to get the initialized client
export const getSupabaseClient = async () => {
  if (!supabase) {
    await initializeSupabase()
  }
  return supabase
}

export { supabase }

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, options?: any) => {
    const client = await getSupabaseClient()
    return await client.auth.signUp({ 
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
    })
  },
  
  signIn: async (email: string, password: string) => {
    const client = await getSupabaseClient()
    return await client.auth.signInWithPassword({ email, password })
  },
  
  signOut: async () => {
    const client = await getSupabaseClient()
    return await client.auth.signOut()
  },
  
  getUser: async () => {
    const client = await getSupabaseClient()
    return client.auth.getUser()
  },
  
  onAuthStateChange: async (callback: (event: string, session: any) => void) => {
    const client = await getSupabaseClient()
    return client.auth.onAuthStateChange(callback)
  }
}