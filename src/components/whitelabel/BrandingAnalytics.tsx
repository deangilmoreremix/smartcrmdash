import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Download,
  Calendar,
  Globe,
  Activity,
  Target,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  brandingViews: number;
  brandingChanges: number;
  userEngagement: number;
  colorSchemePopularity: { [key: string]: number };
  timeToComplete: number;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  monthlyTrends: { month: string; changes: number; views: number }[];
}

export const BrandingAnalytics: React.FC = () => {
  const { brandingConfig, isCustomized } = useWhiteLabel();
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    brandingViews: 1247,
    brandingChanges: 23,
    userEngagement: 85,
    colorSchemePopularity: {
      'Professional Blue': 45,
      'Creative Purple': 25,
      'Corporate Green': 15,
      'Elegant Dark': 10,
      'Custom': 5
    },
    timeToComplete: 12,
    deviceBreakdown: { desktop: 60, mobile: 30, tablet: 10 },
    monthlyTrends: [
      { month: 'Jan', changes: 15, views: 890 },
      { month: 'Feb', changes: 22, views: 1100 },
      { month: 'Mar', changes: 18, views: 950 },
      { month: 'Apr', changes: 25, views: 1300 },
      { month: 'May', changes: 30, views: 1450 },
      { month: 'Jun', changes: 23, views: 1247 },
    ]
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        brandingViews: prev.brandingViews + Math.floor(Math.random() * 5),
        userEngagement: Math.min(100, prev.userEngagement + Math.floor(Math.random() * 3) - 1)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: React.ComponentType<any>;
    description: string;
  }> = ({ title, value, change, trend, icon: Icon, description }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`} />
                <span className={`text-sm ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branding Analytics</h2>
          <p className="text-gray-600">Track your white-label performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Branding Views"
          value={analytics.brandingViews.toLocaleString()}
          change="+12% from last month"
          trend="up"
          icon={Eye}
          description="Total views of branded pages"
        />
        <MetricCard
          title="Configuration Changes"
          value={analytics.brandingChanges}
          change="+5 this week"
          trend="up"
          icon={Activity}
          description="Branding updates made"
        />
        <MetricCard
          title="User Engagement"
          value={`${analytics.userEngagement}%`}
          change="+3% improvement"
          trend="up"
          icon={Users}
          description="Time spent on branded pages"
        />
        <MetricCard
          title="Setup Time"
          value={`${analytics.timeToComplete} min`}
          change="2 min faster"
          trend="up"
          icon={Clock}
          description="Average time to complete setup"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Scheme Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Color Scheme Popularity</span>
            </CardTitle>
            <CardDescription>
              Most popular color schemes chosen by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.colorSchemePopularity).map(([scheme, percentage]) => (
                <div key={scheme} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{scheme}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Device Usage</span>
            </CardTitle>
            <CardDescription>
              How users access the branding interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.deviceBreakdown).map(([device, percentage]) => (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="capitalize font-medium text-gray-700">{device}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Monthly Trends</span>
          </CardTitle>
          <CardDescription>
            Branding activity over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Changes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-4 mt-6">
              {analytics.monthlyTrends.map((month) => (
                <div key={month.month} className="text-center">
                  <div className="relative h-32 flex items-end justify-center space-x-1 mb-2">
                    <div 
                      className="w-4 bg-blue-600 rounded-t"
                      style={{ height: `${(month.views / 1500) * 100}%` }}
                      title={`${month.views} views`}
                    />
                    <div 
                      className="w-4 bg-green-600 rounded-t"
                      style={{ height: `${(month.changes / 35) * 100}%` }}
                      title={`${month.changes} changes`}
                    />
                  </div>
                  <div className="text-xs font-medium text-gray-700">{month.month}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Branding Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Current Branding Status</span>
          </CardTitle>
          <CardDescription>
            Overview of your current white-label configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Company Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company Name:</span>
                  <span className="font-medium">{brandingConfig.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tagline:</span>
                  <span className="font-medium truncate max-w-32" title={brandingConfig.tagline}>
                    {brandingConfig.tagline}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Website:</span>
                  <span className="font-medium truncate max-w-32" title={brandingConfig.website}>
                    {brandingConfig.website}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Visual Branding</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Primary Color:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: brandingConfig.colorScheme.primary }}
                    />
                    <span className="font-mono text-xs">{brandingConfig.colorScheme.primary}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Logo:</span>
                  <Badge variant={brandingConfig.logoUrl ? "default" : "secondary"}>
                    {brandingConfig.logoUrl ? "Uploaded" : "Default"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Typography:</span>
                  <span className="font-medium">{brandingConfig.typography.primaryFont}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Customization Level</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Status:</span>
                  <Badge variant={isCustomized ? "default" : "secondary"}>
                    {isCustomized ? "Customized" : "Default"}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-gray-600 mb-1">Completion Score</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${isCustomized ? 85 : 25}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isCustomized ? '85%' : '25%'} complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandingAnalytics;
