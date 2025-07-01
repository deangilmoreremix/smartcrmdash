import React, { createContext, useContext, useState, useEffect } from 'react';

interface SectionConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ReactNode;
  color: string;
}

interface DashboardLayoutContextType {
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  draggedItem: string | null;
  setDraggedItem: (item: string | null) => void;
  getSectionConfig: (id: string) => SectionConfig | undefined;
  reorderSections: (startIndex: number, endIndex: number) => void;
  resetToDefault: () => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export const useDashboardLayout = () => {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error('useDashboardLayout must be used within a DashboardLayoutProvider');
  }
  return context;
};

const defaultSectionOrder = [
  'ai-section',
  'pipeline-section', 
  'contacts-section',
  'tasks-section',
  'apps-section',
  'analytics-section'
];

const sectionConfigs: Record<string, SectionConfig> = {
  'ai-section': {
    id: 'ai-section',
    title: 'AI Intelligence & Insights',
    description: 'AI-powered analysis and recommendations',
    icon: 'Brain',
    component: null,
    color: 'from-purple-500 to-indigo-500'
  },
  'pipeline-section': {
    id: 'pipeline-section',
    title: 'Pipeline & Deal Analytics',
    description: 'Comprehensive deal performance and pipeline health',
    icon: 'BarChart3',
    component: null,
    color: 'from-green-500 to-emerald-500'
  },
  'contacts-section': {
    id: 'contacts-section',
    title: 'Contacts & Leads Management',
    description: 'Manage and nurture your prospect relationships',
    icon: 'Users',
    component: null,
    color: 'from-blue-500 to-cyan-500'
  },
  'tasks-section': {
    id: 'tasks-section',
    title: 'Tasks & Activities',
    description: 'Manage your daily activities and appointments',
    icon: 'CheckSquare',
    component: null,
    color: 'from-orange-500 to-red-500'
  },
  'apps-section': {
    id: 'apps-section',
    title: 'Connected Apps & Integrations',
    description: 'Access your entire business toolkit',
    icon: 'Grid3X3',
    component: null,
    color: 'from-purple-500 to-indigo-500'
  },
  'analytics-section': {
    id: 'analytics-section',
    title: 'Comprehensive Analytics',
    description: 'Detailed charts and performance metrics',
    icon: 'BarChart3',
    component: null,
    color: 'from-indigo-500 to-purple-500'
  }
};

export const DashboardLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    // Load from localStorage or use default
    const saved = localStorage.getItem('dashboard-section-order');
    return saved ? JSON.parse(saved) : defaultSectionOrder;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Save to localStorage whenever order changes
  useEffect(() => {
    localStorage.setItem('dashboard-section-order', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const getSectionConfig = (id: string): SectionConfig | undefined => {
    return sectionConfigs[id];
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
    const newOrder = Array.from(sectionOrder);
    const [removed] = newOrder.splice(startIndex, 1);
    newOrder.splice(endIndex, 0, removed);
    setSectionOrder(newOrder);
  };

  const resetToDefault = () => {
    setSectionOrder([...defaultSectionOrder]);
    localStorage.removeItem('dashboard-section-order');
  };

  return (
    <DashboardLayoutContext.Provider value={{
      sectionOrder,
      setSectionOrder,
      isDragging,
      setIsDragging,
      draggedItem,
      setDraggedItem,
      getSectionConfig,
      reorderSections,
      resetToDefault
    }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};