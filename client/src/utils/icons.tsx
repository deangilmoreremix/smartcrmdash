import React from 'react';
import * as LucideIcons from 'lucide-react';
import { createFallbackIcon } from './iconFallbacks';

// Type for icon props
export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  className?: string;
};

// Wrapper component to handle size prop correctly
export const Icon = ({ 
  icon,
  name,
  size = 24, 
  className = "",
  ...props 
}: { 
  icon?: React.FC<IconProps>;
  name?: string;
  size?: number | string;
  className?: string;
} & React.SVGProps<SVGSVGElement>) => {
  // Get the icon component - either directly passed or by name
  let IconComponent = icon;
  
  // If icon is not directly provided but name is, look it up
  if (!IconComponent && name) {
    IconComponent = getIconByName(name);
  }

  // Handle missing icon component gracefully
  if (!IconComponent) {
    console.warn('Icon component is undefined');
    return null;
  }

  return (
    <IconComponent 
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

// Add missing corner icons
const missingIcons = {
  CornerLeftUp: createFallbackIcon('CornerLeftUp'),
  CornerLeftDown: createFallbackIcon('CornerLeftDown'),
  CornerRightUp: createFallbackIcon('CornerRightUp'),
  CornerRightDown: createFallbackIcon('CornerRightDown')
};

// Re-export all Lucide icons with fallbacks
export const Icons = {
  ...LucideIcons,
  ...missingIcons
};

// Helper function to get icon by name (useful for dynamic icons)
export function getIconByName(name: string): React.FC<IconProps> {
  // First check our extended Icons object
  const icon = (Icons as unknown as Record<string, React.FC<IconProps>>)[name];
  
  // If not found, create a fallback
  if (!icon) {
    console.warn(`Icon '${name}' not found, using fallback`);
    return createFallbackIcon(name);
  }
  
  return icon;
}
