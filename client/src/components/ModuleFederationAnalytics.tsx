import React, { useState, useEffect } from 'react';
import { loadRemoteComponent } from '../utils/dynamicModuleFederation';

const AnalyticsApp: React.FC = () => {
  const [RemoteAnalytics, setRemoteAnalytics] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRemote = async () => {
      try {
        console.log('🚀 Loading Module Federation Analytics...');
        const module = await loadRemoteComponent(
          'https://resilient-frangipane-6289c8.netlify.app',
          'AnalyticsApp',
          './AnalyticsApp'
        );
        setRemoteAnalytics(() => module.default || module);
        console.log('✅ Module Federation Analytics loaded successfully');
      } catch (err) {
        console.warn('❌ Module Federation failed, using iframe fallback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadRemote();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading Module Federation...</span>
      </div>
    );
  }

  if (error || !RemoteAnalytics) {
    // Fallback to iframe
    return (
      <iframe
        src="https://resilient-frangipane-6289c8.netlify.app"
        className="w-full h-full border-0"
        title="AI Analytics Dashboard"
        allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
        loading="lazy"
      />
    );
  }

  return <RemoteAnalytics />;
};

interface ModuleFederationAnalyticsProps {
  showHeader?: boolean;
}

const ModuleFederationAnalytics: React.FC<ModuleFederationAnalyticsProps> = ({ showHeader = false }) => {
  return (
    <div className="h-full flex flex-col">
      {showHeader && (
        <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">AI Analytics</h3>
            <div className="flex items-center text-green-600 text-xs">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Module Federation
            </div>
          </div>
        </div>
      )}
      <div className="flex-1">
        <AnalyticsApp />
      </div>
    </div>
  );
};

export default ModuleFederationAnalytics;