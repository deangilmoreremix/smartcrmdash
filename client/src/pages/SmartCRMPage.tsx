import React from 'react';
import RemoteSmartCRMLoader from '../components/RemoteSmartCRMLoader';

const SmartCRMPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-16">
      <div className="w-full h-full">
        <RemoteSmartCRMLoader />
      </div>
    </div>
  );
};

export default SmartCRMPage;