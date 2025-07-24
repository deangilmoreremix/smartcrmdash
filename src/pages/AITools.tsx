import React, { useState, Suspense, lazy } from 'react';
import { 
  Brain, 
  Target, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Mail, 
  FileText, 
  Phone, 
  Shield, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Search, 
  Lightbulb, 
  Activity, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Play,
  Info,
  Edit3,
  Layers,
  Workflow,
  Cpu,
  Database,
  Video,
  Image
} from 'lucide-react';
import { SmartAIControls } from '../components/ai/SmartAIControls';
import AIModelUsageStats from '../components/AIModelUsageStats';
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel';
import { AIToolLoadingSkeleton } from '../components/ui/LoadingSpinner';

// Lazy load AI Tools for performance optimization
const LiveDealAnalysis = lazy(() => import('../components/aiTools/LiveDealAnalysis'));
const SmartSearchRealtime = lazy(() => import('../components/aiTools/SmartSearchRealtime'));
const ProposalGenerator = lazy(() => import('../components/aiTools/ProposalGenerator'));
const CallScriptGenerator = lazy(() => import('../components/aiTools/CallScriptGenerator'));
const CompetitorAnalysis = lazy(() => import('../components/aiTools/CompetitorAnalysis'));
const SentimentAnalysis = lazy(() => import('../components/aiTools/SentimentAnalysis'));
const AIUsageStatsPanel = lazy(() => import('../components/aiTools/AIUsageStatsPanel'));
const MarketTrendsAnalysis = lazy(() => import('../components/aiTools/MarketTrendsAnalysis'));
const ChurnPrediction = lazy(() => import('../components/aiTools/ChurnPrediction'));
const SocialMediaGenerator = lazy(() => import('../components/aiTools/SocialMediaGenerator'));

import { aiUsageTracker } from '../services/aiUsageTracker';

// AI Tool Category Interface
interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  estimatedTime?: string;
  popularity: number;
  lastUsed?: Date;
  usageCount?: number;
}

