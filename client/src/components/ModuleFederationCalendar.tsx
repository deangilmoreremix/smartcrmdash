import React, { useState, useEffect } from 'react';
import { loadRemoteComponent } from '../utils/dynamicModuleFederation';
import { moduleFederationOrchestrator, useSharedModuleState } from '../utils/moduleFederationOrchestrator';

const CalendarApp: React.FC = () => {
  const [RemoteCalendar, setRemoteCalendar] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRemote = async () => {
      try {
        console.log('🚀 Attempting Module Federation for Calendar...');
        
        // Try Module Federation first
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Module Federation timeout - remote app may need MF configuration')), 3000);
        });
        
        const modulePromise = loadRemoteComponent(
          'https://calendar.smartcrm.vip',
          'CalendarApp',
          './CalendarApp'
        );
        
        const module = await Promise.race([modulePromise, timeoutPromise]);
        const CalendarComponent = (module as any).default || module;
        setRemoteCalendar(() => CalendarComponent);
        
        // Register with orchestrator for shared state management
        moduleFederationOrchestrator.registerModule('calendar', CalendarComponent, {
          appointments: []
        });
        
        console.log('✅ Module Federation Calendar loaded successfully');
        setIsLoading(false);
      } catch (err) {
        console.log('📺 Module Federation not available, using iframe fallback (remote app needs MF configuration)');
        setError('Remote app needs Module Federation configuration');
        setIsLoading(false);
      }
    };

    loadRemote();
  }, []);

  // Remove loading spinner - go directly to iframe fallback

  if (error || !RemoteCalendar) {
    // Fallback to iframe - remote app needs Module Federation configuration
    return (
      <iframe
        src="https://calendar.smartcrm.vip?theme=light&mode=light"
        className="w-full h-full border-0"
        style={{ width: '100%', height: '100%', border: 'none', margin: 0, padding: 0 }}
        title="Advanced AI Calendar"
        allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
        loading="lazy"
        onLoad={(e) => {
          console.log('🎯 AI Calendar iframe loaded, setting up communication...');

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
          const sharedData = useSharedModuleState.getState().sharedData;
          iframe.contentWindow?.postMessage({
            type: 'INITIAL_DATA_SYNC',
            data: sharedData,
            source: 'CRM_HOST'
          }, '*');

          // Set up message listener for iframe interactions
          const messageHandler = (event: MessageEvent) => {
            // Allow messages from the calendar domain
            if (event.origin === 'https://calendar.smartcrm.vip' || event.origin === window.location.origin) {
              const { type, data } = event.data;
              console.log('📨 Message from AI Calendar:', type, data);

              switch (type) {
                case 'BUTTON_CLICK':
                  console.log('🖱️ Calendar button clicked via iframe:', data);
                  moduleFederationOrchestrator.broadcastToAllModules('CALENDAR_BUTTON_CLICK', data);
                  break;
                case 'APPOINTMENT_CREATED':
                  console.log('📅 Appointment created via iframe:', data);
                  moduleFederationOrchestrator.broadcastToAllModules('APPOINTMENT_CREATED', data);
                  break;
                case 'APPOINTMENT_UPDATED':
                  console.log('📝 Appointment updated via iframe:', data);
                  moduleFederationOrchestrator.broadcastToAllModules('APPOINTMENT_UPDATED', data);
                  break;
                case 'APPOINTMENT_DELETED':
                  console.log('🗑️ Appointment deleted via iframe:', data);
                  moduleFederationOrchestrator.broadcastToAllModules('APPOINTMENT_DELETED', data);
                  break;
                case 'CALENDAR_READY':
                  console.log('✅ AI Calendar ready for interaction');
                  // Send confirmation back
                  iframe.contentWindow?.postMessage({
                    type: 'CRM_READY',
                    data: { connected: true }
                  }, '*');
                  break;
                default:
                  console.log('📨 Unhandled message type from calendar:', type);
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
                console.log('🎨 Theme changed, updating calendar:', theme);
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

  // Pass shared state and theme props to Module Federation component
  const sharedData = useSharedModuleState(state => state.sharedData);

  return React.createElement(RemoteCalendar as any, {
    theme: "light",
    mode: "light",
    sharedData,
    onDataUpdate: (data: any) => {
      moduleFederationOrchestrator.broadcastToAllModules('CALENDAR_DATA_UPDATE', data);
    },
    // Add event handlers for button interactions
    onButtonClick: (action: string, data?: any) => {
      console.log('Calendar button clicked:', action, data);
      moduleFederationOrchestrator.broadcastToAllModules('CALENDAR_BUTTON_CLICK', { action, data });
    },
    onAppointmentCreate: (appointment: any) => {
      console.log('Appointment created:', appointment);
      moduleFederationOrchestrator.broadcastToAllModules('APPOINTMENT_CREATED', appointment);
    },
    onAppointmentUpdate: (appointment: any) => {
      console.log('Appointment updated:', appointment);
      moduleFederationOrchestrator.broadcastToAllModules('APPOINTMENT_UPDATED', appointment);
    },
    onAppointmentDelete: (appointmentId: string) => {
      console.log('Appointment deleted:', appointmentId);
      moduleFederationOrchestrator.broadcastToAllModules('APPOINTMENT_DELETED', appointmentId);
    }
  });
};

interface ModuleFederationCalendarProps {
  showHeader?: boolean;
}

const ModuleFederationCalendar: React.FC<ModuleFederationCalendarProps> = ({ showHeader = false }) => {
  return (
    <div className="h-full w-full flex flex-col" style={{ margin: 0, padding: 0 }} data-testid="calendar-month">
      {showHeader && (
        <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Calendar Moderation</h3>
            <div className="flex items-center text-green-600 text-xs">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Module Federation
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 w-full h-full" style={{ margin: 0, padding: 0 }}>
        <CalendarApp />
      </div>
    </div>
  );
};

export default ModuleFederationCalendar;