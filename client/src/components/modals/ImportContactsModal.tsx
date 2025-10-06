import React from 'react';

interface ImportContactsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ImportContactsModal: React.FC<ImportContactsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Import Contacts</h2>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ImportContactsModal;
