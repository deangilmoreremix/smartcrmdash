import React, { createContext, useState, useContext } from 'react';
import PipelineModal from './PipelineModal';

interface ModalsContextType {
  openPipelineModal: () => void;
  closePipelineModal: () => void;
}

const ModalsContext = createContext<ModalsContextType | undefined>(undefined);

export const useModals = () => {
  const context = useContext(ModalsContext);
  if (context === undefined) {
    throw new Error('useModals must be used within a ModalsProvider');
  }
  return context;
};

export const ModalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  const openPipelineModal = () => setIsPipelineModalOpen(true);
  const closePipelineModal = () => setIsPipelineModalOpen(false);

  return (
    <ModalsContext.Provider value={{ openPipelineModal, closePipelineModal }}>
      {children}
      <PipelineModal isOpen={isPipelineModalOpen} onClose={closePipelineModal} />
    </ModalsContext.Provider>
  );
};

export default ModalsProvider;