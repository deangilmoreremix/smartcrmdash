import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RemoteBusinessIntelLoader: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`w-full h-full ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg overflow-hidden`}>
      <div className="w-full h-full">
        <iframe
          src="https://ai-powered-analytics-fibd.bolt.host"
          className="w-full h-full border-0"
          title="Business Intelligence Platform"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default RemoteBusinessIntelLoader;