import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void; 
  isThemeChanging: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Always start in light mode
    return false;
  });

  // Add a state to track theme transitions
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    
    // Use localStorage asynchronously to avoid blocking the main thread
    setTimeout(() => {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, 0);
  }, [isDark]);

  // Helper to handle theme transition state
  const handleThemeChange = useCallback(() => {
    setIsThemeChanging(true);
    setIsDark(prev => !prev);
    
    // Reset the transition state after animation completes
    setTimeout(() => setIsThemeChanging(false), 300);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isThemeChanging }}>
      {children}
    </ThemeContext.Provider>
  );
};