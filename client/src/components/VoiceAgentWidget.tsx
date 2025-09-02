import React, { useEffect, useState, useCallback } from 'react';
import { MessageCircle, Minimize2, X } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string;
        style?: React.CSSProperties;
        className?: string;
        ref?: React.RefObject<HTMLElement>;
        onLoad?: () => void;
        onError?: (error: any) => void;
      };
    }
  }
}

interface VoiceAgentWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  minimizable?: boolean;
  agentId?: string;
}

const VoiceAgentWidget: React.FC<VoiceAgentWidgetProps> = ({
  position = 'bottom-right',
  minimizable = true,
  agentId = 'agent_01jvwktgjsefkts3rv9jqwcx33'
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const loadElevenLabsScript = useCallback(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="convai-widget-embed"]');
    if (existingScript) {
      console.log('✅ ElevenLabs script already loaded');
      setScriptLoaded(true);
      return;
    }

    console.log('Loading ElevenLabs script...');

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';

    script.onload = () => {
      console.log('✅ ElevenLabs script loaded successfully');
      // Add a small delay to ensure the custom element is registered
      setTimeout(() => {
        setScriptLoaded(true);
        setScriptError(false);
      }, 500);
    };

    script.onerror = (error) => {
      console.error('❌ Failed to load ElevenLabs script:', error);
      setScriptError(true);
      setScriptLoaded(false);
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadElevenLabsScript();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [loadElevenLabsScript]);

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50 transition-all duration-300 ease-in-out';

    switch (position) {
      case 'bottom-right':
        return `${baseClasses} bottom-6 right-6`;
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-6`;
      case 'top-right':
        return `${baseClasses} top-6 right-6`;
      case 'top-left':
        return `${baseClasses} top-6 left-6`;
      default:
        return `${baseClasses} bottom-6 right-6`;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={getPositionClasses()}>
      {isMinimized ? (
        // Minimized state - floating button
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-4 shadow-2xl cursor-pointer hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
          <button
            onClick={() => setIsMinimized(false)}
            className="text-white hover:text-gray-100 transition-colors flex items-center justify-center"
            aria-label="Open Voice Assistant"
            data-testid="button-open-voice-assistant"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      ) : (
        // Expanded state - widget container
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-sm w-80">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="text-white" size={20} />
              <h3 className="text-white font-semibold text-sm">AI Voice Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              {minimizable && (
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  aria-label="Minimize"
                  data-testid="button-minimize"
                >
                  <Minimize2 size={16} />
                </button>
              )}
              <button
                onClick={() => setIsVisible(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
                aria-label="Close"
                data-testid="button-close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {scriptError ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">
                  <MessageCircle size={48} className="mx-auto opacity-50" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Voice assistant temporarily unavailable
                </p>
                <button
                  onClick={() => {
                    setScriptError(false);
                    loadElevenLabsScript();
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  data-testid="button-retry"
                >
                  Retry
                </button>
              </div>
            ) : !scriptLoaded ? (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <MessageCircle size={48} className="mx-auto text-purple-600 mb-2" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Loading voice assistant...
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Ask me anything about your CRM or get help with your sales process.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    💡 If the voice assistant isn't responding, ensure your agent is configured as public in ElevenLabs dashboard.
                  </p>
                </div>

                {/* ElevenLabs Widget Container */}
                <div className="voice-widget-container" style={{ minHeight: '200px', width: '100%' }}>
                  <elevenlabs-convai 
                    agent-id={agentId}
                    style={{
                      width: '100%',
                      height: '200px',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAgentWidget;