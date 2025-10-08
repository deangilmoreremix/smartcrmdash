import React from 'react';
import { getInitials } from '../../utils/avatars';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name = '', src, size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  
  if (src) {
    return <img src={src} alt={name} className={`${sizeClasses[size]} rounded-full object-cover ${className}`} />;
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
