import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { 
  Mail, MessageSquare, Image, Phone, Users, Calendar, 
  TrendingUp, Bot, Search, FileText, Lightbulb, Target,
  BarChart3, Brain, Zap, Eye, PieChart
} from 'lucide-react';
import AIToolModal from './shared/AIToolModal';

// Import AI tool components
import EmailAnalysisContent from './aiTools/EmailAnalysisContent';
import EmailComposerContent from './aiTools/EmailComposerContent';
import ImageGeneratorContent from './aiTools/ImageGeneratorContent';
import CallScriptContent from './aiTools/CallScriptContent';
import CustomerPersonaContent from './aiTools/CustomerPersonaContent';
import MeetingAgendaContent from './aiTools/MeetingAgendaContent';
import MarketTrendContent from './aiTools/MarketTrendContent';
import StreamingChat from './aiTools/StreamingChat';
import SmartSearchRealtime from './aiTools/SmartSearchRealtime';
import MeetingSummaryContent from './aiTools/MeetingSummaryContent';
import ObjectionHandlerContent from './aiTools/ObjectionHandlerContent';
import LiveDealAnalysis from './aiTools/LiveDealAnalysis';
import SentimentAnalysis from './aiTools/SentimentAnalysis';
import CompetitorAnalysisContent from './aiTools/CompetitorAnalysisContent';
import SocialMediaGenerator from './aiTools/SocialMediaGenerator';
import VoiceAnalysisRealtime from './aiTools/VoiceAnalysisRealtime';
import ChurnPrediction from './aiTools/ChurnPrediction';

export type AIToolType = 
  | 'email-analysis' | 'email-composer' | 'image-generator' | 'call-script' 
  | 'customer-persona' | 'meeting-agenda' | 'market-trends' | 'streaming-chat'
  | 'smart-search' | 'meeting-summary' | 'objection-handler' | 'deal-analysis'
  | 'sentiment-analysis' | 'competitor-analysis' | 'social-media' | 'voice-analysis'
  | 'churn-prediction' | 'proposal-generator' | 'subject-optimizer' | 'sales-insights'
  | 'sales-forecast' | 'voice-tone-optimizer' | 'email-response' | 'visual-content-generator'
  | 'ai-assistant' | 'vision-analyzer' | 'semantic-search' | 'real-time-chat'
  | 'form-validation' | 'live-deal-analysis' | 'instant-response' | 'document-analyzer'
  | 'realtime-email' | 'voice-analysis-realtime' | 'smart-search-realtime' | 'auto-form'
  | 'ai-usage-stats' | 'auto-form-completer';

interface AIToolInfo {
  title: string;
  icon: ReactNode;
  component: React.ComponentType;
}

interface AIToolsContextType {
  openTool: (toolName: AIToolType) => void;
  closeTool: () => void;
  currentTool: AIToolType | null;
  isToolOpen: boolean;
  getToolInfo: (toolType: AIToolType) => AIToolInfo;
}

const AIToolsContext = createContext<AIToolsContextType | undefined>(undefined);

export const useAITools = () => {
  const context = useContext(AIToolsContext);
  if (!context) {
    throw new Error('useAITools must be used within an AIToolsProvider');
  }
  return context;
};

// Placeholder component for tools that don't exist yet
const PlaceholderTool: React.ComponentType<{ title: string }> = ({ title }) => (
  <div className="text-center py-16">
    <Brain className="h-16 w-16 mx-auto text-gray-300 mb-4" />
    <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500">This AI tool is coming soon.</p>
  </div>
);

