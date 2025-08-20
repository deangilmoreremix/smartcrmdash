
import React, { createContext, useContext, useState, useCallback } from 'react';

interface RemoteApp {
  id: string;
  title: string;
  src: string;
  lastRefreshed: number;
  autoRefreshEnabled: boolean;
  refreshInterval: number;
}

interface RemoteAppContextType {
  apps: Record<string, RemoteApp>;
  registerApp: (id: string, title: string, src: string) => void;
  unregisterApp: (id: string) => void;
  refreshApp: (id: string) => void;
  refreshAllApps: () => void;
  toggleAutoRefresh: (id: string) => void;
  setRefreshInterval: (id: string, interval: number) => void;
  getAppStatus: (id: string) => RemoteApp | undefined;
}

const RemoteAppContext = createContext<RemoteAppContextType | undefined>(undefined);

export const useRemoteApps = () => {
  const context = useContext(RemoteAppContext);
  if (!context) {
    throw new Error('useRemoteApps must be used within a RemoteAppProvider');
  }
  return context;
};

export const RemoteAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<Record<string, RemoteApp>>({});

  const registerApp = useCallback((id: string, title: string, src: string) => {
    setApps(prev => ({
      ...prev,
      [id]: {
        id,
        title,
        src,
        lastRefreshed: Date.now(),
        autoRefreshEnabled: false,
        refreshInterval: 300 // 5 minutes default
      }
    }));
  }, []);

  const unregisterApp = useCallback((id: string) => {
    setApps(prev => {
      const newApps = { ...prev };
      delete newApps[id];
      return newApps;
    });
  }, []);

  const refreshApp = useCallback((id: string) => {
    // Trigger refresh via event system
    window.dispatchEvent(new CustomEvent('refreshRemoteApp', { detail: { id } }));
    
    setApps(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        lastRefreshed: Date.now()
      }
    }));
  }, []);

  const refreshAllApps = useCallback(() => {
    Object.keys(apps).forEach(id => {
      refreshApp(id);
    });
  }, [apps, refreshApp]);

  const toggleAutoRefresh = useCallback((id: string) => {
    setApps(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        autoRefreshEnabled: !prev[id].autoRefreshEnabled
      }
    }));
  }, []);

  const setRefreshInterval = useCallback((id: string, interval: number) => {
    setApps(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        refreshInterval: interval
      }
    }));
  }, []);

  const getAppStatus = useCallback((id: string) => {
    return apps[id];
  }, [apps]);

  const value = {
    apps,
    registerApp,
    unregisterApp,
    refreshApp,
    refreshAllApps,
    toggleAutoRefresh,
    setRefreshInterval,
    getAppStatus
  };

  return (
    <RemoteAppContext.Provider value={value}>
      {children}
    </RemoteAppContext.Provider>
  );
};
