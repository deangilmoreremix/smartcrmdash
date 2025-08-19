import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RemoteBusinessIntelLoader: React.FC = () => {
  const { isDark } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      // Try to communicate with the iframe to set light mode
      try {
        iframe.contentWindow?.postMessage({ 
          type: 'SET_THEME', 
          theme: 'light' 
        }, '*');
      } catch (error) {
        console.log('Unable to communicate with iframe for theme setting');
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div className="w-full h-full bg-white">
      <iframe
        ref={iframeRef}
        src="https://ai-powered-analytics-fibd.bolt.host"
        className="w-full h-full border-0"
        title="Business Intelligence Platform"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default RemoteBusinessIntelLoader;