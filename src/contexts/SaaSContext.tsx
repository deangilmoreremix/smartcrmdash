import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useOrganization, useOrganizationList } from '@clerk/clerk-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for our SaaS system
export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  featureAccess: Record<string, boolean>;
  isSystemRole: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise' | 'white_label';
  features: string[];
  brandingConfig: any;
  userCount: number;
  maxUsers: number;
  createdAt: string;
}

export interface SaaSUser {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  roleId: string;
  role: UserRole;
  permissions: string[];
  featureAccess: Record<string, boolean>;
  isMasterAdmin: boolean;
  createdAt: string;
  lastActive: string;
}

// System roles configuration
export const SYSTEM_ROLES: Record<string, UserRole> = {
  MASTER_ADMIN: {
    id: 'master_admin',
    name: 'Master Admin',
    permissions: ['*'],
    featureAccess: { all: true },
    isSystemRole: true
  },
  ORG_ADMIN: {
    id: 'org_admin',
    name: 'Organization Admin',
    permissions: ['org.*', 'users.*', 'white_label.*'],
    featureAccess: { 
      whiteLabel: true, 
      analytics: true, 
      userManagement: true,
      billing: true,
      all: true 
    },
    isSystemRole: true
  },
  ORG_MANAGER: {
    id: 'org_manager',
    name: 'Organization Manager',
    permissions: ['contacts.*', 'deals.*', 'tasks.*', 'reports.read'],
    featureAccess: { 
      contacts: true, 
      deals: true, 
      tasks: true, 
      aiTools: true,
      analytics: true 
    },
    isSystemRole: true
  },
  ORG_USER: {
    id: 'org_user',
    name: 'Organization User',
    permissions: ['contacts.read', 'contacts.write', 'deals.read', 'deals.write', 'tasks.*'],
    featureAccess: { 
      contacts: true, 
      deals: true, 
      tasks: true, 
      aiTools: true 
    },
    isSystemRole: true
  },
  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    permissions: ['*.read'],
    featureAccess: { 
      contacts: true, 
      deals: true, 
      tasks: true,
      readonly: true 
    },
    isSystemRole: true
  }
};

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  starter: {
    name: 'Starter',
    maxUsers: 5,
    features: ['basic_crm', 'contacts', 'deals', 'tasks'],
    price: 29
  },
  professional: {
    name: 'Professional',
    maxUsers: 25,
    features: ['basic_crm', 'ai_tools', 'analytics', 'reports'],
    price: 99
  },
  enterprise: {
    name: 'Enterprise',
    maxUsers: -1,
    features: ['all_features', 'advanced_analytics', 'api_access'],
    price: 299
  },
  white_label: {
    name: 'White Label',
    maxUsers: -1,
    features: ['all_features', 'white_label', 'custom_domain', 'api_access', 'multi_tenant'],
    price: 999
  }
};

// Zustand store for SaaS state
interface SaaSStore {
  currentUser: SaaSUser | null;
  currentOrganization: Organization | null;
  userPermissions: string[];
  featureAccess: Record<string, boolean>;
  isMasterAdmin: boolean;
  isLoading: boolean;
  
  setCurrentUser: (user: SaaSUser | null) => void;
  setCurrentOrganization: (org: Organization | null) => void;
  setUserPermissions: (permissions: string[]) => void;
  setFeatureAccess: (access: Record<string, boolean>) => void;
  setMasterAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: string) => boolean;
  hasFeatureAccess: (feature: string) => boolean;
  reset: () => void;
}

export const useSaaSStore = create<SaaSStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentOrganization: null,
      userPermissions: [],
      featureAccess: {},
      isMasterAdmin: false,
      isLoading: true,

      setCurrentUser: (user) => set({ currentUser: user }),
      setCurrentOrganization: (org) => set({ currentOrganization: org }),
      setUserPermissions: (permissions) => set({ userPermissions: permissions }),
      setFeatureAccess: (access) => set({ featureAccess: access }),
      setMasterAdmin: (isAdmin) => set({ isMasterAdmin: isAdmin }),
      setLoading: (loading) => set({ isLoading: loading }),

      hasPermission: (permission) => {
        const { userPermissions, isMasterAdmin } = get();
        if (isMasterAdmin) return true;
        
        return userPermissions.some(p => {
          if (p === '*') return true;
          if (permission.includes('.')) {
            const [resource, action] = permission.split('.');
            return p === permission || p === `${resource}.*` || p === '*';
          }
          return p === permission;
        });
      },

      hasFeatureAccess: (feature) => {
        const { featureAccess, isMasterAdmin } = get();
        if (isMasterAdmin) return true;
        return featureAccess[feature] || featureAccess.all || false;
      },

      reset: () => set({
        currentUser: null,
        currentOrganization: null,
        userPermissions: [],
        featureAccess: {},
        isMasterAdmin: false,
        isLoading: false
      })
    }),
    {
      name: 'saas-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentOrganization: state.currentOrganization,
        userPermissions: state.userPermissions,
        featureAccess: state.featureAccess,
        isMasterAdmin: state.isMasterAdmin
      })
    }
  )
);

