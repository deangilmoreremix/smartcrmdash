/**
 * This file provides fallback imports for Lucide React icons
 * that might be causing import errors in the application.
 * 
 * Corner-left-up.js was specifically failing to load in the app.
 */

// Define types for icon props
export interface IconProps {
  color?: string;
  size?: number | string;
  [key: string]: any;
}

// Create a basic placeholder SVG for any icons that fail to load
export const createFallbackIcon = (name: string) => {
  const FallbackIcon = (props: IconProps) => {
    const { color = 'currentColor', size = 24, ...otherProps } = props;
    
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...otherProps}
      >
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <text
          x="12"
          y="14"
          fontFamily="monospace"
          fontSize="6"
          textAnchor="middle"
          fill={color}
        >
          {name}
        </text>
      </svg>
    );
  };
  
  FallbackIcon.displayName = name;
  return FallbackIcon;
};

// Export the specific icon that was failing
export const CornerLeftUp = createFallbackIcon('CornerLeftUp');

// Export other potentially problematic icons
export const CornerLeftDown = createFallbackIcon('CornerLeftDown');
export const CornerRightUp = createFallbackIcon('CornerRightUp');
export const CornerRightDown = createFallbackIcon('CornerRightDown');

// Export a special function for Lucide to use as a fallback
export const resolveLucideIcon = (iconName: string) => {
  // Try to find it in our fallbacks
  if (iconName === 'CornerLeftUp') return CornerLeftUp;
  if (iconName === 'CornerLeftDown') return CornerLeftDown;
  if (iconName === 'CornerRightUp') return CornerRightUp;
  if (iconName === 'CornerRightDown') return CornerRightDown;
  
  // Create a generic fallback for any other missing icons
  return createFallbackIcon(iconName);
};
