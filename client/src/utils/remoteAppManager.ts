
class RemoteAppManager {
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastUpdateChecks: Map<string, number> = new Map();

  // Check if remote app has updates
  async checkForUpdates(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const lastModified = response.headers.get('last-modified');
      const etag = response.headers.get('etag');
      
      const currentCheck = Date.now();
      const lastCheck = this.lastUpdateChecks.get(url) || 0;
      const cacheKey = `${lastModified}-${etag}`;
      
      if (currentCheck - lastCheck > 30000) { // Check every 30 seconds
        this.lastUpdateChecks.set(url, currentCheck);
        return true; // Assume update available for demo
      }
      
      return false;
    } catch (error) {
      console.warn('Failed to check for updates:', error);
      return false;
    }
  }

  // Auto-refresh iframe when updates detected
  startAutoRefresh(iframeId: string, url: string, intervalMs: number = 60000) {
    if (this.refreshIntervals.has(iframeId)) {
      this.stopAutoRefresh(iframeId);
    }

    const interval = setInterval(async () => {
      const hasUpdates = await this.checkForUpdates(url);
      if (hasUpdates) {
        this.refreshIframe(iframeId);
      }
    }, intervalMs);

    this.refreshIntervals.set(iframeId, interval);
  }

  // Manual refresh
  refreshIframe(iframeId: string) {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (iframe) {
      // Add timestamp to force refresh
      const url = new URL(iframe.src);
      url.searchParams.set('_refresh', Date.now().toString());
      iframe.src = url.toString();
    }
  }

  // Stop auto-refresh
  stopAutoRefresh(iframeId: string) {
    const interval = this.refreshIntervals.get(iframeId);
    if (interval) {
      clearInterval(interval);
      this.refreshIntervals.delete(iframeId);
    }
  }

  // Clean up all intervals
  cleanup() {
    this.refreshIntervals.forEach(interval => clearInterval(interval));
    this.refreshIntervals.clear();
  }
}

export const remoteAppManager = new RemoteAppManager();

// React hook for remote app updates
import { useEffect, useState } from 'react';

export function useRemoteAppUpdates(iframeId: string, url: string, autoRefresh: boolean = false) {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      remoteAppManager.startAutoRefresh(iframeId, url);
    }

    return () => {
      remoteAppManager.stopAutoRefresh(iframeId);
    };
  }, [iframeId, url, autoRefresh]);

  const manualRefresh = () => {
    remoteAppManager.refreshIframe(iframeId);
    setLastUpdate(Date.now());
  };

  const checkForUpdates = async () => {
    setIsChecking(true);
    const hasUpdates = await remoteAppManager.checkForUpdates(url);
    setIsChecking(false);
    
    if (hasUpdates) {
      manualRefresh();
    }
    
    return hasUpdates;
  };

  return {
    lastUpdate,
    isChecking,
    manualRefresh,
    checkForUpdates
  };
}
