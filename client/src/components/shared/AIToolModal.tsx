import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface AIToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const AIToolModal: React.FC<AIToolModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              {icon}
            </div>
            <h3 className="font-bold text-lg text-gray-900">
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AIToolModal;