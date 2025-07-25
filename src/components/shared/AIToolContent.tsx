import React, { ReactNode } from 'react';

interface AIToolContentProps {
  title: string;
  description: string;
  children: ReactNode;
  isActive?: boolean;
  onActivate?: () => void;
  className?: string;
}

const AIToolContent: React.FC<AIToolContentProps> = ({
  title,
  description,
  children,
  isActive = false,
  onActivate,
  className = ""
}) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-6 
        transition-all duration-300 hover:shadow-md
        ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        ${className}
      `}
      onClick={onActivate}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default AIToolContent;