// Tool mapping with component information
export const getToolInfo = (toolType: AIToolType): AIToolInfo => {
  const toolMap: Record<AIToolType, AIToolInfo> = {
    'email-analysis': {
      title: 'Email Analysis',
      icon: <Mail size={20} />,
      component: EmailAnalysisContent
    },
    'email-composer': {
      title: 'Email Composer',
      icon: <FileText size={20} />,
      component: EmailComposerContent
    },
    'image-generator': {
      title: 'AI Image Generator',
      icon: <Image size={20} />,
      component: ImageGeneratorContent
    },
    'call-script': {
      title: 'Call Script Generator',
      icon: <Phone size={20} />,
      component: CallScriptContent
    },
    'customer-persona': {
      title: 'Customer Persona',
      icon: <Users size={20} />,
      component: CustomerPersonaContent
    },
    'meeting-agenda': {
      title: 'Meeting Agenda',
      icon: <Calendar size={20} />,
      component: MeetingAgendaContent
    },
    'market-trends': {
      title: 'Market Trends',
      icon: <TrendingUp size={20} />,
      component: MarketTrendContent
    },
    'streaming-chat': {
      title: 'AI Assistant Chat',
      icon: <Bot size={20} />,
      component: StreamingChat
    },
    'smart-search': {
      title: 'Smart Search',
      icon: <Search size={20} />,
      component: SmartSearchRealtime
    },
    'meeting-summary': {
      title: 'Meeting Summary',
      icon: <FileText size={20} />,
      component: MeetingSummaryContent
    },
    'objection-handler': {
      title: 'Objection Handler',
      icon: <Lightbulb size={20} />,
      component: ObjectionHandlerContent
    },
    'deal-analysis': {
      title: 'Deal Analysis',
      icon: <Target size={20} />,
      component: LiveDealAnalysis
    },
    'sentiment-analysis': {
      title: 'Sentiment Analysis',
      icon: <BarChart3 size={20} />,
      component: SentimentAnalysis
    },
    'competitor-analysis': {
      title: 'Competitor Analysis',
      icon: <Eye size={20} />,
      component: CompetitorAnalysisContent
    },
    'social-media': {
      title: 'Social Media Generator',
      icon: <MessageSquare size={20} />,
      component: SocialMediaGenerator
    },
    'voice-analysis': {
      title: 'Voice Analysis',
      icon: <Brain size={20} />,
      component: VoiceAnalysisRealtime
    },
    'churn-prediction': {
      title: 'Churn Prediction',
      icon: <PieChart size={20} />,
      component: ChurnPrediction
    },
    // Additional tools with placeholder components
    'proposal-generator': {
      title: 'Proposal Generator',
      icon: <FileText size={20} />,
      component: () => <PlaceholderTool title="Proposal Generator" />
    },
    'subject-optimizer': {
      title: 'Subject Line Optimizer',
      icon: <Mail size={20} />,
      component: () => <PlaceholderTool title="Subject Line Optimizer" />
    },
    'sales-insights': {
      title: 'Sales Insights',
      icon: <TrendingUp size={20} />,
      component: () => <PlaceholderTool title="Sales Insights" />
    },
    'sales-forecast': {
      title: 'Sales Forecast',
      icon: <BarChart3 size={20} />,
      component: () => <PlaceholderTool title="Sales Forecast" />
    },
    'voice-tone-optimizer': {
      title: 'Voice Tone Optimizer',
      icon: <Brain size={20} />,
      component: () => <PlaceholderTool title="Voice Tone Optimizer" />
    },
    'email-response': {
      title: 'Email Response Generator',
      icon: <Mail size={20} />,
      component: () => <PlaceholderTool title="Email Response Generator" />
    },
    'visual-content-generator': {
      title: 'Visual Content Generator',
      icon: <Image size={20} />,
      component: () => <PlaceholderTool title="Visual Content Generator" />
    },
    'ai-assistant': {
      title: 'AI Assistant',
      icon: <Bot size={20} />,
      component: () => <PlaceholderTool title="AI Assistant" />
    },
    'vision-analyzer': {
      title: 'Vision Analyzer',
      icon: <Eye size={20} />,
      component: () => <PlaceholderTool title="Vision Analyzer" />
    },
    'semantic-search': {
      title: 'Semantic Search',
      icon: <Search size={20} />,
      component: () => <PlaceholderTool title="Semantic Search" />
    },
    'real-time-chat': {
      title: 'Real-time Chat',
      icon: <MessageSquare size={20} />,
      component: () => <PlaceholderTool title="Real-time Chat" />
    },
    'form-validation': {
      title: 'Form Validation',
      icon: <FileText size={20} />,
      component: () => <PlaceholderTool title="Form Validation" />
    },
    'live-deal-analysis': {
      title: 'Live Deal Analysis',
      icon: <Target size={20} />,
      component: LiveDealAnalysis
    },
    'instant-response': {
      title: 'Instant Response',
      icon: <Zap size={20} />,
      component: () => <PlaceholderTool title="Instant Response" />
    },
    'document-analyzer': {
      title: 'Document Analyzer',
      icon: <FileText size={20} />,
      component: () => <PlaceholderTool title="Document Analyzer" />
    },
    'realtime-email': {
      title: 'Real-time Email',
      icon: <Mail size={20} />,
      component: () => <PlaceholderTool title="Real-time Email" />
    },
    'voice-analysis-realtime': {
      title: 'Voice Analysis Real-time',
      icon: <Brain size={20} />,
      component: VoiceAnalysisRealtime
    },
    'smart-search-realtime': {
      title: 'Smart Search Real-time',
      icon: <Search size={20} />,
      component: SmartSearchRealtime
    },
    'auto-form': {
      title: 'Auto Form',
      icon: <FileText size={20} />,
      component: () => <PlaceholderTool title="Auto Form" />
    },
    'ai-usage-stats': {
      title: 'AI Usage Stats',
      icon: <BarChart3 size={20} />,
      component: () => <PlaceholderTool title="AI Usage Stats" />
    },
    'auto-form-completer': {
      title: 'Auto Form Completer',
      icon: <FileText size={20} />,
      component: () => <PlaceholderTool title="Auto Form Completer" />
    }
  };

  return toolMap[toolType];
};

export const AIToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTool, setCurrentTool] = useState<AIToolType | null>(null);
  const [isToolOpen, setIsToolOpen] = useState(false);

  const openTool = useCallback((toolName: AIToolType) => {
    setCurrentTool(toolName);
    setIsToolOpen(true);
  }, []);

  const closeTool = useCallback(() => {
    setCurrentTool(null);
    setIsToolOpen(false);
  }, []);

  const contextValue = useMemo(() => ({
    openTool,
    closeTool,
    currentTool,
    isToolOpen,
    getToolInfo
  }), [openTool, closeTool, currentTool, isToolOpen]);

  // Get current tool info and component
  const currentToolInfo = currentTool ? getToolInfo(currentTool) : null;
  const CurrentToolComponent = currentToolInfo?.component;

  return (
    <AIToolsContext.Provider value={contextValue}>
      {children}
      
      {/* Global AI Tool Modal */}
      {currentToolInfo && CurrentToolComponent && (
        <AIToolModal
          isOpen={isToolOpen}
          onClose={closeTool}
          title={currentToolInfo.title}
          icon={currentToolInfo.icon}
        >
          <CurrentToolComponent />
        </AIToolModal>
      )}
    </AIToolsContext.Provider>
  );
};