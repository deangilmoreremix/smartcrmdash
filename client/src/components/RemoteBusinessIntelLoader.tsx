import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { loadRemoteComponent, useRemoteComponent } from '../utils/dynamicModuleFederation';

const RemoteBusinessIntelLoader: React.FC = () => {
  const { isDark } = useTheme();
  const [fallbackToIframe, setFallbackToIframe] = useState(false);

  // Try to load remote component first
  const { component: RemoteBusinessIntel, loading, error } = useRemoteComponent(
    'https://ai-analytics.smartcrm.vip',
    'BusinessIntelApp',
    './BusinessIntelApp'
  );

  // If loading fails after a timeout, switch to iframe
  useEffect(() => {
    if (error) {
      console.warn('❌ Module Federation failed for Business Intel, using iframe fallback');
      setFallbackToIframe(true);
    }
  }, [error]);

  // Skip loading state for immediate iframe fallback

  // Use iframe fallback if Module Federation fails
  if (fallbackToIframe || error) {
    return <BusinessIntelIframeLoader />;
  }

  // Render the remote component if loaded successfully
  if (RemoteBusinessIntel) {
    console.log('✅ Successfully loaded remote Business Intel component');
    return <RemoteBusinessIntel />;
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center h-full" style={{ paddingTop: '80px' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Initializing Business Intelligence...</p>
      </div>
    </div>
  );
};

// Separate component for iframe fallback to maintain existing functionality
const BusinessIntelIframeLoader: React.FC = () => {
  const { isDark } = useTheme();
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      // Try to communicate with the iframe to set light mode and add padding
      try {
        iframe.contentWindow?.postMessage({
          type: 'SET_THEME',
          theme: 'light'
        }, '*');

        // Add padding to prevent navbar overlap
        iframe.contentWindow?.postMessage({
          type: 'ADD_TOP_PADDING',
          padding: '80px'
        }, '*');

        // Try to inject CSS directly if postMessage doesn't work
        setTimeout(() => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const style = iframeDoc.createElement('style');
              style.textContent = `
                body {
                  padding-top: 80px !important;
                  margin-top: 0 !important;
                }
                .navbar, .header, nav, [class*="nav"], [class*="header"] {
                  z-index: 999 !important;
                }
                .main-content, .content, main, [class*="main"], [class*="content"] {
                  margin-top: 80px !important;
                  padding-top: 20px !important;
                }
              `;
              iframeDoc.head?.appendChild(style);
            }
          } catch (cssError) {
            console.log('Unable to inject CSS directly into iframe');
          }
        }, 1000);

      } catch (error) {
        console.log('Unable to communicate with iframe for theme setting and padding');
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div className="w-full h-full bg-white" style={{ paddingTop: '80px' }} data-testid="business-intel">
      <iframe
        ref={iframeRef}
        src="https://ai-analytics.smartcrm.vip/"
        className="w-full border-0"
        style={{
          height: 'calc(100vh - 80px)',
          minHeight: 'calc(100vh - 80px)'
        }}
        title="Business Intelligence Platform"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default RemoteBusinessIntelLoader;