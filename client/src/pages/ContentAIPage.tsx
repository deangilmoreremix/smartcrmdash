import React from 'react';
import RemoteContentAILoader from '../components/RemoteContentAILoader';

const ContentAIPage: React.FC = () => {
  return (
    <div className="w-full h-screen pt-16">
      <div className="w-full h-full">
        <RemoteContentAILoader />
      </div>
    </div>
  );
};

export default ContentAIPage;