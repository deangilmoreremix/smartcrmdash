import React from 'react';

interface AnimatedFeatureIconProps {
  icon: React.ReactNode;
  color: string;
  delay: number;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedFeatureIcon: React.FC<AnimatedFeatureIconProps> = ({ 
  icon, 
  color, 
  delay, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${color} rounded-full flex items-center justify-center animate-bounce`}
      style={{ animationDelay: `${delay}s` }}
    >
      {icon}
    </div>
  );
};

export default AnimatedFeatureIcon;
