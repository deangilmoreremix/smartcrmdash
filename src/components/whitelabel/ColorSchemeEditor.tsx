import React from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Palette, RefreshCw, Eye } from 'lucide-react';

interface ColorSchemeEditorProps {
  className?: string;
}

interface ColorPreset {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

const colorPresets: ColorPreset[] = [
  {
    name: 'Default Blue',
    description: 'Professional and trustworthy',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        muted: '#9ca3af',
      },
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Modern Purple',
    description: 'Creative and innovative',
    colors: {
      primary: '#8b5cf6',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        muted: '#9ca3af',
      },
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Corporate Green',
    description: 'Growth and stability',
    colors: {
      primary: '#059669',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        muted: '#9ca3af',
      },
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Elegant Dark',
    description: 'Sophisticated and modern',
    colors: {
      primary: '#6366f1',
      secondary: '#94a3b8',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        muted: '#94a3b8',
      },
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Warm Orange',
    description: 'Energetic and friendly',
    colors: {
      primary: '#ea580c',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        muted: '#9ca3af',
      },
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
  {
    name: 'Professional Gray',
    description: 'Clean and minimalist',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f9fafb',
      text: {
        primary: '#111827',
        secondary: '#4b5563',
        muted: '#9ca3af',
      },
      border: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },
];

export const ColorSchemeEditor: React.FC<ColorSchemeEditorProps> = ({ className = '' }) => {
  const { brandingConfig, updateBranding } = useWhiteLabel();

  const handleColorChange = (colorPath: string, value: string) => {
    const pathArray = colorPath.split('.');
    if (pathArray.length === 1) {
      updateBranding({
        colorScheme: {
          ...brandingConfig.colorScheme,
          [pathArray[0]]: value,
        },
      });
    } else if (pathArray.length === 2 && pathArray[0] === 'text') {
      updateBranding({
        colorScheme: {
          ...brandingConfig.colorScheme,
          text: {
            ...brandingConfig.colorScheme.text,
            [pathArray[1]]: value,
          },
        },
      });
    }
  };

  const applyPreset = (preset: ColorPreset) => {
    updateBranding({
      colorScheme: preset.colors,
      // Also update legacy properties for backward compatibility
      primaryColor: preset.colors.primary,
      secondaryColor: preset.colors.secondary,
      accentColor: preset.colors.accent,
      backgroundColor: preset.colors.background,
      textColor: preset.colors.text.primary,
    });
  };

  const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; description?: string }> = ({
    label,
    value,
    onChange,
    description,
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#000000"
          />
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Color Presets */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Color Presets</span>
          </CardTitle>
          <CardDescription>
            Choose from pre-designed color schemes or create your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorPresets.map((preset) => (
              <Card 
                key={preset.name} 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                onClick={() => applyPreset(preset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{preset.name}</h4>
                    <Button size="sm" variant="outline" className="h-7 px-2">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{preset.description}</p>
                  <div className="flex space-x-1">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200" 
                      style={{ backgroundColor: preset.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200" 
                      style={{ backgroundColor: preset.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200" 
                      style={{ backgroundColor: preset.colors.accent }}
                      title="Accent"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200" 
                      style={{ backgroundColor: preset.colors.success }}
                      title="Success"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <span>Custom Colors</span>
          </CardTitle>
          <CardDescription>
            Fine-tune your color palette
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Colors */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Primary Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput
                label="Primary"
                value={brandingConfig.colorScheme.primary}
                onChange={(value) => handleColorChange('primary', value)}
                description="Main brand color used for buttons and links"
              />
              <ColorInput
                label="Secondary"
                value={brandingConfig.colorScheme.secondary}
                onChange={(value) => handleColorChange('secondary', value)}
                description="Supporting color for less prominent elements"
              />
              <ColorInput
                label="Accent"
                value={brandingConfig.colorScheme.accent}
                onChange={(value) => handleColorChange('accent', value)}
                description="Highlighting color for special elements"
              />
            </div>
          </div>

          {/* Background Colors */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Background Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput
                label="Background"
                value={brandingConfig.colorScheme.background}
                onChange={(value) => handleColorChange('background', value)}
                description="Main background color"
              />
              <ColorInput
                label="Surface"
                value={brandingConfig.colorScheme.surface}
                onChange={(value) => handleColorChange('surface', value)}
                description="Card and panel background color"
              />
              <ColorInput
                label="Border"
                value={brandingConfig.colorScheme.border}
                onChange={(value) => handleColorChange('border', value)}
                description="Border color for elements"
              />
            </div>
          </div>

          {/* Text Colors */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Text Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorInput
                label="Primary Text"
                value={brandingConfig.colorScheme.text.primary}
                onChange={(value) => handleColorChange('text.primary', value)}
                description="Main text color"
              />
              <ColorInput
                label="Secondary Text"
                value={brandingConfig.colorScheme.text.secondary}
                onChange={(value) => handleColorChange('text.secondary', value)}
                description="Supporting text color"
              />
              <ColorInput
                label="Muted Text"
                value={brandingConfig.colorScheme.text.muted}
                onChange={(value) => handleColorChange('text.muted', value)}
                description="Subtle text color"
              />
            </div>
          </div>

          {/* Status Colors */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Status Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ColorInput
                label="Success"
                value={brandingConfig.colorScheme.success}
                onChange={(value) => handleColorChange('success', value)}
                description="Success states and positive actions"
              />
              <ColorInput
                label="Warning"
                value={brandingConfig.colorScheme.warning}
                onChange={(value) => handleColorChange('warning', value)}
                description="Warning states and caution"
              />
              <ColorInput
                label="Error"
                value={brandingConfig.colorScheme.error}
                onChange={(value) => handleColorChange('error', value)}
                description="Error states and destructive actions"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Preview */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Color Preview</CardTitle>
          <CardDescription>
            See how your colors work together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border-2"
            style={{ 
              backgroundColor: brandingConfig.colorScheme.background,
              borderColor: brandingConfig.colorScheme.border,
            }}
          >
            <div 
              className="p-4 rounded-lg mb-4"
              style={{ backgroundColor: brandingConfig.colorScheme.surface }}
            >
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: brandingConfig.colorScheme.text.primary }}
              >
                {brandingConfig.companyName}
              </h3>
              <p 
                className="mb-4"
                style={{ color: brandingConfig.colorScheme.text.secondary }}
              >
                This is how your text will appear with the selected colors.
              </p>
              <div className="flex space-x-3">
                <button
                  className="px-4 py-2 rounded-md text-white font-medium"
                  style={{ backgroundColor: brandingConfig.colorScheme.primary }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md font-medium border"
                  style={{ 
                    color: brandingConfig.colorScheme.secondary,
                    borderColor: brandingConfig.colorScheme.border,
                  }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
            <div className="flex space-x-4 text-sm">
              <span 
                className="px-2 py-1 rounded"
                style={{ 
                  backgroundColor: brandingConfig.colorScheme.success + '20',
                  color: brandingConfig.colorScheme.success,
                }}
              >
                ✓ Success
              </span>
              <span 
                className="px-2 py-1 rounded"
                style={{ 
                  backgroundColor: brandingConfig.colorScheme.warning + '20',
                  color: brandingConfig.colorScheme.warning,
                }}
              >
                ⚠ Warning
              </span>
              <span 
                className="px-2 py-1 rounded"
                style={{ 
                  backgroundColor: brandingConfig.colorScheme.error + '20',
                  color: brandingConfig.colorScheme.error,
                }}
              >
                ✗ Error
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorSchemeEditor;
