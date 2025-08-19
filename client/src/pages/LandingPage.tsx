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
        }}
      />
      
      {/* Floating "Try Dashboard" button as overlay */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          → Go to Dashboard
        </button>
      </div>
      
      {/* Hero section overlay button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-green-700 transition-all transform hover:scale-105"
        >
          🚀 Try Our CRM Dashboard
        </button>
      </div>
    </div>
  );
};

export default LandingPage;