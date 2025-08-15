import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = true 
}) => {
  return (
    <div
      className={`
        glass-card rounded-xl
        ${hover ? 'hover:shadow-xl transition-all duration-300 hover:scale-[1.02]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        text-gray-900
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};