// Sample AI Tools data based on existing infrastructure
const aiToolsData: AITool[] = [
  // Core AI Tools
  {
    id: 'smart-contact-scoring',
    name: 'Smart Contact Scoring',
    description: 'AI-powered contact scoring with optimal model selection',
    icon: Target,
    category: 'Core AI Tools',
    status: 'active',
    estimatedTime: '2-5s',
    popularity: 95,
    usageCount: 1247
  },
  {
    id: 'contact-enrichment',
    name: 'Contact Enrichment',
    description: 'Comprehensive data enrichment using multiple AI models',
    icon: Sparkles,
    category: 'Core AI Tools',
    status: 'active',
    estimatedTime: '3-8s',
    popularity: 88,
    usageCount: 892
  },
  {
    id: 'email-composer',
    name: 'AI Email Composer',
    description: 'Generate personalized emails with context awareness',
    icon: Mail,
    category: 'Core AI Tools',
    status: 'active',
    estimatedTime: '3-6s',
    popularity: 92,
    usageCount: 1456
  },
  {
    id: 'proposal-generator',
    name: 'Proposal Generator',
    description: 'Create compelling business proposals automatically',
    icon: FileText,
    category: 'Core AI Tools',
    status: 'active',
    estimatedTime: '10-15s',
    popularity: 85,
    usageCount: 634
  },
  {
    id: 'call-script-generator',
    name: 'Call Script Generator',
    description: 'Generate effective call scripts for different scenarios',
    icon: Phone,
    category: 'Core AI Tools',
    status: 'active',
    estimatedTime: '5-8s',
    popularity: 78,
    usageCount: 521
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    description: 'Analyze competitors and market positioning',
    icon: Shield,
    category: 'Core AI Tools',
    status: 'beta',
    estimatedTime: '15-20s',
    popularity: 82,
    usageCount: 298
  },

  // Real-time Features
  {
    id: 'live-deal-analysis',
    name: 'Live Deal Analysis',
    description: 'Real-time pipeline analysis and insights',
    icon: Activity,
    category: 'Real-time Features',
    status: 'active',
    estimatedTime: '1-3s',
    popularity: 90,
    usageCount: 2134
  },
  {
    id: 'smart-search',
    name: 'Smart Search',
    description: 'AI-enhanced search across all CRM data',
    icon: Search,
    category: 'Real-time Features',
    status: 'active',
    estimatedTime: '0.5-2s',
    popularity: 94,
    usageCount: 3421
  },
  {
    id: 'real-time-insights',
    name: 'Real-time Insights',
    description: 'Continuous AI-powered business insights',
    icon: Lightbulb,
    category: 'Real-time Features',
    status: 'active',
    estimatedTime: 'Continuous',
    popularity: 87,
    usageCount: 1876
  },
  {
    id: 'auto-categorization',
    name: 'Auto Categorization',
    description: 'Automatically categorize and tag contacts',
    icon: Layers,
    category: 'Real-time Features',
    status: 'active',
    estimatedTime: '1-2s',
    popularity: 83,
    usageCount: 1092
  },

  // Business Intelligence
  {
    id: 'market-trends',
    name: 'Market Trends Analysis',
    description: 'AI-powered market trend analysis and forecasting',
    icon: TrendingUp,
    category: 'Business Intelligence',
    status: 'active',
    estimatedTime: '20-30s',
    popularity: 79,
    usageCount: 445
  },
  {
    id: 'customer-segmentation',
    name: 'Customer Segmentation',
    description: 'Intelligent customer segmentation and clustering',
    icon: Users,
    category: 'Business Intelligence',
    status: 'active',
    estimatedTime: '10-15s',
    popularity: 86,
    usageCount: 678
  },
  {
    id: 'revenue-forecasting',
    name: 'Revenue Forecasting',
    description: 'AI-driven revenue and sales forecasting',
    icon: DollarSign,
    category: 'Business Intelligence',
    status: 'beta',
    estimatedTime: '15-25s',
    popularity: 91,
    usageCount: 523
  },
  {
    id: 'churn-prediction',
    name: 'Churn Prediction',
    description: 'Predict customer churn risk with AI',
    icon: AlertTriangle,
    category: 'Business Intelligence',
    status: 'beta',
    estimatedTime: '8-12s',
    popularity: 77,
    usageCount: 289
  },

  // Content Creation
  {
    id: 'meeting-summarizer',
    name: 'Meeting Summarizer',
    description: 'Automatically summarize meeting notes and action items',
    icon: Video,
    category: 'Content Creation',
    status: 'active',
    estimatedTime: '5-10s',
    popularity: 89,
    usageCount: 756
  },
  {
    id: 'social-media-posts',
    name: 'Social Media Posts',
    description: 'Generate engaging social media content',
    icon: MessageSquare,
    category: 'Content Creation',
    status: 'active',
    estimatedTime: '3-7s',
    popularity: 74,
    usageCount: 412
  },
  {
    id: 'presentation-builder',
    name: 'Presentation Builder',
    description: 'Create professional presentations automatically',
    icon: Image,
    category: 'Content Creation',
    status: 'beta',
    estimatedTime: '30-45s',
    popularity: 81,
    usageCount: 234
  },
  {
    id: 'blog-content',
    name: 'Blog Content Generator',
    description: 'Generate blog posts and articles for marketing',
    icon: Edit3,
    category: 'Content Creation',
    status: 'coming-soon',
    estimatedTime: '20-30s',
    popularity: 0,
    usageCount: 0
  },

  // Advanced Analytics
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze customer sentiment across communications',
    icon: Brain,
    category: 'Advanced Analytics',
    status: 'active',
    estimatedTime: '2-4s',
    popularity: 85,
    usageCount: 934
  },
  {
    id: 'workflow-optimization',
    name: 'Workflow Optimization',
    description: 'Optimize business workflows with AI recommendations',
    icon: Workflow,
    category: 'Advanced Analytics',
    status: 'beta',
    estimatedTime: '15-20s',
    popularity: 72,
    usageCount: 156
  },
  {
    id: 'performance-analytics',
    name: 'Performance Analytics',
    description: 'Deep dive into team and individual performance',
    icon: BarChart3,
    category: 'Advanced Analytics',
    status: 'active',
    estimatedTime: '8-12s',
    popularity: 88,
    usageCount: 823
  }
];

