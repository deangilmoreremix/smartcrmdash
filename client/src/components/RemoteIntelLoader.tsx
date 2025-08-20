import React from 'react';
import AutoRefreshRemoteApp from './AutoRefreshRemoteApp';

const RemoteIntelLoader: React.FC = () => {
  return (
    <div className="w-full h-full">
      <AutoRefreshRemoteApp
        src="https://clever-syrniki-4df87f.netlify.app/"
        title="Intel Dashboard"
        defaultRefreshInterval={240} // 4 minutes
        allowFullscreen={true}
      />
    </div>
  );
};

export default RemoteIntelLoader;