import React from 'react';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className = '',
  showLabel = false 
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 mt-1 block">
          {Math.round(normalizedValue)}%
        </span>
      )}
    </div>
  );
};

export default Progress;
