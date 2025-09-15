import React, { useState, useEffect, useRef } from 'react';
import { useWhitelabel } from '../contexts/WhitelabelContext';
import { WhitelabelButton } from '../types/whitelabel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  Copy,
  Check,
  Plus,
  Trash2,
  Palette,
  Type,
  Link,
  Eye,
  Settings,
  Sparkles,
  Wand2,
  Globe,
  MessageSquare,
  Shield,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

const WhiteLabelCustomization: React.FC = () => {
  const { config, updateConfig, resetToDefault, exportConfig, importConfig } = useWhitelabel();
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSection, setActiveSection] = useState('branding');
  const initializedRef = useRef(false);

  const handleButtonUpdate = (index: number, updates: Partial<WhitelabelButton>) => {
    const newButtons = [...config.ctaButtons];
    newButtons[index] = { ...newButtons[index], ...updates };
    updateConfig({ ctaButtons: newButtons });
  };

  const addButton = () => {
    const newButton: WhitelabelButton = {
      id: `button_${Date.now()}`,
      text: 'New Button',
      url: '/dashboard',
      color: '#3B82F6',
      variant: 'primary',
      enabled: true
    };
    updateConfig({ ctaButtons: [...config.ctaButtons, newButton] });
  };

  const removeButton = (index: number) => {
    const newButtons = config.ctaButtons.filter((_, i) => i !== index);
    updateConfig({ ctaButtons: newButtons });
  };

  const handleExport = () => {
    const configString = exportConfig();
    navigator.clipboard.writeText(configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      importConfig(importText);
      setImportText('');
    } catch (error) {
      console.error('Failed to import config:', error);
    }
  };

  // Initialize component
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setIsInitialized(true);
  }, []);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <main className="w-full h-full flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Loading White Label Customization
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Initializing customization tools...
          </p>
        </div>
      </main>
    );
  }

  // Render section content based on active section
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'branding':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={config.companyName}
                    onChange={(e) => updateConfig({ companyName: e.target.value })}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={config.logoUrl}
                    onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                    placeholder="https://your-logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    value={config.supportEmail}
                    onChange={(e) => updateConfig({ supportEmail: e.target.value })}
                    placeholder="support@yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={config.supportPhone}
                    onChange={(e) => updateConfig({ supportPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Color Scheme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      placeholder="#1E40AF"
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'buttons':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Call-to-Action Buttons
                </div>
                <Button onClick={addButton} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Button
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.ctaButtons.map((button, index) => (
                  <div key={button.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={button.text}
                          onChange={(e) => handleButtonUpdate(index, { text: e.target.value })}
                          placeholder="Button Text"
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={button.url}
                          onChange={(e) => handleButtonUpdate(index, { url: e.target.value })}
                          placeholder="/dashboard"
                        />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={button.color}
                            onChange={(e) => handleButtonUpdate(index, { color: e.target.value })}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={button.color}
                            onChange={(e) => handleButtonUpdate(index, { color: e.target.value })}
                            placeholder="#3B82F6"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeButton(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {config.ctaButtons.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No buttons configured. Add your first button to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Import/Export Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="configImport">Import Configuration</Label>
                <div className="flex space-x-2">
                  <Textarea
                    id="configImport"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste your configuration JSON here..."
                    rows={3}
                    className="flex-1"
                  />
                  <Button onClick={handleImport} disabled={!importText.trim()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Export current configuration</span>
                  <Button onClick={handleExport} variant="outline">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Config
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Section
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Loading section content...</p>
          </div>
        );
    }
  };

  return (
    <main className={`w-full h-full overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Dashboard Header - Always visible */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">White Label Customization</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Customize your application's branding and appearance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetToDefault}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'branding', label: 'Branding', icon: Palette },
            { id: 'buttons', label: 'Buttons', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeSection === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="space-y-8 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {renderSectionContent(activeSection)}
        </div>
      </div>
    </main>
  );
};

export default WhiteLabelCustomization;