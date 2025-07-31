import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '../contexts/WhiteLabelContext';
import { WhiteLabelEditor } from '../components/whitelabel/WhiteLabelEditor';
import { BrandingOnboarding } from '../components/whitelabel/BrandingOnboarding';
import { BrandingAnalytics } from '../components/whitelabel/BrandingAnalytics';
import { MultiTenantManager } from '../components/whitelabel/MultiTenantManager';
import { BrandingAPI } from '../components/whitelabel/BrandingAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Palette, 
  Settings, 
  BarChart3, 
  Users, 
  Code, 
  Globe, 
  Rocket,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield
} from 'lucide-react';

export const WhiteLabelPage: React.FC = () => {
  const { brandingConfig, isCustomized, isDirty } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState('editor');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user needs onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('whitelabel-onboarding-completed');
    if (!hasCompletedOnboarding && !isCustomized) {
      setShowOnboarding(true);
    }
  }, [isCustomized]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('whitelabel-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  const brandingStatus = {
    overall: isCustomized ? 'complete' : 'incomplete',
    items: [
      { 
        name: 'Company Information', 
        status: brandingConfig.companyName !== 'SmartCRM' ? 'complete' : 'incomplete',
        description: 'Company name, tagline, and contact info'
      },
      { 
        name: 'Color Scheme', 
        status: brandingConfig.colorScheme.primary !== '#3b82f6' ? 'complete' : 'incomplete',
        description: 'Brand colors and theme'
      },
      { 
        name: 'Logo & Assets', 
        status: brandingConfig.logoUrl ? 'complete' : 'incomplete',
        description: 'Company logo and favicon'
      },
      { 
        name: 'Typography', 
        status: brandingConfig.typography.primaryFont !== 'Inter' ? 'complete' : 'incomplete',
        description: 'Font selection and styling'
      }
    ]
  };

  const completedItems = brandingStatus.items.filter(item => item.status === 'complete').length;
  const completionPercentage = Math.round((completedItems / brandingStatus.items.length) * 100);

  if (showOnboarding) {
    return (
      <BrandingOnboarding 
        onComplete={handleCompleteOnboarding}
        onSkip={handleCompleteOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Palette className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  White Label Platform
                </h1>
                {isDirty && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Unsaved Changes
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 max-w-2xl">
                Customize your platform's appearance, branding, and user experience. 
                Create a unique branded experience that reflects your company's identity.
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {completionPercentage}%
              </div>
              <div className="text-sm text-gray-500">
                Branding Complete
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Branding Status</span>
            </CardTitle>
            <CardDescription>
              Track your white-label customization progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {brandingStatus.items.map((item) => (
                <div 
                  key={item.name}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  {item.status === 'complete' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="editor" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Brand Editor</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="tenants" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Multi-Tenant</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>API</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <WhiteLabelEditor />
          </TabsContent>

          <TabsContent value="analytics">
            <BrandingAnalytics />
          </TabsContent>

          <TabsContent value="tenants">
            <MultiTenantManager />
          </TabsContent>

          <TabsContent value="api">
            <BrandingAPI />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Advanced Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure advanced white-label features and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Domain Management */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Domain Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Auto-branding by Domain</div>
                          <div className="text-xs text-gray-500">Automatically apply branding based on domain</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Custom Domain Support</div>
                          <div className="text-xs text-gray-500">Enable custom domain branding</div>
                        </div>
                        <Button variant="outline" size="sm">Setup</Button>
                      </div>
                    </div>
                  </div>

                  {/* Compliance */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Brand Compliance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Brand Guidelines Checker</div>
                          <div className="text-xs text-gray-500">Validate branding against guidelines</div>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Asset Quality Control</div>
                          <div className="text-xs text-gray-500">Automatic image optimization</div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>

                  {/* Reset & Backup */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Reset & Backup</h4>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowOnboarding(true)}
                        className="flex items-center space-x-2"
                      >
                        <Rocket className="w-4 h-4" />
                        <span>Restart Onboarding</span>
                      </Button>
                      <Button variant="outline">Export All Configs</Button>
                      <Button variant="outline">Backup to Cloud</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions Footer */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{brandingConfig.companyName}</span> branding is {completionPercentage}% complete
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Preview Live Site
                </Button>
                <Button size="sm">
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhiteLabelPage;
