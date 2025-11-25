import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { useApiStore } from '../store/apiStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Helper to validate UUID format
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Authentication helpers
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

// Database helper functions
export const fetchBusinessAnalysis = async (userId?: string) => {
  try {
    const query = supabase
      .from('business_analyzer')
      .select('*');
    
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    console.error("Error fetching business analyses:", err);
    return { data: null, error: err };
  }
};

export const createBusinessAnalysis = async (analysisData: any) => {
  try {
    const { data, error } = await supabase
      .from('business_analyzer')
      .insert([analysisData])
      .select();
    
    return { data, error };
  } catch (err) {
    console.error("Error creating business analysis:", err);
    return { data: null, error: err };
  }
};

const updateBusinessAnalysis = async (id: number, analysisData: any) => {
  const { data, error } = await supabase
    .from('business_analyzer')
    .update(analysisData)
    .eq('id', id);
  
  return { data, error };
};

const deleteBusinessAnalysis = async (id: number) => {
  const { error } = await supabase
    .from('business_analyzer')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Content Items
export const fetchContentItems = async (userId?: string) => {
  const query = supabase
    .from('content_items')
    .select('*');
  
  if (userId) {
    query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createContentItem = async (contentData: any) => {
  const { data, error } = await supabase
    .from('content_items')
    .insert([contentData]);
  
  return { data, error };
};

const updateContentItem = async (id: string, contentData: any) => {
  const { data, error } = await supabase
    .from('content_items')
    .update(contentData)
    .eq('id', id);
  
  return { data, error };
};

export const deleteContentItem = async (id: string) => {
  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Voice Profiles
export const fetchVoiceProfiles = async (userId?: string) => {
  const query = supabase
    .from('voice_profiles')
    .select('*');
  
  if (userId) {
    query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createVoiceProfile = async (profileData: any) => {
  const { data, error } = await supabase
    .from('voice_profiles')
    .insert([profileData]);
  
  return { data, error };
};

export const updateVoiceProfile = async (id: string, profileData: any) => {
  const { data, error } = await supabase
    .from('voice_profiles')
    .update(profileData)
    .eq('id', id);
  
  return { data, error };
};

export const deleteVoiceProfile = async (id: string) => {
  const { error } = await supabase
    .from('voice_profiles')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Image Assets
const fetchImageAssets = async (userId?: string) => {
  try {
    const query = supabase
      .from('image_assets')
      .select('*');
    
    if (userId) {
      // Skip filtering if userId is not a valid UUID
      if (isValidUUID(userId)) {
        query.eq('user_id', userId);
      } else {
        console.warn(`Invalid UUID format for user_id: ${userId}. Returning all images instead.`);
        // If you want to return empty results for invalid UUIDs, uncomment the following:
        // return { data: [], error: null };
      }
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    console.error("Error fetching image assets:", err);
    return { data: null, error: err };
  }
};

const createImageAsset = async (assetData: any) => {
  try {
    // Check if user_id is a valid UUID
    if (assetData.user_id && !isValidUUID(assetData.user_id)) {
      console.error("Invalid UUID format for user_id when creating image asset");
      return { data: null, error: new Error("Invalid UUID format for user_id") };
    }
    
    const { data, error } = await supabase
      .from('image_assets')
      .insert([assetData]);
    
    return { data, error };
  } catch (err) {
    console.error("Error creating image asset:", err);
    return { data: null, error: err };
  }
};

const updateImageAsset = async (id: string, assetData: any) => {
  const { data, error } = await supabase
    .from('image_assets')
    .update(assetData)
    .eq('id', id);
  
  return { data, error };
};

const deleteImageAsset = async (id: string) => {
  const { error } = await supabase
    .from('image_assets')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Edge Function Helpers
export const callEdgeFunction = async (functionName: string, payload: any) => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl) {
      throw new Error("Supabase URL is not defined");
    }
    
    // Get API keys from store
    let apiKeys = { openai: '', gemini: '', elevenlabs: '' };
    
    // First try to get from window if available (we're in browser)
    if (typeof window !== 'undefined') {
      try {
        const storedKeys = localStorage.getItem('ai-crm-api-storage');
        if (storedKeys) {
          const parsedStore = JSON.parse(storedKeys);
          apiKeys = parsedStore.state.apiKeys;
        }
      } catch (err) {
        console.warn('Could not retrieve API keys from localStorage');
      }
    }
    
    // Fallback to environment variables if needed
    const openaiKey = apiKeys.openai || import.meta.env.VITE_OPENAI_API_KEY || '';
    const geminiKey = apiKeys.gemini || import.meta.env.VITE_GEMINI_API_KEY || '';
    const elevenLabsKey = apiKeys.elevenlabs || import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    
    // Add API keys to payload
    const enhancedPayload = {
      ...payload,
      apiKeys: {
        OPENAI_API_KEY: openaiKey,
        GEMINI_API_KEY: geminiKey,
        ELEVENLABS_API_KEY: elevenLabsKey
      }
    };
    
    const apiUrl = `${supabaseUrl}/functions/v1/${functionName}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(enhancedPayload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error calling ${functionName}: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling edge function ${functionName}:`, error);
    throw error;
  }
};