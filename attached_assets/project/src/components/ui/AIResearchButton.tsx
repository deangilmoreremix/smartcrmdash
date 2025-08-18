import React, { useState } from 'react';
import { ModernButton } from './ModernButton';
import { ContactEnrichmentData, aiEnrichmentService } from '../../services/aiEnrichmentService';
import { 
  Brain, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Globe,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Camera, 
  RefreshCw
} from 'lucide-react';

interface AIResearchButtonProps {
  searchType: 'email' | 'name' | 'linkedin' | 'auto' | 'multimodal';
  searchQuery: {
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    linkedinUrl?: string;
    avatarSrc?: string;
  };
  onDataFound: (data: ContactEnrichmentData) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
  disabled?: boolean;
}

export const AIResearchButton: React.FC<AIResearchButtonProps> = ({
  searchType,
  searchQuery,
  onDataFound,
  className = '',
  variant = 'primary',
  size = 'md',
  showConfidence = true,
  disabled = false
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ContactEnrichmentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isMultimodalSupported] = useState(true); // GPT-5 supports multimodal

  const hasMinimumData = searchQuery.email || searchQuery.firstName || 
                         searchQuery.linkedinUrl || searchQuery.avatarSrc ||
                         (searchQuery.firstName && searchQuery.company);

  // Log available API keys for debugging
  React.useEffect(() => {
    if (disabled) return;
    
    console.log("AI Research Button - Environment variables check:");
    console.log("- VITE_OPENAI_API_KEY present:", !!import.meta.env.VITE_OPENAI_API_KEY);
    console.log("- VITE_GEMINI_API_KEY present:", !!import.meta.env.VITE_GEMINI_API_KEY);
  }, [disabled]);

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    setSearchResults(null);

    console.log('AIResearchButton - starting search', { searchType, searchQuery });

    try {
      let results: ContactEnrichmentData;

      switch (searchType) {
        case 'email':
          if (searchQuery.email) {
            results = await aiEnrichmentService.enrichContactByEmail(searchQuery.email);
          } else {
            throw new Error('Email is required for search');
          }
          break;

        case 'name':
          if (searchQuery.firstName) {
            results = await aiEnrichmentService.enrichContactByName(
              searchQuery.firstName,
              searchQuery.lastName || '',
              searchQuery.company
            );
          } else {
            throw new Error('First name is required for search');
          }
          break;

        case 'linkedin':
          if (searchQuery.linkedinUrl) {
            results = await aiEnrichmentService.enrichContactByLinkedIn(searchQuery.linkedinUrl);
          } else {
            throw new Error('LinkedIn URL is required for search');
          }
          break;

        case 'auto':
          // Auto-detect best search method
          if (searchQuery.email) {
            results = await aiEnrichmentService.enrichContactByEmail(searchQuery.email);
          } else if (searchQuery.firstName) {
            results = await aiEnrichmentService.enrichContactByName(
              searchQuery.firstName,
              searchQuery.lastName || '',
              searchQuery.company
            );
          } else if (searchQuery.linkedinUrl) {
            results = await aiEnrichmentService.enrichContactByLinkedIn(searchQuery.linkedinUrl);
          } else {
            throw new Error('Insufficient search parameters');
          }
          break;
          
        case 'multimodal':
          if (searchQuery.avatarSrc) {
            const contact = {
              name: `${searchQuery.firstName || ''} ${searchQuery.lastName || ''}`.trim(),
              firstName: searchQuery.firstName,
              lastName: searchQuery.lastName,
              company: searchQuery.company,
              email: searchQuery.email
            };
            results = await aiEnrichmentService.enrichContactMultimodal(contact, searchQuery.avatarSrc);
          } else {
            throw new Error('Avatar image URL is required for multimodal search');
          }
          break;

        default:
          throw new Error('Invalid search type');
      }

      // Check if we got valid results with more than just a confidence score
      const hasRealData = results && Object.keys(results).length > 2;
      
      console.log('AIResearchButton - search results:', { 
        hasRealData, 
        resultKeys: Object.keys(results || {})
      });
      
      if (hasRealData) {
        setSearchResults(results);
        setShowPreview(true);
      } else {
        setError('No meaningful information found. Try with more specific details.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyResults = () => {
    if (searchResults) {
      onDataFound(searchResults);
      setShowPreview(false);
      setSearchResults(null);
    }
  };

  const handleFindImage = async () => {
    if (!searchResults) return;
    
    try {
      const imageUrl = await aiEnrichmentService.findContactImage(
        searchResults.name || `${searchResults.firstName} ${searchResults.lastName}`,
        searchResults.company
      );
      
      setSearchResults(prev => prev ? { ...prev, avatar: imageUrl } : null);
    } catch (err) {
      console.error('Failed to find image:', err);
    }
  };

  const getButtonLabel = () => {
    if (isSearching) return 'Researching...';
    
    switch (searchType) {
      case 'email':
        return 'Research by Email';
      case 'name':
        return 'Research by Name';
      case 'linkedin':
        return 'Research LinkedIn';
      case 'auto':
        return 'AI Auto-Research';
      case 'multimodal':
        return 'Multimodal Analysis';
      default:
        return 'AI Research';
    }
  };

  const getButtonIcon = () => {
    if (isSearching) return Loader2;
    if (searchType === 'auto') return Brain;
    if (searchType === 'multimodal') return Camera;
    return Search;
  };

  const ButtonIcon = getButtonIcon();

  // Check if any API keys are configured
  const noApiKeysConfigured = !import.meta.env.VITE_OPENAI_API_KEY && !import.meta.env.VITE_GEMINI_API_KEY;

  // Only show warning in development mode
  const showApiWarning = noApiKeysConfigured && import.meta.env.DEV;

  return (
    <div className="relative">
      {/* Main Research Button */}
      <ModernButton
        variant={variant}
        size={size}
        onClick={handleSearch}
        disabled={isSearching || disabled || !hasMinimumData || noApiKeysConfigured}
        className={`flex items-center space-x-2 ${className}`}
      >
        <ButtonIcon className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
        <span>{getButtonLabel()}</span>
        {searchType === 'auto' && <Sparkles className="w-3 h-3 text-yellow-400" />}
      </ModernButton>

      {/* API Key Configuration Warning */}
      {showApiWarning && (
        <div className="mt-1 text-xs text-yellow-600">
          No AI API keys configured. Set up OpenAI or Gemini keys for full functionality.
        </div>
      )}

      {!hasMinimumData && !disabled && !noApiKeysConfigured && (
        <div className="mt-1 text-xs text-gray-500">
          Enter email, name, or LinkedIn URL
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-10 min-w-72">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results Preview */}
      {showPreview && searchResults && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-96 max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Contact Found
            </h4>
            {showConfidence && searchResults.confidence && (
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${searchResults.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{searchResults.confidence}%</span>
              </div>
            )}
          </div>

          {/* Avatar */}
          {searchResults.avatar && (
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <img
                  src={searchResults.avatar}
                  alt="Contact Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <button
                  onClick={handleFindImage}
                  className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Contact Info Preview */}
          <div className="space-y-3 mb-4">
            {searchResults.name && (
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">{searchResults.name}</span>
              </div>
            )}
            
            {searchResults.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">{searchResults.email}</span>
              </div>
            )}
            
            {searchResults.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">{searchResults.phone}</span>
              </div>
            )}
            
            {searchResults.company && (
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-purple-500" />
                <span className="text-gray-700">{searchResults.company}</span>
                {searchResults.title && <span className="text-gray-500">• {searchResults.title}</span>}
              </div>
            )}

            {searchResults.location && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-gray-700">
                  {searchResults.location.city}, {searchResults.location.state}, {searchResults.location.country}
                </span>
              </div>
            )}

            {searchResults.socialProfiles?.linkedin && (
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <a 
                  href={searchResults.socialProfiles.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>

          {/* Bio */}
          {searchResults.bio && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{searchResults.bio}</p>
            </div>
          )}

          {/* Notes */}
          {searchResults.notes && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-sm text-yellow-800">{searchResults.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <ModernButton
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(false)}
            >
              Cancel
            </ModernButton>
            <ModernButton
              variant="primary"
              size="sm"
              onClick={handleApplyResults}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply to Form</span>
            </ModernButton>
          </div>
        </div>
      )}
    </div>
  );
};