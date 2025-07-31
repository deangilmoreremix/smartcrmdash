import React, { useState } from 'react';
import { useSaaS } from '../../contexts/SaaSContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  Building2, 
  Crown, 
  Settings, 
  Upload, 
  Download,
  Plus,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';

export const MasterAdminDashboard: React.FC = () => {
  const { user, organization, isMasterAdmin, isLoading } = useSaaS();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isMasterAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">This area is restricted to master administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Master Admin Dashboard</h1>
                <p className="text-sm text-gray-600">System-wide management and control</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Master Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Organizations</p>
                  <p className="text-2xl font-bold text-gray-900">47</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+8% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+15% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$18,420</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+23% this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Organizations</CardTitle>
                  <CardDescription>
                    Latest organizations created in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Acme Corp', users: 25, tier: 'Enterprise', status: 'Active' },
                      { name: 'TechStart Inc', users: 8, tier: 'Professional', status: 'Trial' },
                      { name: 'Global Solutions', users: 45, tier: 'White Label', status: 'Active' },
                    ].map((org, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{org.name}</p>
                          <p className="text-sm text-gray-600">{org.users} users • {org.tier}</p>
                        </div>
                        <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
                          {org.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Current system status and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">API Response Time</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">142ms</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Database Performance</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">Excellent</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Server Uptime</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">99.9%</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Storage Usage</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">68%</span>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Organization Management</CardTitle>
                  <CardDescription>
                    Manage all organizations in the system
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organization
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Organization management interface will be implemented here.
                  <br />
                  Features will include: creation, editing, billing management, and user assignment.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Bulk user operations and management
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  User management interface will be implemented here.
                  <br />
                  Features will include: bulk upload, role assignment, and user analytics.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscriptions</CardTitle>
                <CardDescription>
                  Monitor and manage all subscription billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Billing management interface will be implemented here.
                  <br />
                  Features will include: subscription tiers, payment processing, and revenue analytics.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Global system configuration and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  System settings interface will be implemented here.
                  <br />
                  Features will include: feature flags, global branding, and system configuration.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterAdminDashboard;
