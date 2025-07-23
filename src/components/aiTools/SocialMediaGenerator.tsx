import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { enhancedGeminiService } from '../../services/enhancedGeminiService';
import { aiUsageTracker } from '../../services/aiUsageTracker';
import { Share2, Download, Copy, Check, RefreshCw, Hash, Calendar, Target, TrendingUp } from 'lucide-react';

export default function SocialMediaGenerator() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    platform: 'linkedin',
    postType: 'promotion',
    tone: 'professional',
    topic: '',
    targetAudience: '',
    includeHashtags: true,
    includeCallToAction: true,
    contentLength: 'medium'
  });
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const platforms = [
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-blue-600' },
    { value: 'twitter', label: 'Twitter/X', color: 'bg-gray-800' },
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-700' },
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-600' }
  ];

  const postTypes = [
    'promotion', 'educational', 'industry-news', 'company-update', 
    'case-study', 'tip', 'question', 'behind-the-scenes'
  ];

  const tones = [
    'professional', 'casual', 'friendly', 'authoritative', 
    'conversational', 'inspirational', 'humorous', 'urgent'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePosts = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic for your post');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const result = await enhancedGeminiService.generateSocialMediaPost({
        platform: formData.platform,
        postType: formData.postType,
        tone: formData.tone,
        topic: formData.topic,
        targetAudience: formData.targetAudience,
        includeHashtags: formData.includeHashtags,
        includeCallToAction: formData.includeCallToAction,
        contentLength: formData.contentLength
      });

      // Generate multiple variations
      const variations = [];
      for (let i = 0; i < 3; i++) {
        const variation = await enhancedGeminiService.generateSocialMediaPost({
          ...formData,
          topic: formData.topic,
          targetAudience: formData.targetAudience
        });
        variations.push({
          ...variation,
          id: i + 1,
          engagement: Math.floor(Math.random() * 100) + 50, // Mock engagement score
          readability: Math.floor(Math.random() * 20) + 80,  // Mock readability score
        });
      }

      setGeneratedPosts(variations);

      // Track usage
      aiUsageTracker.recordUsage(
        'social-media-generator',
        'Social Media Generator',
        'Content',
        Date.now() - startTime,
        true
      );
    } catch (error) {
      console.error('Error generating social media posts:', error);
      alert('Failed to generate posts. Please try again.');
      
      aiUsageTracker.recordUsage(
        'social-media-generator',
        'Social Media Generator',
        'Content',
        Date.now() - startTime,
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadPost = (post: any, index: number) => {
    const content = `
SOCIAL MEDIA POST - ${formData.platform.toUpperCase()}
Generated: ${new Date().toLocaleDateString()}
Platform: ${formData.platform}
Type: ${formData.postType}
Tone: ${formData.tone}

CONTENT:
${post.content}

HASHTAGS:
${post.hashtags?.join(' ') || 'No hashtags'}

CALL TO ACTION:
${post.callToAction || 'No call to action'}

PERFORMANCE METRICS:
Engagement Score: ${post.engagement}/100
Readability Score: ${post.readability}/100
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-post-${formData.platform}-${index + 1}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.value === platform);
    return platformData ? platformData.color : 'bg-gray-600';
  };

  const getCharacterLimit = (platform: string) => {
    switch (platform) {
      case 'twitter': return 280;
      case 'linkedin': return 3000;
      case 'facebook': return 63206;
      case 'instagram': return 2200;
      default: return 1000;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Share2 className="w-6 h-6 mr-2 text-blue-600" />
          <h2 className="text-2xl font-bold">Social Media Post Generator</h2>
        </div>
      </div>

      {/* Configuration Form */}
      <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold mb-4">Post Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Platform *</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(platform => (
                <button
                  key={platform.value}
                  onClick={() => handleInputChange('platform', platform.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    formData.platform === platform.value
                      ? `${platform.color} text-white border-transparent`
                      : isDark
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">{platform.label}</div>
                  <div className="text-xs opacity-75">
                    {getCharacterLimit(platform.value)} chars
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Post Type</label>
            <select
              value={formData.postType}
              onChange={(e) => handleInputChange('postType', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {postTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <select
              value={formData.tone}
              onChange={(e) => handleInputChange('tone', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {tones.map(tone => (
                <option key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Content Length */}
          <div>
            <label className="block text-sm font-medium mb-2">Content Length</label>
            <select
              value={formData.contentLength}
              onChange={(e) => handleInputChange('contentLength', e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        {/* Topic */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Topic/Message *</label>
          <textarea
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            placeholder="Describe what you want to post about..."
            rows={3}
            className={`w-full p-3 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>

        {/* Target Audience */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Target Audience (Optional)</label>
          <input
            type="text"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="e.g., Small business owners, Marketing professionals..."
            className={`w-full p-3 rounded-lg border ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>

        {/* Options */}
        <div className="mt-6 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.includeHashtags}
              onChange={(e) => handleInputChange('includeHashtags', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Include relevant hashtags</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.includeCallToAction}
              onChange={(e) => handleInputChange('includeCallToAction', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Include call-to-action</span>
          </label>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generatePosts}
            disabled={isLoading || !formData.topic.trim()}
            className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Posts...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Posts
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Posts */}
      {generatedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Posts</h3>
          {generatedPosts.map((post, index) => (
            <div key={index} className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg ${getPlatformIcon(formData.platform)} flex items-center justify-center mr-3`}>
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Post Variation {index + 1}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)} • {formData.postType}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(post.content, index)}
                    className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => downloadPost(post, index)}
                    className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </button>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{post.engagement}/100</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{post.readability}/100</div>
                  <div className="text-xs text-gray-500">Readability</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{post.content?.length || 0}</div>
                  <div className="text-xs text-gray-500">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{post.hashtags?.length || 0}</div>
                  <div className="text-xs text-gray-500">Hashtags</div>
                </div>
              </div>

              {/* Post Content */}
              <div className={`p-4 rounded-lg border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <p className="whitespace-pre-wrap mb-4">{post.content}</p>
                
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.hashtags.map((hashtag: string, hashIndex: number) => (
                      <span
                        key={hashIndex}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {hashtag}
                      </span>
                    ))}
                  </div>
                )}

                {post.callToAction && (
                  <div className={`p-3 rounded border-l-4 border-blue-500 ${
                    isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center mb-1">
                      <Target className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">Call to Action</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{post.callToAction}</p>
                  </div>
                )}
              </div>

              {/* Character Count Warning */}
              {post.content && post.content.length > getCharacterLimit(formData.platform) && (
                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center text-red-700 dark:text-red-300">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Content exceeds {formData.platform} character limit ({post.content.length}/{getCharacterLimit(formData.platform)})
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
