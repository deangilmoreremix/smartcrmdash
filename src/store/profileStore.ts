// Profile Store - User profile management with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role?: string;
  avatar?: string;
  phone?: string;
  timezone?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
    };
    aiSettings: {
      defaultModel: string;
      temperature: number;
      maxTokens: number;
    };
  };
  subscription: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'trial' | 'expired';
    billingCycle: 'monthly' | 'yearly';
    nextBillingDate?: string;
  };
  usage: {
    aiTokensUsed: number;
    aiTokensLimit: number;
    storageUsed: number;
    storageLimit: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProfileStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  updateSubscription: (subscription: Partial<UserProfile['subscription']>) => void;
  updateUsage: (usage: Partial<UserProfile['usage']>) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getFullName: () => string;
  getInitials: () => string;
  isSubscriptionActive: () => boolean;
  getRemainingTokens: () => number;
  getUsagePercentage: (type: 'tokens' | 'storage') => number;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      setProfile: (profile) => set({ profile, error: null }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          ...updates,
          updatedAt: new Date().toISOString()
        } : null
      })),
      
      updatePreferences: (preferences) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          preferences: {
            ...state.profile.preferences,
            ...preferences
          },
          updatedAt: new Date().toISOString()
        } : null
      })),
      
      updateSubscription: (subscription) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          subscription: {
            ...state.profile.subscription,
            ...subscription
          },
          updatedAt: new Date().toISOString()
        } : null
      })),
      
      updateUsage: (usage) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          usage: {
            ...state.profile.usage,
            ...usage
          },
          updatedAt: new Date().toISOString()
        } : null
      })),
      
      clearProfile: () => set({ profile: null, error: null }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      // Computed values
      getFullName: () => {
        const { profile } = get();
        if (!profile) return '';
        return `${profile.firstName} ${profile.lastName}`.trim();
      },
      
      getInitials: () => {
        const { profile } = get();
        if (!profile) return '';
        const firstInitial = profile.firstName?.charAt(0)?.toUpperCase() || '';
        const lastInitial = profile.lastName?.charAt(0)?.toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
      },
      
      isSubscriptionActive: () => {
        const { profile } = get();
        return profile?.subscription?.status === 'active' || profile?.subscription?.status === 'trial';
      },
      
      getRemainingTokens: () => {
        const { profile } = get();
        if (!profile) return 0;
        return Math.max(0, profile.usage.aiTokensLimit - profile.usage.aiTokensUsed);
      },
      
      getUsagePercentage: (type) => {
        const { profile } = get();
        if (!profile) return 0;
        
        if (type === 'tokens') {
          return (profile.usage.aiTokensUsed / profile.usage.aiTokensLimit) * 100;
        } else if (type === 'storage') {
          return (profile.usage.storageUsed / profile.usage.storageLimit) * 100;
        }
        
        return 0;
      }
    }),
    {
      name: 'profile-store',
      partialize: (state) => ({
        profile: state.profile
      })
    }
  )
);

// Default profile for demo purposes
export const createDefaultProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'demo-user-1',
  email: 'demo@smartcrm.com',
  firstName: 'Demo',
  lastName: 'User',
  company: 'SmartCRM Demo',
  role: 'Sales Manager',
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      desktop: false
    },
    aiSettings: {
      defaultModel: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000
    }
  },
  subscription: {
    plan: 'professional',
    status: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2025-02-25'
  },
  usage: {
    aiTokensUsed: 15000,
    aiTokensLimit: 50000,
    storageUsed: 2.5, // GB
    storageLimit: 10 // GB
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
  ...overrides
});
