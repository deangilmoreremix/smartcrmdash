
import React, { useState, useEffect, Suspense } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface AutoLoadingRemoteContactsProps {
  remoteUrls?: string[];
  fallbackComponent: React.ComponentType<any>;
  onContactSync?: () => void;
}

const AutoLoadingRemoteContacts: React.FC<AutoLoadingRemoteContactsProps> = ({
  remoteUrls = [
    'https://taupe-sprinkles-83c9ee.netlify.app',
    'https://contacts-app.vercel.app',
    'https://your-backup-contacts.netlify.app'
  ],
  fallbackComponent: FallbackComponent,
  onContactSync
}) => {
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType<any> | null>(null);
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'fallback'>('loading');
  const [connectionInfo, setConnectionInfo] = useState<string>('');

  const tryLoadRemoteModule = async (url: string): Promise<React.ComponentType<any> | null> => {
    try {
      console.log(`Attempting to load remote module from: ${url}`);
      
      // Test if the URL is reachable first
      const response = await fetch(`${url}/health-check`, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(3000)
      });
      
      // Try to dynamically import the remote module
      const moduleUrl = `${url}/assets/remoteEntry.js`;
      
      // Load the script dynamically
      const script = document.createElement('script');
      script.src = moduleUrl;
      script.type = 'module';
      
      return new Promise((resolve, reject) => {
        script.onload = async () => {
          try {
            // Check for the global container
            const containerName = 'ContactsApp';
            if (window[containerName as any]) {
              const container = window[containerName as any];
              await container.init({});
              const factory = await container.get('./ContactsApp');
              const Module = factory();
              resolve(Module.default || Module);
            } else {
              // Try direct ESM import as fallback
              const module = await import(/* @vite-ignore */ moduleUrl);
              resolve(module.default || module.ContactsApp);
            }
          } catch (error) {
            reject(error);
          }
        };
        
        script.onerror = () => reject(new Error(`Failed to load ${moduleUrl}`));
        document.head.appendChild(script);
        
        // Cleanup on timeout
        setTimeout(() => {
          script.remove();
          reject(new Error('Timeout loading remote module'));
        }, 10000);
      });
    } catch (error) {
      console.warn(`Failed to load from ${url}:`, error);
      return null;
    }
  };

  const loadRemoteContacts = async () => {
    setLoadingState('loading');
    
    // Try each remote URL in sequence
    for (const url of remoteUrls) {
      try {
        const component = await tryLoadRemoteModule(url);
        if (component) {
          setRemoteComponent(() => component);
          setLoadingState('success');
          setConnectionInfo(`Connected to ${url}`);
          console.log(`Successfully loaded remote contacts from: ${url}`);
          return;
        }
      } catch (error) {
        console.warn(`Failed to load from ${url}:`, error);
        continue;
      }
    }
    
    // If all remote attempts fail, use fallback
    console.log('All remote sources failed, using local fallback');
    setLoadingState('fallback');
    setConnectionInfo('Using local contacts (remote unavailable)');
  };

  useEffect(() => {
    // Auto-load on component mount
    loadRemoteContacts();
  }, []);

  const renderStatus = () => {
    if (loadingState === 'loading') {
      return (
        <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Loading remote contacts...</span>
        </div>
      );
    }
    
    if (loadingState === 'success') {
      return (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <Wifi className="h-4 w-4" />
          <span>{connectionInfo}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
        <WifiOff className="h-4 w-4" />
        <span>{connectionInfo}</span>
      </div>
    );
  };

  if (loadingState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Loading Smart Contacts
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connecting to remote contact modules...
          </p>
          <div className="text-xs text-gray-500 max-w-md">
            Trying: {remoteUrls.join(', ')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Status indicator */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {renderStatus()}
      </div>
      
      {/* Main content */}
      <div className="h-full">
        {loadingState === 'success' && RemoteComponent ? (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          }>
            <RemoteComponent onContactSync={onContactSync} />
          </Suspense>
        ) : (
          <FallbackComponent onContactSync={onContactSync} />
        )}
      </div>
    </div>
  );
};

export default AutoLoadingRemoteContacts;
