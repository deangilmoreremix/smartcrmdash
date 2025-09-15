import React, { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import { useNavigate as reactNavigate } from 'react-router-dom';
import { useAITools } from '../components/AIToolsProvider';

interface NavigationContextType {
  scrollToSection: (sectionId: string) => void;
  openAITool: (toolName: string) => void;
  navigateToFeature: (feature: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routerNavigate = reactNavigate;
  const [currentPath, setCurrentPath] = React.useState('');

  // Safe access to AITools with error handling
  let openTool: ((toolName: string) => void) | null = null;
  try {
    const aiTools = useAITools();
    openTool = aiTools?.openTool || null;
  } catch (error) {
    // AIToolsProvider not available - continue without AI tools
    openTool = null;
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const openAITool = (toolName: string) => {
    if (openTool) {
      openTool(toolName);
    }
  };

  const navigateToFeature = (feature: string) => {
    switch (feature) {
      case 'dashboard':
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error("Error scrolling to top:", error);
        }
        break;
      case 'contacts':
        try {
          scrollToSection('customer-lead-management');
        } catch (error) {
          console.error("Error navigating to contacts:", error);
        }
        break;
      case 'pipeline':
        scrollToSection('pipeline-section');
        break;
      case 'ai-tools':
        scrollToSection('ai-smart-features-hub');
        break;
      case 'tasks':
        scrollToSection('tasks-section');
        break;
      case 'analytics':
        scrollToSection('analytics-section');
        break;
      case 'apps':
        scrollToSection('apps-section');
        break;
      case '/deals':
      case '/contacts':
      case '/tasks':
      case '/settings':
        routerNavigate(feature);
        break;
      default:
        console.log(`Navigation to ${feature} not implemented`);
    }
  };

  const navigate = useCallback((path: string, options?: any) => {
    if (path === currentPath) return;

    // Debounce navigation to prevent rapid fire
    clearTimeout(navigationTimeoutRef.current);
    navigationTimeoutRef.current = setTimeout(() => {
      setCurrentPath(path);
      routerNavigate(path, options);
    }, 100);
  }, [currentPath, routerNavigate]);

  // Add ref for timeout
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ scrollToSection, openAITool, navigateToFeature }}>
      {children}
    </NavigationContext.Provider>
  );
};