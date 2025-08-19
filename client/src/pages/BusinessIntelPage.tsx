import React from 'react';
import RemoteBusinessIntelLoader from '../components/RemoteBusinessIntelLoader';

const BusinessIntelPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-40">
      <RemoteBusinessIntelLoader />
    </div>
  );
};

export default BusinessIntelPage;