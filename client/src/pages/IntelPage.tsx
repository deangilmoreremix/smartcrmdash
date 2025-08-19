import React from 'react';
import RemoteIntelLoader from '../components/RemoteIntelLoader';

const IntelPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-16">
      <div className="w-full h-full">
        <RemoteIntelLoader />
      </div>
    </div>
  );
};

export default IntelPage;