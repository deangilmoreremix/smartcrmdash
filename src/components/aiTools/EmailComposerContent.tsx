// Email Composer Content - AI-powered email writing assistant
import React, { useState, useCallback } from 'react';
import { Mail, Wand2, Copy, RefreshCw } from 'lucide-react';
import AIToolContent from '../shared/AIToolContent';

interface EmailComposerContentProps {
  isActive?: boolean;
  onActivate?: () => void;
}

const EmailComposerContent: React.FC<EmailComposerContentProps> = ({ 
  isActive = false, 
  onActivate 
}) => {
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    tone: 'professional',
    purpose: '',
    keyPoints: '',
    context: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!emailData.purpose.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI generation with context
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockEmail = `Subject: ${emailData.subject || 'Follow-up on our conversation'}

Dear ${emailData.recipient || 'Valued Contact'},

I hope this email finds you well. I wanted to follow up on our recent conversation regarding ${emailData.purpose}.

${emailData.keyPoints ? `Key highlights include:
${emailData.keyPoints.split(',').map(point => `• ${point.trim()}`).join('\n')}` : ''}

${emailData.context ? `Given the context of ${emailData.context}, ` : ''}I believe this presents an excellent opportunity for collaboration.

I would love to schedule a brief call to discuss this further. Please let me know your availability for next week.

Best regards,
[Your Name]`;

      setGeneratedEmail(mockEmail);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [emailData]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedEmail);
  }, [generatedEmail]);

  return (
    <AIToolContent
      title="AI Email Composer"
      description="Generate professional emails with AI assistance"
      isActive={isActive}
      onActivate={onActivate}
    >
      <div className="space-y-4">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient
            </label>
            <input
              type="text"
              value={emailData.recipient}
              onChange={(e) => setEmailData(prev => ({ ...prev, recipient: e.target.value }))}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tone
            </label>
            <select
              value={emailData.tone}
              onChange={(e) => setEmailData(prev => ({ ...prev, tone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="persuasive">Persuasive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="e.g., Follow-up on our meeting"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose *
          </label>
          <input
            type="text"
            value={emailData.purpose}
            onChange={(e) => setEmailData(prev => ({ ...prev, purpose: e.target.value }))}
            placeholder="e.g., Schedule a demo, Follow up on proposal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Points
          </label>
          <textarea
            value={emailData.keyPoints}
            onChange={(e) => setEmailData(prev => ({ ...prev, keyPoints: e.target.value }))}
            placeholder="e.g., 30% cost savings, Implementation timeline, ROI benefits"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Context
          </label>
          <textarea
            value={emailData.context}
            onChange={(e) => setEmailData(prev => ({ ...prev, context: e.target.value }))}
            placeholder="e.g., Previous conversation about CRM needs"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!emailData.purpose.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Email'}
        </button>

        {/* Generated Email */}
        {generatedEmail && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Generated Email
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 border rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {generatedEmail}
              </pre>
            </div>
          </div>
        )}
      </div>
    </AIToolContent>
  );
};

export default EmailComposerContent;
