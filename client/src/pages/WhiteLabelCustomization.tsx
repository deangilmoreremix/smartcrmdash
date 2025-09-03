import React, { useState } from 'react';
import { useWhitelabel } from '../contexts/WhitelabelContext';
import { WhitelabelButton } from '../types/whitelabel';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
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
  MessageSquare
} from 'lucide-react';

const WhiteLabelCustomization: React.FC = () => {
  const { config, updateConfig, resetToDefault, exportConfig, importConfig } = useWhitelabel();
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');

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
    if (importText.trim()) {
      try {
        importConfig(importText.trim());
        setImportText('');
        alert('Configuration imported successfully!');
      } catch (error) {
        alert('Error importing configuration. Please check the format.');
      }
    }
  };

  const addRedirect = () => {
    const newMappings = { ...config.redirectMappings, '/new-redirect': 'https://example.com' };
    updateConfig({ redirectMappings: newMappings });
  };

  const updateRedirect = (key: string, value: string) => {
    const newMappings = { ...config.redirectMappings, [key]: value };
    updateConfig({ redirectMappings: newMappings });
  };

  const removeRedirect = (key: string) => {
    const newMappings = { ...config.redirectMappings };
    delete newMappings[key];
    updateConfig({ redirectMappings: newMappings });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                White Label Studio
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Transform your CRM with custom branding and personalized experiences
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Company</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {config.companyName || 'Not Set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">CTA Buttons</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {config.ctaButtons.filter(b => b.enabled).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Link className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Redirects</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {Object.keys(config.redirectMappings).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Features</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {[config.showPricing, config.showTestimonials, config.showFeatures].filter(Boolean).length}/3
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Branding Section */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Brand Identity</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Define your company's visual identity
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Company Name
                  </Label>
                  <Input
                    id="company-name"
                    type="text"
                    value={config.companyName}
                    onChange={(e) => updateConfig({ companyName: e.target.value })}
                    className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo-url" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Logo URL <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </Label>
                  <Input
                    id="logo-url"
                    type="url"
                    value={config.logoUrl || ''}
                    onChange={(e) => updateConfig({ logoUrl: e.target.value || undefined })}
                    className="h-11 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-white shadow-sm"></div>
                      Primary Color
                    </Label>
                    <div className="relative">
                      <Input
                        id="primary-color"
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                        className="h-11 cursor-pointer border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 pr-3"
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: config.primaryColor }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-white shadow-sm"></div>
                      Secondary Color
                    </Label>
                    <div className="relative">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                        className="h-11 cursor-pointer border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 pr-3"
                      />
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: config.secondaryColor }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Section */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Hero Content</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Craft your landing page message
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Hero Title
                  </Label>
                  <Input
                    id="hero-title"
                    type="text"
                    value={config.heroTitle}
                    onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                    className="h-11 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20"
                    placeholder="Enter your main headline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Hero Subtitle
                  </Label>
                  <Textarea
                    id="hero-subtitle"
                    value={config.heroSubtitle}
                    onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                    rows={4}
                    className="border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                    placeholder="Describe your value proposition..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <Card className="xl:col-span-2 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <Wand2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Call-to-Action Buttons</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Create compelling action buttons for your landing page
                    </p>
                  </div>
                </div>
                <Button
                  onClick={addButton}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Button
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config.ctaButtons.map((button, index) => (
                  <Card key={button.id} className="border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: button.color || '#3B82F6' }}
                          ></div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                              {button.text || 'Button Text'}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {button.url || 'No URL set'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={button.enabled ? "default" : "secondary"} className="text-xs">
                            {button.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          <Button
                            onClick={() => removeButton(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Button Text</Label>
                          <Input
                            type="text"
                            value={button.text}
                            onChange={(e) => handleButtonUpdate(index, { text: e.target.value })}
                            className="h-9 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20"
                            placeholder="Enter button text"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL</Label>
                          <Input
                            type="url"
                            value={button.url}
                            onChange={(e) => handleButtonUpdate(index, { url: e.target.value })}
                            className="h-9 border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20"
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Button Color</Label>
                          <div className="relative">
                            <Input
                              type="color"
                              value={button.color || '#3B82F6'}
                              onChange={(e) => handleButtonUpdate(index, { color: e.target.value })}
                              className="h-9 cursor-pointer border-slate-200 dark:border-slate-700 focus:border-green-500 focus:ring-green-500/20 pr-3"
                            />
                            <div
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: button.color || '#3B82F6' }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Settings</Label>
                          <div className="flex items-center gap-3 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={button.enabled}
                                onChange={(e) => handleButtonUpdate(index, { enabled: e.target.checked })}
                                className="w-4 h-4 text-green-600 bg-slate-100 border-slate-300 rounded focus:ring-green-500 focus:ring-2"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Enabled</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {config.ctaButtons.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <Wand2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">No CTA Buttons Yet</h3>
                    <p className="text-slate-500 dark:text-slate-500 mb-4">Add your first call-to-action button to get started</p>
                    <Button
                      onClick={addButton}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Button
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Link Redirects */}
          <Card className="xl:col-span-2 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                    <Link className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Link Redirects</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Manage URL redirects for your custom links
                    </p>
                  </div>
                </div>
                <Button
                  onClick={addRedirect}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Redirect
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(config.redirectMappings).map(([from, to]) => (
                  <Card key={from} className="border border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            From Path
                          </Label>
                          <Input
                            type="text"
                            value={from}
                            onChange={(e) => {
                              const newMappings = { ...config.redirectMappings };
                              delete newMappings[from];
                              newMappings[e.target.value] = to;
                              updateConfig({ redirectMappings: newMappings });
                            }}
                            className="h-9 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500/20"
                            placeholder="/old-path"
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            To URL
                          </Label>
                          <Input
                            type="url"
                            value={to}
                            onChange={(e) => updateRedirect(from, e.target.value)}
                            className="h-9 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500/20"
                            placeholder="https://example.com/new-path"
                          />
                        </div>

                        <Button
                          onClick={() => removeRedirect(from)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 mb-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {Object.keys(config.redirectMappings).length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <Link className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">No Redirects Configured</h3>
                    <p className="text-slate-500 dark:text-slate-500 mb-4">Add URL redirects to customize your link behavior</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Feature Visibility</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Control which sections appear on your landing page
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <span className="text-green-600 dark:text-green-400 font-bold text-sm">$</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Pricing Section</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Show pricing plans and features</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showPricing}
                      onChange={(e) => updateConfig({ showPricing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">★</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Testimonials</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Display customer testimonials</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showTestimonials}
                      onChange={(e) => updateConfig({ showTestimonials: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">⚡</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Features Section</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Show product features and capabilities</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showFeatures}
                      onChange={(e) => updateConfig({ showFeatures: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import/Export */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Configuration Management</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Backup, restore, and share your whitelabel settings
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Export Configuration</Label>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    className="w-full h-11 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {copied ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? 'Copied to Clipboard!' : 'Copy Configuration'}
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Import Configuration</Label>
                  <Textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste your exported configuration JSON here..."
                    rows={4}
                    className="border-slate-200 dark:border-slate-700 focus:border-slate-500 focus:ring-slate-500/20 resize-none"
                  />
                  <Button
                    onClick={handleImport}
                    className="w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
          >
            <Eye className="mr-2 h-5 w-5" />
            Preview Landing Page
          </Button>

          <Button
            onClick={handleExport}
            variant="outline"
            className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-12"
          >
            <Download className="mr-2 h-5 w-5" />
            Export Settings
          </Button>

          <Button
            onClick={resetToDefault}
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 h-12"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset to Default
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Changes are automatically saved to your browser's local storage
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelCustomization;