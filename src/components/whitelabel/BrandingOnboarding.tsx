import React, { useState } from 'react';
import { useWhiteLabel } from '../../contexts/WhiteLabelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  Palette, 
  Upload, 
  Type, 
  Eye,
  Sparkles,
  Target,
  Rocket
} from 'lucide-react';

interface BrandingOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  completed: boolean;
}

const Step1CompanyInfo: React.FC = () => {
  const { brandingConfig, updateBranding } = useWhiteLabel();
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={brandingConfig.companyName}
          onChange={(e) => updateBranding({ companyName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your Company Name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tagline
        </label>
        <input
          type="text"
          value={brandingConfig.tagline}
          onChange={(e) => updateBranding({ tagline: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your company tagline"
        />
      </div>
    </div>
  );
};

const Step2ColorScheme: React.FC = () => {
  const { brandingConfig, updateBranding } = useWhiteLabel();
  
  const presets = [
    { name: 'Professional Blue', primary: '#3b82f6', secondary: '#64748b', accent: '#10b981' },
    { name: 'Creative Purple', primary: '#8b5cf6', secondary: '#64748b', accent: '#06b6d4' },
    { name: 'Corporate Green', primary: '#059669', secondary: '#64748b', accent: '#3b82f6' },
    { name: 'Elegant Dark', primary: '#374151', secondary: '#6b7280', accent: '#3b82f6' },
  ];
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Choose a color scheme that represents your brand
      </p>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((preset) => (
          <div
            key={preset.name}
            className="p-3 border rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => updateBranding({
              colorScheme: {
                ...brandingConfig.colorScheme,
                primary: preset.primary,
                secondary: preset.secondary,
                accent: preset.accent,
              }
            })}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: preset.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: preset.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
            </div>
            <div className="text-xs font-medium">{preset.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Step3Logo: React.FC = () => {
  const { brandingConfig, updateBranding } = useWhiteLabel();
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Add your company logo to complete your branding
      </p>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop your logo here
        </p>
        <Button variant="outline" size="sm">
          Choose File
        </Button>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or enter logo URL
        </label>
        <input
          type="url"
          value={brandingConfig.logoUrl}
          onChange={(e) => updateBranding({ logoUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/logo.png"
        />
      </div>
    </div>
  );
};

const Step4Preview: React.FC = () => {
  const { brandingConfig } = useWhiteLabel();
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Preview your branded platform
      </p>
      <div 
        className="border rounded-lg p-4"
        style={{ backgroundColor: brandingConfig.colorScheme.surface }}
      >
        <div className="flex items-center space-x-3 mb-4">
          {brandingConfig.logoUrl ? (
            <img
              src={brandingConfig.logoUrl}
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: brandingConfig.colorScheme.primary }}
            >
              {brandingConfig.companyName.charAt(0)}
            </div>
          )}
          <div>
            <h3 
              className="font-semibold"
              style={{ color: brandingConfig.colorScheme.text.primary }}
            >
              {brandingConfig.companyName}
            </h3>
            <p 
              className="text-sm"
              style={{ color: brandingConfig.colorScheme.text.secondary }}
            >
              {brandingConfig.tagline}
            </p>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-md text-white font-medium"
          style={{ backgroundColor: brandingConfig.colorScheme.primary }}
        >
          Sample Button
        </button>
      </div>
    </div>
  );
};

export const BrandingOnboarding: React.FC<BrandingOnboardingProps> = ({ onComplete, onSkip }) => {
  const { brandingConfig } = useWhiteLabel();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'company',
      title: 'Company Information',
      description: 'Tell us about your company',
      icon: Target,
      component: Step1CompanyInfo,
      completed: brandingConfig.companyName !== 'SmartCRM'
    },
    {
      id: 'colors',
      title: 'Choose Colors',
      description: 'Select your brand colors',
      icon: Palette,
      component: Step2ColorScheme,
      completed: brandingConfig.colorScheme.primary !== '#3b82f6'
    },
    {
      id: 'logo',
      title: 'Upload Logo',
      description: 'Add your company logo',
      icon: Upload,
      component: Step3Logo,
      completed: !!brandingConfig.logoUrl
    },
    {
      id: 'preview',
      title: 'Preview & Launch',
      description: 'Review your branding',
      icon: Eye,
      component: Step4Preview,
      completed: false
    }
  ];

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to White Label Setup
          </h1>
          <p className="text-gray-600">
            Let's customize your platform to match your brand in just a few steps
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || step.completed;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <currentStepData.icon className="w-5 h-5" />
              <span>{currentStepData.title}</span>
            </CardTitle>
            <CardDescription>
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onSkip}>
              Skip Setup
            </Button>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          
          <Button onClick={handleNext} className="flex items-center space-x-2">
            {currentStep === steps.length - 1 ? (
              <>
                <Rocket className="w-4 h-4" />
                <span>Complete Setup</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandingOnboarding;
