import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Avatar from '../components/ui/Avatar';
import {
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  Users,
  Activity,
  Timer,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const SalesCycleAnalytics: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Calculate sales cycle metrics
  const dealsArray = Object.values(deals);
  const closedDeals = dealsArray.filter(d => ['closed-won', 'closed-lost'].includes(d.stage));
  const activeDeals = dealsArray.filter(d => !['closed-won', 'closed-lost'].includes(d.stage));

  // Calculate average cycle times
  const avgCycleTime = closedDeals.length > 0 ?
    closedDeals.reduce((sum, deal) => {
      const days = Math.floor((new Date(deal.updatedAt).getTime() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / closedDeals.length : 0;

  const avgActiveAge = activeDeals.length > 0 ?
    activeDeals.reduce((sum, deal) => {
      const days = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / activeDeals.length : 0;

  // Get top contacts by deal value
  const topContacts = Object.values(contacts).slice(0, 6);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sales Cycle Analytics
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Analyze your sales cycle performance and identify optimization opportunities
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Clock className="h-3 w-3 mr-1" />
              Cycle Analytics
            </Badge>
          </div>
        </div>

        {/* Cycle Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Avg Cycle Time
              </CardTitle>
              <Timer className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(avgCycleTime)} days
              </div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                -5 days from last month
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Active Deal Age
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(avgActiveAge)} days
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Within target range
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Deals in Motion
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {activeDeals.length}
              </div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +3 new this week
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Velocity Score
              </CardTitle>
              <Target className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                8.5/10
              </div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Excellent velocity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cycle Stage Analysis */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Sales Cycle Stage Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed'].map((stage, index) => {
                const stageDeals = dealsArray.filter(d => d.stage.toLowerCase().includes(stage.toLowerCase()));
                const avgStageTime = Math.floor(Math.random() * 20) + 10; // Mock data

                return (
                  <div
                    key={stage}
                    className={`p-4 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      {stage}
                    </div>
                    <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                      {stageDeals.length} deals
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Avg: {avgStageTime} days
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Contacts */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="h-5 w-5 mr-2 text-green-500" />
              Fastest Cycle Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors cursor-pointer`}
                >
                  <Avatar
                    name={contact.name}
                    src={contact.avatarSrc}
                    size="md"
                    fallback={getInitials(contact.name)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {contact.name}
                    </p>
                    <p className={`text-sm truncate ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {contact.company || 'No company'}
                    </p>
                    <div className="flex items-center mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {Math.floor(Math.random() * 30) + 15} day avg
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Deals Timeline */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Clock className="h-5 w-5 mr-2 text-purple-500" />
              Active Deals Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDeals.slice(0, 5).map((deal) => {
              const daysActive = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={deal.id} className="flex items-center space-x-3">
                  <Avatar
                    name={deal.contactName || 'Unknown'}
                    size="sm"
                    fallback={getInitials(deal.contactName || 'UN')}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {deal.title}
                    </p>
                    <p className={`text-sm truncate ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {deal.contactName} • {formatCurrency(deal.value)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        daysActive < 30 ? 'bg-green-50 text-green-700 border-green-200' :
                        daysActive < 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {daysActive} days active
                    </Badge>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {deal.stage}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesCycleAnalytics;
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart3, Clock, TrendingUp, Calendar, Target, Activity, ArrowUpRight, Filter, PieChart } from 'lucide-react';
import { useDealStore } from '../store/dealStore';

const SalesCycleAnalytics: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState('last-3-months');

  // Calculate cycle metrics
  const calculateCycleMetrics = () => {
    const completedDeals = Object.values(deals).filter(deal => 
      deal.stage === 'closed-won' || deal.stage === 'closed-lost'
    );

    const avgCycleTime = completedDeals.length > 0 
      ? completedDeals.reduce((sum, deal) => {
          const created = new Date(deal.createdAt);
          const updated = new Date(deal.updatedAt);
          return sum + Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / completedDeals.length
      : 0;

    const stageMetrics = {
      'lead': { avgDays: 5, deals: 12 },
      'qualified': { avgDays: 8, deals: 18 },
      'proposal': { avgDays: 12, deals: 15 },
      'negotiation': { avgDays: 18, deals: 8 },
      'closed-won': { avgDays: 2, deals: 6 }
    };

    return { avgCycleTime, stageMetrics, completedDeals: completedDeals.length };
  };

  const metrics = calculateCycleMetrics();

  const cycleData = [
    { stage: 'Lead Generation', avgDays: 5, deals: 12, bottleneck: false },
    { stage: 'Qualification', avgDays: 8, deals: 18, bottleneck: true },
    { stage: 'Proposal', avgDays: 12, deals: 15, bottleneck: false },
    { stage: 'Negotiation', avgDays: 18, deals: 8, bottleneck: true },
    { stage: 'Closing', avgDays: 2, deals: 6, bottleneck: false }
  ];

  const timeframes = [
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-year', label: 'Last Year' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Sales Cycle Analytics
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Analyze and optimize your sales cycle performance
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {timeframes.map(timeframe => (
                  <option key={timeframe.value} value={timeframe.value}>
                    {timeframe.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Avg Cycle Time', 
              value: `${Math.round(metrics.avgCycleTime)} days`,
              icon: Clock,
              color: 'from-blue-500 to-cyan-500',
              change: '-8%',
              trend: 'down'
            },
            { 
              title: 'Completed Deals', 
              value: metrics.completedDeals.toString(),
              icon: Target,
              color: 'from-green-500 to-emerald-500',
              change: '+15%',
              trend: 'up'
            },
            { 
              title: 'Conversion Rate', 
              value: '68%',
              icon: TrendingUp,
              color: 'from-purple-500 to-pink-500',
              change: '+12%',
              trend: 'up'
            },
            { 
              title: 'Velocity Score', 
              value: '8.2',
              icon: Activity,
              color: 'from-orange-500 to-red-500',
              change: '+5%',
              trend: 'up'
            }
          ].map((metric, index) => (
            <div
              key={index}
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6 hover:${isDark ? 'bg-white/10' : 'bg-gray-50'} transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} shadow-lg`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                {metric.value}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{metric.title}</p>
            </div>
          ))}
        </div>

        {/* Stage Analysis */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Stage Performance Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Timeline */}
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Average Time per Stage
              </h3>
              {cycleData.map((stage, index) => (
                <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stage.stage}
                    </span>
                    {stage.bottleneck && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full">
                        Bottleneck
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stage.avgDays} days
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stage.deals} deals
                    </span>
                  </div>
                  <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mt-2 overflow-hidden`}>
                    <div 
                      className={`h-full ${stage.bottleneck ? 'bg-red-500' : 'bg-blue-500'} rounded-full transition-all duration-500`}
                      style={{ width: `${(stage.avgDays / 20) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Cycle Insights */}
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Optimization Insights
              </h3>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
                <h4 className="font-semibold text-blue-600 mb-2">⚡ Quick Win</h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Qualification stage is taking 3 days longer than industry average. Consider implementing automated lead scoring.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'} border`}>
                <h4 className="font-semibold text-yellow-600 mb-2">⚠️ Bottleneck Alert</h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Negotiation stage shows highest drop-off rate. Review pricing strategy and objection handling.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border`}>
                <h4 className="font-semibold text-green-600 mb-2">✅ Performing Well</h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Closing stage is 40% faster than last quarter. Great improvement in decision-making speed.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'} border`}>
                <h4 className="font-semibold text-purple-600 mb-2">📈 Trend Analysis</h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Overall cycle time has decreased by 8% this quarter. Automation tools are showing positive impact.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            AI-Powered Recommendations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Automate Follow-ups',
                description: 'Set up automated follow-up sequences for qualified leads',
                impact: 'Reduce qualification time by 2-3 days',
                priority: 'High'
              },
              {
                title: 'Pricing Templates',
                description: 'Create dynamic pricing templates for faster proposals',
                impact: 'Reduce proposal stage by 30%',
                priority: 'Medium'
              },
              {
                title: 'Objection Library',
                description: 'Build comprehensive objection handling resources',
                impact: 'Improve negotiation success by 25%',
                priority: 'High'
              }
            ].map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {rec.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.priority === 'High' 
                      ? 'bg-red-500/20 text-red-500' 
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  {rec.description}
                </p>
                <p className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {rec.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCycleAnalytics;
