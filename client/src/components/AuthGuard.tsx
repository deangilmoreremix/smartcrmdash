
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback = '/signin' }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner message="Checking authentication..." size="lg" />;
  }

  if (!isSignedIn) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
