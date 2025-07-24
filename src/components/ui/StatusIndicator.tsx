import React from 'react';

interface StatusIndicatorProps {
  status?: 'active' | 'pending' | 'inactive' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'active',
  size = 'md',
  pulse = false
}) => {
  // Get color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'success':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-orange-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get size class
  const getSizeClass = () => {
    switch (size) {
      case 'xs':
        return 'w-2 h-2';
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      case 'md':
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <div className={`${getSizeClass()} ${getStatusColor()} rounded-full border border-white dark:border-gray-800 ${pulse ? 'animate-pulse' : ''}`}></div>
  );
};