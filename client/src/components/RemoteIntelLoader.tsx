import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RemoteIntelLoader: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`w-full h-full ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg overflow-hidden`}>
      <div className="w-full h-full">
        <iframe
          src="https://clever-syrniki-4df87f.netlify.app/"
          className="w-full h-full border-0"
          title="Intel Platform"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default RemoteIntelLoader;