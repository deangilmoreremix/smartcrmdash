// Remote Contacts Loader - Dynamically loads contacts component from your Bolt app
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface RemoteContactsProps {
  remoteUrl: string; // URL of your deployed Bolt contacts app
  onContactSelect?: (contact: any) => void;
  onContactCreate?: (contact: any) => void;
  onContactUpdate?: (contact: any) => void;
  onContactDelete?: (contactId: string) => void;
  initialContacts?: any[];
  theme?: 'light' | 'dark';
  fallbackComponent?: React.ComponentType;
}

// Dynamic remote component loader
const loadRemoteComponent = (remoteUrl: string, module: string) => {
  return lazy(async () => {
    try {
      // Load the remote entry
      const script = document.createElement('script');
      script.src = `${remoteUrl}/assets/remoteEntry.js`;
      script.type = 'module';
      
      return new Promise((resolve, reject) => {
        script.onload = async () => {
          try {
            // Access the remote container
            const container = (window as any).contacts_remote;
            await container.init({
              react: () => import('react'),
              'react-dom': () => import('react-dom')
            });
            
            const factory = await container.get(module);
            const Module = factory();
            resolve({ default: Module.default || Module });
          } catch (error) {
            reject(error);
          }
        };
        
        script.onerror = reject;
        document.head.appendChild(script);
      });
    } catch (error) {
      throw new Error(`Failed to load remote component: ${error}`);
    }
  });
};

const RemoteContactsLoader: React.FC<RemoteContactsProps> = ({
  remoteUrl,
  fallbackComponent: FallbackComponent,
  ...props
}) => {
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadComponent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const LazyComponent = loadRemoteComponent(remoteUrl, './ContactsApp');
        
        if (mounted) {
          setRemoteComponent(() => LazyComponent);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load remote contacts');
          console.error('Remote contacts loading error:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (remoteUrl) {
      loadComponent();
    }

    return () => {
      mounted = false;
    };
  }, [remoteUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner message="Loading remote contacts..." size="lg" />
      </div>
    );
  }

  if (error) {
    console.warn('Remote contacts failed to load:', error);
    
    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
        <h3 className="text-yellow-800 font-medium">Remote Contacts Unavailable</h3>
        <p className="text-yellow-700 text-sm mt-1">
          Cannot connect to remote contacts app. Using local fallback.
        </p>
        <details className="mt-2">
          <summary className="text-yellow-600 text-xs cursor-pointer">Technical Details</summary>
          <pre className="text-xs text-yellow-600 mt-1 whitespace-pre-wrap">{error}</pre>
        </details>
      </div>
    );
  }

  if (!RemoteComponent) {
    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }
    return <div>Remote component not available</div>;
  }

  return (
    <Suspense fallback={<LoadingSpinner message="Initializing contacts..." size="lg" />}>
      <RemoteComponent {...props} />
    </Suspense>
  );
};

export default RemoteContactsLoader;