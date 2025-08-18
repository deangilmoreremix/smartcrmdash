import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { RemotePipelineBridge } from '../services/remotePipelineBridge';
import { useDealStore } from '../store/dealStore';

const RemotePipeline: React.FC = () => {
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
      bridgeRef.current = new RemotePipelineBridge();
      
      // Set up message handlers
      bridgeRef.current.onMessage('REMOTE_READY', () => {
        console.log('🎉 Remote pipeline is ready');
        setIsConnected(true);
        setIsLoading(false);
        
        // Send initial CRM data
        if (bridgeRef.current) {
          bridgeRef.current.initializeCRM({
            deals: deals,
            stages: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
            totalValue: deals.reduce((sum, deal) => sum + deal.value, 0),
            activeDeals: deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length
          }, {
            name: 'CRM System',
            version: '1.0.0'
          });
        }
      });

      bridgeRef.current.onMessage('DEAL_CREATED', (data) => {
        console.log('🆕 Deal created in remote pipeline:', data);
        // Refresh deals in CRM
        fetchDeals();
      });

      bridgeRef.current.onMessage('DEAL_UPDATED', (data) => {
        console.log('✏️ Deal updated in remote pipeline:', data);
        // Refresh deals in CRM
        fetchDeals();
      });

      bridgeRef.current.onMessage('DEAL_DELETED', (data) => {
        console.log('🗑️ Deal deleted in remote pipeline:', data);
        // Refresh deals in CRM
        fetchDeals();
      });

      bridgeRef.current.onMessage('REQUEST_PIPELINE_DATA', () => {
        console.log('📊 Remote pipeline requesting CRM data');
        if (bridgeRef.current) {
          bridgeRef.current.syncDeals(deals);
        }
      });
    }

    return () => {
      if (bridgeRef.current) {
        bridgeRef.current.disconnect();
      }
    };
  }, [deals, fetchDeals]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && bridgeRef.current) {
      const handleLoad = () => {
        console.log('📺 Remote pipeline iframe loaded');
        setError(null);
        
        if (bridgeRef.current) {
          bridgeRef.current.setIframe(iframe);
          // Try to inject bridge code after a delay
          setTimeout(() => {
            if (bridgeRef.current) {
              bridgeRef.current.injectBridgeCode();
            }
          }, 2000);
        }
      };

      const handleError = () => {
        console.error('❌ Failed to load remote pipeline');
        setError('Failed to load remote pipeline application');
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

  const handleOpenInNewTab = () => {
    window.open(REMOTE_URL, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Remote Pipeline</h1>
            <p className="text-sm text-gray-600">External pipeline management system</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center text-green-600 text-sm">
                <Wifi className="w-4 h-4 mr-1" />
                Connected
              </div>
            ) : (
              <div className="flex items-center text-gray-500 text-sm">
                <WifiOff className="w-4 h-4 mr-1" />
                {isLoading ? 'Connecting...' : 'Disconnected'}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open in New Tab
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Remote Pipeline</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">Loading Remote Pipeline</h3>
              <p className="text-gray-600">Connecting to external pipeline system...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={REMOTE_URL}
          className="w-full h-full border-0"
          title="Remote Pipeline System"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-navigation"
          loading="lazy"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Remote URL: {REMOTE_URL}</span>
          {isConnected && (
            <span className="text-green-600">● Bridge Active</span>
          )}
        </div>
        <div>
          CRM Integration v1.0
        </div>
      </div>
    </div>
  );
};

export default RemotePipeline;