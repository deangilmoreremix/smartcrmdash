
import { useState, useCallback } from 'react';

interface VoiceAgentState {
  isActive: boolean;
  isMinimized: boolean;
  isVisible: boolean;
}

export const useVoiceAgent = () => {
  const [state, setState] = useState<VoiceAgentState>({
    isActive: false,
    isMinimized: false,
    isVisible: true
  });

  const toggleAgent = useCallback(() => {
    setState(prev => ({ ...prev, isActive: !prev.isActive }));
  }, []);

  const minimizeAgent = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: true }));
  }, []);

  const maximizeAgent = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: false }));
  }, []);

  const showAgent = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }));
  }, []);

  const hideAgent = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  const resetAgent = useCallback(() => {
    setState({
      isActive: false,
      isMinimized: false,
      isVisible: true
    });
  }, []);

  return {
    ...state,
    toggleAgent,
    minimizeAgent,
    maximizeAgent,
    showAgent,
    hideAgent,
    resetAgent
  };
};

export default useVoiceAgent;
