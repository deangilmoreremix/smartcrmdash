/// <reference types="vite/client" />

declare global {
  interface Window {
    ENV_VARS?: {
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
    };
  }
}
