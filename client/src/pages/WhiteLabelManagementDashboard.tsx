
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTenant } from '../contexts/TenantProvider';
import { 
  Palette, 
  Users, 
  DollarSign, 
  Settings, 
  Globe, 
  BarChart3, 
  Shield, 
  Zap,
  Monitor,
  Smartphone,
  Mail,
  Code,
  Download,
  Upload,
  Eye,
  Save
} from 'lucide-react';
import RemoteWhiteLabelLoader from '../components/RemoteWhiteLabelLoader';

interface WhiteLabelStats {
  totalTenants: number;
  activeCustomers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  avgCustomerValue: number;
  churnRate: number;
}

const WhiteLabelManagementDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<WhiteLabelStats>({
    totalTenants: 0,
    activeCustomers: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    avgCustomerValue: 0,
    churnRate: 0
  });

  const [brandingTemplates, setBrandingTemplates] = useState([
    {
      id: '1',
      name: 'Professional Blue',
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      preview: '/templates/professional-blue.png',
      category: 'Corporate'
    },
    {
      id: '2',
      name: 'Modern Green',
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      preview: '/templates/modern-green.png',
      category: 'Tech'
    },
    {
      id: '3',
      name: 'Elegant Purple',
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#8b5cf6',
      preview: '/templates/elegant-purple.png',
      category: 'Creative'
    }
  ]);

  useEffect(() => {
    fetchWhiteLabelStats();
  }, []);

  const fetchWhiteLabelStats = async () => {
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/white-label/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch white-label stats:', error);
      // Set demo data
      setStats({
        totalTenants: 127,
        activeCustomers: 1843,
        monthlyRevenue: 84500,
        totalRevenue: 1250000,
        avgCustomerValue: 458,
        churnRate: 2.3
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'branding', label: 'Branding Hub', icon: Palette },
    { id: 'tenants', label: 'Tenant Management', icon: Users },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
    { id: 'integrations', label: 'Platform Integration', icon: Globe },
    { id: 'automation', label: 'AI Automation', icon: Zap },
    { id: 'settings', label: 'Global Settings', icon: Settings }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  White-Label Management Center
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comprehensive platform management and customization hub
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className={`px-4 py-2 rounded-lg border ${
                isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } flex items-center gap-2`}>
                <Download className="h-4 w-4" />
                Export Data
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Tenants</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalTenants}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Customers</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeCustomers.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-100 text-green-600">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Revenue</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(stats.monthlyRevenue)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Customer Value</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(stats.avgCustomerValue)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Remote White-Label Suite Integration */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Integrated White-Label Suite
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Full-featured white-label management platform
                </p>
              </div>
              <div style={{ height: '800px' }}>
                <RemoteWhiteLabelLoader showHeader={true} />
              </div>
            </div>
          </div>
        )}

        {/* Branding Hub Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Branding Templates */}
              <div className="lg:col-span-2">
                <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Branding Templates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {brandingTemplates.map((template) => (
                      <div key={template.id} className={`border ${isDark ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: template.primary }}></div>
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: template.secondary }}></div>
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: template.accent }}></div>
                        </div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{template.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{template.category}</p>
                        <button className="mt-3 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                          Apply Template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <Palette className="h-5 w-5 text-purple-600" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Customize Branding</span>
                    </button>
                    <button className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Domain Setup</span>
                    </button>
                    <button className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <Code className="h-5 w-5 text-green-600" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Custom CSS</span>
                    </button>
                    <button className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <Eye className="h-5 w-5 text-orange-600" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Preview Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab !== 'overview' && activeTab !== 'branding' && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              {tabs.find(tab => tab.id === activeTab)?.label} - Coming Soon
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              This section is under development and will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteLabelManagementDashboard;
