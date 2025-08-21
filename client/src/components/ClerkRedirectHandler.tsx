
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ClerkRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user tries to access auth pages, redirect to dashboard
    const pathname = location.pathname;
    
    if (pathname.includes('sign-in') || pathname === '/sign-in' || pathname.includes('signin')) {
      navigate('/dashboard', { replace: true });
    } else if (pathname.includes('sign-up') || pathname === '/sign-up' || pathname.includes('signup')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, location]);

  return null;
};

export default ClerkRedirectHandler;
