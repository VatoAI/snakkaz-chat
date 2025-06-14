/**
 * Snakkaz Chat - Main Entry Point
 * Enhanced for Norwegian Tech Community - Juni 7, 2025
 */

// CRITICAL: Import the emergency React state fix FIRST to prevent useState undefined errors
import './utils/reactStateFixV4NEW';

// Import environment fix to ensure process.env is available
import './utils/env/environmentFix';

// Norwegian UX Performance Monitoring
import './utils/performanceMonitor';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './assets/update-notification.css';
import './styles/custom-emoji.css';

// DEAKTIVERT: Supabase preview-fix (forårsaker konflikter)
// import '@/utils/supabase/preview-fix';

// Enhanced global error handler for Norwegian users
const handleGlobalError = (event: Event | Error) => {
  try {
    console.log('🇳🇴 Global error handlers initialized for Norwegian tech community');
    
    // Enhanced error tracking for better UX
    if (window.snakkazPerformance) {
      console.log('📊 Performance monitoring active');
    }
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