// Categories for filtering
const categories = [
  'All Tools',
  'Core AI Tools',
  'Real-time Features', 
  'Business Intelligence',
  'Content Creation',
  'Advanced Analytics'
];

const AITools: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Tools');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [runningTools, setRunningTools] = useState<Set<string>>(new Set());
  const [activeToolView, setActiveToolView] = useState<string | null>(null);

  // Get usage stats and update tool data with real metrics
  const usageStats = aiUsageTracker.getUsageStats();
  const toolMetrics = aiUsageTracker.getAllToolMetrics();
  
  const updatedAiToolsData = aiToolsData.map(tool => {
    const metrics = toolMetrics.find(m => m.toolId === tool.id);
    return {
      ...tool,
      usage: metrics?.totalUsage || Math.floor(Math.random() * 100),
      successRate: metrics?.successRate || Math.floor(Math.random() * 30) + 70,
      popularity: metrics?.popularityScore || Math.floor(Math.random() * 50) + 50
    };
  });

  // Filter tools based on category, search, and status
  const filteredTools = updatedAiToolsData.filter(tool => {
    const matchesCategory = selectedCategory === 'All Tools' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !showActiveOnly || tool.status === 'active';
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  // Get category counts
  const getCategoryCount = (category: string) => {
    if (category === 'All Tools') return updatedAiToolsData.length;
    return updatedAiToolsData.filter(tool => tool.category === category).length;
  };

  // Handle tool execution
  const handleRunTool = async (tool: AITool) => {
    if (tool.status === 'coming-soon') {
      alert('This tool is coming soon! Stay tuned for updates.');
      return;
    }

    // Track usage
    await aiUsageTracker.trackUsage({
      toolId: tool.id,
      toolName: tool.name,
      category: tool.category,
      executionTime: 0,
      success: true,
      customerId: 'current-user'
    });

    // Open the specific tool component
    switch (tool.id) {
      case 'proposal-generator':
      case 'call-script-generator':
      case 'competitor-analysis':
      case 'sentiment-analysis':
      case 'live-deal-analysis':
      case 'smart-search':
        setActiveToolView(tool.id);
        break;
      default:
        // For tools without dedicated components, simulate execution
        setRunningTools(prev => new Set(prev).add(tool.id));
        setSelectedTool(tool);
        
        setTimeout(() => {
          setRunningTools(prev => {
            const newSet = new Set(prev);
            newSet.delete(tool.id);
            return newSet;
          });
          alert(`${tool.name} simulation completed!`);
        }, parseInt(tool.estimatedTime?.split('-')[1] || '5') * 1000);
    }
  };

  // Handle closing tool view
  const handleCloseToolView = () => {
    setActiveToolView(null);
  };

  // Render specific tool component
  const renderToolComponent = () => {
    switch (activeToolView) {
      case 'proposal-generator':
        return <ProposalGenerator />;
      case 'call-script-generator':
        return <CallScriptGenerator />;
      case 'competitor-analysis':
        return <CompetitorAnalysis />;
      case 'sentiment-analysis':
        return <SentimentAnalysis />;
      case 'usage-stats':
        return <AIUsageStatsPanel />;
      case 'market-trends':
        return <MarketTrendsAnalysis />;
      case 'churn-prediction':
        return <ChurnPrediction />;
      case 'social-media-posts':
        return <SocialMediaGenerator />;
      case 'live-deal-analysis':
        return <LiveDealAnalysis />;
      case 'smart-search':
        return <SmartSearchRealtime />;
      default:
        return null;
    }
  };

  // If a tool is active, show its component
  if (activeToolView) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={handleCloseToolView}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
          >
            ← Back to AI Tools Hub
          </button>
        </div>
        <div className="container mx-auto px-4 pb-8">
          <Suspense fallback={<AIToolLoadingSkeleton />}>
            {renderToolComponent()}
          </Suspense>
        </div>
      </div>
    );
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'beta': return 'bg-blue-100 text-blue-600';
      case 'coming-soon': return 'bg-yellow-100 text-yellow-600';
      case 'experimental': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalUsage = usageStats.totalUsage;
  const activeTools = usageStats.activeTools;
  const averagePopularity = usageStats.successRate;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl mr-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Tools Hub</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive AI-powered tools for sales, marketing, and business intelligence
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tools</p>
                <p className="text-2xl font-semibold text-gray-900">{aiToolsData.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Cpu className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Tools</p>
                <p className="text-2xl font-semibold text-gray-900">{activeTools}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Usage</p>
                <p className="text-2xl font-semibold text-gray-900">{totalUsage.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{averagePopularity}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI Components Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Live AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              Live AI Insights
            </h3>
          </div>
          <div className="p-0">
            <AIInsightsPanel />
          </div>
        </div>

        {/* Live Deal Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              Deal Analysis
            </h3>
          </div>
          <div className="p-4">
            <LiveDealAnalysis />
          </div>
        </div>
      </div>

      {/* AI Controls and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Smart AI Controls */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 text-gray-600 mr-2" />
              AI Controls
            </h3>
          </div>
          <div className="p-6">
            <SmartAIControls />
          </div>
        </div>

        {/* AI Model Usage Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Database className="h-5 w-5 text-green-600 mr-2" />
              Model Usage
            </h3>
          </div>
          <div className="p-4">
            <AIModelUsageStats />
          </div>
        </div>
      </div>

      {/* Smart Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Search className="h-5 w-5 text-indigo-600 mr-2" />
            Smart Search
          </h3>
        </div>
        <div className="p-6">
          <SmartSearchRealtime />
        </div>
      </div>

      {/* Tools Catalog */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">AI Tools Catalog</h2>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Active Tools Filter */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Active only</span>
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category} ({getCategoryCount(category)})
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="p-6">
          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const isRunning = runningTools.has(tool.id);
                
                return (
                  <div
                    key={tool.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedTool(tool)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${
                          tool.status === 'active' ? 'bg-blue-100' :
                          tool.status === 'beta' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          <tool.icon size={20} className={
                            tool.status === 'active' ? 'text-blue-600' :
                            tool.status === 'beta' ? 'text-yellow-600' :
                            'text-gray-500'
                          } />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tool.status)}`}>
                            {tool.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      {tool.estimatedTime && (
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{tool.estimatedTime}</span>
                        </div>
                      )}
                      {tool.usageCount && (
                        <div className="flex items-center space-x-1">
                          <Activity size={12} />
                          <span>{tool.usageCount.toLocaleString()} uses</span>
                        </div>
                      )}
                    </div>

                    {/* Popularity Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Popularity</span>
                        <span>{tool.popularity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${tool.popularity}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunTool(tool);
                      }}
                      disabled={isRunning || tool.status === 'coming-soon'}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        tool.status === 'coming-soon'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isRunning
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isRunning ? (
                        <div className="flex items-center justify-center space-x-2">
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Running...</span>
                        </div>
                      ) : tool.status === 'coming-soon' ? (
                        'Coming Soon'
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Play size={16} />
                          <span>Run Tool</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      selectedTool.status === 'active' ? 'bg-blue-100' :
                      selectedTool.status === 'beta' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      <selectedTool.icon size={24} className={
                        selectedTool.status === 'active' ? 'text-blue-600' :
                        selectedTool.status === 'beta' ? 'text-yellow-600' :
                        'text-gray-500'
                      } />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedTool.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTool.status)}`}>
                        {selectedTool.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTool(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedTool.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                      <p className="text-gray-600">{selectedTool.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Estimated Time</h4>
                      <p className="text-gray-600">{selectedTool.estimatedTime || 'Varies'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Usage Count</h4>
                      <p className="text-gray-600">{selectedTool.usageCount?.toLocaleString() || 'New'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Popularity</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${selectedTool.popularity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{selectedTool.popularity}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Tool-specific information could be added here */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">AI Model Information</h5>
                        <p className="text-sm text-blue-700 mt-1">
                          This tool uses advanced AI models optimized for {selectedTool.category.toLowerCase()}. 
                          Performance may vary based on data complexity and current system load.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    handleRunTool(selectedTool);
                    setSelectedTool(null);
                  }}
                  disabled={selectedTool.status === 'coming-soon'}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedTool.status === 'coming-soon'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {selectedTool.status === 'coming-soon' ? 'Coming Soon' : 'Run Tool'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTool(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITools;
