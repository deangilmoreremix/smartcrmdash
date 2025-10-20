import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NavbarPosition = 'top' | 'left' | 'right' | 'bottom' | 'sidebar';

interface NavbarPositionState {
  position: NavbarPosition;
  isDragging: boolean;
}

interface NavbarPositionContextType {
  position: NavbarPosition;
  isDragging: boolean;
  setPosition: (position: NavbarPosition) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const NavbarPositionContext = createContext<NavbarPositionContextType | undefined>(undefined);

interface NavbarPositionProviderProps {
  children: ReactNode;
  initialPosition?: NavbarPosition;
}

export const NavbarPositionProvider: React.FC<NavbarPositionProviderProps> = ({ children, initialPosition = 'top' }) => {
  const [position, setPositionState] = useState<NavbarPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('navbar-position') as NavbarPosition;
    if (savedPosition && ['top', 'left', 'right', 'bottom', 'sidebar'].includes(savedPosition)) {
      setPositionState(savedPosition);
    }
  }, []);

  // Save position to localStorage when it changes
  const setPosition = (newPosition: NavbarPosition) => {
    setPositionState(newPosition);
    localStorage.setItem('navbar-position', newPosition);
  };

  const value: NavbarPositionContextType = {
    position,
    isDragging,
    setPosition,
    setIsDragging,
  };

  return (
    <NavbarPositionContext.Provider value={value}>
      {children}
    </NavbarPositionContext.Provider>
  );
};

export const useNavbarPosition = (): NavbarPositionContextType => {
  const context = useContext(NavbarPositionContext);
  if (context === undefined) {
    throw new Error('useNavbarPosition must be used within a NavbarPositionProvider');
  }
  return context;
};