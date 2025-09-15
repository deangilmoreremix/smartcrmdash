// Remote White Label Suite Loader
import React, { useRef, useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useRemoteAppUpdates } from '../utils/remoteAppManager';

interface RemoteWhiteLabelLoaderProps {
  showHeader?: boolean;
}

const RemoteWhiteLabelLoader: React.FC<RemoteWhiteLabelLoaderProps> = ({
  showHeader = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const REMOTE_URL = 'https://moonlit-tarsier-239e70.netlify.app';
  const IFRAME_ID = 'wl-remote-iframe';

  const { manualRefresh, checkForUpdates, isChecking } = useRemoteAppUpdates(
    IFRAME_ID,
    REMOTE_URL,
    true // Enable auto-refresh
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        setError(null);
        setIsConnected(true);
      };

      const handleError = () => {
        setError('Network error: Could not connect to the white label suite.');
        setIsConnected(false);
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, []);

  const handleRefresh = () => {
    setError(null);
    manualRefresh();
  };

  return (
    <div className="h-full w-full overflow-auto">
      {showHeader && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isConnected ? '#10b981' : '#ef4444'
              }}>
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isChecking}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: isChecking ? 'not-allowed' : 'pointer',
                  opacity: isChecking ? 0.6 : 1
                }}
              >
                <RefreshCw size={12} style={{ animation: isChecking ? 'spin 1s linear infinite' : 'none' }} />
                {isChecking ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <a
              href={REMOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: '#667eea',
                border: '1px solid #667eea',
                borderRadius: '6px',
                fontSize: '12px',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={12} />
              Open in New Tab
            </a>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '12px',
          textAlign: 'center',
          fontSize: '14px',
          borderBottom: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}


      <iframe
        ref={iframeRef}
        id={IFRAME_ID}
        src={REMOTE_URL}
        style={{
          width: '100%',
          height: showHeader ? 'calc(100vh - 60px)' : '100vh',
          minHeight: '800px',
          border: 'none',
          display: 'block',
          overflow: 'auto'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        title="White Label Management Suite"
        scrolling="yes"
      />
    </div>
  );
};

export default RemoteWhiteLabelLoader;