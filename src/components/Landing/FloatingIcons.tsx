import React from 'react';

const FloatingIcons: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 animate-float">
        <div className="w-8 h-8 bg-blue-200 rounded-full opacity-50"></div>
      </div>
      <div className="absolute top-20 right-20 animate-pulse">
        <div className="w-6 h-6 bg-purple-200 rounded-full opacity-40"></div>
      </div>
      <div className="absolute bottom-20 left-1/4 animate-bounce">
        <div className="w-4 h-4 bg-green-200 rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default FloatingIcons;
