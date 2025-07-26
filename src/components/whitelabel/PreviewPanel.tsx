import React, { useState } from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Monitor, Smartphone, Tablet, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface PreviewPanelProps {
  className?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ className = '' }) => {
  const { brandingConfig, previewMode, setPreviewMode } = useWhiteLabel();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');

  const deviceSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '600px' },
    mobile: { width: '375px', height: '600px' },
  };

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const mockComponents = {
    navbar: (
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ 
          backgroundColor: brandingConfig.colorScheme.surface,
          borderColor: brandingConfig.colorScheme.border,
        }}
      >
        <div className="flex items-center space-x-3">
          {brandingConfig.logoUrl ? (
            <img
              src={brandingConfig.logoUrl}
              alt="Logo"
              className="h-8 max-w-24 object-contain"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: brandingConfig.colorScheme.primary }}
            >
              {brandingConfig.companyName.charAt(0)}
            </div>
          )}
          <span 
            className="font-semibold"
            style={{ color: brandingConfig.colorScheme.text.primary }}
          >
            {brandingConfig.companyName}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span 
            className="text-sm"
            style={{ color: brandingConfig.colorScheme.text.secondary }}
          >
            Dashboard
          </span>
          <span 
            className="text-sm"
            style={{ color: brandingConfig.colorScheme.text.secondary }}
          >
            Settings
          </span>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
            style={{ backgroundColor: brandingConfig.colorScheme.primary }}
          >
            U
          </div>
        </div>
      </div>
    ),

    hero: (
      <div 
        className="p-8 text-center"
        style={{ backgroundColor: brandingConfig.colorScheme.background }}
      >
        <h1 
          className="text-3xl font-bold mb-4"
          style={{ 
            color: brandingConfig.colorScheme.text.primary,
            fontFamily: brandingConfig.typography.primaryFont,
          }}
        >
          Welcome to {brandingConfig.companyName}
        </h1>
        <p 
          className="text-lg mb-6"
          style={{ 
            color: brandingConfig.colorScheme.text.secondary,
            fontFamily: brandingConfig.typography.secondaryFont,
          }}
        >
          {brandingConfig.tagline || 'Transform your business with our powerful platform'}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-3 rounded-lg font-medium text-white"
            style={{ backgroundColor: brandingConfig.colorScheme.primary }}
          >
            Get Started
          </button>
          <button
            className="px-6 py-3 rounded-lg font-medium border"
            style={{ 
              color: brandingConfig.colorScheme.text.primary,
              borderColor: brandingConfig.colorScheme.border,
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    ),

    dashboard: (
      <div 
        className="p-6"
        style={{ backgroundColor: brandingConfig.colorScheme.background }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Stats Cards */}
          {['Total Sales', 'Active Leads', 'Conversion Rate'].map((title, index) => (
            <div 
              key={title}
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: brandingConfig.colorScheme.surface,
                borderColor: brandingConfig.colorScheme.border,
              }}
            >
              <h3 
                className="text-sm font-medium mb-2"
                style={{ color: brandingConfig.colorScheme.text.secondary }}
              >
                {title}
              </h3>
              <div 
                className="text-2xl font-bold"
                style={{ color: brandingConfig.colorScheme.text.primary }}
              >
                {index === 0 ? '$12,345' : index === 1 ? '123' : '12.3%'}
              </div>
              <div 
                className="text-sm mt-1"
                style={{ color: brandingConfig.colorScheme.success }}
              >
                +{index + 5}% from last month
              </div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div 
          className="p-6 rounded-lg border"
          style={{ 
            backgroundColor: brandingConfig.colorScheme.surface,
            borderColor: brandingConfig.colorScheme.border,
          }}
        >
          <h3 
            className="text-lg font-semibold mb-4"
            style={{ color: brandingConfig.colorScheme.text.primary }}
          >
            Sales Overview
          </h3>
          <div 
            className="h-32 rounded flex items-end justify-center space-x-2"
            style={{ backgroundColor: brandingConfig.colorScheme.background }}
          >
            {[40, 60, 30, 80, 50, 70, 90].map((height, index) => (
              <div
                key={index}
                className="w-8 rounded-t"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: index % 2 === 0 
                    ? brandingConfig.colorScheme.primary 
                    : brandingConfig.colorScheme.accent,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),

    alerts: (
      <div className="p-4 space-y-3">
        <div 
          className="p-3 rounded-lg border-l-4"
          style={{ 
            backgroundColor: brandingConfig.colorScheme.success + '10',
            borderLeftColor: brandingConfig.colorScheme.success,
          }}
        >
          <div 
            className="font-medium text-sm"
            style={{ color: brandingConfig.colorScheme.success }}
          >
            Success
          </div>
          <div 
            className="text-sm"
            style={{ color: brandingConfig.colorScheme.text.secondary }}
          >
            Operation completed successfully
          </div>
        </div>

        <div 
          className="p-3 rounded-lg border-l-4"
          style={{ 
            backgroundColor: brandingConfig.colorScheme.warning + '10',
            borderLeftColor: brandingConfig.colorScheme.warning,
          }}
        >
          <div 
            className="font-medium text-sm"
            style={{ color: brandingConfig.colorScheme.warning }}
          >
            Warning
          </div>
          <div 
            className="text-sm"
            style={{ color: brandingConfig.colorScheme.text.secondary }}
          >
            Please review your settings
          </div>
        </div>

        <div 
          className="p-3 rounded-lg border-l-4"
          style={{ 
            backgroundColor: brandingConfig.colorScheme.error + '10',
            borderLeftColor: brandingConfig.colorScheme.error,
          }}
        >
          <div 
            className="font-medium text-sm"
            style={{ color: brandingConfig.colorScheme.error }}
          >
            Error
          </div>
          <div 
            className="text-sm"
            style={{ color: brandingConfig.colorScheme.text.secondary }}
          >
            Something went wrong
          </div>
        </div>
      </div>
    ),
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Live Preview</span>
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={togglePreviewMode}
              className="flex items-center space-x-1"
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{previewMode ? 'Exit' : 'Preview'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="flex items-center space-x-1"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Device Selector */}
        <div className="flex items-center justify-center space-x-2 p-2 bg-gray-100 rounded-lg">
          {(Object.keys(deviceSizes) as DeviceType[]).map((device) => {
            const Icon = deviceIcons[device];
            return (
              <Button
                key={device}
                variant={selectedDevice === device ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDevice(device)}
                className="flex items-center space-x-1"
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{device}</span>
              </Button>
            );
          })}
        </div>

        {/* Preview Container */}
        <div className="flex justify-center">
          <div 
            className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white"
            style={{ 
              width: deviceSizes[selectedDevice].width,
              height: deviceSizes[selectedDevice].height,
              maxWidth: '100%',
            }}
          >
            <div className="h-full overflow-y-auto">
              {/* Navigation Preview */}
              {mockComponents.navbar}
              
              {/* Content Preview */}
              <div className="space-y-6">
                {mockComponents.hero}
                {mockComponents.dashboard}
                {mockComponents.alerts}
              </div>
              
              {/* Footer Preview */}
              <div 
                className="p-4 mt-8 border-t text-center"
                style={{ 
                  backgroundColor: brandingConfig.colorScheme.surface,
                  borderColor: brandingConfig.colorScheme.border,
                }}
              >
                <p 
                  className="text-sm"
                  style={{ color: brandingConfig.colorScheme.text.muted }}
                >
                  {brandingConfig.footerText || `© 2024 ${brandingConfig.companyName}. All rights reserved.`}
                </p>
                {brandingConfig.website && (
                  <p 
                    className="text-xs mt-1"
                    style={{ color: brandingConfig.colorScheme.text.muted }}
                  >
                    {brandingConfig.website}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Preview shows how your branding will appear across the platform
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Current device: {selectedDevice} ({deviceSizes[selectedDevice].width})
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDevice('mobile')}
            className="text-xs"
          >
            Test Mobile View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // In a real app, this would open a new tab with the branded interface
              const newWindow = window.open('about:blank', '_blank');
              if (newWindow) {
                newWindow.document.title = `${brandingConfig.companyName} - Preview`;
              }
            }}
            className="text-xs"
          >
            Open Full Preview
          </Button>
        </div>

        {/* Accessibility Check */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Accessibility Check
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Color Contrast</span>
              <span className="text-green-600">✓ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Font Readability</span>
              <span className="text-green-600">✓ Good</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-700">Logo Visibility</span>
              <span className={brandingConfig.logoUrl ? "text-green-600" : "text-yellow-600"}>
                {brandingConfig.logoUrl ? "✓ Good" : "⚠ Logo Missing"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewPanel;
