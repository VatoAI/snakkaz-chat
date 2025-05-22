/**
 * Snakkaz Chat - Main Entry Point
 * Super-Simplified Version - May 22, 2025
 */

// Import environment fix first to ensure process.env is available
import './utils/env/environmentFix';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './assets/update-notification.css';

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
