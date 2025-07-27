import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useOrganization, useOrganizationList } from '@clerk/clerk-react';

// Define roles and permissions
export interface Permission {
  resource: string;
  actions: string[];
  scope: 'own' | 'team' | 'organization' | 'system';
}

export interface Role {
  id: string;
  name: string;
  systemRole: boolean;
  permissions: Permission[];
  featureAccess: {
    whiteLabel: boolean;
    aiTools: boolean;
    analytics: boolean;
    masterAdmin: boolean;
    billing: boolean;
    userManagement: boolean;
  };
}

export interface SaaSUser {
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
  roleId: string;
  customPermissions: Permission[];
  featureAccess: Record<string, boolean>;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface Organization {
  id: string;
  clerkOrgId: string;
  name: string;
  slug: string;
  domain?: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise' | 'white_label';
  brandingConfig: any;
  featureFlags: Record<string, boolean>;
  createdAt: Date;
  settings: {
    allowSelfSignup: boolean;
    maxUsers: number;
    customDomain?: string;
  };
}

interface SaaSContextType {
  currentUser: SaaSUser | null;
  currentOrganization: Organization | null;
  userRole: Role | null;
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasFeatureAccess: (feature: string) => boolean;
  isMasterAdmin: boolean;
  organizations: Organization[];
  switchOrganization: (orgId: string) => void;
  createOrganization: (name: string, slug: string) => Promise<void>;
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

// System roles definition
export const SYSTEM_ROLES: Record<string, Role> = {
  MASTER_ADMIN: {
    id: 'master_admin',
    name: 'Master Admin',
    systemRole: true,
    permissions: [
      { resource: '*', actions: ['*'], scope: 'system' }
    ],
    featureAccess: {
      whiteLabel: true,
      aiTools: true,
      analytics: true,
      masterAdmin: true,
      billing: true,
      userManagement: true,
    }
  },
  ORG_ADMIN: {
    id: 'org_admin',
    name: 'Organization Admin',
    systemRole: true,
    permissions: [
      { resource: 'organization', actions: ['read', 'write', 'admin'], scope: 'organization' },
      { resource: 'users', actions: ['read', 'write', 'invite'], scope: 'organization' },
      { resource: 'billing', actions: ['read', 'write'], scope: 'organization' },
    ],
    featureAccess: {
      whiteLabel: true,
      aiTools: true,
      analytics: true,
      masterAdmin: false,
      billing: true,
      userManagement: true,
    }
  },
  ORG_USER: {
    id: 'org_user',
    name: 'Organization User',
    systemRole: true,
    permissions: [
      { resource: 'contacts', actions: ['read', 'write'], scope: 'organization' },
      { resource: 'deals', actions: ['read', 'write'], scope: 'organization' },
      { resource: 'tasks', actions: ['read', 'write'], scope: 'own' },
    ],
    featureAccess: {
      whiteLabel: false,
      aiTools: true,
      analytics: false,
      masterAdmin: false,
      billing: false,
      userManagement: false,
    }
  },
  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    systemRole: true,
    permissions: [
      { resource: '*', actions: ['read'], scope: 'organization' }
    ],
    featureAccess: {
      whiteLabel: false,
      aiTools: false,
      analytics: false,
      masterAdmin: false,
      billing: false,
      userManagement: false,
    }
  }
};

export const SaaSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization } = useOrganization();
  const { organizationList } = useOrganizationList();

  const [currentUser, setCurrentUser] = useState<SaaSUser | null>(null);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Master admin check - you can configure this email in environment variables
  const masterAdminEmail = import.meta.env.VITE_MASTER_ADMIN_EMAIL || 'admin@smart-crm.videoremix.io';
  const isMasterAdmin = user?.primaryEmailAddress?.emailAddress === masterAdminEmail;

  useEffect(() => {
    if (userLoaded && user) {
      // Initialize current user
      const saasUser: SaaSUser = {
        id: user.id,
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        organizationId: organization?.id,
        roleId: isMasterAdmin ? 'master_admin' : 'org_user',
        customPermissions: [],
        featureAccess: {},
        createdAt: new Date(user.createdAt || Date.now()),
        lastActiveAt: new Date(),
      };

      setCurrentUser(saasUser);

      // Set user role
      const role = isMasterAdmin ? SYSTEM_ROLES.MASTER_ADMIN : SYSTEM_ROLES.ORG_USER;
      setUserRole(role);

      // Initialize current organization if available
      if (organization) {
        const saasOrg: Organization = {
          id: organization.id,
          clerkOrgId: organization.id,
          name: organization.name,
          slug: organization.slug || organization.name.toLowerCase().replace(/\s+/g, '-'),
          subscriptionTier: 'professional',
          brandingConfig: {},
          featureFlags: {},
          createdAt: new Date(organization.createdAt || Date.now()),
          settings: {
            allowSelfSignup: false,
            maxUsers: 25,
          },
        };
        setCurrentOrganization(saasOrg);
      }

      // Initialize organizations list
      if (organizationList) {
        const saasOrgs = organizationList.map(org => ({
          id: org.organization.id,
          clerkOrgId: org.organization.id,
          name: org.organization.name,
          slug: org.organization.slug || org.organization.name.toLowerCase().replace(/\s+/g, '-'),
          subscriptionTier: 'professional' as const,
          brandingConfig: {},
          featureFlags: {},
          createdAt: new Date(org.organization.createdAt || Date.now()),
          settings: {
            allowSelfSignup: false,
            maxUsers: 25,
          },
        }));
        setOrganizations(saasOrgs);
      }

      setIsLoading(false);
    }
  }, [userLoaded, user, organization, organizationList, isMasterAdmin]);

  const hasPermission = (resource: string, action: string): boolean => {
    if (!userRole) return false;
    
    // Master admin has all permissions
    if (isMasterAdmin) return true;

    return userRole.permissions.some(permission => {
      const resourceMatch = permission.resource === '*' || permission.resource === resource;
      const actionMatch = permission.actions.includes('*') || permission.actions.includes(action);
      return resourceMatch && actionMatch;
    });
  };

  const hasFeatureAccess = (feature: string): boolean => {
    if (!userRole) return false;
    
    // Master admin has access to all features
    if (isMasterAdmin) return true;

    return userRole.featureAccess[feature as keyof typeof userRole.featureAccess] || false;
  };

  const switchOrganization = async (orgId: string) => {
    // This would typically involve calling Clerk's organization switching
    // For now, we'll implement a basic version
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrganization(org);
    }
  };

  const createOrganization = async (name: string, slug: string) => {
    // This would involve calling Clerk's organization creation API
    // For now, we'll implement a placeholder
    console.log(`Creating organization: ${name} with slug: ${slug}`);
  };

  const value: SaaSContextType = {
    currentUser,
    currentOrganization,
    userRole,
    isLoading,
    hasPermission,
    hasFeatureAccess,
    isMasterAdmin,
    organizations,
    switchOrganization,
    createOrganization,
  };

  return (
    <SaaSContext.Provider value={value}>
      {children}
    </SaaSContext.Provider>
  );
};

export const useSaaS = (): SaaSContextType => {
  const context = useContext(SaaSContext);
  if (context === undefined) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
};
