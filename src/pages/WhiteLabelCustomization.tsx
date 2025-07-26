import React, { useState, useCallback } from 'react';
import { 
  Palette, 
  Upload, 
  Download, 
  Save, 
  RefreshCw, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor,
  Image,
  Type,
  Layout,
  Settings,
  Check,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

interface BrandAssets {
  logo?: File | null;
  logoUrl?: string;
  favicon?: File | null;
  faviconUrl?: string;
  backgroundImage?: File | null;
  backgroundImageUrl?: string;
}

interface CustomizationSettings {
  companyName: string;
  customDomain: string;
  colorScheme: ColorScheme;
  brandAssets: BrandAssets;
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  layout: {
    sidebarPosition: 'left' | 'right';
    headerStyle: 'minimal' | 'standard' | 'enhanced';
    cardStyle: 'flat' | 'elevated' | 'outlined';
  };
  features: {
    showBranding: boolean;
    customFooter: string;
    customCssUrl: string;
  };
}

const defaultColorSchemes: { name: string; colors: ColorScheme }[] = [
  {
    name: 'Corporate Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb'
    }
  },
  {
    name: 'Professional Green',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827',
      border: '#d1d5db'
    }
  },
  {
    name: 'Modern Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb'
    }
  },
  {
    name: 'Elegant Dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#06b6d4',
      background: '#111827',
      text: '#f9fafb',
      border: '#374151'
    }
  }
];

