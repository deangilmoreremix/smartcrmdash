import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BrandingConfig {
  companyName: string;
  tagline: string;
  description: string;
  website: string;
  supportEmail: string;
  logoUrl: string;
  faviconUrl: string;
  typography: {
    primaryFont: string;
    secondaryFont: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  // Legacy properties for backward compatibility
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  customDomain?: string;
  emailSignature?: string;
  footerText?: string;
}

interface WhiteLabelStore {
  brandingConfig: BrandingConfig;
  isCustomized: boolean;
  previewMode: boolean;
  isDirty: boolean;
  setBrandingConfig: (config: Partial<BrandingConfig>) => void;
  updateBranding: (config: Partial<BrandingConfig>) => void;
  setPreviewMode: (enabled: boolean) => void;
  resetToDefault: () => void;
  resetConfig: () => void;
  saveConfig: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => void;
}

const defaultBranding: BrandingConfig = {
  companyName: 'SmartCRM',
  tagline: 'Intelligent Customer Relationship Management',
  description: 'Transform your business with our comprehensive CRM platform designed for modern teams.',
  website: 'https://smartcrm.com',
  supportEmail: 'support@smartcrm.com',
  logoUrl: '',
  faviconUrl: '',
  typography: {
    primaryFont: 'Inter',
    secondaryFont: 'Inter',
  },
  contact: {
    phone: '+1 (555) 123-4567',
    email: 'contact@smartcrm.com',
    address: '123 Business Ave, Suite 100\nSan Francisco, CA 94111',
  },
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
  },
  colorScheme: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      muted: '#9ca3af',
    },
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  // Legacy properties for backward compatibility
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#10b981',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontFamily: 'Inter, system-ui, sans-serif',
  footerText: 'Powered by SmartCRM',
};

export const useWhiteLabelStore = create<WhiteLabelStore>()(
  persist(
    (set, get) => ({
      brandingConfig: defaultBranding,
      isCustomized: false,
      previewMode: false,
      isDirty: false,
      
      setBrandingConfig: (config) => {
        set((state) => ({
          brandingConfig: { ...state.brandingConfig, ...config },
          isCustomized: true,
          isDirty: true,
        }));
        
        // Apply CSS custom properties immediately
        const root = document.documentElement;
        Object.entries(config).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--brand-${key}`, value);
          }
        });
      },

      updateBranding: (config) => {
        get().setBrandingConfig(config);
      },
      
      setPreviewMode: (enabled) => set({ previewMode: enabled }),
      
      resetToDefault: () => {
        set({ 
          brandingConfig: defaultBranding, 
          isCustomized: false,
          previewMode: false,
          isDirty: false,
        });
        
        // Reset CSS custom properties
        const root = document.documentElement;
        Object.keys(defaultBranding).forEach((key) => {
          root.style.removeProperty(`--brand-${key}`);
        });
      },

      resetConfig: () => {
        get().resetToDefault();
      },

      saveConfig: () => {
        set({ isDirty: false });
        // In a real app, this would save to the backend
        localStorage.setItem('whitelabel-saved', JSON.stringify(get().brandingConfig));
      },
      
      exportConfig: () => {
        return JSON.stringify(get().brandingConfig, null, 2);
      },
      
      importConfig: (configJson) => {
        try {
          const config = JSON.parse(configJson);
          get().setBrandingConfig(config);
        } catch (error) {
          console.error('Failed to import branding config:', error);
        }
      },
    }),
    {
      name: 'whitelabel-branding',
    }
  )
);

interface WhiteLabelContextType {
  brandingConfig: BrandingConfig;
  setBrandingConfig: (config: Partial<BrandingConfig>) => void;
  updateBranding: (config: Partial<BrandingConfig>) => void;
  isCustomized: boolean;
  previewMode: boolean;
  isDirty: boolean;
  setPreviewMode: (enabled: boolean) => void;
  resetToDefault: () => void;
  resetConfig: () => void;
  saveConfig: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => void;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export const useWhiteLabel = () => {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
  }
  return context;
};

interface WhiteLabelProviderProps {
  children: ReactNode;
}

export const WhiteLabelProvider: React.FC<WhiteLabelProviderProps> = ({ children }) => {
  const store = useWhiteLabelStore();
  
  // Apply branding on mount
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(store.brandingConfig).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--brand-${key}`, value);
      }
    });
  }, []);

  return (
    <WhiteLabelContext.Provider value={store}>
      {children}
    </WhiteLabelContext.Provider>
  );
};
