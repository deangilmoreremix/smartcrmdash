import React from 'react';

// TODO: Replace with Module Federation import once vite.config.ts is updated:
// const AnalyticsApp = React.lazy(() => import('analytics/AnalyticsApp'));

const AnalyticsApp: React.FC = () => (
  <iframe
    src="https://resilient-frangipane-6289c8.netlify.app"
    className="w-full h-full border-0"
    title="AI Analytics Dashboard"
    allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
    loading="lazy"
  />
);

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