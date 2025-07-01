import React from 'react';
import { useDealStore } from '../../store/dealStore';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, AlertTriangle, Clock, DollarSign } from 'lucide-react';

const LiveDealAnalysis: React.FC = () => {
  const { deals } = useDealStore();
  const { isDark } = useTheme();

  const analyzePipeline = () => {
    const activeDeals = Object.values(deals).filter(deal => 
      deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
    );

    const highValueDeals = activeDeals.filter(deal => deal.value > 50000);
    const stalledDeals = activeDeals.filter(deal => deal.daysInStage && deal.daysInStage > 10);
    const hotDeals = activeDeals.filter(deal => deal.probability > 70);

    return {
      totalActive: activeDeals.length,
      highValue: highValueDeals.length,
      stalled: stalledDeals.length,
      hot: hotDeals.length,
      avgValue: activeDeals.reduce((sum, deal) => sum + deal.value, 0) / activeDeals.length
    };
  };

  const analysis = analyzePipeline();

  const insights = [
    {
      icon: TrendingUp,
      title: 'High-Value Opportunities',
      value: analysis.highValue,
      description: 'Deals over $50K',
      color: 'text-green-600',
      bgColor: isDark ? 'bg-green-500/20' : 'bg-green-100'
    },
    {
      icon: AlertTriangle,
      title: 'Stalled Deals',
      value: analysis.stalled,
      description: 'Over 10 days in stage',
      color: 'text-orange-600',
      bgColor: isDark ? 'bg-orange-500/20' : 'bg-orange-100'
    },
    {
      icon: Clock,
      title: 'Hot Prospects',
      value: analysis.hot,
      description: 'High probability deals',
      color: 'text-blue-600',
      bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight, index) => (
          <div key={index} className={`p-3 border rounded-lg ${
            isDark 
              ? 'border-white/10 bg-white/5' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                <insight.icon size={16} className={insight.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.title}
                  </h3>
                  <span className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.value}
                  </span>
                </div>
                <p className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-3 rounded-lg border ${
        isDark 
          ? 'bg-blue-500/10 border-blue-500/20' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          <h3 className={`font-medium text-sm ${
            isDark ? 'text-blue-300' : 'text-blue-900'
          }`}>
            Average Deal Value
          </h3>
        </div>
        <p className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-blue-900'
        }`}>
          ${Math.round(analysis.avgValue).toLocaleString()}
        </p>
        <p className={`text-xs ${
          isDark ? 'text-blue-400' : 'text-blue-700'
        }`}>
          Based on {analysis.totalActive} active deals
        </p>
      </div>
    </div>
  );
};

export default LiveDealAnalysis;