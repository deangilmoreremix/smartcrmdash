import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmbeddedLandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the trusted domain
      if (event.origin !== 'https://cerulean-crepe-9470cc.netlify.app') {
        return;
      }

      // Handle navigation requests from the embedded page
      if (event.data.type === 'navigate') {
        const { path } = event.data;
        
        // Map landing page paths to your app routes
        switch (path) {
          case '/dashboard':
          case '/register':
          case '/signup':
            navigate('/dashboard');
            break;
          case '/signin':
          case '/login':
            navigate('/sign-in');
            break;
          case '/pricing':
            navigate('/pricing');
            break;
          default:
            // For any other paths, try to navigate within your app
            navigate(path);
        }
      }
    };

    // Listen for messages from the iframe
    window.addEventListener('message', handleMessage);

    // Add script to inject into iframe to capture clicks (optional)
    const iframe = document.getElementById('embedded-landing') as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = () => {
        console.log('Landing page loaded successfully');
        
        // Optional: Inject script to capture navigation attempts
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // This will only work if the iframe content is from the same origin
            // For cross-origin, you'll need cooperation from the embedded page
          }
        } catch (e) {
          // Expected for cross-origin iframes
          console.log('Cross-origin iframe - navigation interception limited');
        }
      };
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-white">
      <iframe
        id="embedded-landing"
        src="https://cerulean-crepe-9470cc.netlify.app/"
        className="w-full min-h-screen border-0"
        style={{ 
          height: '100vh', 
          minHeight: '100vh',
          width: '100%',
          display: 'block'
        }}
        title="SmartCRM Landing Page"
        frameBorder="0"
        scrolling="auto"
        allowFullScreen
        allow="fullscreen"
      />
      
      {/* Optional: Add overlay for specific link interception */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors font-medium"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EmbeddedLandingPage;
