
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Avatar from '../components/ui/Avatar';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Activity,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const SmartConversionInsights: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Calculate conversion metrics
  const dealsArray = Object.values(deals);
  const totalDeals = dealsArray.length;
  const wonDeals = dealsArray.filter(d => d.stage === 'closed-won');
  const conversionRate = totalDeals > 0 ? (wonDeals.length / totalDeals * 100) : 0;
  
  // Identify high-potential conversions
  const highPotentialDeals = dealsArray.filter(deal => 
    deal.probability >= 70 && !['closed-won', 'closed-lost'].includes(deal.stage)
  );
  
  const stuckDeals = dealsArray.filter(deal => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate > 14 && !['closed-won', 'closed-lost'].includes(deal.stage);
  });

  // Get top contacts by conversion potential
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
              Smart Conversion Insights
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered insights to maximize your conversion opportunities
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Zap className="h-3 w-3 mr-1" />
              AI Insights
            </Badge>
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Conversion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +3.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                High Potential Deals
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {highPotentialDeals.length}
              </div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                70%+ probability
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Stuck Deals
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stuckDeals.length}
              </div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                Need attention
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Won This Month
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {wonDeals.length}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Strong performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Conversion Recommendations */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              AI Conversion Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Focus on High-Probability Deals
                  </h4>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    You have {highPotentialDeals.length} deals with 70%+ probability. Prioritize follow-ups to close these quickly.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/20 border border-orange-800' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="flex items-start space-x-3">
                <Activity className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Re-engage Stuck Deals
                  </h4>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stuckDeals.length} deals haven't been updated in 2+ weeks. Schedule follow-up calls to prevent lost opportunities.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Optimize Conversion Timing
                  </h4>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Best conversion times: Tuesday-Thursday, 10-11 AM. Schedule important calls during these peak hours.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* High Potential Deals */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              High Conversion Potential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {highPotentialDeals.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Target className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <p>No high-potential deals at the moment. Keep nurturing your pipeline!</p>
              </div>
            ) : (
              highPotentialDeals.map((deal) => (
                <div key={deal.id} className={`flex items-center space-x-3 p-4 rounded-lg border ${
                  isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                }`}>
                  <Avatar
                    name={deal.contactName || 'Unknown'}
                    size="md"
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
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {deal.probability}% probability
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {deal.stage}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Star className="h-5 w-5 text-yellow-500 mb-1" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      High Potential
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Converting Contacts */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Top Converting Contacts
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
                        {contact.leadScore || 85}/100 score
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartConversionInsights;
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Lightbulb, TrendingUp, Target, Zap, BarChart3, Users, Clock, DollarSign, ArrowUpRight, Filter } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';

const SmartConversionInsights: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState('last-30-days');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  // Calculate conversion metrics
  const calculateConversionMetrics = () => {
    const totalLeads = Object.keys(contacts).length;
    const convertedDeals = Object.values(deals).filter(deal => deal.stage === 'closed-won').length;
    const overallRate = totalLeads > 0 ? (convertedDeals / totalLeads) * 100 : 0;
    
    return {
      overallRate: Math.round(overallRate),
      totalLeads,
      convertedDeals,
      avgDealValue: 35000,
      timeToConvert: 32
    };
  };

  const metrics = calculateConversionMetrics();

  const conversionFunnel = [
    { stage: 'Leads', count: 150, rate: 100, color: 'bg-blue-500' },
    { stage: 'Qualified', count: 85, rate: 57, color: 'bg-green-500' },
    { stage: 'Proposal', count: 45, rate: 30, color: 'bg-yellow-500' },
    { stage: 'Negotiation', count: 28, rate: 19, color: 'bg-orange-500' },
    { stage: 'Closed Won', count: 18, rate: 12, color: 'bg-purple-500' }
  ];

  const conversionOpportunities = [
    {
      category: 'Lead Source Optimization',
      insight: 'LinkedIn leads convert 45% better than email campaigns',
      opportunity: '+12% conversion rate',
      effort: 'Low',
      impact: 'High',
      recommendation: 'Shift 30% of budget from email to LinkedIn ads'
    },
    {
      category: 'Follow-up Timing',
      insight: 'Responses within 5 minutes show 9x higher conversion',
      opportunity: '+25% faster conversions',
      effort: 'Medium',
      impact: 'High',
      recommendation: 'Implement instant lead response automation'
    },
    {
      category: 'Personalization',
      insight: 'Personalized demos increase conversion by 65%',
      opportunity: '+15% close rate',
      effort: 'Medium',
      impact: 'Medium',
      recommendation: 'Create dynamic demo personalization system'
    },
    {
      category: 'Price Positioning',
      insight: 'Value-first pricing conversations reduce objections by 40%',
      opportunity: '+8% conversion rate',
      effort: 'Low',
      impact: 'Medium',
      recommendation: 'Train team on value-based selling methodology'
    }
  ];

  const conversionTrends = [
    { metric: 'Overall Rate', current: '18%', previous: '15%', trend: 'up', change: '+3%' },
    { metric: 'Lead to Qualified', current: '57%', previous: '52%', trend: 'up', change: '+5%' },
    { metric: 'Qualified to Proposal', current: '53%', previous: '48%', trend: 'up', change: '+5%' },
    { metric: 'Proposal to Close', current: '40%', previous: '45%', trend: 'down', change: '-5%' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return 'bg-green-500/20 text-green-500';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'High': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-blue-500/20 text-blue-500';
      case 'Medium': return 'bg-purple-500/20 text-purple-500';
      case 'Low': return 'bg-gray-500/20 text-gray-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Smart Conversion Insights
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  AI-powered insights to optimize your conversion rates
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
                } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
                <option value="last-year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Conversion Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { 
              title: 'Overall Rate', 
              value: `${metrics.overallRate}%`,
              icon: Target,
              color: 'from-green-500 to-emerald-500',
              change: '+12%'
            },
            { 
              title: 'Total Leads', 
              value: metrics.totalLeads.toString(),
              icon: Users,
              color: 'from-blue-500 to-cyan-500',
              change: '+8%'
            },
            { 
              title: 'Conversions', 
              value: metrics.convertedDeals.toString(),
              icon: TrendingUp,
              color: 'from-purple-500 to-pink-500',
              change: '+15%'
            },
            { 
              title: 'Avg Value', 
              value: formatCurrency(metrics.avgDealValue),
              icon: DollarSign,
              color: 'from-orange-500 to-red-500',
              change: '+5%'
            },
            { 
              title: 'Time to Convert', 
              value: `${metrics.timeToConvert}d`,
              icon: Clock,
              color: 'from-yellow-500 to-orange-500',
              change: '-8%'
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
                <div className="flex items-center text-green-400">
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

        {/* Conversion Funnel */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Conversion Funnel Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {conversionFunnel.map((stage, index) => (
              <div key={index} className="text-center">
                <div className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg p-4 mb-3`}>
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {stage.count}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    {stage.stage}
                  </div>
                  <div className={`w-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div 
                      className={`h-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                    {stage.rate}% conversion
                  </div>
                </div>
                {index < conversionFunnel.length - 1 && (
                  <div className="hidden md:block">
                    <ArrowUpRight className={`mx-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Trends */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Conversion Trends
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {conversionTrends.map((trend, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {trend.metric}
                  </span>
                  <div className={`flex items-center ${trend.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <ArrowUpRight className={`h-4 w-4 mr-1 ${trend.trend === 'down' ? 'rotate-90' : ''}`} />
                    <span className="text-sm font-medium">{trend.change}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {trend.current}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    from {trend.previous}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Opportunities */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Conversion Opportunities
          </h2>
          
          <div className="space-y-4">
            {conversionOpportunities.map((opp, index) => (
              <div key={index} className={`p-6 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {opp.category}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                      {opp.insight}
                    </p>
                    <p className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      💡 {opp.recommendation}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getEffortColor(opp.effort)}`}>
                      {opp.effort} Effort
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(opp.impact)}`}>
                      {opp.impact} Impact
                    </div>
                    <div className="text-sm font-semibold text-green-500">
                      {opp.opportunity}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      AI Confidence: 94%
                    </span>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isDark 
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  } transition-colors`}>
                    Implement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Optimize Lead Sources', description: 'Reallocate budget to high-converting channels', impact: '+12% conversion' },
              { title: 'Automate Follow-ups', description: 'Set up instant response automation', impact: '+25% speed' },
              { title: 'Personalize Demos', description: 'Create dynamic demo experiences', impact: '+15% close rate' }
            ].map((action, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {action.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  {action.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-500">
                    {action.impact}
                  </span>
                  <button className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    isDark 
                      ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } transition-colors`}>
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartConversionInsights;
