
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Avatar from '../components/ui/Avatar';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

const DealRiskMonitor: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Calculate risk metrics
  const dealsArray = Object.values(deals);
  const highRiskDeals = dealsArray.filter(deal => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate > 7 || deal.probability < 30;
  });
  
  const mediumRiskDeals = dealsArray.filter(deal => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return (daysSinceUpdate >= 3 && daysSinceUpdate <= 7) || (deal.probability >= 30 && deal.probability <= 60);
  });

  const lowRiskDeals = dealsArray.filter(deal => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate < 3 && deal.probability > 60;
  });

  const atRiskValue = highRiskDeals.reduce((sum, deal) => sum + deal.value, 0);

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

  // Get risk level
  const getRiskLevel = (deal: any) => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate > 7 || deal.probability < 30) return 'high';
    if ((daysSinceUpdate >= 3 && daysSinceUpdate <= 7) || (deal.probability >= 30 && deal.probability <= 60)) return 'medium';
    return 'low';
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Deal Risk Monitor
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Identify and manage at-risk deals to prevent revenue loss
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Shield className="h-3 w-3 mr-1" />
              Risk Analysis
            </Badge>
          </div>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                High Risk Deals
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {highRiskDeals.length}
              </div>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                Immediate attention needed
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                At Risk Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(atRiskValue)}
              </div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Revenue at risk
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Medium Risk
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mediumRiskDeals.length}
              </div>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Monitor closely
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Low Risk
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {lowRiskDeals.length}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                On track
              </p>
            </CardContent>
          </Card>
        </div>

        {/* High Risk Deals */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              High Risk Deals - Immediate Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {highRiskDeals.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No high-risk deals found. Great job!</p>
              </div>
            ) : (
              highRiskDeals.map((deal) => {
                const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={deal.id} className={`flex items-center space-x-3 p-4 rounded-lg border ${
                    isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
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
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          {deal.probability}% probability
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          {daysSinceUpdate} days inactive
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <XCircle className="h-5 w-5 text-red-500 mb-1" />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        High Risk
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* All Deals Risk Analysis */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Complete Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dealsArray.map((deal) => {
              const riskLevel = getRiskLevel(deal);
              const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
              
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
                        riskLevel === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                        riskLevel === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >
                      {riskLevel} risk
                    </Badge>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {deal.probability}%
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

export default DealRiskMonitor;
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AlertTriangle, TrendingDown, Clock, DollarSign, Target, Users, Calendar, Activity, ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import Avatar from '../components/ui/Avatar';
import { getInitials } from '../utils/avatars';

const DealRiskMonitor: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate risk levels for deals
  const calculateDealRisk = (deal: any) => {
    let riskScore = 0;
    const daysToClose = deal.expectedCloseDate ? 
      Math.ceil((new Date(deal.expectedCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 30;
    
    // Risk factors
    if (daysToClose < 7) riskScore += 30;
    else if (daysToClose < 14) riskScore += 20;
    else if (daysToClose < 30) riskScore += 10;
    
    if (deal.probability < 30) riskScore += 40;
    else if (deal.probability < 50) riskScore += 25;
    else if (deal.probability < 70) riskScore += 15;
    
    if (deal.value > 50000) riskScore += 10;
    if (deal.stage === 'negotiation') riskScore += 15;
    
    if (riskScore >= 60) return 'high';
    if (riskScore >= 35) return 'medium';
    return 'low';
  };

  const dealsWithRisk = Object.values(deals)
    .filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost')
    .map(deal => ({
      ...deal,
      riskLevel: calculateDealRisk(deal),
      contact: contacts[deal.contactId]
    }))
    .filter(deal => deal.contact);

  const filteredDeals = dealsWithRisk.filter(deal => {
    const matchesRisk = selectedRiskLevel === 'all' || deal.riskLevel === selectedRiskLevel;
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.contact?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const riskCounts = {
    high: dealsWithRisk.filter(d => d.riskLevel === 'high').length,
    medium: dealsWithRisk.filter(d => d.riskLevel === 'medium').length,
    low: dealsWithRisk.filter(d => d.riskLevel === 'low').length
  };

  const totalAtRiskValue = dealsWithRisk
    .filter(d => d.riskLevel === 'high')
    .reduce((sum, deal) => sum + deal.value, 0);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Deal Risk Monitor
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  Monitor and mitigate risks across your sales pipeline
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'High Risk Deals', 
              value: riskCounts.high.toString(),
              icon: AlertTriangle,
              color: 'from-red-500 to-red-600',
              change: '+12%'
            },
            { 
              title: 'At Risk Value', 
              value: formatCurrency(totalAtRiskValue),
              icon: DollarSign,
              color: 'from-orange-500 to-red-500',
              change: '+8%'
            },
            { 
              title: 'Medium Risk', 
              value: riskCounts.medium.toString(),
              icon: Clock,
              color: 'from-yellow-500 to-orange-500',
              change: '-5%'
            },
            { 
              title: 'Low Risk', 
              value: riskCounts.low.toString(),
              icon: Target,
              color: 'from-green-500 to-emerald-500',
              change: '+15%'
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

        {/* Filters and Search */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedRiskLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedRiskLevel === level
                      ? 'bg-blue-500 text-white'
                      : isDark
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)} Risk
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deals List */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Risk Analysis Results ({filteredDeals.length} deals)
          </h2>
          
          <div className="space-y-4">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 hover:${isDark ? 'bg-white/10' : 'bg-gray-100'} transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={deal.contact?.avatarSrc || deal.contact?.avatar}
                      alt={deal.contact?.name}
                      size="md"
                      fallback={getInitials(deal.contact?.name || '')}
                    />
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {deal.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {deal.contact?.name} • {deal.company}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(deal.value)}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {deal.probability}% probability
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRiskColor(deal.riskLevel)}`}>
                      {deal.riskLevel.toUpperCase()} RISK
                    </div>
                    
                    <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'} transition-colors`}>
                      <Activity className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealRiskMonitor;
