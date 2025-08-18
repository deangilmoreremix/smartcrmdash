import React, { useState, useCallback } from 'react';
import { AvatarWithStatus } from '../ui/AvatarWithStatus';
import { Contact } from '../../types/contact';
import { 
  Edit, 
  AlertCircle,
  Loader2,
  MoreHorizontal, 
  Mail, 
  Phone, 
  User, 
  BarChart, 
  ThumbsUp, 
  ThumbsDown,
  ExternalLink,
  Star,
  Brain,
  Sparkles,
  Target,
  Zap,
  Camera,
  MessageSquare
} from 'lucide-react';

interface AIEnhancedContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onAnalyze?: (contact: Contact) => Promise<boolean>;
  isAnalyzing?: boolean;
}

const interestColors = {
  hot: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
  cold: 'bg-gray-400'
};

const interestLabels = {
  hot: 'Hot Client',
  medium: 'Medium Interest',
  low: 'Low Interest',
  cold: 'Non Interest'
};

const sourceColors: { [key: string]: string } = {
  'LinkedIn': 'bg-blue-600',
  'Facebook': 'bg-blue-500',
  'Email': 'bg-green-500',
  'Website': 'bg-purple-500',
  'Referral': 'bg-orange-500',
  'Typeform': 'bg-pink-500',
  'Cold Call': 'bg-gray-600'
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const AIEnhancedContactCard: React.FC<AIEnhancedContactCardProps> = ({
  contact,
  isSelected,
  onSelect,
  onClick,
  onAnalyze,
  isAnalyzing = false
}) => {
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!onAnalyze || isAnalyzingLocal) return;
    
    setIsAnalyzingLocal(true);
    try {
      await onAnalyze(contact);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzingLocal(false);
    }
  }, [onAnalyze, contact, isAnalyzingLocal]);

  const score = contact.aiScore || contact.score || 0;
  const analyzing = isAnalyzing || isAnalyzingLocal;

  return (
    <div 
      className={`relative group bg-white border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Analysis indicator */}
      {analyzing && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyzing</span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Avatar and basic info */}
        <div className="flex items-start space-x-3 mt-4">
          <AvatarWithStatus 
            src={contact.avatarSrc || contact.avatar} 
            name={contact.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
            {contact.position && contact.company && (
              <p className="text-sm text-gray-600 truncate">
                {contact.position} at {contact.company}
              </p>
            )}
            {contact.industry && (
              <p className="text-xs text-gray-500 mt-1">{contact.industry}</p>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{contact.phone}</span>
            </div>
          )}
        </div>

        {/* Status badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* AI Score */}
            {score > 0 && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getScoreColor(score)}`}>
                <Target className="w-3 h-3" />
                <span>{score}</span>
              </div>
            )}

            {/* Interest Level */}
            {contact.interestLevel && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${interestColors[contact.interestLevel as keyof typeof interestColors]}`}>
                {interestLabels[contact.interestLevel as keyof typeof interestLabels]}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onAnalyze && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnalyze();
                }}
                disabled={analyzing}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="AI Analysis"
              >
                <Brain className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`mailto:${contact.email}`, '_blank');
              }}
              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Source indicator */}
        {(contact.source || (contact.sources && contact.sources.length > 0)) && (
          <div className="flex items-center space-x-1">
            {(contact.sources || [contact.source]).filter(Boolean).slice(0, 3).map((source, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded text-xs font-medium text-white ${sourceColors[source as string] || 'bg-gray-500'}`}
              >
                {source}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contact.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                +{contact.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500 capitalize">{contact.status}</span>
          {contact.lastContact && (
            <span className="text-xs text-gray-500">
              Last contact: {new Date(contact.lastContact).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 pointer-events-none" />
    </div>
  );
};