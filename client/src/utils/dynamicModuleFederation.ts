// Dynamic Module Federation Loader - Works without Vite config changes
// Import satisfy first to avoid TDZ issues
import { wt } from './satisfy';


export interface RemoteModuleConfig {
  url: string;
  scope: string;
  module: string;
  requiredVersion?: string; // Optional version requirement for compatibility checking
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

    console.log(`🚀 DEBUG: Starting module federation load for ${scope}/${module} from ${url}`);

    try {
      // Load the remote script if not already loaded
      if (!this.loadedScripts.has(url)) {
        console.log(`📦 DEBUG: Loading remote script for ${scope} from ${url}`);
        await this.loadScript(url);
        this.loadedScripts.add(url);
        console.log(`✅ DEBUG: Remote script loaded successfully for ${scope}`);
      } else {
        console.log(`♻️ DEBUG: Using cached script for ${scope}`);
      }

      // Get the container
      console.log(`🔍 DEBUG: Getting container for scope: ${scope}`);
      const container = await this.getContainer(scope);
      console.log(`✅ DEBUG: Container obtained for ${scope}`);

      // Initialize container with shared dependencies
      console.log(`🔧 DEBUG: Initializing container for ${scope}`);
      await this.initContainer(container);
      console.log(`✅ DEBUG: Container initialized for ${scope}`);

      // Get the module factory
      console.log(`📦 DEBUG: Getting module factory for ${module} from ${scope}`);
      const factory = await container.get(module);
      const Module = factory();
      console.log(`✅ DEBUG: Module factory executed for ${scope}/${module}`);

      // Optional: Check version compatibility if the module exposes a version
      if (Module.version && config.requiredVersion) {
        console.log(`🔍 DEBUG: Checking version compatibility: ${Module.version} vs ${config.requiredVersion}`);
        if (!wt(Module.version, config.requiredVersion)) {
          const error = new Error(`Module ${scope}/${module} version ${Module.version} does not satisfy required version ${config.requiredVersion}`);
          console.error(`❌ DEBUG: Version compatibility check failed:`, error);
          throw error;
        }
        console.log(`✅ DEBUG: Version compatibility check passed`);
      }

      console.log(`🎉 DEBUG: Successfully loaded remote module ${scope}/${module}`);
      return Module.default || Module;
    } catch (error) {
      console.error(`❌ DEBUG: Failed to load remote module ${scope}/${module} from ${url}:`, error);
      // Return a fallback/placeholder component instead of throwing
      console.log(`🛡️ DEBUG: Returning fallback component for ${scope}/${module}`);
      return this.createFallbackComponent(scope, module) as T;
    }
  }

  private async loadScript(url: string): Promise<void> {
    console.log(`🌐 DEBUG: Starting script load process for URL: ${url}`);

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;

      // Try different possible script URLs
      const possibleUrls = [
        `${url}/remoteEntry.js`,
        `${url}/assets/remoteEntry.js`,
        `${url}/static/js/remoteEntry.js`,
        url.endsWith('.js') ? url : `${url}/remoteEntry.js`
      ];

      console.log(`📋 DEBUG: Possible URLs to try:`, possibleUrls);

      let currentUrlIndex = 0;

      const tryNextUrl = () => {
        if (currentUrlIndex >= possibleUrls.length) {
          const error = new Error(`Failed to load remote script from any of: ${possibleUrls.join(', ')}`);
          console.error('❌ DEBUG: Module Federation script loading failed after trying all URLs:', error);
          reject(error);
          return;
        }

        script.src = possibleUrls[currentUrlIndex];
        console.log(`🔄 DEBUG: Attempting to load script from: ${script.src} (attempt ${currentUrlIndex + 1}/${possibleUrls.length})`);
        currentUrlIndex++;
      };

      script.onload = () => {
        console.log(`✅ DEBUG: Module Federation script loaded successfully: ${script.src}`);
        resolve();
      };

      script.onerror = (error) => {
        console.warn(`❌ DEBUG: Failed to load script from: ${script.src}`, error);
        tryNextUrl();
      };

      tryNextUrl();
      document.head.appendChild(script);
    });
  }

  private async getContainer(scope: string): Promise<ModuleContainer> {
    console.log(`🔍 DEBUG: Checking for cached container: ${scope}`);

    if (this.loadedContainers.has(scope)) {
      console.log(`♻️ DEBUG: Using cached Module Federation container: ${scope}`);
      return this.loadedContainers.get(scope)!;
    }

    // Wait for the global to be available (reduced for faster fallback)
    let retries = 0;
    const maxRetries = 20; // 2 seconds max wait

    console.log(`🔍 DEBUG: Looking for Module Federation container: ${scope}`);
    console.log(`📊 DEBUG: Current window keys:`, Object.keys(window).slice(0, 10), '...');

    while (!window[scope] && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;

      if (retries % 10 === 0) {
        console.log(`⏳ DEBUG: Still waiting for container "${scope}" (${retries}/${maxRetries})`);
        console.log(`📊 DEBUG: Available globals with 'get' method:`,
          Object.keys(window).filter(key =>
            typeof window[key] === 'object' &&
            window[key] !== null &&
            typeof (window[key] as any).get === 'function'
          )
        );
      }
    }

    if (!window[scope]) {
      const availableContainers = Object.keys(window).filter(key =>
        typeof window[key] === 'object' &&
        window[key] !== null &&
        typeof (window[key] as any).get === 'function'
      );
      const error = new Error(`Remote container "${scope}" not found. Available containers: ${availableContainers.join(', ') || 'none'}`);
      console.error('❌ DEBUG: Module Federation container not found:', error);
      console.error('🔍 DEBUG: Full window object keys:', Object.keys(window));
      throw error;
    }

    console.log(`✅ DEBUG: Module Federation container found: ${scope}`);
    const container = window[scope] as ModuleContainer;
    this.loadedContainers.set(scope, container);
    return container;
  }

  private async initContainer(container: ModuleContainer): Promise<void> {
    console.log(`🔧 DEBUG: Initializing container with shared dependencies`);

    // Get shared dependencies dynamically
    const shared = {
      react: () => import('react'),
      'react-dom': () => import('react-dom'),
      'react-router-dom': () => import('react-router-dom')
    };

    console.log(`📦 DEBUG: Shared dependencies:`, Object.keys(shared));

    try {
      await container.init(shared);
      console.log(`✅ DEBUG: Container initialization successful`);
    } catch (error) {
      console.error(`❌ DEBUG: Container initialization failed:`, error);
      throw error;
    }
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

  // Create a fallback component when remote module fails to load
  private createFallbackComponent(scope: string, module: string): any {
    // Return a simple object that can be used as a fallback
    // This prevents the app from crashing when remote modules fail
    return {
      default: () => null,
      [module]: () => null
    };
  }
}

