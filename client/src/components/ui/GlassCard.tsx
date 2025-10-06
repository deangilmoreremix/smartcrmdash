import React from 'react';
import './../../styles/design-system.css';

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
        glass-card
        ${hover ? 'hover:shadow-md transition-all duration-300 hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        text-[var(--gray-900)]
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};