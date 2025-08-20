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

    // Intercept navigation attempts by monitoring URL changes
    const interceptNavigation = () => {
      const iframe = document.querySelector('iframe[title="Smart CRM Landing Page"]') as HTMLIFrameElement;
      if (!iframe) return;

      // Override window.open and similar methods in iframe
      try {
        const originalOpen = window.open;
        window.open = function(url?: string | URL, target?: string, features?: string) {
          if (url && typeof url === 'string') {
            // Check if this is a navigation to an old app
            if (url.includes('app') || url.includes('dashboard') || url.includes('signup') || url.includes('login')) {
              console.log('Intercepted navigation attempt to:', url);
              // Redirect to our current app instead
              if (url.includes('signup') || url.includes('register')) {
                navigate('/signup');
              } else if (url.includes('login') || url.includes('signin')) {
                navigate('/signin');
              } else {
                navigate('/dashboard');
              }
              return null;
            }
          }
          return originalOpen.call(this, url, target, features);
        };

        // Also try to inject navigation override into iframe
        iframe.addEventListener('load', () => {
          try {
            const currentUrl = window.location.origin;
            const script = `
              // Override all navigation to point to current app
              const originalOpen = window.open;
              window.open = function(url, target, features) {
                if (url && (url.includes('app') || url.includes('dashboard') || url.includes('signup') || url.includes('login'))) {
                  if (url.includes('signup') || url.includes('register')) {
                    window.parent.postMessage({type: 'navigate', path: '/signup'}, '${currentUrl}');
                  } else if (url.includes('login') || url.includes('signin')) {
                    window.parent.postMessage({type: 'navigate', path: '/signin'}, '${currentUrl}');
                  } else {
                    window.parent.postMessage({type: 'navigate', path: '/dashboard'}, '${currentUrl}');
                  }
                  return null;
                }
                return originalOpen.call(this, url, target, features);
              };
              
              // Override link clicks
              document.addEventListener('click', function(e) {
                const link = e.target.closest('a');
                if (link && link.href) {
                  if (link.href.includes('app') || link.href.includes('dashboard') || link.href.includes('signup') || link.href.includes('login')) {
                    e.preventDefault();
                    if (link.href.includes('signup') || link.href.includes('register')) {
                      window.parent.postMessage({type: 'navigate', path: '/signup'}, '${currentUrl}');
                    } else if (link.href.includes('login') || link.href.includes('signin')) {
                      window.parent.postMessage({type: 'navigate', path: '/signin'}, '${currentUrl}');
                    } else {
                      window.parent.postMessage({type: 'navigate', path: '/dashboard'}, '${currentUrl}');
                    }
                  }
                }
              });
            `;
            
            if (iframe.contentWindow) {
              iframe.contentWindow.eval(script);
            }
          } catch (error) {
            console.log('Cannot inject navigation override due to CORS policy');
          }
        });
      } catch (error) {
        console.log('Navigation interception setup failed:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    setTimeout(interceptNavigation, 1000); // Give iframe time to load
    
    return () => window.removeEventListener('message', handleMessage);
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
        onLoad={() => {
          console.log('Landing page iframe loaded successfully from cerulean-crepe');
        }}
      />
    </div>
  );
};

export default LandingPage;