export const moduleFederation = new DynamicModuleFederation();

// Utility function for easy loading
export async function loadRemoteComponent<T = any>(
  remoteUrl: string,
  scope: string,
  module: string,
  requiredVersion?: string
): Promise<T> {
  return moduleFederation.loadRemoteModule<T>({
    url: remoteUrl,
    scope,
    module,
    requiredVersion
  });
}

// React hook for loading remote components
import { useState, useEffect } from 'react';

export function useRemoteComponent<T = any>(
  remoteUrl: string | null,
  scope: string,
  module: string,
  requiredVersion?: string
) {
  const [component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log(`🎣 DEBUG: useRemoteComponent hook triggered for ${scope}/${module}`);
    console.log(`  - remoteUrl: ${remoteUrl}`);
    console.log(`  - scope: ${scope}`);
    console.log(`  - module: ${module}`);
    console.log(`  - requiredVersion: ${requiredVersion}`);

    if (!remoteUrl) {
      console.log(`🚫 DEBUG: No remoteUrl provided, clearing component`);
      setComponent(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadComponent = async () => {
      try {
        console.log(`⏳ DEBUG: Starting component load for ${scope}/${module}`);
        setLoading(true);
        setError(null);

        const loadedComponent = await loadRemoteComponent<T>(remoteUrl, scope, module, requiredVersion);

        if (!cancelled) {
          console.log(`✅ DEBUG: Component loaded successfully for ${scope}/${module}`);
          setComponent(loadedComponent);
        } else {
          console.log(`🚫 DEBUG: Component load cancelled for ${scope}/${module}`);
        }
      } catch (err) {
        console.error(`❌ DEBUG: Component load failed for ${scope}/${module}:`, err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load remote component'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log(`🏁 DEBUG: Component load finished for ${scope}/${module}`);
        }
      }
    };

    loadComponent();

    return () => {
      console.log(`🧹 DEBUG: Cleaning up component load for ${scope}/${module}`);
      cancelled = true;
    };
  }, [remoteUrl, scope, module, requiredVersion]);

  return { component, loading, error };
}