import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  // Handle navigation from embedded landing page
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: only accept messages from the embedded landing page
      if (event.origin !== 'https://cerulean-crepe-9470cc.netlify.app') return;
      
      if (event.data?.type === 'navigate') {
        const path = event.data.path;
        console.log('Navigation request from landing page:', path);
        navigate(path);
      }
    };

    // Override iframe navigation by injecting script when iframe loads
    const handleIframeLoad = () => {
      const iframe = document.querySelector('iframe[title="Smart CRM Landing Page"]') as HTMLIFrameElement;
      if (!iframe) return;

      // Wait for iframe to fully load
      setTimeout(() => {
        const currentAppUrl = window.location.origin;
        console.log('Attempting to inject navigation override into iframe');
        
        try {
          // Try to communicate with iframe to set up navigation override
          iframe.contentWindow?.postMessage({
            type: 'SETUP_NAVIGATION',
            targetUrl: currentAppUrl,
            routes: {
              signup: '/signup',
              login: '/signin',
              signin: '/signin',
              register: '/signup',
              dashboard: '/dashboard',
              app: '/dashboard'
            }
          }, 'https://cerulean-crepe-9470cc.netlify.app');

        } catch (error) {
          console.log('Could not setup navigation override:', error);
        }
      }, 1000);
    };

    // Set up global link interception for iframe
    const interceptGlobalNavigation = () => {
      // Override all window navigation attempts
      const originalOpen = window.open;
      window.open = function(url?: string | URL | null, target?: string, features?: string) {
        const urlStr = url?.toString() || '';
        console.log('Global navigation intercepted:', urlStr);
        
        // Check if this looks like an app navigation
        if (urlStr.includes('app') || urlStr.includes('dashboard') || 
            urlStr.includes('signup') || urlStr.includes('login') || 
            urlStr.includes('signin') || urlStr.includes('register')) {
          
          console.log('Redirecting to current Smart CRM app');
          
          if (urlStr.includes('signup') || urlStr.includes('register')) {
            navigate('/signup');
          } else if (urlStr.includes('login') || urlStr.includes('signin')) {
            navigate('/signin');
          } else if (urlStr.includes('dashboard') || urlStr.includes('app')) {
            navigate('/dashboard');
          }
          return null;
        }
        
        // For other URLs, use original behavior
        return originalOpen?.call(this, url, target, features) || null;
      };
    };

    window.addEventListener('message', handleMessage);
    handleIframeLoad();
    interceptGlobalNavigation();
    
    return () => {
      window.removeEventListener('message', handleMessage);
      // Restore original window.open
      window.open = window.originalOpen || window.open;
    };
  }, [navigate]);
  
  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Embedded Landing Page - Updated design from new reference URL */}
      <iframe
        src="https://cerulean-crepe-9470cc.netlify.app"
        className="w-full h-full border-0"
        title="Smart CRM Landing Page"
        style={{
          minHeight: '100vh',
          background: 'white'
        }}
        onLoad={(e) => {
          console.log('Landing page iframe loaded successfully from cerulean-crepe');
          const iframe = e.target as HTMLIFrameElement;
          
          // Try to set up navigation communication
          setTimeout(() => {
            try {
              iframe.contentWindow?.postMessage({
                type: 'SETUP_CRM_NAVIGATION',
                crmUrl: window.location.origin,
                routes: {
                  'Get Started': '/signup',
                  'Login': '/signin',
                  'Sign In': '/signin', 
                  'Sign Up': '/signup',
                  'Register': '/signup',
                  'Dashboard': '/dashboard',
                  'Try Now': '/signup',
                  'Start Free Trial': '/signup',
                  'Book Demo': '/signin'
                }
              }, 'https://cerulean-crepe-9470cc.netlify.app');
            } catch (error) {
              console.log('Could not communicate with iframe:', error);
            }
          }, 500);
        }}
      />
    </div>
  );
};

export default LandingPage;