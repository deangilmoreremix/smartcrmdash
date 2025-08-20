import React from 'react';
import RemoteWhiteLabelLoader from '../components/RemoteWhiteLabelLoader';

const WhiteLabelManagementDashboard: React.FC = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <RemoteWhiteLabelLoader />
    </div>
  );
};

export default WhiteLabelManagementDashboard;