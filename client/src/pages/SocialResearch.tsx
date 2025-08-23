import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Users, 
  Globe, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube, 
  Github,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  ExternalLink,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Brain,
  Zap
} from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { gpt5SocialResearchService, SocialResearchResult, SocialPlatformProfile } from '../services/gpt5SocialResearchService';
import { Contact } from '../types';

const SocialResearch: React.FC = () => {
  const { contacts } = useContactStore();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [socialResearch, setSocialResearch] = useState<SocialResearchResult | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'GitHub'
  ]);

  const platformIcons: Record<string, any> = {
    'LinkedIn': Linkedin,
    'Twitter': Twitter,
    'Instagram': Instagram,
    'YouTube': Youtube,
    'GitHub': Github,
    'TikTok': MessageSquare,
    'Medium': MessageSquare,
    'Facebook': MessageSquare,
    'Snapchat': MessageSquare,
    'Discord': MessageSquare,
    'Reddit': MessageSquare,
    'Pinterest': MessageSquare,
    'Behance': MessageSquare,
    'Dribbble': MessageSquare,
    'AngelList': MessageSquare
  };

  const allPlatforms = [
    'LinkedIn', 'Twitter', 'Instagram', 'TikTok', 'YouTube', 'GitHub',
    'Medium', 'Facebook', 'Snapchat', 'Discord', 'Reddit', 'Pinterest',
    'Behance', 'Dribbble', 'AngelList'
  ];

  const contactsList = Object.values(contacts).filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setSocialResearch(null);
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSocialResearch = async () => {
    if (!selectedContact) return;

    setIsResearching(true);
    try {
      const research = await gpt5SocialResearchService.researchContactSocialMedia(
        selectedContact,
        selectedPlatforms,
        'comprehensive'
      );
      setSocialResearch(research);
    } catch (error) {
      console.error('Social research failed:', error);
    } finally {
      setIsResearching(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const Icon = platformIcons[platform] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">GPT-5 Social Media Research</h1>
          </div>
          <p className="text-gray-600">
            Discover and analyze social media profiles across 15+ platforms using advanced AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Contact</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Contact List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {contactsList.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-blue-50 border-blue-200 border'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      {contact.company && (
                        <p className="text-xs text-gray-500">{contact.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h2>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              {allPlatforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => handlePlatformToggle(platform)}
                  className={`p-2 rounded-lg border transition-colors ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {getPlatformIcon(platform)}
                    <span className="ml-2 text-xs font-medium">{platform}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Selected: {selectedPlatforms.length} platforms
            </div>

            {/* Research Button */}
            <button
              onClick={handleSocialResearch}
              disabled={!selectedContact || isResearching || selectedPlatforms.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              data-testid="button-research-social"
            >
              {isResearching ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start Research
                </>
              )}
            </button>
          </div>

          {/* Research Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Results</h2>
            
            {!socialResearch && !selectedContact && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a contact to start social media research</p>
              </div>
            )}

            {!socialResearch && selectedContact && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Click "Start Research" to discover social profiles</p>
              </div>
            )}

            {socialResearch && (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-600 text-sm font-medium">Profiles Found</p>
                    <p className="text-blue-900 text-xl font-bold">{socialResearch.profiles.length}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-green-600 text-sm font-medium">Confidence</p>
                    <p className="text-green-900 text-xl font-bold">{socialResearch.confidenceScore}%</p>
                  </div>
                </div>

                {/* Found Profiles */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {socialResearch.profiles.map((profile, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getPlatformIcon(profile.platform)}
                          <span className="ml-2 font-medium text-gray-900">{profile.platform}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(profile.confidence)}`}>
                          {profile.confidence}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">@{profile.username}</p>
                      {profile.followers && (
                        <p className="text-xs text-gray-500">{profile.followers.toLocaleString()} followers</p>
                      )}
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs mt-2"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Profile
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Results */}
        {socialResearch && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personality Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                Personality Insights
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Communication Style</h4>
                  <p className="text-gray-600 text-sm">{socialResearch.personalityInsights.communicationStyle}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Professional Demeanor</h4>
                  <p className="text-gray-600 text-sm">{socialResearch.personalityInsights.professionalDemeanor}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {socialResearch.personalityInsights.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Engagement Analytics
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Best Posting Times</h4>
                  <div className="flex flex-wrap gap-2">
                    {socialResearch.engagementMetrics.bestPostingTimes.map((time, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Preferred Content</h4>
                  <div className="space-y-1">
                    {socialResearch.engagementMetrics.preferredContentTypes.map((type, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialResearch;