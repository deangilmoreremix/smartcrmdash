import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto">
        <button 
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
          onClick={() => onOpenChange(false)}
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};