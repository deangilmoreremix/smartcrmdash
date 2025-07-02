import React, { useState, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { SmartAIControls } from './ai/SmartAIControls';
import { useSmartAI, useTaskOptimization } from '../hooks/useSmartAI';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Clock, 
  DollarSign, 
  Zap,
  BarChart3,
  Lightbulb,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Star,
  Settings,
  Layers,
  Sparkles,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const EnhancedAIInsightsPanel: React.FC = () => {
  const { isDark } = useTheme();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedView, setSelectedView] = useState<'insights' | 'controls' | 'performance'>('insights');
  const { getRecommendations, getInsights, performance } = useTaskOptimization();
  const [taskRecommendations, setTaskRecommendations] = useState<Record<string, any>>({});

  const generateInsights = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  useEffect(() => {
    // Load recommendations for common tasks
    const tasks = ['contact_scoring', 'categorization', 'contact_enrichment', 'lead_qualification'];
    const recommendations: Record<string, any> = {};
    
    tasks.forEach(task => {
      const rec = getRecommendations(task);
      if (rec) {
        recommendations[task] = rec;
      }
    });
    
    setTaskRecommendations(recommendations);
  }, [getRecommendations]);

  const insights = [
    {
      type: 'optimization',
      icon: Zap,
      title: 'AI Model Optimization Active',
      description: 'Smart routing between Gemma and OpenAI models based on task requirements is improving response times by 40% while reducing costs.',
      color: 'text-blue-600',
      priority: 'high',
      recommendation: 'Continue using smart routing for optimal performance'
    },
    {
      type: 'cost',
      icon: DollarSign,
      title: 'Cost Efficiency Improved',
      description: 'Automatic selection of Gemma models for simple tasks has reduced AI costs by 65% while maintaining 95% accuracy.',
      color: 'text-green-600',
      priority: 'medium',
      recommendation: 'Consider increasing batch sizes for bulk operations'
    },
    {
      type: 'performance',
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Contact scoring accuracy has improved to 92% with the new hybrid model approach. OpenAI models excel at complex analysis while Gemma handles volume efficiently.',
      color: 'text-purple-600',
      priority: 'high',
      recommendation: 'Expand smart analysis to relationship mapping tasks'
    },
    {
      type: 'alert',
      icon: AlertTriangle,
      title: 'Rate Limit Advisory',
      description: 'OpenAI usage approaching 80% of rate limits during peak hours. Smart routing is automatically shifting traffic to Gemma models.',
      color: 'text-yellow-600',
      priority: 'medium',
      recommendation: 'Consider upgrading OpenAI tier or increasing Gemma usage'
    }
  ];

  const views = [
    { id: 'insights', label: 'AI Insights', icon: Lightbulb },
    { id: 'controls', label: 'Smart Controls', icon: Settings },
    { id: 'performance', label: 'Performance', icon: BarChart3 }
  ];

  return (
    <GlassCard className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
              Smart AI Intelligence Hub
              <Sparkles className="w-4 h-4 ml-2 text-yellow-500" />
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Advanced multi-model AI orchestration with Gemma & OpenAI</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Selector */}
          <div className={`flex rounded-lg border ${isDark ? 'border-white/10' : 'border-gray-300'} overflow-hidden`}>
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id as any)}
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1 ${
                    selectedView === view.id
                      ? isDark 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-transparent text-white hover:bg-white/10'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>
          
          <ModernButton 
            onClick={generateInsights}
            loading={isAnalyzing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Refresh'}</span>
          </ModernButton>
        </div>
      </div>

      {/* AI Model Status Bar */}
      <div className={`mb-6 p-4 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border border-blue-500/20' 
          : 'bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 border border-blue-200'
      } rounded-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Gemma Models</span>
              <span className={`text-xs ${
                isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
              } px-2 py-1 rounded-md`}>Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>OpenAI Models</span>
              <span className={`text-xs ${
                isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
              } px-2 py-1 rounded-md`}>Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-purple-700'}`}>Smart Routing</span>
              <span className={`text-xs ${
                isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
              } px-2 py-1 rounded-md`}>Enabled</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Cost Savings</div>
            <div className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>65%</div>
          </div>
        </div>
      </div>

      {/* Content Based on Selected View */}
      {selectedView === 'insights' && (
        <div className="space-y-4">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className={`animate-spin w-8 h-8 border-4 ${
                  isDark ? 'border-blue-400 border-t-transparent' : 'border-blue-500 border-t-transparent'
                } rounded-full mx-auto mb-4`}></div>
                <p className={isDark ? 'text-white' : 'text-gray-600'}>AI is analyzing your pipeline data across multiple models...</p>
                <div className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Evaluating Gemma 2-9B, GPT-4o Mini, and Gemini Flash performance...
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:border-white/20'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isDark 
                        ? `${insight.color.replace('600', '400')} bg-opacity-20` 
                        : `${insight.color} bg-opacity-10`
                    }`}>
                      <Icon className={`w-5 h-5 ${isDark ? insight.color.replace('600', '400') : insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{insight.title}</h4>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          insight.priority === 'high' 
                            ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800' 
                            : isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {insight.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${
                          isDark ? 'text-blue-300' : 'text-blue-600'
                        } font-medium`}>
                          💡 {insight.recommendation}
                        </p>
                        <div className="flex space-x-1">
                          <button className={`p-1 rounded ${
                            isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}>
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button className={`p-1 rounded ${
                            isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}>
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Task Recommendations */}
          {Object.keys(taskRecommendations).length > 0 && (
            <div className="mt-6">
              <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
                <Target className={`w-5 h-5 mr-2 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                Recommended Models by Task
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(taskRecommendations).map(([task, rec]: [string, any]) => (
                  <div 
                    key={task} 
                    className={`p-4 rounded-lg ${
                      isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50'
                    }`}
                  >
                    <h5 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2 capitalize`}>
                      {task.replace('_', ' ')}
                    </h5>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className={`w-3 h-3 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
                        <span className="font-medium">{rec.recommendedProvider}</span>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>•</span>
                        <span>{rec.recommendedModel}</span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{rec.reasoning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedView === 'controls' && (
        <SmartAIControls />
      )}

      {selectedView === 'performance' && performance && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 ${
              isDark ? 'bg-blue-500/10 rounded-lg border border-blue-500/20' : 'bg-blue-50 rounded-lg'
            }`}>
              <Activity className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>{performance.totalTasks}</div>
              <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Total Tasks</div>
            </div>
            <div className={`text-center p-4 ${
              isDark ? 'bg-green-500/10 rounded-lg border border-green-500/20' : 'bg-green-50 rounded-lg'
            }`}>
              <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-green-900'}`}>
                {Math.round(performance.overallSuccessRate * 100)}%
              </div>
              <div className={`text-sm ${isDark ? 'text-green-300' : 'text-green-700'}`}>Success Rate</div>
            </div>
            <div className={`text-center p-4 ${
              isDark ? 'bg-purple-500/10 rounded-lg border border-purple-500/20' : 'bg-purple-50 rounded-lg'
            }`}>
              <Clock className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>
                {Math.round(performance.avgResponseTime)}ms
              </div>
              <div className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>Avg Response</div>
            </div>
            <div className={`text-center p-4 ${
              isDark ? 'bg-orange-500/10 rounded-lg border border-orange-500/20' : 'bg-orange-50 rounded-lg'
            }`}>
              <Layers className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-orange-900'}`}>
                {performance.modelPerformance.length}
              </div>
              <div className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>Active Models</div>
            </div>
          </div>

          {/* Model Performance Details */}
          <div>
            <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Model Performance Breakdown</h4>
            <div className="space-y-3">
              {performance.modelPerformance.map((model: any, index: number) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      model.model.includes('gemma') || model.model.includes('gemini') 
                        ? 'bg-green-500' 
                        : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{model.model}</div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {model.model.includes('gemma') || model.model.includes('gemini') ? 'Google' : 'OpenAI'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round(model.successRate * 100)}%
                      </div>
                      <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Success</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {Math.round(model.avgTime)}ms
                      </div>
                      <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Avg Time</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${model.avgCost.toFixed(4)}
                      </div>
                      <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>Avg Cost</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default EnhancedAIInsightsPanel;