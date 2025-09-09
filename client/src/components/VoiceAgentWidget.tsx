import React, { useEffect, useState, useCallback } from 'react';
import { MessageCircle, Minimize2, X, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useConversation } from '@elevenlabs/react';

interface VoiceAgentWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  minimizable?: boolean;
  agentId?: string;
}

const VoiceAgentWidget: React.FC<VoiceAgentWidgetProps> = ({
  position = 'bottom-right',
  minimizable = true,
  agentId = 'default'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Mock conversation object for now since ElevenLabs is disabled
  const conversation = {
    status: 'disconnected',
    isSpeaking: false,
    startSession: async (config: any) => {
      throw new Error('ElevenLabs integration is currently disabled');
    },
    endSession: async () => {
      setConversationId(null);
    }
  };

  const startConversation = async () => {
    try {
      console.log('🎤 Starting ElevenLabs conversation...');
      console.log('🔗 Using agent ID:', agentId);
      
      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎤 Microphone access granted');
      
      // Try public agent first (for public agents)
      try {
        const id = await conversation.startSession({
          agentId: agentId,
          connectionType: 'webrtc'
        });
        
        setConversationId(id);
        console.log('✅ Conversation started with public agent, ID:', id);
        return;
      } catch (publicError) {
        console.log('🔐 Public agent failed, trying signed URL approach:', publicError);
        
        // Try signed URL approach for private agents
        const response = await fetch(`/api/elevenlabs/signed-url?agent_id=${agentId}`);
        if (!response.ok) {
          throw new Error('Failed to get signed URL');
        }
        
        const { signed_url } = await response.json();
        console.log('🔗 Got signed URL, starting session...');
        
        const id = await conversation.startSession({
          signedUrl: signed_url,
          connectionType: 'websocket'
        });
        
        setConversationId(id);
        console.log('✅ Conversation started with signed URL, ID:', id);
      }
    } catch (error) {
      console.error('❌ Failed to start conversation:', error);
      console.error('Error details:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Permission denied')) {
          setError('Microphone access denied. Please allow microphone permissions and try again.');
        } else if (error.message.includes('agent') || error.message.includes('authentication')) {
          setError('Agent not available. Please ensure your ElevenLabs agent is configured as public or check API key.');
        } else {
          setError(`Connection failed: ${error.message}`);
        }
      } else {
        setError('Failed to start conversation. Please try again.');
      }
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setConversationId(null);
      console.log('🛑 Conversation ended');
    } catch (error) {
      console.error('❌ Failed to end conversation:', error);
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
            {error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">
                  <MessageCircle size={48} className="mx-auto opacity-50" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    startConversation();
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                  data-testid="button-retry"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Ask me anything about your CRM or get help with your sales process.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                    <div className={`h-2 w-2 rounded-full ${conversation.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span>{conversation.status === 'connected' ? 'Connected' : 'Disconnected'}</span>
                    {conversation.isSpeaking && (
                      <span className="text-purple-600 font-medium">• Speaking</span>
                    )}
                  </div>
                </div>

                {/* Conversation Controls */}
                <div className="voice-widget-container">
                  {!conversationId ? (
                    <div className="text-center py-6">
                      <button
                        onClick={startConversation}
                        className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                        data-testid="button-start-conversation"
                      >
                        <Mic size={20} />
                        <span>Start Voice Chat</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Click to begin voice conversation
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="mb-4">
                        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${conversation.isSpeaking ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                          {conversation.isSpeaking ? (
                            <>
                              <div className="animate-pulse">
                                <Mic size={16} />
                              </div>
                              <span className="text-sm font-medium">AI is speaking...</span>
                            </>
                          ) : (
                            <>
                              <Mic size={16} />
                              <span className="text-sm font-medium">Listening...</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={endConversation}
                        className="flex items-center space-x-2 mx-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        data-testid="button-end-conversation"
                      >
                        <PhoneOff size={20} />
                        <span>End Call</span>
                      </button>
                    </div>
                  )}
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