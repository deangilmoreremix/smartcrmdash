/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_ANTHROPIC_API_KEY: string;
  readonly VITE_GOOGLE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    originalWindowOpen?: typeof window.open;
  }
}

// ElevenLabs Conversational AI Widget Types
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': {
      'agent-id': string;
      style?: React.CSSProperties;
      className?: string;
    };
  }
}