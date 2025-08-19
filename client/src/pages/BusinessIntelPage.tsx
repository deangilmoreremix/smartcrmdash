import React from 'react';
import RemoteBusinessIntelLoader from '../components/RemoteBusinessIntelLoader';

const BusinessIntelPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="h-full rounded-xl overflow-hidden shadow-2xl">
          <RemoteBusinessIntelLoader />
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelPage;