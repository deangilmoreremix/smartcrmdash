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

    // Intercept navigation by overriding window.open globally
    const interceptNavigation = () => {
      // Store original window.open
      if (!window.originalWindowOpen) {
        window.originalWindowOpen = window.open;
      }

      // Override window.open globally to catch any navigation attempts
      window.open = function(url?: string | URL, target?: string, features?: string) {
        if (url && typeof url === 'string') {
          console.log('Navigation attempt detected:', url);
          
          // Check if this is a navigation to any app/dashboard/auth pages
          if (url.includes('app') || url.includes('dashboard') || url.includes('signup') || url.includes('login') || url.includes('signin') || url.includes('register')) {
            console.log('Intercepted navigation to:', url);
            
            // Route to current app instead
            if (url.includes('signup') || url.includes('register')) {
              navigate('/signup');
            } else if (url.includes('login') || url.includes('signin')) {
              navigate('/signin');
            } else if (url.includes('dashboard') || url.includes('app')) {
              navigate('/dashboard');
            }
            return null;
          }
        }
        return window.originalWindowOpen?.call(this, url, target, features) || null;
      };

      // Also try to inject into iframe when it loads
      const iframe = document.querySelector('iframe[title="Smart CRM Landing Page"]') as HTMLIFrameElement;
      if (iframe) {
        iframe.addEventListener('load', () => {
          try {
            const currentUrl = window.location.origin;
            console.log('Iframe loaded, attempting navigation override injection');
            
            // Try to inject navigation override script
            const script = document.createElement('script');
            script.textContent = `
              (function() {
                console.log('CRM Navigation override script loaded');
                const currentAppUrl = '${currentUrl}';
                
                // Override window.open in iframe
                const originalOpen = window.open;
                window.open = function(url, target, features) {
                  console.log('Iframe window.open called with:', url);
                  if (url && (url.includes('app') || url.includes('dashboard') || url.includes('signup') || url.includes('login'))) {
                    console.log('Redirecting to parent CRM:', url);
                    if (url.includes('signup') || url.includes('register')) {
                      window.parent.postMessage({type: 'navigate', path: '/signup'}, currentAppUrl);
                    } else if (url.includes('login') || url.includes('signin')) {
                      window.parent.postMessage({type: 'navigate', path: '/signin'}, currentAppUrl);
                    } else {
                      window.parent.postMessage({type: 'navigate', path: '/dashboard'}, currentAppUrl);
                    }
                    return null;
                  }
                  return originalOpen.call(this, url, target, features);
                };
                
                // Override link clicks
                document.addEventListener('click', function(e) {
                  const link = e.target.closest('a');
                  if (link && link.href) {
                    console.log('Link clicked:', link.href);
                    if (link.href.includes('app') || link.href.includes('dashboard') || link.href.includes('signup') || link.href.includes('login')) {
                      e.preventDefault();
                      console.log('Link redirected to parent CRM');
                      if (link.href.includes('signup') || link.href.includes('register')) {
                        window.parent.postMessage({type: 'navigate', path: '/signup'}, currentAppUrl);
                      } else if (link.href.includes('login') || link.href.includes('signin')) {
                        window.parent.postMessage({type: 'navigate', path: '/signin'}, currentAppUrl);
                      } else {
                        window.parent.postMessage({type: 'navigate', path: '/dashboard'}, currentAppUrl);
                      }
                    }
                  }
                });
              })();
            `;
            
            if (iframe.contentDocument) {
              iframe.contentDocument.head.appendChild(script);
            }
          } catch (error) {
            console.log('Cannot inject navigation override due to CORS policy:', error.message);
          }
        });
      }
    };

    window.addEventListener('message', handleMessage);
    // Wait a bit longer for iframe to fully load
    setTimeout(interceptNavigation, 2000);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      // Restore original window.open when component unmounts
      if (window.originalWindowOpen) {
        window.open = window.originalWindowOpen;
      }
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
        onLoad={() => {
          console.log('Landing page iframe loaded successfully from cerulean-crepe');
        }}
      />
    </div>
  );
};

export default LandingPage;