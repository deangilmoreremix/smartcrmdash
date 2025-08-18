// Dynamic Module Federation Loader - Works without Vite config changes
export interface RemoteModuleConfig {
  url: string;
  scope: string;
  module: string;
}

interface ModuleContainer {
  init(shared: any): Promise<void>;
  get(module: string): Promise<() => any>;
}

declare global {
  interface Window {
    [key: string]: ModuleContainer;
  }
}

class DynamicModuleFederation {
  private loadedScripts = new Set<string>();
  private loadedContainers = new Map<string, ModuleContainer>();

  async loadRemoteModule<T = any>(config: RemoteModuleConfig): Promise<T> {
    const { url, scope, module } = config;
    
    // Load the remote script if not already loaded
    if (!this.loadedScripts.has(url)) {
      await this.loadScript(url);
      this.loadedScripts.add(url);
    }

    // Get the container
    const container = await this.getContainer(scope);
    
    // Initialize container with shared dependencies
    await this.initContainer(container);
    
    // Get the module factory
    const factory = await container.get(module);
    const Module = factory();
    
    return Module.default || Module;
  }

  private async loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = url;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      
      document.head.appendChild(script);
    });
  }

  private async getContainer(scope: string): Promise<ModuleContainer> {
    if (this.loadedContainers.has(scope)) {
      return this.loadedContainers.get(scope)!;
    }

    // Wait for the global to be available
    let retries = 0;
    const maxRetries = 50; // 5 seconds max wait
    
    while (!window[scope] && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    if (!window[scope]) {
      throw new Error(`Remote container "${scope}" not found`);
    }

    const container = window[scope] as ModuleContainer;
    this.loadedContainers.set(scope, container);
    return container;
  }

  private async initContainer(container: ModuleContainer): Promise<void> {
    // Get shared dependencies dynamically
    const shared = {
      react: () => import('react'),
      'react-dom': () => import('react-dom'),
      'react-router-dom': () => import('react-router-dom')
    };

    await container.init(shared);
  }

  // Preload a remote module for better performance
  async preloadRemoteModule(config: RemoteModuleConfig): Promise<void> {
    try {
      await this.loadRemoteModule(config);
    } catch (error) {
      console.warn('Failed to preload remote module:', error);
    }
  }

  // Clear cache if needed
  clearCache(): void {
    this.loadedScripts.clear();
    this.loadedContainers.clear();
  }
}

export const moduleFederation = new DynamicModuleFederation();

// Utility function for easy loading
export async function loadRemoteComponent<T = any>(
  remoteUrl: string,
  scope: string,
  module: string
): Promise<T> {
  return moduleFederation.loadRemoteModule<T>({
    url: remoteUrl,
    scope,
    module
  });
}

// React hook for loading remote components
import { useState, useEffect } from 'react';

export function useRemoteComponent<T = any>(
  remoteUrl: string | null,
  scope: string,
  module: string
) {
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!remoteUrl) {
      setComponent(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const loadedComponent = await loadRemoteComponent<T>(remoteUrl, scope, module);
        
        if (!cancelled) {
          setComponent(loadedComponent);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load remote component'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      cancelled = true;
    };
  }, [remoteUrl, scope, module]);

  return { component, loading, error };
}