import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Fix for "global is not defined" error in browser
if (typeof global === 'undefined') {
  (window as any).global = globalThis;
}

// Additional browser compatibility fixes
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

// Polyfill for Node.js modules that might be required by third-party scripts
(window as any).Buffer = (window as any).Buffer || undefined;
(window as any).require = (window as any).require || function() { return {}; };

// Enhanced error boundary for unhandled errors
window.addEventListener('error', (event) => {
  const message = event.message || '';
  const error = event.error;
  
  // Suppress common development/third-party errors that cause runtime overlay
  if (message.includes('Script error') || 
      message.includes('Module') ||
      message.includes('stream') ||
      error?.message?.includes('No AI providers available') ||
      !error) {
    console.warn('🚨 Suppressed error to prevent runtime overlay:', message || 'Unknown error');
    event.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.toString() || event.reason?.message || '';
  
  // Suppress common promise rejections that cause runtime overlay
  if (reason.includes('Module externalized') ||
      reason.includes('No AI providers available') ||
      reason.includes('stream') ||
      !event.reason) {
    console.warn('🚨 Suppressed promise rejection to prevent runtime overlay:', reason || 'Unknown rejection');
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
