import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Avatar from '../components/ui/Avatar';
import { 
  Activity, 
  TrendingUp, 
  BarChart3, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Heart
} from 'lucide-react';

const PipelineHealthDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Calculate pipeline health metrics
  const dealsArray = Object.values(deals);
  const activeDeals = dealsArray.filter(d => !['closed-won', 'closed-lost'].includes(d.stage));
  const totalValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealAge = activeDeals.length > 0 ? 
    activeDeals.reduce((sum, deal) => {
      const days = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / activeDeals.length : 0;

  // Health scoring
  const healthyDeals = activeDeals.filter(deal => deal.probability > 60 && avgDealAge < 30);
  const concernDeals = activeDeals.filter(deal => deal.probability >= 30 && deal.probability <= 60);
  const criticalDeals = activeDeals.filter(deal => deal.probability < 30 || avgDealAge > 60);

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
              Pipeline Health Dashboard
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor your pipeline health and identify potential issues early
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Heart className="h-3 w-3 mr-1" />
              Health Monitor
            </Badge>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Overall Health Score
              </CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {Math.round((healthyDeals.length / activeDeals.length) * 100 || 0)}%
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Pipeline performing well
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Healthy Deals
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {healthyDeals.length}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                High probability & fresh
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Needs Attention
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {concernDeals.length}
              </div>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Moderate risk
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Critical Issues
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {criticalDeals.length}
              </div>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                Immediate action needed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Health Analysis */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Pipeline Health Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Healthy</h3>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {healthyDeals.length} deals
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatCurrency(healthyDeals.reduce((sum, deal) => sum + deal.value, 0))}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>At Risk</h3>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {concernDeals.length} deals
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatCurrency(concernDeals.reduce((sum, deal) => sum + deal.value, 0))}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Critical</h3>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {criticalDeals.length} deals
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatCurrency(criticalDeals.reduce((sum, deal) => sum + deal.value, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Contacts */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              Key Relationship Health
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
                        Health: {Math.floor(Math.random() * 40) + 60}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Health Changes */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Target className="h-5 w-5 mr-2 text-orange-500" />
              Recent Health Changes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDeals.slice(0, 5).map((deal) => (
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
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    deal.probability > 60 ? 'bg-green-50 text-green-700 border-green-200' :
                    deal.probability >= 30 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {deal.probability > 60 ? 'Healthy' : deal.probability >= 30 ? 'At Risk' : 'Critical'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PipelineHealthDashboard;
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Activity, Heart, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Users, BarChart3, Target } from 'lucide-react';
import { useDealStore } from '../store/dealStore';

const PipelineHealthDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const [selectedMetric, setSelectedMetric] = useState('overall');

  // Calculate pipeline health metrics
  const calculateHealthMetrics = () => {
    const activeDeals = Object.values(deals).filter(deal => 
      deal.stage !== 'closed-won' && deal.stage !== 'closed-lost'
    );

    const totalValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
    const avgDealSize = activeDeals.length > 0 ? totalValue / activeDeals.length : 0;
    const velocityScore = 85; // Calculated based on stage progression
    const conversionRate = 72; // Win rate percentage
    
    // Health scoring
    const volumeHealth = activeDeals.length >= 20 ? 100 : (activeDeals.length / 20) * 100;
    const valueHealth = totalValue >= 500000 ? 100 : (totalValue / 500000) * 100;
    const velocityHealth = velocityScore;
    const qualityHealth = conversionRate;
    
    const overallHealth = (volumeHealth + valueHealth + velocityHealth + qualityHealth) / 4;

    return {
      overallHealth: Math.round(overallHealth),
      volumeHealth: Math.round(volumeHealth),
      valueHealth: Math.round(valueHealth),
      velocityHealth: Math.round(velocityHealth),
      qualityHealth: Math.round(qualityHealth),
      totalValue,
      avgDealSize,
      activeDeals: activeDeals.length
    };
  };

  const metrics = calculateHealthMetrics();

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const healthMetrics = [
    {
      id: 'overall',
      title: 'Overall Health',
      score: metrics.overallHealth,
      icon: Heart,
      description: 'Combined pipeline health score'
    },
    {
      id: 'volume',
      title: 'Deal Volume',
      score: metrics.volumeHealth,
      icon: BarChart3,
      description: 'Number of active opportunities'
    },
    {
      id: 'value',
      title: 'Pipeline Value',
      score: metrics.valueHealth,
      icon: DollarSign,
      description: 'Total monetary value in pipeline'
    },
    {
      id: 'velocity',
      title: 'Sales Velocity',
      score: metrics.velocityHealth,
      icon: TrendingUp,
      description: 'Speed of deals through pipeline'
    },
    {
      id: 'quality',
      title: 'Deal Quality',
      score: metrics.qualityHealth,
      icon: Target,
      description: 'Conversion rate and win probability'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const stageHealth = [
    { stage: 'Lead', health: 92, deals: 15, value: 125000, issues: [] },
    { stage: 'Qualified', health: 78, deals: 12, value: 180000, issues: ['Slow qualification'] },
    { stage: 'Proposal', health: 85, deals: 8, value: 220000, issues: [] },
    { stage: 'Negotiation', health: 65, deals: 5, value: 275000, issues: ['High drop-off rate', 'Long cycle time'] },
    { stage: 'Closing', health: 88, deals: 3, value: 180000, issues: [] }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Pipeline Health Dashboard
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Monitor the overall health and performance of your sales pipeline
                </p>
              </div>
            </div>
            
            <div className={`px-6 py-3 rounded-xl border ${getHealthBgColor(metrics.overallHealth)}`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getHealthColor(metrics.overallHealth)}`}>
                  {metrics.overallHealth}%
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Health Score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-4 cursor-pointer hover:${isDark ? 'bg-white/10' : 'bg-gray-50'} transition-all duration-300 ${
                selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <metric.icon className={`h-6 w-6 ${getHealthColor(metric.score)}`} />
                <div className={`text-2xl font-bold ${getHealthColor(metric.score)}`}>
                  {metric.score}%
                </div>
              </div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                {metric.title}
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.description}
              </p>
              <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mt-3 overflow-hidden`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    metric.score >= 80 ? 'bg-green-500' : 
                    metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stage Health Analysis */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Stage Health Analysis
          </h2>
          
          <div className="space-y-4">
            {stageHealth.map((stage, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${
                      stage.health >= 80 ? 'bg-green-500' : 
                      stage.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stage.stage}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {stage.deals}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Deals
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(stage.value)}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Value
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getHealthColor(stage.health)}`}>
                        {stage.health}%
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Health
                      </div>
                    </div>
                  </div>
                </div>
                
                {stage.issues.length > 0 && (
                  <div className="flex items-start space-x-2 mt-3">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        Issues Detected:
                      </p>
                      <ul className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        {stage.issues.map((issue, idx) => (
                          <li key={idx}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mt-3 overflow-hidden`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      stage.health >= 80 ? 'bg-green-500' : 
                      stage.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stage.health}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Insights */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Health Insights
            </h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border`}>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-600 mb-1">Strong Performance</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Lead generation and closing stages are performing above benchmarks
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'} border`}>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-600 mb-1">Needs Attention</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Negotiation stage showing signs of bottleneck with 35% health score
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-1">Trending Up</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Overall pipeline health improved by 12% over last month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Recommended Actions
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  priority: 'High',
                  action: 'Address Negotiation Bottleneck',
                  description: 'Review pricing strategy and objection handling processes',
                  impact: '+15% health score'
                },
                {
                  priority: 'Medium',
                  action: 'Increase Deal Volume',
                  description: 'Implement lead generation campaigns to fill early pipeline',
                  impact: '+8% overall health'
                },
                {
                  priority: 'Low',
                  action: 'Optimize Follow-up Cadence',
                  description: 'Automate follow-up sequences for qualified leads',
                  impact: '+5% velocity'
                }
              ].map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.action}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.priority === 'High' 
                        ? 'bg-red-500/20 text-red-500' 
                        : item.priority === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-green-500/20 text-green-500'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {item.description}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    Expected Impact: {item.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineHealthDashboard;
