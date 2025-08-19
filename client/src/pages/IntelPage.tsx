import React from 'react';
import RemoteIntelLoader from '../components/RemoteIntelLoader';

const IntelPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="h-full rounded-xl overflow-hidden shadow-2xl">
          <RemoteIntelLoader />
        </div>
      </div>
    </div>
  );
};

export default IntelPage;