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
          
          // Create precise overlay areas to intercept button clicks
          const iframe = document.querySelector('iframe[title="Smart CRM Landing Page"]') as HTMLIFrameElement;
          if (iframe) {
            setTimeout(() => {
              const overlay = document.createElement('div');
              overlay.style.position = 'absolute';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.pointerEvents = 'none';
              overlay.style.zIndex = '999';
              overlay.id = 'button-intercept-overlay';
              
              // Precise button overlay positions based on typical landing page layouts
              const buttonAreas = [
                // Main hero "Try it for free" button (usually center-top area)
                { top: '45%', left: '42%', width: '16%', height: '6%', name: 'hero-cta' },
                // Secondary CTA in hero section
                { top: '55%', left: '42%', width: '16%', height: '5%', name: 'hero-secondary' },
                // Navigation "Get Started" button (top right)
                { top: '5%', left: '85%', width: '12%', height: '4%', name: 'nav-cta' },
                // Mid-page CTA
                { top: '70%', left: '42%', width: '16%', height: '6%', name: 'mid-cta' },
                // Footer CTA
                { top: '90%', left: '42%', width: '16%', height: '5%', name: 'footer-cta' },
                // Pricing section buttons
                { top: '75%', left: '25%', width: '15%', height: '5%', name: 'pricing-left' },
                { top: '75%', left: '60%', width: '15%', height: '5%', name: 'pricing-right' },
              ];
              
              buttonAreas.forEach((area, index) => {
                const clickArea = document.createElement('div');
                clickArea.style.position = 'absolute';
                clickArea.style.top = area.top;
                clickArea.style.left = area.left;
                clickArea.style.width = area.width;
                clickArea.style.height = area.height;
                clickArea.style.pointerEvents = 'auto';
                clickArea.style.cursor = 'pointer';
                // Make overlay visible for testing - change to transparent once working
                clickArea.style.background = 'rgba(0,0,255,0.15)'; // Blue tint for testing
                clickArea.style.border = '2px solid rgba(0,0,255,0.4)';
                clickArea.style.borderRadius = '8px';
                clickArea.style.transition = 'all 0.2s ease';
                clickArea.title = `Click here to access dashboard (${area.name})`;
                
                clickArea.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(`🎯 Intercepted ${area.name} button click, redirecting to dashboard`);
                  navigate('/dashboard');
                });
                
                // Hover effects
                clickArea.addEventListener('mouseenter', () => {
                  clickArea.style.background = 'rgba(0,0,255,0.3)';
                  clickArea.style.transform = 'scale(1.02)';
                });
                clickArea.addEventListener('mouseleave', () => {
                  clickArea.style.background = 'rgba(0,0,255,0.15)';
                  clickArea.style.transform = 'scale(1)';
                });
                
                overlay.appendChild(clickArea);
              });
              
              iframe.parentElement?.appendChild(overlay);
              console.log('Button intercept overlay created with', buttonAreas.length, 'click areas');
              
            }, 2000); // Wait for iframe to fully load
          }
        }}
      />
    </div>
  );
};

export default LandingPage;