// Simple Remote AI Goals Loader for Dashboard Sections
import React, { useRef, useEffect } from 'react';
import { useTheme } from "../contexts/ThemeContext";

interface RemoteAIGoalsLoaderProps {
  showHeader?: boolean;
}

const RemoteAIGoalsLoader: React.FC<RemoteAIGoalsLoaderProps> = ({ showHeader = true }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isDark } = useTheme();
  const currentTheme = isDark ? 'dark' : 'light';

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      // Send theme message to iframe
      try {
        iframe.contentWindow?.postMessage({
          type: 'SET_THEME',
          theme: currentTheme
        }, 'https://agency.smartcrm.vip');
      } catch (error) {
        console.log('Unable to communicate with iframe for theme setting');
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [currentTheme]);

  return (
    <div className="w-full h-full">
      {showHeader && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border-b border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Remote AI Goals
          </h3>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={`https://agency.smartcrm.vip?theme=light&mode=light`}
        style={{
          width: '100%',
          height: showHeader ? 'calc(100% - 50px)' : '100%',
          border: 'none'
        }}
        title="Remote AI Goals"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
      />
    </div>
  );
};

export default RemoteAIGoalsLoader;