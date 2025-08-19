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

    // Intercept clicks in the iframe to redirect to our dashboard
    const handleIframeLoad = () => {
      const iframe = document.querySelector('iframe[title="Smart CRM Landing Page"]') as HTMLIFrameElement;
      if (!iframe) return;

      // Add click interceptor to redirect "Try it for free" and similar buttons
      iframe.addEventListener('load', () => {
        try {
          // Send a message to the iframe to set up click interception
          iframe.contentWindow?.postMessage({
            type: 'setup_navigation_bridge',
            redirectUrls: {
              // Map various trial/signup URLs to our dashboard
              '/dashboard': '/dashboard',
              '/app': '/dashboard', 
              '/demo': '/dashboard',
              '/signup': '/register',
              '/login': '/login',
              '/try-free': '/dashboard',
              '/get-started': '/dashboard'
            }
          }, 'https://cerulean-crepe-9470cc.netlify.app');
        } catch (error) {
          console.log('Cross-origin iframe communication limited, using fallback method');
        }
      });
    };

    window.addEventListener('message', handleMessage);
    setTimeout(handleIframeLoad, 1000); // Give iframe time to load
    
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);
  
  return (
    <div className="w-full h-screen overflow-hidden relative">
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
          
          // Intercept clicks on the existing buttons in the iframe
          const iframe = document.querySelector('iframe[title="Smart CRM Landing Page"]') as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            try {
              // Send message to iframe to set up click interception
              iframe.contentWindow.postMessage({
                type: 'intercept_buttons',
                selectors: [
                  'button:contains("Try")',
                  'button:contains("Free")', 
                  'a:contains("Try")',
                  'a:contains("Free")',
                  'a:contains("Start")',
                  'button:contains("Start")',
                  '.cta-button',
                  '.try-button',
                  '.start-button'
                ],
                redirectTo: window.location.origin + '/dashboard'
              }, 'https://cerulean-crepe-9470cc.netlify.app');
              
              console.log('Button interception message sent to iframe');
            } catch (error) {
              console.log('Cross-origin restrictions prevent direct button interception');
              
              // Fallback: Create targeted overlay areas for likely button positions
              const overlay = document.createElement('div');
              overlay.style.position = 'absolute';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.pointerEvents = 'none';
              overlay.style.zIndex = '10';
              
              // Create click areas for common CTA button positions
              const buttonAreas = [
                { top: '15%', left: '35%', width: '30%', height: '10%' }, // Hero area
                { top: '25%', left: '40%', width: '20%', height: '8%' },  // Secondary hero
                { top: '85%', left: '35%', width: '30%', height: '10%' }, // Footer area
                { top: '50%', left: '35%', width: '30%', height: '10%' }, // Mid-page CTA
              ];
              
              buttonAreas.forEach(area => {
                const clickArea = document.createElement('div');
                clickArea.style.position = 'absolute';
                clickArea.style.top = area.top;
                clickArea.style.left = area.left;
                clickArea.style.width = area.width;
                clickArea.style.height = area.height;
                clickArea.style.pointerEvents = 'auto';
                clickArea.style.cursor = 'pointer';
                clickArea.style.background = 'transparent';
                clickArea.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Intercepted button click, redirecting to dashboard');
                  navigate('/dashboard');
                });
                overlay.appendChild(clickArea);
              });
              
              iframe.parentElement?.appendChild(overlay);
            }
          }
        }}
      />
    </div>
  );
};

export default LandingPage;