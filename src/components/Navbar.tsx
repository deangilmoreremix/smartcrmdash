// --- inside src/components/Navbar.tsx ---
// add (or merge) these imports with your existing lucide-react imports
import {
  Mail, Brain, BarChart3, Shield, Volume2, Image, Search as SearchIcon, Zap, Calendar,
  MessageSquare, FileText, Phone, Users
} from "lucide-react";

// ...inside the component, near your other arrays...
type AIFeature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  id: string;          // this is the tool id we pass to AITools
  categories: string[];
  new?: boolean;
  demoId?: string;
};

const aiFeatures: AIFeature[] = [
  { title: "Email Analysis", description: "Analyze email tone, clarity, and intent", icon: Mail, id: "email-analysis", categories: ["email"] },
  { title: "Meeting Summarizer", description: "Summarize meetings instantly", icon: Calendar, id: "meeting-summary", categories: ["meetings"] },
  { title: "Proposal Generator", description: "Generate complete proposals", icon: FileText, id: "proposal-generator", categories: ["docs"] },
  { title: "Call Script Generator", description: "Craft effective call scripts", icon: Phone, id: "call-script-generator", categories: ["calls"] },
  { title: "Objection Handler", description: "Handle objections with AI help", icon: Shield, id: "objection-handler", categories: ["sales"] },
  { title: "Email Composer", description: "Compose personalized emails fast", icon: Mail, id: "email-composer-content", categories: ["email"], new: true },
  { title: "Voice Analysis (Realtime)", description: "Live voice analytics", icon: Volume2, id: "voice-analysis-realtime", categories: ["realtime", "voice"] },
  { title: "Customer Persona", description: "Generate target personas", icon: Users, id: "customer-persona", categories: ["research"] },
  { title: "Visual Content Generator", description: "Create visuals with prompts", icon: Image, id: "visual-content-generator", categories: ["content"] },
  { title: "Meeting Agenda", description: "Plan meetings in seconds", icon: Calendar, id: "meeting-agenda", categories: ["meetings"] },
  { title: "AI Assistant Chat", description: "Persistent assistant chat", icon: Brain, id: "ai-assistant-chat", categories: ["assistant"], new: true },
  { title: "Image Generator (Tool)", description: "Generate images on demand", icon: Image, id: "image-generator-content", categories: ["content"] },
  { title: "Semantic Search (Realtime)", description: "Smart across-CRM search", icon: SearchIcon, id: "smart-search-realtime", categories: ["search", "realtime"] },
  { title: "Function Assistant", description: "Trigger functions via AI", icon: Zap, id: "function-assistant", categories: ["dev"] },
  { title: "Document Analyzer (Realtime)", description: "Analyze docs live", icon: FileText, id: "document-analyzer-realtime", categories: ["docs", "realtime"] },
  { title: "Form Validation (Realtime)", description: "Validate as you type", icon: Zap, id: "form-validation", categories: ["forms", "realtime"] },
  { title: "Live Deal Analysis", description: "Real-time deal insights", icon: BarChart3, id: "live-deal-analysis", categories: ["sales", "realtime"], new: true },
  { title: "Instant AI Response", description: "Quick, high-quality replies", icon: Zap, id: "instant-response", categories: ["assist"] },
  { title: "Real-time Email Composer", description: "Compose in real time", icon: Mail, id: "realtime-email-composer", categories: ["email", "realtime"] },
  { title: "Reasoning: Content", description: "Advanced content creation", icon: Brain, id: "reasoning-content-generator", categories: ["reasoning"] },
  { title: "Reasoning: Proposal", description: "Complex proposal planning", icon: Brain, id: "reasoning-proposal-generator", categories: ["reasoning"] },
  { title: "Reasoning: Script", description: "Script with long-chain logic", icon: Brain, id: "reasoning-script-generator", categories: ["reasoning"] },
  { title: "Reasoning: Objection", description: "Handle nuanced objections", icon: Brain, id: "reasoning-objection-handler", categories: ["reasoning"] },
  { title: "Reasoning: Social", description: "On-brand social content", icon: Brain, id: "reasoning-social-content", categories: ["reasoning"] },
  { title: "Market Trends (Hub)", description: "Explore market trends (hub)", icon: BarChart3, id: "market-trends-analysis", categories: ["research"] },
  { title: "Market Trend (Single)", description: "Drill into a single trend", icon: BarChart3, id: "market-trend-content", categories: ["research"] },
  { title: "Competitor Analysis (Hub)", description: "Compare competitors (hub)", icon: Shield, id: "competitor-analysis", categories: ["research"] },
  { title: "Competitor Analysis (Single)", description: "Deep dive competitor", icon: Shield, id: "competitor-analysis-content", categories: ["research"] },
  { title: "Churn Prediction", description: "Predict churn risk", icon: BarChart3, id: "churn-prediction", categories: ["analysis"] },
  { title: "Social Media Generator", description: "Generate posts & ideas", icon: MessageSquare, id: "social-media-generator", categories: ["content"] },
  { title: "Sentiment Analysis", description: "Sentiment at a glance", icon: BarChart3, id: "sentiment-analysis", categories: ["analysis"] },
  { title: "AI Usage Stats", description: "Usage & performance metrics", icon: BarChart3, id: "ai-usage-stats-panel", categories: ["admin"] },
  { title: "Auto Form Completer", description: "Fill forms with AI", icon: Zap, id: "auto-form-completer", categories: ["forms"] },
];

// update your handler to use ids and route
const handleAIToolClick = useCallback((toolId: string) => {
  // navigate to the tools hub with a query param
  navigate(`/ai-tools?tool=${encodeURIComponent(toolId)}`);
  // also notify your existing tool context (if used elsewhere)
  openAITool?.(toolId);
  setActiveDropdown(null);
  setIsMobileMenuOpen(false);
}, [navigate, openAITool]);

// ...in your AI dropdown render, replace the list with aiFeatures...
// Example (inside the dropdown content for "ai-categories"):
<div className="p-3">
  <div className="mb-2">
    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Tools</h3>
  </div>
  <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
    {aiFeatures.map((tool) => (
      <button
        key={tool.id}
        onClick={() => handleAIToolClick(tool.id)}
        className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
          isDark ? 'hover:bg-white/5 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
        }`}
      >
        <tool.icon size={16} className="shrink-0" />
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">
            {tool.title} {tool.new && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-pink-500 text-white">NEW</span>}
          </div>
          <div className="text-xs text-gray-500 truncate">{tool.description}</div>
        </div>
      </button>
    ))}
  </div>
  <button
    onClick={() => handleNavigation('/ai-tools', 'ai-tools')}
    className={`w-full mt-3 py-2 px-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
      isDark ? 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white' : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
    }`}
  >
    <span className="text-sm font-medium">View All AI Tools</span>
  </button>
</div>
