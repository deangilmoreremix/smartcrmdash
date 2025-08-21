import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // No authentication required - direct access
  return <>{children}</>;
};

export default AuthGuard;