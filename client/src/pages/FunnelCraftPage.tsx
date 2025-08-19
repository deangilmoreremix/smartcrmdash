import React from 'react';
import RemoteFunnelCraftLoader from '../components/RemoteFunnelCraftLoader';

const FunnelCraftPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-16">
      <div className="w-full h-full">
        <RemoteFunnelCraftLoader />
      </div>
    </div>
  );
};

export default FunnelCraftPage;