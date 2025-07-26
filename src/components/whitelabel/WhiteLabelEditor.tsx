import React, { useState } from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { BrandingPanel } from './BrandingPanel';
import { ColorSchemeEditor } from './ColorSchemeEditor';
import { LogoUploader } from './LogoUploader';
import { PreviewPanel } from './PreviewPanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Download, Upload, RotateCcw, Save } from 'lucide-react';

interface WhiteLabelEditorProps {
  className?: string;
}

export const WhiteLabelEditor: React.FC<WhiteLabelEditorProps> = ({ className = '' }) => {
  const { 
    brandingConfig, 
    exportConfig, 
    importConfig, 
    resetConfig,
    isDirty,
    saveConfig 
  } = useWhiteLabel();
  
  const [activeTab, setActiveTab] = useState('branding');

  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandingConfig.companyName || 'platform'}-branding-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          importConfig(content);
        } catch (error) {
          alert('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            White Label Configuration
          </h1>
          <p className="text-gray-600">
            Customize your platform's branding, colors, and appearance to match your business.
          </p>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleExport}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Config</span>
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Import Config</span>
                  </Button>
                </div>

                <Button 
                  onClick={resetConfig}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Default</span>
                </Button>
              </div>

              {isDirty && (
                <Button 
                  onClick={saveConfig}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Configuration Panels */}
          <div className="xl:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="logo">Logo</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="branding">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Branding</CardTitle>
                    <CardDescription>
                      Configure your company information and typography
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BrandingPanel />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="colors">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Scheme</CardTitle>
                    <CardDescription>
                      Customize your platform's color palette
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ColorSchemeEditor />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logo">
                <Card>
                  <CardHeader>
                    <CardTitle>Logo & Assets</CardTitle>
                    <CardDescription>
                      Upload and manage your brand assets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LogoUploader />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>
                      Additional customization options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom CSS
                        </label>
                        <textarea
                          placeholder="Add custom CSS styles here..."
                          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom JavaScript
                        </label>
                        <textarea
                          placeholder="Add custom JavaScript here..."
                          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">
                          ⚠️ Advanced Settings Warning
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Custom CSS and JavaScript can affect platform functionality. 
                          Please test thoroughly before deploying to production.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <PreviewPanel />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <Card className="mt-8">
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-600">
              <p>
                Changes are automatically saved as you work. 
                Export your configuration to backup or deploy to other environments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhiteLabelEditor;
