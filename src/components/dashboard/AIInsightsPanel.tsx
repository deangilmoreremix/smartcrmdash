import React, { useState } from 'react';
import { Brain, Zap, RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const AIInsightsPanel: React.FC = () => {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineInsight, setPipelineInsight] = useState<string | null>(null);

  const generateInsights = () => {
    setIsGenerating(true);
    // Simulate AI analysis
    setTimeout(() => {
      const insights = [
        "Your pipeline velocity has increased 23% this month with high-quality leads entering the qualification stage.",
        "AI identified 5 prospects with 85%+ closing probability. Prioritize these for immediate attention.",
        "3 high-value deals show stagnation in negotiation stage. Consider immediate follow-up actions."
      ];
      setPipelineInsight(insights[Math.floor(Math.random() * insights.length)]);
      setIsGenerating(false);
    }, 2000);
  };

  const insights = [
    {
      type: 'success',
      title: 'Pipeline Health Strong',
      description: 'Your pipeline velocity has increased 23% this month with high-quality leads entering the qualification stage.',
      icon: CheckCircle,
      color: isDark ? 'text-green-400' : 'text-green-600',
      bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100'
    },
    {
      type: 'warning',
      title: 'Deal Risk Alert',
      description: '3 high-value deals show stagnation in negotiation stage. Consider immediate follow-up actions.',
      icon: AlertTriangle,
      color: isDark ? 'text-orange-400' : 'text-orange-600',
      bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-100'
    },
    {
      type: 'insight',
      title: 'Conversion Opportunity',
      description: 'AI identified 5 prospects with 85%+ closing probability. Prioritize these for immediate attention.',
      icon: TrendingUp,
      color: isDark ? 'text-blue-400' : 'text-blue-600',
      bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
    }
  ];

  return (
    <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6 mb-8`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Brain className={`h-6 w-6 ${isDark ? 'text-white' : 'text-white'}`} />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Pipeline Intelligence</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Real-time analysis of your sales performance</p>
          </div>
        </div>
        <button
          onClick={generateInsights}
          disabled={isGenerating}
          className={`flex items-center space-x-2 px-4 py-2 ${
            isDark 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
          } text-white rounded-xl transition-all disabled:opacity-50`}
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
      
      {pipelineInsight && (
        <div className={`p-4 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border rounded-lg mb-6`}>
          <p className={isDark ? 'text-white' : 'text-gray-800'}>
            {pipelineInsight}
          </p>
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