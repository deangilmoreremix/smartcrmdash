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

// Error boundary for unhandled errors
window.addEventListener('error', (event) => {
  if (event.message?.includes('Script error') || event.message?.includes('Module')) {
    console.warn('Suppressed third-party script error:', event.message);
    event.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.toString()?.includes('Module externalized')) {
    console.warn('Suppressed module externalization error:', event.reason);
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
