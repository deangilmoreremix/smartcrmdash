import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSaaS } from '../../contexts/SaaSContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
  requireFeature?: string;
  requireMasterAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireRole,
  requireFeature,
  requireMasterAdmin = false
}) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { hasFeatureAccess, isMasterAdmin, user, isLoading } = useSaaS();
  const location = useLocation();

  // Show loading while Clerk is loading
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  // Check if master admin is required
  if (requireMasterAdmin && !isMasterAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">This page requires master admin privileges.</p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-500"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Check role requirement
  if (requireRole && user?.roleId !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This page requires the {requireRole} role.
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-500"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Check feature access requirement
  if (requireFeature && !hasFeatureAccess(requireFeature)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Available</h1>
          <p className="text-gray-600 mb-6">
            Your subscription plan doesn't include access to {requireFeature}.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="block w-full text-blue-600 hover:text-blue-500"
            >
              Go back
            </button>
            <button
              onClick={() => window.location.href = '/billing'}
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
