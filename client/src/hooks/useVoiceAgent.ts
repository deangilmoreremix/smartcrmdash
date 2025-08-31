
import { useState, useEffect, useCallback } from 'react';

interface VoiceAgentConfig {
  agentId: string;
  apiKey?: string;
  baseUrl?: string;
}

interface VoiceAgentState {
  isLoaded: boolean;
  isConnected: boolean;
  error: string | null;
  isLoading: boolean;
}

export const useVoiceAgent = (config: VoiceAgentConfig) => {
  const [state, setState] = useState<VoiceAgentState>({
    isLoaded: false,
    isConnected: false,
    error: null,
    isLoading: true
  });

  const loadScript = useCallback(async () => {
    try {
      // Check if already loaded
      if (document.querySelector('script[src*="convai-widget-embed"]')) {
        setState(prev => ({ ...prev, isLoaded: true, isLoading: false }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      const loadPromise = new Promise<void>((resolve, reject) => {
        script.onload = () => {
          console.log('✅ ElevenLabs script loaded successfully');
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('❌ Failed to load ElevenLabs script:', error);
          reject(new Error('Failed to load voice agent script'));
        };
      });

      document.head.appendChild(script);
      
      // Add timeout for script loading
      const timeoutPromise = new Promise<void>((_, reject) => {
        setTimeout(() => reject(new Error('Script loading timeout')), 10000);
      });

      await Promise.race([loadPromise, timeoutPromise]);
      
      setState(prev => ({ 
        ...prev, 
        isLoaded: true, 
        isLoading: false, 
        error: null 
      }));

    } catch (error) {
      console.error('Voice agent script loading failed:', error);
      setState(prev => ({ 
        ...prev, 
        isLoaded: false, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }, []);

  const retry = useCallback(() => {
    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="convai-widget-embed"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    setState({
      isLoaded: false,
      isConnected: false,
      error: null,
      isLoading: true
    });
    
    loadScript();
  }, [loadScript]);

  useEffect(() => {
    loadScript();
  }, [loadScript]);

  const connect = useCallback(() => {
    if (!state.isLoaded) return;
    
    setState(prev => ({ ...prev, isConnected: true }));
  }, [state.isLoaded]);

  const disconnect = useCallback(() => {
    setState(prev => ({ ...prev, isConnected: false }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    retry,
    agentId: config.agentId
  };
};
