import React from 'react';
import AutoRefreshRemoteApp from './AutoRefreshRemoteApp';

const RemoteWLLoader: React.FC = () => {
  return (
    <div className="w-full h-full bg-white">
      <AutoRefreshRemoteApp
        src="https://moonlit-tarsier-239e70.netlify.app/"
        title="White Label Platform"
        defaultRefreshInterval={300} // 5 minutes
        allowFullscreen={true}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default RemoteWLLoader;