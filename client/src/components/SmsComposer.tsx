// SMS Composer Component - AI-powered SMS composition interface
// Adapted from the EnhancedVoiceSmsAgent component in Voice & SMS code

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  Sparkles,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Save,
  Users,
  Phone,
  Zap,
  Settings
} from 'lucide-react';
import { SmsEnhancementService } from '../services/smsEnhancementService';
import { SmsService } from '../services/smsService';
import { useSharedModuleState } from '../utils/moduleFederationOrchestrator';

interface SmsComposerProps {
  contacts: any[];
  onClose: () => void;
  onSuccess: (result: any) => void;
  initialContext?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SmsComposer: React.FC<SmsComposerProps> = ({
  contacts,
  onClose,
  onSuccess,
  initialContext = 'general'
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(contacts);
  const [context, setContext] = useState(initialContext);
  const [isSending, setIsSending] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [model, setModel] = useState<'gemini-2.5-pro' | 'gemini-2.0-flash'>('gemini-2.5-pro');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'casual'>('professional');
  const [includeEmojis, setIncludeEmojis] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sharedData } = useSharedModuleState.getState();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add message to chat
  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Process user commands (adapted from Voice & SMS chat interface)
  const processCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();

    if (cmd.startsWith('/sms')) {
      setIsGenerating(true);
      try {
        const generatedSms = await SmsEnhancementService.generateSmsForContact(
          selectedContacts[0]?.id,
          context,
          { model, tone, includeEmojis }
        );

        addMessage('assistant', `Here's your AI-generated SMS: "${generatedSms}"`);
        setCurrentMessage(generatedSms);
      } catch (error: any) {
        addMessage('assistant', `Sorry, I couldn't generate the SMS. Error: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    } else if (cmd.startsWith('/enhance')) {
      if (!currentMessage.trim()) {
        addMessage('assistant', 'Please enter an SMS message first before enhancing.');
        return;
      }

      setIsGenerating(true);
      try {
        const enhanced = await SmsEnhancementService.enhanceSmsContent(
          currentMessage,
          'tone'
        );
        setCurrentMessage(enhanced);
        addMessage('assistant', `Enhanced SMS: "${enhanced}"`);
      } catch (error: any) {
        addMessage('assistant', `Enhancement failed: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    } else if (cmd.startsWith('/analyze')) {
      if (!currentMessage.trim()) {
        addMessage('assistant', 'Please enter an SMS message first before analyzing.');
        return;
      }

      setIsGenerating(true);
      try {
        const analysis = await SmsEnhancementService.analyzeSmsEffectiveness(
          currentMessage,
          'general'
        );

        addMessage('assistant',
          `SMS Analysis (Score: ${analysis.score}/10):\n` +
          `💪 Strengths: ${analysis.strengths.join(', ')}\n` +
          `🔧 Improvements: ${analysis.improvements.join(', ')}\n` +
          `💡 Suggestions: ${analysis.suggestions.join(', ')}`
        );
      } catch (error: any) {
        addMessage('assistant', `Analysis failed: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Regular message - just add to chat
      addMessage('user', command);
    }
  };

  // Send SMS to selected contacts
  const sendSms = async () => {
    if (!currentMessage.trim() || selectedContacts.length === 0) return;

    setIsSending(true);
    try {
      if (selectedContacts.length === 1) {
        // Single SMS
        const result = await SmsService.sendSms(currentMessage, selectedContacts[0].phone);
        addMessage('assistant', `✅ SMS sent successfully to ${selectedContacts[0].name}!`);
        onSuccess(result);
      } else {
        // Bulk SMS
        const bulkResult = await SmsEnhancementService.sendBulkSmsWithAI(
          selectedContacts.map(c => c.id),
          context,
          { model, tone, includeEmojis }
        );
        addMessage('assistant',
          `✅ Bulk SMS sent! ${bulkResult.successful} successful, ${bulkResult.failed} failed.`
        );
        onSuccess(bulkResult);
      }
    } catch (error: any) {
      addMessage('assistant', `❌ Failed to send SMS: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    if (currentMessage.startsWith('/')) {
      processCommand(currentMessage);
    } else {
      sendSms();
    }
    setCurrentMessage('');
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy message to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addMessage('assistant', '📋 Message copied to clipboard!');
  };

  // Save as template
  const saveAsTemplate = () => {
    if (!currentMessage.trim()) {
      addMessage('assistant', 'Please enter a message first.');
      return;
    }

    // This would integrate with template storage
    addMessage('assistant', '💾 Template saved! (Integration with template storage needed)');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">AI SMS Composer</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Chat Interface - Adapted from EnhancedVoiceSmsAgent */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                    <MessageSquare size={48} className="text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">AI SMS Assistant</h3>
                    <p className="text-gray-600 mb-4">
                      I can help you create personalized SMS messages with AI.
                    </p>
                    <div className="text-sm text-gray-500">
                      Try: <code className="bg-gray-200 px-2 py-1 rounded">/sms create a follow-up message</code>
                    </div>
                  </div>
                </div>
              )}

              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.type === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-xs opacity-70 hover:opacity-100"
                        >
                          <Copy size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              {/* SMS Preview */}
              {currentMessage && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-800">SMS Preview</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(currentMessage)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={saveAsTemplate}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Save size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700">"{currentMessage}"</p>
                  <div className="text-xs text-blue-600 mt-1">
                    {SmsService.getCharacterInfo(currentMessage).length}/160 characters
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="mb-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as any)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Emojis</label>
                  <input
                    type="checkbox"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type /sms to generate AI SMS or enter message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSending}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isSending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isSending ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>

              {/* Quick Commands */}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setCurrentMessage('/sms create a professional follow-up message')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  /sms follow-up
                </button>
                <button
                  onClick={() => setCurrentMessage('/sms create a friendly introduction')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  /sms introduction
                </button>
                <button
                  onClick={() => setCurrentMessage('/enhance')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  /enhance
                </button>
                <button
                  onClick={() => setCurrentMessage('/analyze')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  /analyze
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <Users size={16} className="inline mr-1" />
            Sending to {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={sendSms}
              disabled={!currentMessage.trim() || isSending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Phone size={16} className="mr-2" />
              Send SMS ({selectedContacts.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsComposer;