import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, 
  RefreshCw, 
  Activity,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { useTheme } from '../contexts/ThemeContext';

interface RemotePipelineBridge {
  isConnected: boolean;
  lastSync: Date | null;
  dealCount: number;
  errorMessage?: string;
}

const Pipeline: React.FC = () => {
  const { isDark } = useTheme();
  const { deals, addDeal, updateDeal, deleteDeal } = useDealStore();
  const { contacts } = useContactStore();
  
  // Remote Pipeline Integration State
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [bridgeStatus, setBridgeStatus] = useState<RemotePipelineBridge>({
    isConnected: false,
    lastSync: null,
    dealCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLocalFallback, setShowLocalFallback] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const REMOTE_PIPELINE_URL = 'https://cheery-syrniki-b5b6ca.netlify.app';
  const MAX_CONNECTION_ATTEMPTS = 3;

  // Remote Pipeline Bridge Communication
  useEffect(() => {
    const handleRemoteMessage = (event: MessageEvent) => {
      // Security check for remote pipeline domain
      if (!event.origin.includes('netlify.app') && !event.origin.includes('localhost')) {
        return;
      }

      try {
        const message = event.data;
        if (!message || message.source !== 'REMOTE_PIPELINE') return;

        console.log('📨 Remote pipeline message:', message.type, message.data);

        switch (message.type) {
          case 'REMOTE_READY':
            console.log('🎯 Remote pipeline ready, initializing...');
            initializeRemotePipeline();
            break;
            
          case 'CRM_INIT_COMPLETE':
            setBridgeStatus(prev => ({
              ...prev,
              isConnected: true,
              lastSync: new Date(),
              dealCount: message.data?.dealsReceived || 0
            }));
            setIsLoading(false);
            console.log('✅ Remote pipeline initialized successfully');
            break;
            
          case 'DEAL_UPDATED':
            if (message.data) {
              updateDeal(message.data.id, message.data);
              setBridgeStatus(prev => ({ ...prev, lastSync: new Date() }));
            }
            break;
            
          case 'DEAL_CREATED':
            if (message.data) {
              addDeal(message.data);
              setBridgeStatus(prev => ({ ...prev, lastSync: new Date() }));
            }
            break;
            
          case 'DEAL_DELETED':
            if (message.data?.id) {
              deleteDeal(message.data.id);
              setBridgeStatus(prev => ({ ...prev, lastSync: new Date() }));
            }
            break;
            
          case 'NAVIGATE':
            // Handle navigation requests from remote pipeline
            if (message.data?.route) {
              window.location.hash = message.data.route;
            }
            break;
        }
      } catch (error) {
        console.error('❌ Failed to handle remote pipeline message:', error);
      }
    };

    window.addEventListener('message', handleRemoteMessage);
    
    // Initialize connection after a brief delay
    const initTimer = setTimeout(() => {
      if (!bridgeStatus.isConnected && connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
        setConnectionAttempts(prev => prev + 1);
      }
    }, 2000);

    return () => {
      window.removeEventListener('message', handleRemoteMessage);
      clearTimeout(initTimer);
    };
  }, [bridgeStatus.isConnected, connectionAttempts, addDeal, updateDeal, deleteDeal]);

  // Initialize Remote Pipeline with CRM Data
  const initializeRemotePipeline = () => {
    if (!iframeRef.current?.contentWindow) {
      console.warn('⚠️ Remote pipeline iframe not ready');
      return;
    }

    const dealsArray = Array.isArray(deals) ? deals : Object.values(deals);
    const contactsArray = Array.isArray(contacts) ? contacts : Object.values(contacts);

    const initData = {
      type: 'CRM_INIT',
      data: {
        crmInfo: {
          name: 'Smart CRM Dashboard',
          version: '2.0.0',
          timestamp: new Date().toISOString()
        },
        pipelineData: {
          deals: dealsArray,
          stages: [
            { id: 'lead', name: 'Lead', order: 1 },
            { id: 'qualified', name: 'Qualified', order: 2 },
            { id: 'proposal', name: 'Proposal', order: 3 },
            { id: 'negotiation', name: 'Negotiation', order: 4 },
            { id: 'won', name: 'Won', order: 5 },
            { id: 'lost', name: 'Lost', order: 6 }
          ]
        },
        contactsData: contactsArray
      },
      source: 'CRM',
      timestamp: Date.now()
    };

    try {
      iframeRef.current.contentWindow.postMessage(initData, '*');
      console.log('📤 Initialization data sent to remote pipeline');
    } catch (error) {
      console.error('❌ Failed to send init data to remote pipeline:', error);
      handleConnectionFailure();
    }
  };

  // Handle connection failure
  const handleConnectionFailure = () => {
    setBridgeStatus(prev => ({
      ...prev,
      isConnected: false,
      errorMessage: 'Failed to connect to remote pipeline'
    }));
    setIsLoading(false);
    
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      setShowLocalFallback(true);
    }
  };

  // Retry connection
  const retryConnection = () => {
    setIsLoading(true);
    setBridgeStatus({
      isConnected: false,
      lastSync: null,
      dealCount: 0
    });
    setConnectionAttempts(0);
    setShowLocalFallback(false);
    
    // Reload iframe
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  if (showLocalFallback) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`p-6 rounded-xl border ${
            isDark ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-yellow-200 bg-yellow-50'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} size={24} />
              <h2 className={`text-xl font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                Remote Pipeline Unavailable
              </h2>
            </div>
            <p className={`mb-4 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
              The remote pipeline module couldn't be loaded from https://cheery-syrniki-b5b6ca.netlify.app. 
              This might be due to network issues or the remote service being temporarily unavailable.
            </p>
            <div className="flex gap-3">
              <button
                onClick={retryConnection}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                <RefreshCw size={16} className="inline mr-2" />
                Retry Connection
              </button>
              <button
                onClick={() => window.location.hash = '/dashboard'}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  isDark 
                    ? 'border-gray-600 hover:bg-gray-800 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <ArrowLeft size={16} className="inline mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Pipeline Status Header */}
      <div className={`border-b ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Pipeline & Deal Management
            </h1>
            <div className="flex items-center gap-2">
              {bridgeStatus.isConnected ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Connected
                  </span>
                </div>
              ) : isLoading ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Activity size={16} className="text-blue-600 dark:text-blue-400 animate-pulse" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Connecting...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Disconnected
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {bridgeStatus.lastSync && (
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Last sync: {bridgeStatus.lastSync.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={retryConnection}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
                isDark 
                  ? 'border-gray-600 hover:bg-gray-800 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <RefreshCw size={16} className={`inline mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href={REMOTE_PIPELINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-lg border transition-colors ${
                isDark 
                  ? 'border-gray-600 hover:bg-gray-800 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ExternalLink size={16} className="inline mr-2" />
              Open Direct
            </a>
          </div>
        </div>
      </div>

      {/* Remote Pipeline Iframe */}
      <div className="flex-1">
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isDark ? 'bg-gray-900/90' : 'bg-white/90'
          } z-10`}>
            <div className="text-center">
              <Activity size={48} className={`mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-spin`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Loading Pipeline
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Connecting to remote pipeline module...
              </p>
              <div className={`mt-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Attempt {connectionAttempts + 1} of {MAX_CONNECTION_ATTEMPTS}
              </div>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={REMOTE_PIPELINE_URL}
          className="w-full h-screen border-0"
          title="Remote Pipeline Management"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          onLoad={() => {
            console.log('📱 Remote pipeline iframe loaded');
            // Give the remote app time to initialize
            setTimeout(() => {
              if (!bridgeStatus.isConnected && connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
                initializeRemotePipeline();
              }
            }, 1000);
          }}
          onError={() => {
            console.error('❌ Remote pipeline iframe failed to load');
            handleConnectionFailure();
          }}
        />
      </div>
    </div>
  );
};

export default Pipeline;