// Context for SaaS functionality
interface SaaSContextType {
  user: SaaSUser | null;
  organization: Organization | null;
  permissions: string[];
  featureAccess: Record<string, boolean>;
  isMasterAdmin: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasFeatureAccess: (feature: string) => boolean;
  switchOrganization: (orgId: string) => Promise<void>;
  createOrganization: (data: Partial<Organization>) => Promise<void>;
  updateUserRole: (userId: string, roleId: string) => Promise<void>;
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

// SaaS Provider Component
interface SaaSProviderProps {
  children: React.ReactNode;
}

export const SaaSProvider: React.FC<SaaSProviderProps> = ({ children }) => {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { organization: clerkOrg } = useOrganization();
  const { setActive } = useOrganizationList();
  
  const {
    currentUser,
    currentOrganization,
    userPermissions,
    featureAccess,
    isMasterAdmin,
    isLoading,
    setCurrentUser,
    setCurrentOrganization,
    setUserPermissions,
    setFeatureAccess,
    setMasterAdmin,
    setLoading,
    hasPermission,
    hasFeatureAccess,
    reset
  } = useSaaSStore();

  // Initialize user data when Clerk user loads
  useEffect(() => {
    const initializeUser = async () => {
      if (!userLoaded) return;
      
      setLoading(true);
      
      if (!clerkUser) {
        reset();
        setLoading(false);
        return;
      }

      try {
        // Check if user is master admin
        const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
        const masterAdmin = userEmail === process.env.NEXT_PUBLIC_MASTER_ADMIN_EMAIL;
        setMasterAdmin(masterAdmin);

        // Fetch or create user data
        const userData = await fetchOrCreateUser(clerkUser.id, {
          email: userEmail || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          isMasterAdmin: masterAdmin
        });

        setCurrentUser(userData);
        setUserPermissions(userData.permissions);
        setFeatureAccess(userData.featureAccess);

      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [clerkUser, userLoaded]);

  // Initialize organization data when Clerk organization loads
  useEffect(() => {
    const initializeOrganization = async () => {
      if (!clerkOrg || !currentUser) return;

      try {
        // Fetch or create organization data
        const orgData = await fetchOrCreateOrganization(clerkOrg.id, {
          name: clerkOrg.name,
          slug: clerkOrg.slug || clerkOrg.name.toLowerCase().replace(/\s+/g, '-')
        });

        setCurrentOrganization(orgData);

        // Update user permissions based on organization role
        if (clerkOrg.membership?.role) {
          const role = mapClerkRoleToSystemRole(clerkOrg.membership.role);
          const updatedPermissions = [...SYSTEM_ROLES[role].permissions];
          const updatedFeatureAccess = { ...SYSTEM_ROLES[role].featureAccess };

          setUserPermissions(updatedPermissions);
          setFeatureAccess(updatedFeatureAccess);
        }

      } catch (error) {
        console.error('Error initializing organization:', error);
      }
    };

    initializeOrganization();
  }, [clerkOrg, currentUser]);

  // Helper functions
  const fetchOrCreateUser = async (clerkUserId: string, userData: any): Promise<SaaSUser> => {
    // This would typically call your API
    // For now, return mock data
    return {
      id: `user_${clerkUserId}`,
      clerkUserId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      organizationId: clerkOrg?.id || '',
      roleId: userData.isMasterAdmin ? 'master_admin' : 'org_user',
      role: userData.isMasterAdmin ? SYSTEM_ROLES.MASTER_ADMIN : SYSTEM_ROLES.ORG_USER,
      permissions: userData.isMasterAdmin ? ['*'] : ['contacts.read', 'deals.read'],
      featureAccess: userData.isMasterAdmin ? { all: true } : { contacts: true, deals: true },
      isMasterAdmin: userData.isMasterAdmin,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
  };

  const fetchOrCreateOrganization = async (clerkOrgId: string, orgData: any): Promise<Organization> => {
    // This would typically call your API
    // For now, return mock data
    return {
      id: clerkOrgId,
      name: orgData.name,
      slug: orgData.slug,
      subscriptionTier: 'professional',
      features: SUBSCRIPTION_TIERS.professional.features,
      brandingConfig: {},
      userCount: 1,
      maxUsers: SUBSCRIPTION_TIERS.professional.maxUsers,
      createdAt: new Date().toISOString()
    };
  };

  const mapClerkRoleToSystemRole = (clerkRole: string): string => {
    switch (clerkRole) {
      case 'admin':
        return 'ORG_ADMIN';
      case 'basic_member':
        return 'ORG_USER';
      default:
        return 'ORG_USER';
    }
  };

  const switchOrganization = async (orgId: string) => {
    if (setActive) {
      await setActive({ organization: orgId });
    }
  };

  const createOrganization = async (data: Partial<Organization>) => {
    // This would typically call your API to create organization
    console.log('Creating organization:', data);
  };

  const updateUserRole = async (userId: string, roleId: string) => {
    // This would typically call your API to update user role
    console.log('Updating user role:', userId, roleId);
  };

  const contextValue: SaaSContextType = {
    user: currentUser,
    organization: currentOrganization,
    permissions: userPermissions,
    featureAccess,
    isMasterAdmin,
    isLoading,
    hasPermission,
    hasFeatureAccess,
    switchOrganization,
    createOrganization,
    updateUserRole
  };

  return (
    <SaaSContext.Provider value={contextValue}>
      {children}
    </SaaSContext.Provider>
  );
};

// Hook to use SaaS context
export const useSaaS = (): SaaSContextType => {
  const context = useContext(SaaSContext);
  if (context === undefined) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
};

// Permission checking hooks
export const usePermission = (permission: string): boolean => {
  const { hasPermission } = useSaaS();
  return hasPermission(permission);
};

export const useFeatureAccess = (feature: string): boolean => {
  const { hasFeatureAccess } = useSaaS();
  return hasFeatureAccess(feature);
};

// Higher-order component for protecting routes
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string
) => {
  return (props: P) => {
    const hasPermission = usePermission(requiredPermission);
    
    if (!hasPermission) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access this feature.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// Higher-order component for feature gating
export const withFeatureGate = <P extends object>(
  Component: React.ComponentType<P>,
  requiredFeature: string
) => {
  return (props: P) => {
    const hasAccess = useFeatureAccess(requiredFeature);
    
    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Feature Not Available</h3>
            <p className="text-gray-600">This feature is not included in your current plan.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};
