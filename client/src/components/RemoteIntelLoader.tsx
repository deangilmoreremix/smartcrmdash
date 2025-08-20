import React from 'react';
import AutoRefreshRemoteApp from './AutoRefreshRemoteApp';

const RemoteIntelLoader: React.FC = () => {
  return (
    <div className="w-full h-full">
      <AutoRefreshRemoteApp
        src="https://product-research-mod-uay0.bolt.host/"
        title="Intel Dashboard"
        defaultRefreshInterval={240} // 4 minutes
        allowFullscreen={true}
      />
    </div>
  );
};

export default RemoteIntelLoader;