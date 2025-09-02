import React, { useState, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { MessageCircle, Minimize2, X, Mic, MicOff, Loader2 } from 'lucide-react';

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('✅ ElevenLabs conversation connected');
    },
    onDisconnect: () => {
      console.log('🔌 ElevenLabs conversation disconnected');
      setConversationId(null);
    },
    onMessage: (message) => {
      console.log('📩 Message received:', message);
    },
    onError: (error) => {
      console.error('❌ ElevenLabs conversation error:', error);
    }
  });

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      return false;
    }
  };

  const startConversation = async () => {
    try {
      const permissionGranted = hasPermission || await requestMicrophonePermission();
      if (!permissionGranted) {
        return;
      }

      const conversationId = await conversation.startSession({
        agentId: agentId,
        connectionType: 'webrtc', // or 'websocket'
        userId: 'smartcrm-user' // you can make this dynamic
      });
      
      setConversationId(conversationId);
      console.log('🎤 Conversation started:', conversationId);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setConversationId(null);
      console.log('🔇 Conversation ended');
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

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
              {conversation.status === 'connected' && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-200">Live</span>
                </div>
              )}
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
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Ask me anything about your CRM or get help with your sales process.
              </p>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Status: <span className="font-medium capitalize">{conversation.status}</span>
                {conversation.isSpeaking && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">🎤 Speaking...</span>
                )}
              </div>
            </div>

            {/* Connection Controls */}
            <div className="space-y-3">
              {conversation.status === 'disconnected' ? (
                <button
                  onClick={startConversation}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  data-testid="button-start-conversation"
                >
                  <Mic size={18} />
                  <span>Start Conversation</span>
                </button>
              ) : conversation.status === 'connected' ? (
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Connected - Speak now!
                      </span>
                    </div>
                    {conversation.isSpeaking && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Agent is speaking...
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={endConversation}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    data-testid="button-end-conversation"
                  >
                    <MicOff size={16} />
                    <span>End Conversation</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connecting...
                  </p>
                </div>
              )}
            </div>

            {/* Permission Info */}
            {!hasPermission && conversation.status === 'disconnected' && (
              <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  <strong>Microphone access required:</strong> This feature needs microphone permission to work.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAgentWidget;