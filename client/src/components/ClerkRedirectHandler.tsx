
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ClerkRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is redirected from Clerk's hosted pages, redirect to our custom pages
    const pathname = location.pathname;
    
    if (pathname.includes('sign-in') || pathname === '/sign-in') {
      navigate('/signin', { replace: true });
    } else if (pathname.includes('sign-up') || pathname === '/sign-up') {
      navigate('/signup', { replace: true });
    }
  }, [navigate, location]);

  return null;
};

export default ClerkRedirectHandler;
