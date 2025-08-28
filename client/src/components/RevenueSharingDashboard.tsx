import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Award, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  CreditCard
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Partner {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  tier: string;
  commissionRate: string;
  totalRevenue: string;
  totalCommissions: string;
  customerCount: number;
}

interface RevenueAnalytics {
  totalRevenue: number;
  totalCommissions: number;
  totalPartners: number;
  activePartners: number;
  totalCustomers: number;
  averageCommissionRate: number;
  monthlyGrowth: number;
  topPerformingTier: string;
  metrics: {
    revenue: {
      current: number;
      previousMonth: number;
      growth: number;
    };
    commissions: {
      current: number;
      previousMonth: number;
      growth: number;
    };
    partners: {
      current: number;
      previousMonth: number;
      growth: number;
    };
  };
}

export default function RevenueSharingDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const { data: analytics, isLoading: analyticsLoading } = useQuery<RevenueAnalytics>({
    queryKey: ['/api/revenue/analytics'],
    refetchInterval: 30000,
  });

  const { data: partners, isLoading: partnersLoading } = useQuery<Partner[]>({
    queryKey: ['/api/partners'],
    refetchInterval: 30000,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTierBadgeColor = (tier: string) => {
    const colors = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800',
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      terminated: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (analyticsLoading || partnersLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const topPartners = partners?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6" data-testid="revenue-sharing-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Sharing Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor partner performance and revenue analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="export-report-button">
            Export Report
          </Button>
          <Button data-testid="add-partner-button">
            Add Partner
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="total-revenue-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics?.totalRevenue || 0)}
            </div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(analytics?.metrics.revenue.growth || 0)}`}>
              {getGrowthIcon(analytics?.metrics.revenue.growth || 0)}
              {formatPercentage(analytics?.metrics.revenue.growth || 0)} from last month
            </div>
          </CardContent>
        </Card>

        <Card data-testid="total-commissions-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics?.totalCommissions || 0)}
            </div>
            <div className={`text-xs flex items-center gap-1 ${getGrowthColor(analytics?.metrics.commissions.growth || 0)}`}>
              {getGrowthIcon(analytics?.metrics.commissions.growth || 0)}
              {formatPercentage(analytics?.metrics.commissions.growth || 0)} from last month
            </div>
          </CardContent>
        </Card>

        <Card data-testid="active-partners-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.activePartners || 0}</div>
            <div className="text-xs text-muted-foreground">
              of {analytics?.totalPartners || 0} total partners
            </div>
          </CardContent>
        </Card>

        <Card data-testid="average-commission-rate-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(analytics?.averageCommissionRate || 0)}
            </div>
            <div className="text-xs text-muted-foreground">
              Top tier: {analytics?.topPerformingTier || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value="overview" className="space-y-6">
        <TabsList data-testid="dashboard-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Partners */}
            <Card className="lg:col-span-2" data-testid="top-partners-card">
              <CardHeader>
                <CardTitle>Top Performing Partners</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {partner.companyName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{partner.companyName}</div>
                        <div className="text-sm text-gray-500">{partner.contactName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(parseFloat(partner.totalRevenue))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTierBadgeColor(partner.tier)}>
                          {partner.tier}
                        </Badge>
                        <Badge className={getStatusBadgeColor(partner.status)}>
                          {partner.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card data-testid="quick-stats-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Growth</span>
                    <span className="text-sm font-semibold">
                      {formatPercentage(analytics?.monthlyGrowth || 0)}
                    </span>
                  </div>
                  <Progress value={(analytics?.monthlyGrowth || 0) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Partner Activation</span>
                    <span className="text-sm font-semibold">
                      {analytics ? Math.round((analytics.activePartners / analytics.totalPartners) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics ? (analytics.activePartners / analytics.totalPartners) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">Total Customers</div>
                  <div className="text-2xl font-bold">{analytics?.totalCustomers || 0}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <Card data-testid="partners-table-card">
            <CardHeader>
              <CardTitle>All Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Company</th>
                      <th className="text-left p-4">Contact</th>
                      <th className="text-left p-4">Tier</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">Revenue</th>
                      <th className="text-right p-4">Commissions</th>
                      <th className="text-right p-4">Customers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners?.map((partner) => (
                      <tr key={partner.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium">{partner.companyName}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{partner.contactName}</div>
                            <div className="text-gray-500">{partner.contactEmail}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getTierBadgeColor(partner.tier)}>
                            {partner.tier}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusBadgeColor(partner.status)}>
                            {partner.status}
                          </Badge>
                        </td>
                        <td className="text-right p-4 font-medium">
                          {formatCurrency(parseFloat(partner.totalRevenue))}
                        </td>
                        <td className="text-right p-4 font-medium">
                          {formatCurrency(parseFloat(partner.totalCommissions))}
                        </td>
                        <td className="text-right p-4">
                          {partner.customerCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card data-testid="revenue-breakdown-card">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Month</span>
                    <span className="font-semibold">
                      {formatCurrency(analytics?.metrics.revenue.current || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Previous Month</span>
                    <span className="font-medium text-gray-600">
                      {formatCurrency(analytics?.metrics.revenue.previousMonth || 0)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span>Growth</span>
                      <span className={`font-semibold ${getGrowthColor(analytics?.metrics.revenue.growth || 0)}`}>
                        {formatPercentage(analytics?.metrics.revenue.growth || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="commission-breakdown-card">
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Month</span>
                    <span className="font-semibold">
                      {formatCurrency(analytics?.metrics.commissions.current || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Previous Month</span>
                    <span className="font-medium text-gray-600">
                      {formatCurrency(analytics?.metrics.commissions.previousMonth || 0)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span>Growth</span>
                      <span className={`font-semibold ${getGrowthColor(analytics?.metrics.commissions.growth || 0)}`}>
                        {formatPercentage(analytics?.metrics.commissions.growth || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}