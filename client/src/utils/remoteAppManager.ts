
class RemoteAppManager {
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastUpdateChecks: Map<string, number> = new Map();
  private updateHashCache: Map<string, string> = new Map();

  // Check if remote app has updates
  async checkForUpdates(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      const lastModified = response.headers.get('last-modified');
      const etag = response.headers.get('etag');
      const contentLength = response.headers.get('content-length');
      
      const currentHash = `${lastModified}-${etag}-${contentLength}-${Date.now()}`;
      const cachedHash = this.updateHashCache.get(url);
      
      if (cachedHash && cachedHash !== currentHash) {
        this.updateHashCache.set(url, currentHash);
        return true;
      }
      
      if (!cachedHash) {
        this.updateHashCache.set(url, currentHash);
      }
      
      // Force refresh every 2 minutes regardless
      const currentCheck = Date.now();
      const lastCheck = this.lastUpdateChecks.get(url) || 0;
      
      if (currentCheck - lastCheck > 120000) { // 2 minutes
        this.lastUpdateChecks.set(url, currentCheck);
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Failed to check for updates:', error);
      // Return true on error to trigger refresh and potentially fix connection issues
      return true;
    }
  }

  // Auto-refresh iframe when updates detected
  startAutoRefresh(iframeId: string, url: string, intervalMs: number = 30000) {
    if (this.refreshIntervals.has(iframeId)) {
      this.stopAutoRefresh(iframeId);
    }

    console.log(`Starting auto-refresh for ${iframeId} every ${intervalMs}ms`);

    const interval = setInterval(async () => {
      const hasUpdates = await this.checkForUpdates(url);
      if (hasUpdates) {
        console.log(`Refreshing ${iframeId} due to detected updates`);
        this.refreshIframe(iframeId);
      }
    }, intervalMs);

    this.refreshIntervals.set(iframeId, interval);
  }

  // Manual refresh
  refreshIframe(iframeId: string) {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (iframe) {
      // Add timestamp to force refresh and prevent caching
      const originalSrc = iframe.src.split('?')[0]; // Remove existing query params
      const timestamp = Date.now();
      iframe.src = `${originalSrc}?_refresh=${timestamp}&_nocache=${Math.random()}`;
      
      // Dispatch custom event for refresh
      window.dispatchEvent(new CustomEvent('remoteAppRefresh', { 
        detail: { iframeId, timestamp } 
      }));
    }
  }

  // Refresh all active remote apps
  refreshAllApps() {
    this.refreshIntervals.forEach((_, iframeId) => {
      this.refreshIframe(iframeId);
    });
  }

  // Stop auto-refresh
  stopAutoRefresh(iframeId: string) {
    const interval = this.refreshIntervals.get(iframeId);
    if (interval) {
      clearInterval(interval);
      this.refreshIntervals.delete(iframeId);
      console.log(`Stopped auto-refresh for ${iframeId}`);
    }
  }

  // Get active refresh count
  getActiveRefreshCount(): number {
    return this.refreshIntervals.size;
  }

  // Clean up all intervals
  cleanup() {
    console.log(`Cleaning up ${this.refreshIntervals.size} auto-refresh intervals`);
    this.refreshIntervals.forEach(interval => clearInterval(interval));
    this.refreshIntervals.clear();
    this.lastUpdateChecks.clear();
    this.updateHashCache.clear();
  }
}

export const remoteAppManager = new RemoteAppManager();

// React hook for remote app updates
import { useEffect, useState, useCallback } from 'react';

export function useRemoteAppUpdates(
  iframeId: string, 
  url: string, 
  autoRefresh: boolean = true, 
  refreshInterval: number = 30000
) {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isChecking, setIsChecking] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (autoRefresh && url && iframeId) {
      remoteAppManager.startAutoRefresh(iframeId, url, refreshInterval);
    }

    // Listen for refresh events
    const handleRefresh = (event: CustomEvent) => {
      if (event.detail.iframeId === iframeId) {
        setLastUpdate(event.detail.timestamp);
        setRefreshCount(prev => prev + 1);
      }
    };

    window.addEventListener('remoteAppRefresh', handleRefresh as EventListener);

    return () => {
      remoteAppManager.stopAutoRefresh(iframeId);
      window.removeEventListener('remoteAppRefresh', handleRefresh as EventListener);
    };
  }, [iframeId, url, autoRefresh, refreshInterval]);

  const manualRefresh = useCallback(() => {
    remoteAppManager.refreshIframe(iframeId);
    setLastUpdate(Date.now());
    setRefreshCount(prev => prev + 1);
  }, [iframeId]);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    const hasUpdates = await remoteAppManager.checkForUpdates(url);
    setIsChecking(false);
    
    if (hasUpdates) {
      manualRefresh();
    }
    
    return hasUpdates;
  }, [url, manualRefresh]);

  const toggleAutoRefresh = useCallback(() => {
    if (remoteAppManager.getActiveRefreshCount() > 0) {
      remoteAppManager.stopAutoRefresh(iframeId);
    } else {
      remoteAppManager.startAutoRefresh(iframeId, url, refreshInterval);
    }
  }, [iframeId, url, refreshInterval]);

  return {
    lastUpdate,
    isChecking,
    refreshCount,
    manualRefresh,
    checkForUpdates,
    toggleAutoRefresh,
    isAutoRefreshActive: remoteAppManager.getActiveRefreshCount() > 0
  };
}
