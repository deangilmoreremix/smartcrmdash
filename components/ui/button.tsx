import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-50 px-4 py-2",
      ghost: "bg-transparent hover:bg-gray-100 px-3 py-2",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-2"
    };
    
    const styles = `${baseStyles} ${variantStyles[variant]} ${className || ''}`;
    
    return (
      <button className={styles} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';