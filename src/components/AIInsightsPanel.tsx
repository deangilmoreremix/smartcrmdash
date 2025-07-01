import React, { useState } from 'react';
import { Brain, Zap, RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AIInsightsPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights] = useState([
    {
      type: 'success',
      title: 'Pipeline Health Strong',
      description: 'Your conversion rate increased 15% this month',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      type: 'warning',
      title: 'Follow-up Required',
      description: '3 high-value deals need immediate attention',
      icon: AlertTriangle,
      color: 'text-orange-400'
    },
    {
      type: 'insight',
      title: 'Best Contact Time',
      description: 'Prospects respond 40% more on Tuesday afternoons',
      icon: TrendingUp,
      color: 'text-blue-400'
    }
  ]);

  const generateInsights = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Pipeline Intelligence</h2>
            <p className="text-sm text-gray-400">Real-time insights powered by AI</p>
          </div>
        </div>
        <button
          onClick={generateInsights}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all disabled:opacity-50"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-start space-x-3">
              <insight.icon className={`h-5 w-5 ${insight.color} mt-1`} />
              <div className="flex-1">
                <h3 className="font-medium text-white group-hover:text-green-400 transition-colors">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsPanel;