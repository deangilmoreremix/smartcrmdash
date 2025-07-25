import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AIToolsProvider } from './components/AIToolsProvider.tsx';

// Create a function to ensure CSS is loaded
const ensureCssLoaded = () => {
  // Check if animations.css is loaded
  const animationsCss = document.querySelector('link[href*="animations.css"]');
  if (!animationsCss) {
    console.log('Animations CSS not found, adding it manually');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/animations.css';
    link.type = 'text/css';
    document.head.appendChild(link);
    
    // Log when it's loaded or fails
    link.onload = () => console.log('Animations CSS manually loaded');
    link.onerror = (e) => console.error('Failed to load animations.css manually', e);
  } else {
    console.log('Animations CSS found in document');
  }
};

// Ensure CSS is loaded before rendering
ensureCssLoaded();

// Create root and render app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AIToolsProvider>
      <App />
    </AIToolsProvider>
  </StrictMode>
);

// Debug page load events
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  document.documentElement.classList.add('content-ready');
  
  // Check CSS again
  ensureCssLoaded();
});

// When fully loaded, complete the transition
window.addEventListener('load', () => {
  console.log('Window load event fired');
  document.documentElement.classList.add('page-loaded');
  
  // Log all stylesheets
  console.log('All stylesheets:', Array.from(document.styleSheets).map(sheet => 
    sheet.href || 'inline style'
  ));
  
  // Remove the loader once everything is ready
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.classList.add('hide-loader');
    setTimeout(() => loader.remove(), 300);
  }
});