
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Package, Plus, Minus, Check, Star, Zap, Shield, Globe } from 'lucide-react';

interface PackageFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'branding' | 'integration' | 'support' | 'advanced';
  basePrice: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface PackageTemplate {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  popular?: boolean;
}

const WhiteLabelPackageBuilder: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [packageName, setPackageName] = useState('');
  const [packageDescription, setPackageDescription] = useState('');

  const features: PackageFeature[] = [
    {
      id: 'basic-branding',
      name: 'Basic Branding',
      description: 'Logo, colors, and basic customization',
      category: 'branding',
      basePrice: 99,
      icon: Package
    },
    {
      id: 'advanced-branding',
      name: 'Advanced Branding',
      description: 'Complete UI customization and white-labeling',
      category: 'branding',
      basePrice: 299,
      icon: Star
    },
    {
      id: 'custom-domain',
      name: 'Custom Domain',
      description: 'Use your own domain name',
      category: 'core',
      basePrice: 49,
      icon: Globe
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Full API integration capabilities',
      category: 'integration',
      basePrice: 199,
      icon: Zap
    },
    {
      id: 'priority-support',
      name: 'Priority Support',
      description: '24/7 dedicated support team',
      category: 'support',
      basePrice: 149,
      icon: Shield
    }
  ];

  const packageTemplates: PackageTemplate[] = [
    {
      id: 'starter',
      name: 'Starter Package',
      description: 'Perfect for small businesses getting started',
      basePrice: 199,
      features: ['basic-branding', 'custom-domain']
    },
    {
      id: 'professional',
      name: 'Professional Package',
      description: 'Ideal for growing businesses',
      basePrice: 499,
      features: ['advanced-branding', 'custom-domain', 'api-access'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Package',
      description: 'Complete solution for large organizations',
      basePrice: 999,
      features: ['advanced-branding', 'custom-domain', 'api-access', 'priority-support']
    }
  ];

  const calculateTotalPrice = () => {
    return selectedFeatures.reduce((total, featureId) => {
      const feature = features.find(f => f.id === featureId);
      return total + (feature?.basePrice || 0);
    }, 0);
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const applyTemplate = (template: PackageTemplate) => {
    setSelectedFeatures(template.features);
    setPackageName(template.name);
    setPackageDescription(template.description);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            White-Label Package Builder
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Create custom white-label packages for your clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Templates */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Quick Start Templates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packageTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      template.popular 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : `border-gray-200 dark:border-gray-700 hover:border-purple-300`
                    }`}
                    onClick={() => applyTemplate(template)}
                  >
                    {template.popular && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Most Popular</span>
                      </div>
                    )}
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {template.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {template.description}
                    </p>
                    <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mt-2`}>
                      ${template.basePrice}/month
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Selection */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Select Features
              </h2>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedFeatures.includes(feature.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : `border-gray-200 dark:border-gray-700 hover:border-gray-300`
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedFeatures.includes(feature.id) ? 'bg-purple-100 dark:bg-purple-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <feature.icon className={`h-5 w-5 ${selectedFeatures.includes(feature.id) ? 'text-purple-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {feature.name}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${feature.basePrice}/mo
                      </span>
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedFeatures.includes(feature.id)
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {selectedFeatures.includes(feature.id) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Package Summary */}
          <div className="space-y-6">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm sticky top-4`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Package Summary
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder="Enter package name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Description
                  </label>
                  <textarea
                    value={packageDescription}
                    onChange={(e) => setPackageDescription(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Package description"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Included Features:
                  </h3>
                  <ul className="space-y-2">
                    {selectedFeatures.map((featureId) => {
                      const feature = features.find(f => f.id === featureId);
                      return feature ? (
                        <li key={featureId} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-2`}>
                          <Check className="h-4 w-4 text-green-500" />
                          {feature.name}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Total Price:
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
                      ${calculateTotalPrice()}/month
                    </span>
                  </div>
                  
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium">
                    Create Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelPackageBuilder;
