import React, { useState } from 'react';
import { useAiApi } from '../hooks/useAiApi';
import { useTheme } from '../contexts/ThemeContext';
import { Contact } from '../types/contact';
import { Mail, Send, RefreshCw, Copy, Check, AlertCircle, Settings } from 'lucide-react';

interface AIEmailDrafterProps {
  incomingEmail?: string;
  contactId: string;
  onEmailGenerated?: (subject: string, body: string) => void;
  className?: string;
}

const AIEmailDrafter: React.FC<AIEmailDrafterProps> = ({
  incomingEmail = '',
  contactId,
  onEmailGenerated,
  className = ''
}) => {
  const { isDark } = useTheme();
  const { draftEmailResponse, loading, error } = useAiApi();
  
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [emailSettings, setEmailSettings] = useState({
    tone: 'professional' as 'formal' | 'casual' | 'friendly' | 'professional',
    includeGreeting: true,
    includeSignature: true
  });
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateEmail = async () => {
    try {
      // If we have a custom prompt, use that instead of the incoming email
      const emailContent = customPrompt || incomingEmail;
      
      const result = await draftEmailResponse(
        emailContent, 
        contactId,
        {
          tone: emailSettings.tone,
          includeGreeting: emailSettings.includeGreeting,
          includeSignature: emailSettings.includeSignature
        }
      );
      
      setEmailDraft(result);
      
      if (onEmailGenerated) {
        onEmailGenerated(result.subject, result.body);
      }
    } catch (err) {
      console.error('Error generating email:', err);
    }
  };

  const handleCopyToClipboard = () => {
    if (!emailDraft) return;
    
    navigator.clipboard.writeText(emailDraft.body)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy text:', err));
  };

  return (
    <div className={`${className}`}>
      <div className={`p-4 rounded-lg border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Mail className="mr-2 h-5 w-5 text-blue-500" />
            AI Email Drafter
          </h3>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Settings size={16} />
          </button>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className={`mb-4 p-3 rounded-lg ${
            isDark ? 'bg-gray-800 border border-white/10' : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Email Settings
            </h4>
            
            <div className="space-y-3">
              {/* Tone Selection */}
              <div>
                <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tone
                </label>
                <select
                  value={emailSettings.tone}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    tone: e.target.value as any
                  })}
                  className={`w-full rounded-md px-3 py-1.5 text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-white/10 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="professional">Professional</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
              
              {/* Include Greeting */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeGreeting"
                  checked={emailSettings.includeGreeting}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    includeGreeting: e.target.checked
                  })}
                  className="mr-2 h-4 w-4 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeGreeting" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Include Greeting
                </label>
              </div>
              
              {/* Include Signature */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeSignature"
                  checked={emailSettings.includeSignature}
                  onChange={(e) => setEmailSettings({
                    ...emailSettings,
                    includeSignature: e.target.checked
                  })}
                  className="mr-2 h-4 w-4 rounded focus:ring-blue-500"
                />
                <label htmlFor="includeSignature" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Include Signature
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Custom Prompt Input */}
        <div className="mb-4">
          <label className={`block text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Custom Prompt (optional)
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter custom instructions or leave empty to use the incoming email..."
            rows={3}
            className={`w-full rounded-lg p-2 text-sm ${
              isDark 
                ? 'bg-gray-800 border-white/10 text-white placeholder:text-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        
        {/* Generate Button */}
        <button
          onClick={handleGenerateEmail}
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } transition-colors disabled:opacity-50`}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Generate Email Draft</span>
            </>
          )}
        </button>
        
        {/* Error Display */}
        {error && (
          <div className={`mt-4 p-3 rounded-lg ${
            isDark ? 'bg-red-900/20 border border-red-900/30 text-red-200' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-start">
              <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {/* Email Draft Display */}
        {emailDraft && (
          <div className={`mt-4 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          } border rounded-lg overflow-hidden`}>
            <div className={`p-3 border-b ${
              isDark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-gray-100'
            } flex justify-between items-center`}>
              <div>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Subject:
                </span>
                <span className={`ml-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {emailDraft.subject}
                </span>
              </div>
              <button
                onClick={handleCopyToClipboard}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                }`}
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4">
              <div className={`whitespace-pre-line text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {emailDraft.body}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEmailDrafter;