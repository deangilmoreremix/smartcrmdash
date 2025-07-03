import React, { useState, useEffect } from 'react';
import { Brain, Zap, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { useGemini } from '../../services/geminiService';

interface Insight {
  type: 'success' | 'warning' | 'insight';
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const AIInsightsPanel = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const gemini = useGemini();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeysConfigured, setApiKeysConfigured] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([
    {
      type: 'success',
      title: 'Pipeline Health Strong',
      description: 'Your conversion rate increased 15% this month',
      icon: CheckCircle,
      color: isDark ? 'text-green-400' : 'text-green-600',
      bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100'
    },
    {
      type: 'warning',
      title: 'Follow-up Required',
      description: '3 high-value deals need immediate attention',
      icon: AlertTriangle,
      color: isDark ? 'text-orange-400' : 'text-orange-600',
      bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-100'
    },
    {
      type: 'insight',
      title: 'Best Contact Time',
      description: 'Prospects respond 40% more on Tuesday afternoons',
      icon: TrendingUp,
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
    }
  ]);

  useEffect(() => {
    // Generate initial insights when component mounts
    generateInitialInsights();
  }, []);

  const generateInitialInsights = async () => {
    // Only generate if we have enough data
    if (Object.keys(deals).length < 2 || Object.keys(contacts).length < 2) {
      return;
    }

    try {
      await generateRealInsights();
    } catch (error) {
      console.error("Failed to generate initial insights:", error);
      // Don't set error state for initial load failures
    }
  };

  const generateInsights = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      await generateRealInsights();
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setError(error instanceof Error ? error.message : "Failed to generate insights");
      // Keep existing insights on error
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRealInsights = async () => {
    // Convert to arrays for analysis
    const dealsArray = Object.values(deals);
    const contactsArray = Object.values(contacts);
    
    // Prepare pipeline data for analysis
    const pipelineData = {
      deals: dealsArray.map(deal => ({
        id: deal.id,
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        probability: deal.probability,
        daysInStage: deal.daysInStage,
        priority: deal.priority,
        contactId: deal.contactId
      })),
      contacts: contactsArray.map(contact => ({
        id: contact.id,
        name: contact.name,
        company: contact.company,
        status: contact.status,
        source: contact.source,
        tags: contact.tags
      })),
      summary: {
        activeDealCount: dealsArray.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length,
        totalPipelineValue: dealsArray.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost')
          .reduce((sum, deal) => sum + deal.value, 0),
        avgDealSize: dealsArray.length > 0 ? 
          dealsArray.reduce((sum, deal) => sum + deal.value, 0) / dealsArray.length : 0,
        hotLeadsCount: contactsArray.filter(c => c.status === 'hot').length
      }
    };
    
    try {
      // Use AI orchestrator for smart routing between models
      const result = await gemini.analyzePipelineHealth(pipelineData, {
        priority: 'quality', // Prioritize insight quality over speed/cost
        customerId: 'demo-customer-id' // Demo customer ID for logging
      });
      
      // Handle case where AI services are unavailable
      if (!result.success) {
        setApiKeysConfigured(false);
        if (result.error?.includes("API key") || result.error?.includes("No AI provider configured")) {
          setError("AI services are not configured. Please add your API keys to enable AI insights.");
        } else {
          setError(result.error || "AI analysis is currently unavailable.");
        }
        // Don't throw error, just handle gracefully
        return;
      }

      // Reset API keys configured flag if we got a successful result
      setApiKeysConfigured(true);

      // Convert AI insights to our format
      const newInsights: Insight[] = [];
      
      // Add pipeline health insight
      if (result.content.healthScore > 70) {
        newInsights.push({
          type: 'success',
          title: 'Pipeline Health Strong',
          description: result.content.keyInsights[0] || 'Your pipeline shows strong momentum with healthy deal flow.',
          icon: CheckCircle,
          color: isDark ? 'text-green-400' : 'text-green-600',
          bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100'
        });
      } else if (result.content.bottlenecks && result.content.bottlenecks.length > 0) {
        newInsights.push({
          type: 'warning',
          title: 'Deal Risk Alert',
          description: result.content.bottlenecks[0],
          icon: AlertTriangle,
          color: isDark ? 'text-orange-400' : 'text-orange-600',
          bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-100'
        });
      }
      
      // Add opportunity insight
      if (result.content.opportunities && result.content.opportunities.length > 0) {
        newInsights.push({
          type: 'insight',
          title: 'Conversion Opportunity',
          description: result.content.opportunities[0],
          icon: TrendingUp,
          color: isDark ? 'text-blue-400' : 'text-blue-600',
          bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
        });
      }
      
      // Make sure we always have at least one insight
      if (newInsights.length === 0 && result.content.keyInsights && result.content.keyInsights.length > 0) {
        newInsights.push({
          type: 'insight',
          title: 'AI Pipeline Insight',
          description: result.content.keyInsights[0],
          icon: Brain,
          color: isDark ? 'text-purple-400' : 'text-purple-600',
          bgColor: isDark ? 'bg-purple-500/20' : 'bg-purple-100'
        });
      }
      
      // If we got meaningful insights, update the state
      if (newInsights.length > 0) {
        setInsights(newInsights);
      }
      
      // Log the AI service used
      console.log(`Generated insights using ${result.model} (${result.provider}) in ${result.responseTime}ms`);
      
    } catch (error) {
      console.error("Error generating insights:", error);
      // Set a more user-friendly error message
      setError("Unable to generate AI insights at this time. Please try again later.");
      setApiKeysConfigured(false);
    }
  };

  return (
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6 mb-8`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Brain className={`h-6 w-6 ${isDark ? 'text-white' : 'text-white'}`} />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Pipeline Intelligence</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {apiKeysConfigured ? 'Real-time insights powered by AI' : 'Configure API keys to enable AI features'}
            </p>
          </div>
        </div>
        <button
          onClick={generateInsights}
          disabled={isGenerating || !apiKeysConfigured}
          className={`flex items-center space-x-2 px-4 py-2 ${
            isDark 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
          } text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {isGenerating ? 'Analyzing...' : 'Generate Insights'}
          </span>
        </button>
      </div>

      {error && (
        <div className={`p-4 mb-4 rounded-lg ${
          isDark ? 'bg-red-500/10 border-red-500/20 border' : 'bg-red-50 border-red-200 border'
        }`}>
          <div className="flex items-start">
            <Info className={`h-5 w-5 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                AI Service Unavailable
              </h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                {error.includes("API key") ? 
                  "Please configure your AI API keys in the .env file to enable AI insights." :
                  error
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'
            } rounded-xl p-4 hover:${isDark ? 'bg-white/10' : 'bg-gray-50'} transition-all group`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                <insight.icon size={16} className={insight.color} />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isDark ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'} transition-colors`}>
                  {insight.title}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsPanel;