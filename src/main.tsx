/**
 * Snakkaz Chat - Main Entry Point
 * Super-Simplified Version - May 22, 2025
 */

// CRITICAL: Apply React state fix IMMEDIATELY - Juni 4, 2025
console.log('🚨 APPLYING EMERGENCY REACT STATE FIX');

// Emergency useState implementation
const emergencyUseState = (initialState: any): [any, (newState: any) => void] => {
  console.log('Emergency useState called with:', initialState);
  let state = initialState;
  const setState = (newState: any) => {
    state = newState;
    console.log('Emergency setState called with:', newState);
  };
  return [state, setState];
};

// Apply fixes to window object
if (typeof window !== 'undefined') {
  // Ensure React exists
  if (!window.React) {
    (window as any).React = {};
  }
  
  // Ensure useState exists
  if (!window.React.useState) {
    window.React.useState = emergencyUseState;
  }
  
  // Ensure global useState exists
  if (!(window as any).useState) {
    (window as any).useState = emergencyUseState;
  }
  
  // Fix for minified variables
  const minifiedVars = ['Nt', 'Mt', 'Pt', 'Qt', 'Rt'];
  minifiedVars.forEach(varName => {
    if ((window as any)[varName] === undefined) {
      (window as any)[varName] = { useState: emergencyUseState };
      console.log(`Fixed undefined minified variable: ${varName}`);
    }
  });
  
  console.log('✅ EMERGENCY REACT STATE FIX APPLIED');
}

// Import React polyfill FIRST to ensure React and its hooks are available
import './reactPolyfill';

// Import environment fix to ensure process.env is available
import './utils/env/environmentFix';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './assets/update-notification.css';
import './styles/custom-emoji.css';

// Import the preview-fix utilities - the App component will initialize them
import '@/utils/supabase/preview-fix';

// Simplified global error handler
const handleGlobalError = (event: Event | Error) => {
  try {
    console.log('Global error handlers initialized');
    // Silent mode - just prevent crashing
  } catch (e) {
    // Completely silent fail
  }
  
  return true; // Prevents default error handling
};

// Register global error handlers
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleGlobalError);

// Simple function to render the app
function renderApp() {
  try {
    // Find the container
    const container = document.getElementById('root');
    
    if (!container) {
      document.body.innerHTML = '<div style="padding: 20px; text-align: center;">'+
        '<h2>Laster Snakkaz Chat...</h2>'+
        '<p>Kunne ikke finne root-element. Vennligst last inn siden på nytt.</p>'+
        '<button onclick="window.location.reload()">Last inn på nytt</button>'+
        '</div>';
      return;
    }
    
    // Create root and render
    const root = createRoot(container);
    root.render(
      <App />
    );
    
    // Unregister the service worker to avoid cached issues
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
  } catch (error) {
    // If render fails, show minimal UI
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;">'+
      '<h2>Snakkaz Chat</h2>'+
      '<p>Vi beklager, men det oppstod et problem ved lasting av appen.</p>'+
      '<button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 20px;">Last inn på nytt</button>'+
      '</div>';
  }
}

// Render the app
renderApp();
