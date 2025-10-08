import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default LoadingSpinner;
