import React from 'react';
import RemoteWLLoader from '../components/RemoteWLLoader';

const WLPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-16">
      <div className="w-full h-full">
        <RemoteWLLoader />
      </div>
    </div>
  );
};

export default WLPage;