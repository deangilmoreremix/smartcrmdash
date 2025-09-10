import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, TrendingUp, ExternalLink, Zap } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import ModuleFederationPipeline from '../components/ModuleFederationPipeline';

const PipelinePage: React.FC = () => {
  const { isDark } = useTheme();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();

  // Module Federation approach - no complex bridge logic needed
  // Data sync happens through the ModuleFederationPipeline component

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Full Screen Pipeline Component - Positioned below navbar */}
      <div className="h-full w-full">
        <ModuleFederationPipeline showHeader={false} />
        
        {/* Module Federation Status Indicator - Floating */}
        <div className="absolute top-4 right-4 z-30">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Module Federation</span>
          </div>
        </div>
        
        {/* External Link Button - Floating */}
        <div className="absolute top-4 left-4 z-30">
          <a
            href="https://cheery-syrniki-b5b6ca.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors shadow-lg"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">Open in New Tab</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;