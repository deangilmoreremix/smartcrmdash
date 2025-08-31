
import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface VoiceAgentWidgetProps {
  agentId?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  minimizable?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string;
        style?: React.CSSProperties;
        className?: string;
        ref?: React.RefObject<HTMLElement>;
      };
    }
  }
}

export const VoiceAgentWidget: React.FC<VoiceAgentWidgetProps> = ({
  agentId = "agent_01jvwktgjsefkts3rv9jqwcx33",
  className,
  position = 'bottom-right',
  minimizable = true
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const widgetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="elevenlabs"]');
    if (existingScript) {
      setIsScriptLoaded(true);
      setIsLoaded(true);
      return;
    }

    // Load the ElevenLabs script
    console.log('Loading ElevenLabs script...');
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    
    script.onload = () => {
      console.log('✅ ElevenLabs script loaded successfully');
      setIsScriptLoaded(true);
      
      // Give the custom element time to register
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load ElevenLabs script:', error);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Debug effect to monitor widget loading
  useEffect(() => {
    if (isLoaded && widgetRef.current) {
      console.log('🎤 Voice widget element:', widgetRef.current);
      console.log('🔗 Agent ID:', agentId);
    }
  }, [isLoaded, agentId]);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300 ease-in-out',
        positionClasses[position],
        className
      )}
    >
      {/* Modern Container */}
      <div className={cn(
        'relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg',
        'border border-gray-200/60 dark:border-gray-700/60',
        'rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30',
        'transition-all duration-300 ease-in-out',
        isMinimized ? 'w-16 h-16' : 'w-96 h-80'
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isLoaded ? "bg-green-400 animate-pulse" : "bg-yellow-400"
            )} />
            <span className={cn(
              'text-sm font-medium text-gray-900 dark:text-gray-100',
              isMinimized && 'hidden'
            )}>
              AI Voice Assistant
            </span>
            {!isMinimized && (
              <span className={cn(
                'text-xs px-2 py-1 rounded-full text-white transition-colors',
                isLoaded ? 'bg-green-500' : 'bg-yellow-500'
              )}>
                {isLoaded ? 'Ready' : 'Loading'}
              </span>
            )}
          </div>
          
          {minimizable && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={cn(
                'p-1.5 rounded-lg transition-colors duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-500 dark:text-gray-400',
                'hover:text-gray-700 dark:hover:text-gray-200'
              )}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Widget Container */}
        {!isMinimized && (
          <div className="p-4 h-full">
            <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              
              {/* ElevenLabs Widget - Using proper web component */}
              {isScriptLoaded && (
                <div className="absolute inset-0">
                  <elevenlabs-convai 
                    agent-id={agentId}
                    ref={widgetRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '12px',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              {/* Loading State */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {!isScriptLoaded ? 'Loading ElevenLabs...' : 'Initializing Agent...'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Agent ID: {agentId}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {isScriptLoaded && !isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MicOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Widget failed to load
                    </p>
                  </div>
                </div>
              )}

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                <Volume2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-20 pointer-events-none">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>ElevenLabs AI Assistant</span>
              <span className="flex items-center space-x-1">
                <div className={cn(
                  "w-1 h-1 rounded-full transition-colors",
                  isLoaded ? "bg-green-400" : "bg-yellow-400"
                )}></div>
                <span>{isLoaded ? 'Connected' : 'Connecting...'}</span>
              </span>
            </div>
          </div>
        )}

        {/* Minimized State */}
        {isMinimized && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Mic className={cn(
                "w-6 h-6 transition-colors",
                isLoaded ? "text-purple-600" : "text-yellow-500"
              )} />
              {isLoaded && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        )}

        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-0 rounded-2xl blur-xl -z-10 opacity-50 transition-all duration-300",
          isLoaded 
            ? "bg-gradient-to-r from-purple-400/20 to-blue-400/20" 
            : "bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
        )} />
      </div>
    </div>
  );
};

export default VoiceAgentWidget;
