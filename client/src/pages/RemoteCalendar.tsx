import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, Wifi, WifiOff, Calendar } from 'lucide-react';
import { useAppointmentStore, Appointment } from '../store/appointmentStore';
import { RemoteCalendarBridge, CRMAppointment, RemoteCalendarStatus } from '../services/remoteCalendarBridge';
import { remoteAppManager } from '../utils/remoteAppManager';
import { universalDataSync } from '../services/universalDataSync';

const RemoteCalendar: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const bridgeRef = useRef<RemoteCalendarBridge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bridgeStatus, setBridgeStatus] = useState<RemoteCalendarStatus | null>(null);
  
  const { appointments, fetchAppointments, createAppointment, updateAppointment, deleteAppointment } = useAppointmentStore();

  const REMOTE_URL = 'https://ai-calendar-applicat-qshp.bolt.host';

  // Convert Appointment to CRMAppointment format
  const convertToCRMAppointment = (appointment: Appointment): CRMAppointment => ({
    id: appointment.id,
    title: appointment.title,
    contactId: appointment.contactId,
    contactName: appointment.contactName,
    contactEmail: appointment.contactEmail,
    contactPhone: appointment.contactPhone,
    date: appointment.date.toISOString(),
    endDate: appointment.endDate.toISOString(),
    duration: appointment.duration,
    type: appointment.type,
    status: appointment.status,
    location: appointment.location,
    notes: appointment.notes,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString()
  });

  useEffect(() => {
    // Initialize the bridge with status callback
    if (!bridgeRef.current) {
      bridgeRef.current = new RemoteCalendarBridge((status: RemoteCalendarStatus) => {
        setBridgeStatus(status);
        setIsConnected(status.isConnected);
        if (status.errorMessage) {
          setError(status.errorMessage);
        }
      });
      
      // Register with universal manager
      remoteAppManager.registerBridge('calendar', bridgeRef.current);
      universalDataSync.initialize();
      
      // Set up message handlers
      bridgeRef.current.onMessage('REMOTE_READY', () => {
        console.log('✅ Remote calendar moderation is ready');
        setIsConnected(true);
        setIsLoading(false);
      });

      bridgeRef.current.onMessage('APPOINTMENT_CREATED', (data: any) => {
        console.log('📅 Appointment created in remote calendar:', data);
        createAppointment(data);
      });

      bridgeRef.current.onMessage('APPOINTMENT_UPDATED', (data: any) => {
        console.log('✏️ Appointment updated in remote calendar:', data);
        updateAppointment(data.id, data);
      });

      bridgeRef.current.onMessage('APPOINTMENT_DELETED', (data: any) => {
        console.log('🗑️ Appointment deleted in remote calendar:', data);
        deleteAppointment(data.id);
      });

      bridgeRef.current.onMessage('REQUEST_APPOINTMENTS', () => {
        console.log('📊 Remote calendar requesting CRM appointments');
        if (bridgeRef.current) {
          const crmAppointments = Object.values(appointments).map(convertToCRMAppointment);
          bridgeRef.current.syncAppointments(crmAppointments);
        }
      });

      bridgeRef.current.onMessage('NAVIGATE', (data: any) => {
        console.log('🧭 Remote calendar requesting navigation to:', data.route);
        if (data.route && typeof data.route === 'string') {
          if (data.route.startsWith('/')) {
            window.location.pathname = data.route;
          } else {
            window.location.hash = '#/' + data.route;
          }
        }
      });

      bridgeRef.current.onMessage('NAVIGATE_BACK', () => {
        console.log('⬅️ Remote calendar requesting navigation back');
        window.history.back();
      });

      bridgeRef.current.onMessage('NAVIGATE_TO_DASHBOARD', () => {
        console.log('🏠 Remote calendar requesting navigation to dashboard');
        window.location.pathname = '/';
      });
    }

    return () => {
      if (bridgeRef.current) {
        bridgeRef.current.disconnect();
        bridgeRef.current = null;
      }
    };
  }, [appointments, fetchAppointments, createAppointment, updateAppointment, deleteAppointment]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && bridgeRef.current) {
      const handleLoad = () => {
        console.log('📺 Remote calendar iframe loaded');
        
        // Check if content actually loaded (not a 404 page)
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc && iframeDoc.title === 'Page not found') {
            console.error('❌ Remote calendar app not found - 404 error');
            setError('The remote calendar app is not available at this URL. Please check if the app is properly deployed.');
            setIsLoading(false);
            setIsConnected(false);
            return;
          }
        } catch (e) {
          // Cross-origin restrictions prevent document access - this is normal
          console.log('📝 Cross-origin calendar iframe loaded (expected)');
        }
        
        setError(null);
        setIsLoading(false);
        
        if (bridgeRef.current) {
          bridgeRef.current.setIframe(iframe);
          console.log('🔗 Calendar bridge communication initialized');
          
          // Initialize CRM connection after iframe loads
          setTimeout(() => {
            if (bridgeRef.current) {
              const crmAppointments = Object.values(appointments).map(convertToCRMAppointment);
              bridgeRef.current.syncAppointments(crmAppointments);
              bridgeRef.current.sendNavigationCapabilities();
            }
          }, 2000);
        }
      };

      const handleError = () => {
        console.error('❌ Failed to load remote calendar');
        setError('Network error: Could not connect to the calendar moderation application. Check your internet connection.');
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
  }, [appointments]);

  // Sync appointments when they change
  useEffect(() => {
    if (bridgeRef.current && isConnected && appointments) {
      const crmAppointments = Object.values(appointments).map(convertToCRMAppointment);
      bridgeRef.current.syncAppointments(crmAppointments);
    }
  }, [appointments, isConnected]);

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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-cyan-600" />
              Calendar Moderation
            </h1>
            <p className="text-sm text-gray-600">AI-powered calendar management and moderation system</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full">
              ✓ Module Federation
            </div>
            {isConnected ? (
              <div className="flex items-center text-green-600 text-sm bg-green-100 px-3 py-1 rounded-full">
                <Wifi className="w-4 h-4 mr-1" />
                Bridge Connected
              </div>
            ) : (
              <div className="flex items-center text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                <WifiOff className="w-4 h-4 mr-1" />
                {isLoading ? 'Connecting...' : 'Disconnected'}
              </div>
            )}
            {bridgeStatus && bridgeStatus.connectionAttempts > 0 && (
              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                Attempts: {bridgeStatus.connectionAttempts}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            data-testid="button-refresh-calendar"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center px-3 py-2 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            data-testid="button-open-calendar-external"
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
              <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Calendar Moderation</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                data-testid="button-retry-calendar"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">Loading Calendar Moderation</h3>
              <p className="text-gray-600">Connecting to AI calendar management system...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={REMOTE_URL}
          className="w-full h-full border-0"
          title="Calendar Moderation System"
          allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
          loading="lazy"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Remote URL: {REMOTE_URL}</span>
          {isConnected && (
            <span className="text-green-600">● Module Federation Bridge Active</span>
          )}
          {error && (
            <span className="text-red-600">● Bridge Connection Failed</span>
          )}
          {bridgeStatus && (
            <span className="text-blue-600">
              Appointments: {bridgeStatus.appointmentCount} | 
              {bridgeStatus.lastSync ? ` Last Sync: ${bridgeStatus.lastSync.toLocaleTimeString()}` : ' No Sync'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>Calendar Moderation Module Federation v1.0</span>
          {!isLoading && !error && !isConnected && (
            <span className="text-yellow-600">● Initializing Bridge...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoteCalendar;