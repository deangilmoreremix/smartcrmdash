// src/pages/AITools.tsx
import React, { Suspense, lazy, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Lazy imports (match your actual file paths)
const AIAssistantChat = lazy(() => import("../components/aiTools/AIAssistantChat"));
const AutoFormCompleter = lazy(() => import("../components/aiTools/AutoFormCompleter"));
const CallScriptContent = lazy(() => import("../components/aiTools/CallScriptContent"));
const CompetitorAnalysisContent = lazy(() => import("../components/aiTools/CompetitorAnalysisContent"));
const CustomerPersonaContent = lazy(() => import("../components/aiTools/CustomerPersonaContent"));
const DocumentAnalyzerRealtime = lazy(() => import("../components/aiTools/DocumentAnalyzerRealtime"));
const EmailAnalysisContent = lazy(() => import("../components/aiTools/EmailAnalysisContent"));
const EmailComposerContent = lazy(() => import("../components/aiTools/EmailComposerContent"));
const FunctionAssistantContent = lazy(() => import("../components/aiTools/FunctionAssistantContent"));
const ImageGeneratorContent = lazy(() => import("../components/aiTools/ImageGeneratorContent"));
const InstantAIResponseGenerator = lazy(() => import("../components/aiTools/InstantAIResponseGenerator"));
const LiveDealAnalysis = lazy(() => import("../components/aiTools/LiveDealAnalysis"));
const MarketTrendContent = lazy(() => import("../components/aiTools/MarketTrendContent"));
const MeetingAgendaContent = lazy(() => import("../components/aiTools/MeetingAgendaContent"));
const MeetingSummaryContent = lazy(() => import("../components/aiTools/MeetingSummaryContent"));
const ObjectionHandlerContent = lazy(() => import("../components/aiTools/ObjectionHandlerContent"));
const RealTimeEmailComposer = lazy(() => import("../components/aiTools/RealTimeEmailComposer"));
const RealTimeFormValidation = lazy(() => import("../components/aiTools/RealTimeFormValidation"));
const ReasoningObjectionHandler = lazy(() => import("../components/aiTools/ReasoningObjectionHandler"));
const ReasoningProposalGenerator = lazy(() => import("../components/aiTools/ReasoningProposalGenerator"));
const ReasoningScriptGenerator = lazy(() => import("../components/aiTools/ReasoningScriptGenerator"));
const ReasoningSocialContent = lazy(() => import("../components/aiTools/ReasoningSocialContent"));
const SmartSearchRealtime = lazy(() => import("../components/aiTools/SmartSearchRealtime"));
const SocialMediaGenerator = lazy(() => import("../components/aiTools/SocialMediaGenerator"));
const VoiceAnalysisRealtime = lazy(() => import("../components/aiTools/VoiceAnalysisRealtime"));
const VisualContentGeneratorContent = lazy(() => import("../components/aiTools/VisualContentGeneratorContent"));
const ChurnPrediction = lazy(() => import("../components/aiTools/ChurnPrediction"));
const ProposalGenerator = lazy(() => import("../components/aiTools/ProposalGenerator"));
const CallScriptGenerator = lazy(() => import("../components/aiTools/CallScriptGenerator"));
const CompetitorAnalysis = lazy(() => import("../components/aiTools/CompetitorAnalysis"));
const SentimentAnalysis = lazy(() => import("../components/aiTools/SentimentAnalysis"));
const AIUsageStatsPanel = lazy(() => import("../components/aiTools/AIUsageStatsPanel"));
const MarketTrendsAnalysis = lazy(() => import("../components/aiTools/MarketTrendsAnalysis"));

const spinner = (
  <div className="text-center py-10">
    <div className="animate-spin h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
    <p className="mt-3 text-gray-600">Loading AI tool…</p>
  </div>
);

export default function AITools() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selected = params.get("tool");

  const Tool = useMemo(() => {
    switch (selected) {
      case "email-analysis": return EmailAnalysisContent;
      case "meeting-summary": return MeetingSummaryContent;
      case "proposal-generator": return ProposalGenerator;
      case "call-script-generator": return CallScriptGenerator;
      case "objection-handler": return ObjectionHandlerContent;
      case "email-composer-content": return EmailComposerContent;
      case "voice-analysis-realtime": return VoiceAnalysisRealtime;
      case "customer-persona": return CustomerPersonaContent;
      case "visual-content-generator": return VisualContentGeneratorContent;
      case "meeting-agenda": return MeetingAgendaContent;
      case "ai-assistant-chat": return AIAssistantChat;
      case "image-generator-content": return ImageGeneratorContent;
      case "smart-search-realtime": return SmartSearchRealtime;
      case "function-assistant": return FunctionAssistantContent;
      case "document-analyzer-realtime": return DocumentAnalyzerRealtime;
      case "form-validation": return RealTimeFormValidation;
      case "live-deal-analysis": return LiveDealAnalysis;
      case "instant-response": return InstantAIResponseGenerator;
      case "realtime-email-composer": return RealTimeEmailComposer;
      case "reasoning-content-generator": return ReasoningContentGenerator; // make sure file exists if you named it this
      case "reasoning-proposal-generator": return ReasoningProposalGenerator;
      case "reasoning-script-generator": return ReasoningScriptGenerator;
      case "reasoning-objection-handler": return ReasoningObjectionHandler;
      case "reasoning-social-content": return ReasoningSocialContent;
      case "market-trends-analysis": return MarketTrendsAnalysis;
      case "market-trend-content": return MarketTrendContent;
      case "competitor-analysis": return CompetitorAnalysis;
      case "competitor-analysis-content": return CompetitorAnalysisContent;
      case "churn-prediction": return ChurnPrediction;
      case "social-media-generator": return SocialMediaGenerator;
      case "sentiment-analysis": return SentimentAnalysis;
      case "ai-usage-stats-panel": return AIUsageStatsPanel;
      case "auto-form-completer": return AutoFormCompleter;
      case "call-script-content": return CallScriptContent;
      default:
        return null;
    }
  }, [selected]);

  if (Tool) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/ai-tools", { replace: true })}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to AI Tools Hub
          </button>
        </div>
        <div className="container mx-auto px-4 pb-8">
          <Suspense fallback={spinner}>
            <Tool />
          </Suspense>
        </div>
      </div>
    );
    }
  
  // Default “hub” view (show your existing grid/cards here)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AI Tools</h1>
      <p className="text-gray-600">
        Choose a tool from the navbar’s AI dropdown, or add a gallery/grid here.
      </p>
      {/* Optional: list some quick links */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { id: "email-composer-content", label: "Email Composer" },
          { id: "live-deal-analysis", label: "Live Deal Analysis" },
          { id: "smart-search-realtime", label: "Semantic Search (Realtime)" },
        ].map((x) => (
          <button
            key={x.id}
            onClick={() => navigate(`/ai-tools?tool=${x.id}`)}
            className="p-4 rounded-lg border hover:bg-gray-50 text-left"
          >
            {x.label}
          </button>
        ))}
      </div>
    </div>
  );
}
