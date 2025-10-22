import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTenant } from '../contexts/TenantProvider';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'wl_user' | 'regular_user';
  tenantId: string;
  permissions: string[];
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface RoleContextType {
  user: User | null;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  canAccess: (resource: string) => boolean;
  isSuperAdmin: () => boolean;
  isWLUser: () => boolean;
  isRegularUser: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: React.ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tenant } = useTenant();

  useEffect(() => {
    fetchUserRole();
  }, [tenant]);

  const fetchUserRole = async () => {
    try {
      setIsLoading(true);
      console.log('RoleProvider Debug: Fetching user role, tenant:', tenant);

      // Get current user with role information
      const response = await fetch('/api/auth/user-role', {
        headers: tenant ? { 'X-Tenant-ID': tenant.id } : {},
      });

      console.log('RoleProvider Debug: Response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('RoleProvider Debug: User data received:', userData);
        setUser(userData.user);
      } else {
        // Silently handle non-200 responses during development
        console.debug('User role not available:', response.status);
      }
    } catch (error) {
      // Only log significant errors, not network failures during development
      console.debug('User role fetch skipped:', error instanceof Error ? error.message : 'Unknown error');
      console.error('RoleProvider Debug: Error fetching user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === 'super_admin';
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const canAccess = (resource: string): boolean => {
    if (!user) return false;

    // Super admin can access everything (including dev bypass)
    if (user.role === 'super_admin' || user.email === 'dev@smartcrm.local') return true;

    // Resource-specific access control for new role structure
    const resourcePermissions: Record<string, string[]> = {
      // Super Admin only
      'admin_dashboard': ['super_admin'],
      'user_management': ['super_admin'], 
      'bulk_import_users': ['super_admin'],
      'system_settings': ['super_admin'],
      'billing_management': ['super_admin'],
      
      // WL Users and Super Admin
      'ai_tools': ['super_admin', 'wl_user'],
      'advanced_analytics': ['super_admin', 'wl_user'],
      'custom_branding': ['super_admin', 'wl_user'],
      'api_access': ['super_admin', 'wl_user'],
      'advanced_features': ['super_admin', 'wl_user'],
      
      // Core CRM features - All users (including CSV imports within modules)
      'dashboard': ['super_admin', 'wl_user', 'regular_user'],
      'contacts': ['super_admin', 'wl_user', 'regular_user'],
      'contacts_csv': ['super_admin', 'wl_user', 'regular_user'],
      'pipeline': ['super_admin', 'wl_user', 'regular_user'],
      'pipeline_csv': ['super_admin', 'wl_user', 'regular_user'],
      'calendar': ['super_admin', 'wl_user', 'regular_user'],
      'communication': ['super_admin', 'wl_user', 'regular_user'],
    };

    const allowedRoles = resourcePermissions[resource] || [];
    return allowedRoles.includes(user.role);
  };

  const isSuperAdmin = (): boolean => user?.role === 'super_admin' || user?.email === 'dev@smartcrm.local';
  const isWLUser = (): boolean => user?.role === 'wl_user';
  const isRegularUser = (): boolean => user?.role === 'regular_user';

  return (
    <RoleContext.Provider
      value={{
        user,
        isLoading,
        hasPermission,
        hasRole,
        canAccess,
        isSuperAdmin,
        isWLUser,
        isRegularUser,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

// HOC for protecting routes based on roles
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  resource?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  resource,
  fallback = <div className="p-8 text-center text-red-600">Access Denied</div>
}) => {
  const { user, isLoading, hasRole, hasPermission, canAccess } = useRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return fallback;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback;
  }

  // Check resource-based access
  if (resource && !canAccess(resource)) {
    return fallback;
  }

  return <>{children}</>;
};

// Component for conditional rendering based on permissions
interface ConditionalRenderProps {
  children: React.ReactNode;
  role?: string;
  permission?: string;
  resource?: string;
  inverse?: boolean;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  role,
  permission,
  resource,
  inverse = false
}) => {
  const { hasRole, hasPermission, canAccess } = useRole();

  let hasAccess = true;

  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  if (resource) {
    hasAccess = hasAccess && canAccess(resource);
  }

  // Apply inverse logic if needed
  if (inverse) {
    hasAccess = !hasAccess;
  }

  return hasAccess ? <>{children}</> : null;
};

// Role badge component
interface RoleBadgeProps {
  role: string;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'partner_admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer_admin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'end_user':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'partner_admin':
        return 'Partner Admin';
      case 'customer_admin':
        return 'Customer Admin';
      case 'end_user':
        return 'End User';
      default:
        return role;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)} ${className}`}
    >
      {getRoleLabel(role)}
    </span>
  );
};

// Permission checker hook
export const usePermissions = () => {
  const { user, hasPermission, hasRole, canAccess } = useRole();

  return {
    user,
    can: hasPermission,
    is: hasRole,
    canAccess,
    permissions: user?.permissions || [],
    role: user?.role || null,
  };
};

export default RoleProvider;