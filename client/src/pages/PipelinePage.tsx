import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, BarChart3, Users, TrendingUp, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../hooks/useContactStore';
import { RemotePipelineBridge, CRMDeal, CRMPipelineData } from '../services/remotePipelineBridge';

const PipelinePage: React.FC = () => {
  const { isDark } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<RemotePipelineBridge | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { deals, addDeal, updateDeal, deleteDeal } = useDealStore();
  const { contacts } = useContactStore();

  // Convert Deal to CRMDeal format
  const convertToCRMDeal = (deal: any): CRMDeal => ({
    id: deal.id,
    title: deal.title || deal.name,
    value: deal.value || 0,
    stage: typeof deal.stage === 'string' ? deal.stage : deal.stage?.name || 'prospect',
    contactId: deal.contactId,
    contactName: contacts[deal.contactId]?.name,
    company: contacts[deal.contactId]?.company,
    probability: deal.probability || 50,
    expectedCloseDate: deal.expectedCloseDate,
    notes: deal.notes || deal.description,
    createdAt: typeof deal.createdAt === 'string' ? deal.createdAt : deal.createdAt?.toISOString(),
    updatedAt: typeof deal.updatedAt === 'string' ? deal.updatedAt : deal.updatedAt?.toISOString()
  });

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log('📺 Pipeline iframe loaded');
    setIsLoading(false);
    
    // Initialize communication after a short delay
    setTimeout(() => {
      initializePipelineCommunication();
    }, 1000);
  };

  // Initialize pipeline communication
  const initializePipelineCommunication = () => {
    if (!iframeRef.current?.contentWindow) {
      console.warn('⚠️ Iframe not ready for communication');
      return;
    }

    console.log('🚀 Initializing CRM connection with pipeline data');
    
    // Convert deals to CRM format
    const crmDeals = Object.values(deals).map(convertToCRMDeal);
    
    // Send initialization data to remote pipeline
    const initMessage = {
      type: 'CRM_INIT',
      source: 'CRM',
      data: {
        crmInfo: {
          name: 'Professional CRM',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        },
        pipelineData: {
          deals: crmDeals,
          stages: [
            { id: 'qualification', name: 'Qualification', order: 1, color: '#3B82F6' },
            { id: 'proposal', name: 'Proposal', order: 2, color: '#8B5CF6' },
            { id: 'negotiation', name: 'Negotiation', order: 3, color: '#F59E0B' },
            { id: 'closed-won', name: 'Closed Won', order: 4, color: '#10B981' },
            { id: 'closed-lost', name: 'Closed Lost', order: 5, color: '#EF4444' }
          ]
        }
      }
    };

    try {
      iframeRef.current.contentWindow.postMessage(initMessage, 'https://cheery-syrniki-b5b6ca.netlify.app');
      console.log('📤 Pipeline message sent:', initMessage.type, initMessage.data);
      setIsConnected(true);
    } catch (error) {
      console.error('❌ Failed to send init message:', error);
    }
  };

  // Initialize bridge and set up communication
  useEffect(() => {
    const bridge = new RemotePipelineBridge();
    bridgeRef.current = bridge;

    // Set up message event listener
    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        'https://cheery-syrniki-b5b6ca.netlify.app',
        'http://localhost:3000',
        'https://localhost:3000'
      ];

      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      const message = event.data;
      if (!message || message.source !== 'REMOTE_PIPELINE') {
        return;
      }

      console.log('📨 Remote pipeline message:', message.type, message.data);

      switch (message.type) {
        case 'REMOTE_READY':
          console.log('✅ Remote pipeline module connected');
          setIsConnected(true);
          // Re-initialize communication when remote is ready
          setTimeout(() => initializePipelineCommunication(), 500);
          break;
        
        case 'DEAL_CREATED':
          console.log('📝 Remote deal created:', message.data);
          addDeal(message.data);
          break;
        
        case 'DEAL_UPDATED':
          console.log('✏️ Remote deal updated:', message.data);
          updateDeal(message.data.id, message.data);
          break;
        
        case 'DEAL_DELETED':
          console.log('🗑️ Remote deal deleted:', message.data);
          deleteDeal(message.data.id);
          break;
        
        case 'CRM_INIT_COMPLETE':
          console.log('✅ Pipeline initialization complete:', message.data);
          setIsConnected(true);
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Set up message handlers
    bridge.onMessage('REMOTE_READY', () => {
      console.log('✅ Remote pipeline module connected via bridge');
      setIsConnected(true);
      initializePipelineCommunication();
    });

    bridge.onMessage('DEAL_CREATED', (deal) => {
      console.log('📝 Remote deal created:', deal);
      addDeal(deal);
    });

    bridge.onMessage('DEAL_UPDATED', (deal) => {
      console.log('✏️ Remote deal updated:', deal);
      updateDeal(deal.id, deal);
    });

    bridge.onMessage('DEAL_DELETED', (data) => {
      console.log('🗑️ Remote deal deleted:', data.id);
      deleteDeal(data.id);
    });

    bridge.onMessage('DEAL_STAGE_CHANGED', (data) => {
      console.log('↔️ Remote deal stage changed:', data);
      updateDeal(data.dealId, { stage: data.newStage });
    });

    bridge.onMessage('REQUEST_PIPELINE_DATA', () => {
      console.log('📤 Remote requesting pipeline data');
      const crmDeals = Object.values(deals).map(convertToCRMDeal);
      const pipelineData: CRMPipelineData = {
        deals: crmDeals,
        stages: ['prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
        totalValue: crmDeals.reduce((sum, deal) => sum + deal.value, 0),
        activeDeals: crmDeals.filter(deal => !deal.stage.includes('closed')).length
      };
      bridge.syncDeals(crmDeals);
    });

    bridge.onMessage('NAVIGATE', (data) => {
      console.log('🧭 Remote requesting navigation to:', data.route);
      if (data.route && typeof data.route === 'string') {
        if (data.route.startsWith('/')) {
          window.location.pathname = data.route;
        } else {
          window.location.hash = '#/' + data.route;
        }
      }
    });

    return () => {
      bridge.disconnect();
    };
  }, [addDeal, updateDeal, deleteDeal, deals, contacts]);

  

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Pipeline Management
              </h1>
              <p className={`mt-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Manage your sales pipeline, track deals, and optimize your conversion process
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                isConnected 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {isConnected ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              <a
                href="https://cheery-syrniki-b5b6ca.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-1 px-3 py-2 rounded-full ${
                  isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Open in New Tab</span>
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Pipeline Component */}
        <Card className={`${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } mb-6`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Target className="h-5 w-5 mr-2 text-green-500" />
              Interactive Deal Pipeline
            </CardTitle>
            <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Your comprehensive pipeline management system with drag-and-drop functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[900px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Loading Pipeline Module...
                    </p>
                  </div>
                </div>
              )}
              <iframe 
                ref={iframeRef}
                src="https://cheery-syrniki-b5b6ca.netlify.app"
                className="w-full h-full border-0"
                title="Pipeline Management System"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-modals"
                onLoad={handleIframeLoad}
                style={{ minHeight: '900px' }}
                allow="fullscreen"
              />
              
              {/* Connection Status Indicator */}
              <div className="absolute top-4 right-4 z-20">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium ${
                  isConnected 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-800' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${
                isDark ? 'text-blue-200' : 'text-blue-800'
              }`}>
                Active Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                isDark ? 'text-blue-100' : 'text-blue-900'
              }`}>
                24
              </div>
              <p className={`text-xs mt-1 flex items-center ${
                isDark ? 'text-blue-300' : 'text-blue-600'
              }`}>
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800' 
              : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${
                isDark ? 'text-green-200' : 'text-green-800'
              }`}>
                Pipeline Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                isDark ? 'text-green-100' : 'text-green-900'
              }`}>
                $1.2M
              </div>
              <p className={`text-xs mt-1 flex items-center ${
                isDark ? 'text-green-300' : 'text-green-600'
              }`}>
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8% growth
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-800' 
              : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${
                isDark ? 'text-yellow-200' : 'text-yellow-800'
              }`}>
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                isDark ? 'text-yellow-100' : 'text-yellow-900'
              }`}>
                68%
              </div>
              <p className={`text-xs mt-1 flex items-center ${
                isDark ? 'text-yellow-300' : 'text-yellow-600'
              }`}>
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Industry avg: 52%
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-800' 
              : 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${
                isDark ? 'text-purple-200' : 'text-purple-800'
              }`}>
                Avg Deal Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                isDark ? 'text-purple-100' : 'text-purple-900'
              }`}>
                $50K
              </div>
              <p className={`text-xs mt-1 flex items-center ${
                isDark ? 'text-purple-300' : 'text-purple-600'
              }`}>
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15% increase
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Instructions */}
        <Card className={`${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Pipeline Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Drag & Drop
                </h4>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Move deals between stages by dragging them to different columns
                </p>
              </div>
              <div>
                <h4 className={`font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Actions
                </h4>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Click on any deal card to view details or edit information
                </p>
              </div>
              <div>
                <h4 className={`font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Stage Management
                </h4>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Customize pipeline stages to match your sales process
                </p>
              </div>
              <div>
                <h4 className={`font-medium mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Analytics Integration
                </h4>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  All pipeline changes sync automatically with your analytics dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PipelinePage;