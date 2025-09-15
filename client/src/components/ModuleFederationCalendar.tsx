import React, { useState, useEffect } from 'react';
import { loadRemoteComponent } from '../utils/dynamicModuleFederation';

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
          'https://ai-calendar-applicat-qshp.bolt.host',
          'CalendarApp',
          './CalendarApp'
        );
        
        const module = await Promise.race([modulePromise, timeoutPromise]);
        setRemoteCalendar(() => (module as any).default || module);
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

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Calendar Module...</p>
        </div>
      </div>
    );
  }

  if (error || !RemoteCalendar) {
    // Fallback to iframe - remote app needs Module Federation configuration
    return (
      <iframe
        src="https://ai-calendar-applicat-qshp.bolt.host"
        className="w-full h-full border-0"
        style={{ width: '100%', height: '100%', border: 'none', margin: 0, padding: 0 }}
        title="Calendar Moderation System"
        allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
        loading="lazy"
      />
    );
  }

  return <RemoteCalendar />;
};

interface ModuleFederationCalendarProps {
  showHeader?: boolean;
}

const ModuleFederationCalendar: React.FC<ModuleFederationCalendarProps> = ({ showHeader = false }) => {
  return (
    <div className="h-full w-full flex flex-col" style={{ margin: 0, padding: 0 }}>
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