import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { 
  Mail, MessageSquare, Image, Phone, Users, Calendar, 
  TrendingUp, Bot, Search, FileText, Lightbulb, Target,
  BarChart3, Brain, Zap, Eye, PieChart
} from 'lucide-react';

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
import AIToolModal from './shared/AIToolModal';

export type AIToolType = 
  | 'email-analysis' | 'email-composer' | 'image-generator' | 'call-script' 
  | 'customer-persona' | 'meeting-agenda' | 'market-trends' | 'streaming-chat'
  | 'smart-search' | 'meeting-summary' | 'objection-handler' | 'deal-analysis'
  | 'sentiment-analysis' | 'competitor-analysis' | 'social-media' | 'voice-analysis'
  | 'churn-prediction';

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
}

const AIToolsContext = createContext<AIToolsContextType | undefined>(undefined);

export const useAITools = () => {
  const context = useContext(AIToolsContext);
  if (!context) {
    throw new Error('useAITools must be used within an AIToolsProvider');
  }
  return context;
};

// Tool mapping with component information
const getToolInfo = (toolType: AIToolType): AIToolInfo => {
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
    isToolOpen
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