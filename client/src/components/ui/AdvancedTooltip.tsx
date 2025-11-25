import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import {
  TrendingUp,
  Users,
  Target,
  ChevronRight,
  Sparkles,
  BarChart3,
  Clock,
  ExternalLink,
  Copy,
  ThumbsUp
} from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";
import { useGemini } from '../../services/geminiService';

interface AdvancedTooltipProps {
  id: string;
  target: string;
  context: 'dashboard' | 'pipeline' | 'leads' | 'analytics';
  data?: any;
  showAI?: boolean;
  federated?: boolean;
}

const AdvancedTooltip: React.FC<AdvancedTooltipProps> = ({
  id,
  target,
  context,
  data,
  showAI = true,
  federated = false
}) => {
  const { isDark } = useTheme();
  const { generateContent } = useGemini();
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible && showAI && !aiInsights) {
      generateAIInsights();
    }
  }, [isVisible, showAI]);

  const generateAIInsights = async () => {
    setIsLoading(true);
    try {
      const prompt = `Provide a brief insight about ${context} data: ${JSON.stringify(data)}`;
      const response = await generateContent({ prompt });
      setAiInsights(response.content);
    } catch (error) {
      console.warn('AI insights failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContextualMetrics = () => {
    switch (context) {
      case 'dashboard':
        return {
          icon: BarChart3,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          metrics: [
            { label: 'Conversion Rate', value: data?.conversion || '24%', trend: '+5%' },
            { label: 'Active Deals', value: data?.deals || '47', trend: '+12' },
            { label: 'Avg Deal Size', value: data?.avgDeal || '$12.5K', trend: '+$2K' }
          ]
        };
      case 'pipeline':
        return {
          icon: Target,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          metrics: [
            { label: 'Pipeline Value', value: data?.value || '$847K', trend: '+$45K' },
            { label: 'Win Rate', value: data?.winRate || '68%', trend: '+8%' },
            { label: 'Time to Close', value: data?.timeToClose || '23 days', trend: '-3 days' }
          ]
        };
      default:
        return {
          icon: TrendingUp,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
          metrics: []
        };
    }
  };

  const contextualData = getContextualMetrics();
  const IconComponent = contextualData.icon;

  const actions = [
    {
      label: 'View Details',
      icon: ExternalLink,
      action: () => console.log('Navigate to details'),
      primary: true
    },
    {
      label: 'Copy Data',
      icon: Copy,
      action: () => navigator.clipboard.writeText(JSON.stringify(data)),
      primary: false
    },
    {
      label: 'AI Analysis',
      icon: Sparkles,
      action: () => setIsVisible(true),
      primary: false
    }
  ];

  return (
    <>
      <div
        data-tooltip-id={id}
        className="cursor-help group"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {target}
      </div>

      <Tooltip
        id={id}
        place="top"
        clickable
        noArrow={false}
        className={`!bg-white dark:!bg-gray-800 !rounded-xl !shadow-2xl !border !border-gray-200 dark:!border-gray-700 !p-0 !max-w-lg !z-50 !animate-in !fade-in-0 !zoom-in-95 !duration-200`}
        style={{
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${contextualData.bgColor}`}>
                <IconComponent className={`h-5 w-5 ${contextualData.color}`} />
              </div>
              <div>
                <h4 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {context.charAt(0).toUpperCase() + context.slice(1)} Insights
                </h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time analytics and recommendations
                </p>
              </div>
            </div>
            {federated && (
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 text-xs rounded-full font-medium">
                Remote App
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {contextualData.metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {metric.label}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </span>
                  <span className="text-green-600 text-sm font-medium">
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          {showAI && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  AI Insights
                </span>
              </div>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Analyzing data...</span>
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {aiInsights || 'Click to generate AI-powered insights about this data.'}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  action.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Updated just now</span>
            </div>
            <button className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <ThumbsUp className="h-3 w-3" />
              <span>Helpful</span>
            </button>
          </div>
        </div>
      </Tooltip>
    </>
  );
};

export default AdvancedTooltip;