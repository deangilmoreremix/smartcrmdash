// Remote Pipeline Loader - Similar to contacts without spinner
import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { RemotePipelineBridge } from '../services/remotePipelineBridge';
import { useDealStore } from '../store/dealStore';

interface RemotePipelineLoaderProps {
  showHeader?: boolean;
}

const RemotePipelineLoader: React.FC<RemotePipelineLoaderProps> = ({ 
  showHeader = false 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<RemotePipelineBridge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { deals, fetchDeals } = useDealStore();
  const REMOTE_URL = 'https://cheery-syrniki-b5b6ca.netlify.app';

  useEffect(() => {
    // Initialize the bridge
    if (!bridgeRef.current) {
      bridgeRef.current = new RemotePipelineBridge((status) => {
        setIsConnected(status.isConnected);
        setIsLoading(false);
        if (status.errorMessage) {
          setError(status.errorMessage);
        }
      });
    }

    return () => {
      if (bridgeRef.current) {
        // Cleanup bridge reference
        bridgeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && bridgeRef.current) {
      const handleLoad = () => {
        setError(null);
        setIsLoading(false);
        
        if (bridgeRef.current) {
          bridgeRef.current.setIframe(iframe);
          // Quick injection for faster loading
          setTimeout(() => {
            if (bridgeRef.current) {
              try {
                // Try to initialize pipeline if method exists
                if (typeof bridgeRef.current.initializePipeline === 'function') {
                  bridgeRef.current.initializePipeline();
                } else {
                  console.log('Pipeline initialization method not available');
                }
              } catch (e) {
                console.warn('Pipeline initialization skipped:', e);
              }
            }
          }, 500);
        }
      };

      const handleError = () => {
        setError('Network error: Could not connect to the remote pipeline application.');
        setIsLoading(false);
        setIsConnected(false);
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, []);

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setError(null);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Optional Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pipeline</h3>
            {isConnected ? (
              <div className="flex items-center text-green-600 text-xs">
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </div>
            ) : (
              <div className="flex items-center text-gray-500 text-xs">
                <WifiOff className="w-3 h-3 mr-1" />
                {isLoading ? 'Loading...' : 'Disconnected'}
              </div>
            )}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
            <div className="text-center p-4">
              <div className="text-red-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Pipeline Unavailable</h4>
              <p className="text-xs text-red-600 dark:text-red-300 mb-2">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Show iframe immediately without loading overlay */}
        <iframe
          ref={iframeRef}
          src={REMOTE_URL}
          className="w-full h-full border-0"
          title="Remote Pipeline System"
          allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default RemotePipelineLoader;