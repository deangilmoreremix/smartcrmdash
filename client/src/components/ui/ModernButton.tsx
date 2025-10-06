import React from 'react';
import { Loader2 } from 'lucide-react';
import './../../styles/design-system.css';

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'glass' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = ''
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30';
      case 'outline':
        return 'bg-transparent border border-[var(--gray-300)] text-[var(--gray-700)] hover:bg-[var(--gray-50)]';
      case 'ghost':
        return 'bg-transparent text-[var(--gray-700)] hover:bg-[var(--gray-100)]';
      case 'primary':
      default:
        return 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-sm)]';
      case 'lg':
        return 'px-[var(--space-6)] py-[var(--space-4)] text-[var(--text-lg)]';
      case 'md':
      default:
        return 'px-[var(--space-4)] py-[var(--space-3)] text-[var(--text-base)]';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getVariantClass()}
        ${getSizeClass()}
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};