import React from 'react';
import AutoRefreshRemoteApp from './AutoRefreshRemoteApp';

const RemoteAnalyticsLoader: React.FC = () => {
  return (
    <div className="w-full h-full">
      <AutoRefreshRemoteApp
        src="https://ai-powered-analytics-fibd.bolt.host"
        title="Analytics Dashboard"
        defaultRefreshInterval={180} // 3 minutes for analytics
        allowFullscreen={true}
      />
    </div>
  );
};

export default RemoteAnalyticsLoader;