const WhiteLabelCustomization: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'colors' | 'assets' | 'typography' | 'layout' | 'domain' | 'preview'>('colors');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState<CustomizationSettings>({
    companyName: 'Your Company Name',
    customDomain: '',
    colorScheme: defaultColorSchemes[0].colors,
    brandAssets: {},
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    layout: {
      sidebarPosition: 'left',
      headerStyle: 'standard',
      cardStyle: 'elevated'
    },
    features: {
      showBranding: true,
      customFooter: '',
      customCssUrl: ''
    }
  });

  const updateSettings = useCallback((updates: Partial<CustomizationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setUnsavedChanges(true);
  }, []);

  const updateColorScheme = useCallback((colors: Partial<ColorScheme>) => {
    setSettings(prev => ({
      ...prev,
      colorScheme: { ...prev.colorScheme, ...colors }
    }));
    setUnsavedChanges(true);
  }, []);

  const handleFileUpload = useCallback((file: File, type: 'logo' | 'favicon' | 'backgroundImage') => {
    const url = URL.createObjectURL(file);
    updateSettings({
      brandAssets: {
        ...settings.brandAssets,
        [type]: file,
        [`${type}Url`]: url
      }
    });
  }, [settings.brandAssets, updateSettings]);

  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUnsavedChanges(false);
      alert('White-label settings saved successfully!');
    } catch (error) {
      alert('Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    if (confirm('Are you sure you want to reset all customizations to default?')) {
      setSettings({
        companyName: 'Your Company Name',
        customDomain: '',
        colorScheme: defaultColorSchemes[0].colors,
        brandAssets: {},
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
          fontSize: 'medium'
        },
        layout: {
          sidebarPosition: 'left',
          headerStyle: 'standard',
          cardStyle: 'elevated'
        },
        features: {
          showBranding: true,
          customFooter: '',
          customCssUrl: ''
        }
      });
      setUnsavedChanges(true);
    }
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'white-label-settings.json';
    link.click();
  }, [settings]);

  const tabs = [
    { id: 'colors', label: 'Colors & Themes', icon: Palette },
    { id: 'assets', label: 'Brand Assets', icon: Image },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'domain', label: 'Domain & Settings', icon: Globe },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pt-20 pb-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                White-Label Customization
              </h1>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Customize the platform with your branding, colors, and domain settings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportSettings}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border'
                }`}
              >
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                onClick={resetToDefaults}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border'
                }`}
              >
                <RefreshCw size={16} />
                <span>Reset</span>
              </button>
              <button
                onClick={saveSettings}
                disabled={!unsavedChanges || isLoading}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                  unsavedChanges && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
          
          {unsavedChanges && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">
                You have unsaved changes. Don't forget to save your customizations.
              </p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          {/* Colors & Themes Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Color Scheme & Themes
              </h2>
              
              {/* Preset Color Schemes */}
              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Preset Themes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {defaultColorSchemes.map((scheme) => (
                    <button
                      key={scheme.name}
                      onClick={() => updateColorScheme(scheme.colors)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        JSON.stringify(settings.colorScheme) === JSON.stringify(scheme.colors)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.colors.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.colors.accent }}
                        />
                      </div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {scheme.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Inputs */}
              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Custom Colors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(settings.colorScheme).map(([key, value]) => (
                    <div key={key}>
                      <label className={`block text-sm font-medium mb-2 capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => updateColorScheme({ [key]: e.target.value } as any)}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateColorScheme({ [key]: e.target.value } as any)}
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Brand Assets Tab */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Brand Assets
              </h2>
              
              {/* Logo Upload */}
              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Company Logo
                </h3>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDark ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {settings.brandAssets.logoUrl ? (
                    <div className="space-y-4">
                      <img 
                        src={settings.brandAssets.logoUrl} 
                        alt="Logo preview" 
                        className="max-h-32 mx-auto"
                      />
                      <button
                        onClick={() => updateSettings({
                          brandAssets: { ...settings.brandAssets, logo: null, logoUrl: undefined }
                        })}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Upload your company logo (SVG, PNG, JPG)
                      </p>
                      <input
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'logo');
                        }}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Favicon Upload */}
              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Favicon
                </h3>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDark ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {settings.brandAssets.faviconUrl ? (
                    <div className="space-y-4">
                      <img 
                        src={settings.brandAssets.faviconUrl} 
                        alt="Favicon preview" 
                        className="w-8 h-8 mx-auto"
                      />
                      <button
                        onClick={() => updateSettings({
                          brandAssets: { ...settings.brandAssets, favicon: null, faviconUrl: undefined }
                        })}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Favicon
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className={`mx-auto h-8 w-8 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Upload favicon (ICO, PNG - 32x32px recommended)
                      </p>
                      <input
                        type="file"
                        accept=".ico,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'favicon');
                        }}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Typography Settings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Heading Font
                  </label>
                  <select
                    value={settings.typography.headingFont}
                    onChange={(e) => updateSettings({
                      typography: { ...settings.typography, headingFont: e.target.value }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Body Font
                  </label>
                  <select
                    value={settings.typography.bodyFont}
                    onChange={(e) => updateSettings({
                      typography: { ...settings.typography, bodyFont: e.target.value }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Font Size
                </label>
                <div className="flex space-x-4">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSettings({
                        typography: { ...settings.typography, fontSize: size as any }
                      })}
                      className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                        settings.typography.fontSize === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : isDark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Domain & Settings Tab */}
          {activeTab === 'domain' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Domain & Advanced Settings
              </h2>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => updateSettings({ companyName: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Custom Domain
                </label>
                <input
                  type="text"
                  value={settings.customDomain}
                  onChange={(e) => updateSettings({ customDomain: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="your-domain.com"
                />
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enter your custom domain (requires DNS configuration)
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Custom Footer Text
                </label>
                <textarea
                  value={settings.features.customFooter}
                  onChange={(e) => updateSettings({
                    features: { ...settings.features, customFooter: e.target.value }
                  })}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.features.showBranding}
                    onChange={(e) => updateSettings({
                      features: { ...settings.features, showBranding: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Show platform branding
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Live Preview
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Desktop Preview */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Monitor size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Desktop</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: settings.colorScheme.background }}>
                    <div className="h-8" style={{ backgroundColor: settings.colorScheme.primary }}></div>
                    <div className="p-4">
                      <div className="h-4 rounded mb-2" style={{ backgroundColor: settings.colorScheme.secondary, width: '60%' }}></div>
                      <div className="h-3 rounded mb-1" style={{ backgroundColor: settings.colorScheme.text, opacity: 0.3, width: '80%' }}></div>
                      <div className="h-3 rounded" style={{ backgroundColor: settings.colorScheme.text, opacity: 0.3, width: '40%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Tablet Preview */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Smartphone size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Tablet</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden w-3/4" style={{ backgroundColor: settings.colorScheme.background }}>
                    <div className="h-6" style={{ backgroundColor: settings.colorScheme.primary }}></div>
                    <div className="p-3">
                      <div className="h-3 rounded mb-2" style={{ backgroundColor: settings.colorScheme.secondary, width: '70%' }}></div>
                      <div className="h-2 rounded mb-1" style={{ backgroundColor: settings.colorScheme.text, opacity: 0.3, width: '90%' }}></div>
                      <div className="h-2 rounded" style={{ backgroundColor: settings.colorScheme.text, opacity: 0.3, width: '50%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Smartphone size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Mobile</h3>
                  </div>
                  <div className="border rounded-lg overflow-hidden w-1/2" style={{ backgroundColor: settings.colorScheme.background }}>
                    <div className="h-4" style={{ backgroundColor: settings.colorScheme.primary }}></div>
                    <div className="p-2">
                      <div className="h-2 rounded mb-2" style={{ backgroundColor: settings.colorScheme.secondary, width: '80%' }}></div>
                      <div className="h-1 rounded mb-1" style={{ backgroundColor: settings.colorScheme.text, opacity: 0.3 }}></div>
                      <div className="h-1 rounded" style={{ backgroundColor: settings.colorScheme.text, opacity: 0.3, width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Palette Preview */}
              <div>
                <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Color Palette
                </h3>
                <div className="flex space-x-4">
                  {Object.entries(settings.colorScheme).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="w-16 h-16 rounded-lg border shadow-sm"
                        style={{ backgroundColor: value }}
                      ></div>
                      <p className={`mt-2 text-xs capitalize ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {key}
                      </p>
                      <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelCustomization;
