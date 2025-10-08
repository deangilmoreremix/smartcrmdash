import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAITools } from '../components/AIToolsProvider';
import { getRouteForTool, isToolRoutable } from '../utils/routeMapping';

interface NavigationContextType {
  scrollToSection: (sectionId: string) => void;
  openAITool: (toolName: string) => void;
  navigateToFeature: (feature: string) => void;
  navigateToTool: (toolId: string) => void;
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
  const { openTool } = useAITools();
  const navigate = useNavigate();

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
    openTool(toolName);
  };

  // Navigate to a tool based on its ID
  const navigateToTool = (toolId: string) => {
    if (isToolRoutable(toolId)) {
      // If the tool has a dedicated route, navigate to it
      const route = getRouteForTool(toolId);
      if (route) {
        navigate(route);
      } else {
        console.warn(`No route defined for tool: ${toolId}`);
      }
    } else {
      // If it's an AI tool that opens in a panel/modal
      openAITool(toolId);
    }
  };

  const navigateToFeature = (feature: string) => {
    // First check if it's a tool we can navigate to
    if (feature.startsWith('/')) {
      navigate(feature);
      return;
    }
    
    // Otherwise handle special dashboard sections
    switch (feature) {
      case 'dashboard':
        try {
          navigate('/dashboard');
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        } catch (error) {
          console.error("Error navigating to dashboard:", error);
        }
        break;
      case 'contacts':
        navigate('/contacts');
        break;
      case 'pipeline':
        navigate('/pipeline');
        break;
      case 'ai-tools':
        navigate('/ai-tools');
        break;
      case 'tasks':
        navigate('/tasks');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'apps':
        navigate('/dashboard');
        setTimeout(() => {
          scrollToSection('apps-section');
        }, 100);
        break;
      default:
        // Try to navigate to it as a tool
        navigateToTool(feature);
    }
  };

  return (
    <NavigationContext.Provider value={{ scrollToSection, openAITool, navigateToFeature, navigateToTool }}>
      {children}
    </NavigationContext.Provider>
  );
};