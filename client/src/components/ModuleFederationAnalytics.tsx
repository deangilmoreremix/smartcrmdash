import React, { useState, useEffect } from 'react';
import { loadRemoteComponent, useRemoteComponent } from '../utils/dynamicModuleFederation';

const AnalyticsApp: React.FC = () => {
  const [fallbackToIframe, setFallbackToIframe] = useState(false);

  // Try to load remote component first
  const { component: RemoteAnalytics, loading, error } = useRemoteComponent(
    'https://ai-analytics.smartcrm.vip',
    'AnalyticsApp',
    './AnalyticsApp'
  );

  // If loading fails after a timeout, switch to iframe
  useEffect(() => {
    if (error) {
      console.warn('❌ Module Federation failed for Analytics, using iframe fallback');
      setFallbackToIframe(true);
    }
  }, [error]);

  // Skip loading state for immediate iframe fallback

  // Use iframe fallback if Module Federation fails
  if (fallbackToIframe || error) {
    return (
      <iframe
        src="https://ai-analytics.smartcrm.vip/"
        className="w-full h-full border-0"
        title="AI-Powered Analytics Dashboard with Multiple Apps"
        allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        loading="lazy"
        onLoad={(e) => {
          console.log('🎯 AI Analytics iframe loaded, setting up communication...');

          // Send theme message to iframe
          const iframe = e.currentTarget;

          // Get current theme from the host app
          const isDark = document.documentElement.classList.contains('dark');
          const theme = isDark ? 'dark' : 'light';

          iframe.contentWindow?.postMessage({
            type: 'SET_THEME',
            theme: theme,
            mode: theme
          }, '*');

          // Send shared data
          const sharedData = { theme: 'light', user: null };
          iframe.contentWindow?.postMessage({
            type: 'INITIAL_DATA_SYNC',
            data: sharedData,
            source: 'CRM_HOST'
          }, '*');

          // Set up message listener for iframe interactions
          const messageHandler = (event: MessageEvent) => {
            // Allow messages from the analytics domain
            if (event.origin === 'https://ai-analytics.smartcrm.vip' || event.origin === window.location.origin) {
              const { type, data } = event.data;
              console.log('📨 Message from AI Analytics:', type, data);

              switch (type) {
                case 'ANALYTICS_READY':
                  console.log('✅ AI Analytics ready for interaction');
                  iframe.contentWindow?.postMessage({
                    type: 'CRM_READY',
                    data: { connected: true }
                  }, '*');
                  break;
                case 'DASHBOARD_CLICK':
                  console.log('📊 Analytics dashboard interaction:', data);
                  // Handle dashboard interactions
                  break;
                default:
                  console.log('📨 Unhandled message type from analytics:', type);
              }
            }
          };

          window.addEventListener('message', messageHandler);

          // Listen for theme changes from the host app
          const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isDark = document.documentElement.classList.contains('dark');
                const theme = isDark ? 'dark' : 'light';
                console.log('🎨 Theme changed, updating analytics:', theme);
                iframe.contentWindow?.postMessage({
                  type: 'SET_THEME',
                  theme: theme,
                  mode: theme
                }, '*');
              }
            });
          });

          themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
          });

          // Clean up on unmount
          return () => {
            window.removeEventListener('message', messageHandler);
            themeObserver.disconnect();
          };
        }}
      />
    );
  }

  // Render the remote component if loaded successfully
  if (RemoteAnalytics) {
    console.log('✅ Successfully loaded remote Analytics component');
    return <RemoteAnalytics />;
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Initializing AI Analytics...</p>
      </div>
    </div>
  );
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