import React from 'react';
import RemoteBusinessIntelLoader from '../components/RemoteBusinessIntelLoader';

const BusinessIntelPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-16">
      <div className="w-full h-full">
        <RemoteBusinessIntelLoader />
      </div>
    </div>
  );
};

export default BusinessIntelPage;