/**
 * Snakkaz Chat - Main Entry Point
 * Production Hardened Version - May 22, 2025
 */

// Import environment fix first to ensure process.env is available
import './utils/env/environmentFix';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './assets/update-notification.css';

// Import security initialization
import { initializeSnakkazChat, applyAllCspFixes } from './services/simplified-initialize';

// Create a robust error handler for the main initialization
window.addEventListener('error', (event) => {
  // Only log in development to avoid leaking information
  if (import.meta.env.DEV) {
    console.error('Global error caught during initialization:', event.error);
  }
  
  // Prevent the error from breaking the app initialization
  event.preventDefault();
  return true;
});

// Try-catch the entire initialization process
try {
  // Apply CSP fixes as early as possible
  applyAllCspFixes();
  
  // Initialize Snakkaz Chat security features
  initializeSnakkazChat();
  
  // Function to initialize the React app
  const initReactApp = () => {
    try {
      const container = document.getElementById('root');
      
      if (!container) {
        throw new Error('Root container not found');
      }
      
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.error('Failed to initialize React app:', error);
      }
      
      // Try minimal initialization for recovery
      const container = document.getElementById('root');
      if (container) {
        container.innerHTML = '<div style="padding: 20px; text-align: center;">'+
          '<h2>Laster Snakkaz Chat...</h2>'+
          '<p>Vennligst vent eller last inn siden på nytt.</p>'+
          '</div>';
      }
    }
  };
  
  // Initialize the React app
  initReactApp();
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {
        // Silent fail - service worker is not critical
      });
    });
  }
} catch (error) {
  // Final fallback for complete initialization failure
  // Only log in development
  if (import.meta.env.DEV) {
    console.error('Critical initialization failure:', error);
  }
  
  // Try to show something to the user
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = '<div style="padding: 20px; text-align: center;">'+
      '<h2>Snakkaz Chat</h2>'+
      '<p>Vi beklager, men det oppstod et problem ved lasting av appen. Vennligst last inn siden på nytt.</p>'+
      '<button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 20px;">Last inn på nytt</button>'+
      '</div>';
  }
}
