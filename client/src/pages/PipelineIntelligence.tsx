
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Avatar from '../components/ui/Avatar';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users,
  Target,
  Activity,
  Briefcase,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const PipelineIntelligence: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Calculate pipeline metrics
  const dealsArray = Object.values(deals);
  const totalValue = dealsArray.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = dealsArray.filter(d => !['closed-won', 'closed-lost'].includes(d.stage));
  const wonDeals = dealsArray.filter(d => d.stage === 'closed-won');
  const avgDealSize = activeDeals.length > 0 ? totalValue / activeDeals.length : 0;

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
              Pipeline Intelligence
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Advanced analytics and insights for your sales pipeline
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Activity className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Pipeline Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(totalValue)}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Active Deals
              </CardTitle>
              <Briefcase className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {activeDeals.length}
              </div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8 new this week
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Average Deal Size
              </CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(avgDealSize)}
              </div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5.2% increase
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Won Deals
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {wonDeals.length}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                85% win rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Stages Analysis */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Pipeline Stage Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, index) => {
                const stageDeals = dealsArray.filter(d => d.stage.toLowerCase().includes(stage.toLowerCase()));
                const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
                
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
                      {formatCurrency(stageValue)}
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
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              High-Value Business Relationships
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
                        {contact.leadScore || 85}/100
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Pipeline Activity */}
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Activity className="h-5 w-5 mr-2 text-orange-500" />
              Recent Pipeline Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dealsArray.slice(0, 5).map((deal) => (
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
                    deal.stage === 'closed-won' ? 'bg-green-50 text-green-700 border-green-200' :
                    deal.stage === 'negotiation' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {deal.stage}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PipelineIntelligence;

const PipelineIntelligence: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const [selectedInsight, setSelectedInsight] = useState('conversion');

  const aiInsights = [
    {
      id: 'conversion',
      title: 'Conversion Optimization',
      description: 'AI-powered analysis of conversion patterns and opportunities',
      score: 87,
      trend: '+12%'
    },
    {
      id: 'timing',
      title: 'Timing Intelligence',
      description: 'Optimal timing predictions for outreach and follow-ups',
      score: 92,
      trend: '+8%'
    },
    {
      id: 'value',
      title: 'Value Prediction',
      description: 'AI forecasting of deal values and pipeline worth',
      score: 78,
      trend: '+15%'
    },
    {
      id: 'risk',
      title: 'Risk Assessment',
      description: 'Real-time risk analysis and mitigation recommendations',
      score: 85,
      trend: '-5%'
    }
  ];

  const pipelineMetrics = {
    totalValue: 1250000,
    predictedClosing: 875000,
    conversionRate: 68,
    avgDealSize: 35000,
    velocity: 24,
    qualityScore: 85
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const intelligenceData = {
    conversion: {
      insights: [
        'Leads from LinkedIn convert 40% better than other sources',
        'Tuesday 2-4 PM shows highest response rates',
        'Personalized demos increase conversion by 85%'
      ],
      recommendations: [
        'Focus 60% of outreach efforts on LinkedIn prospects',
        'Schedule demos preferentially on Tuesday afternoons',
        'Implement dynamic demo personalization tools'
      ],
      metrics: {
        'Current Rate': '68%',
        'Predicted Rate': '74%',
        'Opportunity': '+6%'
      }
    },
    timing: {
      insights: [
        'Deals close 30% faster when contacted within 5 minutes',
        'Follow-ups after 3 days show diminishing returns',
        'End-of-quarter timing affects 25% more closes'
      ],
      recommendations: [
        'Implement instant lead response automation',
        'Optimize follow-up sequences to 2-day intervals',
        'Create quarter-end urgency campaigns'
      ],
      metrics: {
        'Avg Response': '2.4 hours',
        'Optimal Window': '5 minutes',
        'Improvement': '300%'
      }
    },
    value: {
      insights: [
        'Enterprise deals show 45% higher value potential',
        'Multi-stakeholder meetings increase deal size by 60%',
        'Technical demos correlate with 35% larger deals'
      ],
      recommendations: [
        'Prioritize enterprise prospect identification',
        'Schedule group decision-maker sessions',
        'Include technical proof-of-concept in sales process'
      ],
      metrics: {
        'Current Avg': formatCurrency(35000),
        'Predicted Avg': formatCurrency(42000),
        'Upside': '+20%'
      }
    },
    risk: {
      insights: [
        '15% of deals show early warning signs of churn risk',
        'Pricing objections correlate with 60% drop-off rate',
        'Competitor mentions increase risk score by 40%'
      ],
      recommendations: [
        'Implement early warning monitoring system',
        'Develop value-based pricing conversation framework',
        'Create competitive differentiation playbooks'
      ],
      metrics: {
        'At Risk Deals': '12',
        'Total Value': formatCurrency(485000),
        'Mitigation Rate': '75%'
      }
    }
  };

  const currentData = intelligenceData[selectedInsight as keyof typeof intelligenceData];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Pipeline Intelligence
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  AI-powered insights and predictions for your sales pipeline
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Active
              </span>
            </div>
          </div>
        </div>

        {/* Intelligence Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              onClick={() => setSelectedInsight(insight.id)}
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6 cursor-pointer hover:${isDark ? 'bg-white/10' : 'bg-gray-50'} transition-all duration-300 ${
                selectedInsight === insight.id ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center text-green-400">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{insight.trend}</span>
                </div>
              </div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                {insight.title}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                {insight.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {insight.score}%
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Confidence
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Total Pipeline', value: formatCurrency(pipelineMetrics.totalValue), icon: DollarSign },
            { title: 'Predicted Closing', value: formatCurrency(pipelineMetrics.predictedClosing), icon: Target },
            { title: 'Conversion Rate', value: `${pipelineMetrics.conversionRate}%`, icon: TrendingUp },
            { title: 'Avg Deal Size', value: formatCurrency(pipelineMetrics.avgDealSize), icon: BarChart3 },
            { title: 'Velocity (days)', value: pipelineMetrics.velocity.toString(), icon: Clock },
            { title: 'Quality Score', value: `${pipelineMetrics.qualityScore}%`, icon: Activity }
          ].map((metric, index) => (
            <div
              key={index}
              className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-xl p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                {metric.value}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.title}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              AI Insights - {aiInsights.find(i => i.id === selectedInsight)?.title}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  🧠 Key Insights
                </h3>
                <div className="space-y-2">
                  {currentData.insights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  📊 Key Metrics
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(currentData.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {key}
                      </span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              AI Recommendations
            </h2>
            
            <div className="space-y-4">
              {currentData.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {rec}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-500 text-xs rounded-full">
                          AI Recommended
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Priority: {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Models & Performance */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            AI Model Performance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                model: 'Conversion Predictor',
                accuracy: '94.2%',
                predictions: '1,247',
                lastTrained: '2 hours ago'
              },
              {
                model: 'Value Estimator',
                accuracy: '89.7%',
                predictions: '892',
                lastTrained: '4 hours ago'
              },
              {
                model: 'Risk Analyzer',
                accuracy: '91.5%',
                predictions: '634',
                lastTrained: '1 hour ago'
              }
            ].map((model, index) => (
              <div key={index} className={`p-4 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  {model.model}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Accuracy
                    </span>
                    <span className="font-semibold text-green-500">
                      {model.accuracy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Predictions
                    </span>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {model.predictions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Last Trained
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {model.lastTrained}
                    </span>
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

export default PipelineIntelligence;
