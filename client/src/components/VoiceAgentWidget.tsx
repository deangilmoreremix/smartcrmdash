
import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface VoiceAgentWidgetProps {
  agentId?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  minimizable?: boolean;
}

export const VoiceAgentWidget: React.FC<VoiceAgentWidgetProps> = ({
  agentId = "agent_01jvwktgjsefkts3rv9jqwcx33",
  className,
  position = 'bottom-right',
  minimizable = true
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load the ElevenLabs script if not already loaded
    if (!document.querySelector('script[src*="elevenlabs"]')) {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

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
        'relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg',
        'border border-gray-200/50 dark:border-gray-700/50',
        'rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30',
        'transition-all duration-300 ease-in-out',
        isMinimized ? 'w-16 h-16' : 'w-80 h-64'
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className={cn(
              'text-sm font-medium text-gray-900 dark:text-gray-100',
              isMinimized && 'hidden'
            )}>
              AI Voice Assistant
            </span>
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
              
              {/* ElevenLabs Widget */}
              {isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <elevenlabs-convai 
                    agent-id={agentId}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '12px'
                    }}
                  />
                </div>
              )}

              {/* Loading State */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Loading Voice Assistant...
                    </p>
                  </div>
                </div>
              )}

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <Volume2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-20">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>AI-Powered Sales Assistant</span>
              <span className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span>Ready</span>
              </span>
            </div>
          </div>
        )}

        {/* Minimized State */}
        {isMinimized && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Mic className="w-6 h-6 text-purple-600" />
          </div>
        )}

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-xl -z-10 opacity-50" />
      </div>
    </div>
  );
};

export default VoiceAgentWidget;
