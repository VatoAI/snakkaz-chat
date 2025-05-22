// Import environment fix first to ensure process.env is available
import './utils/env/environmentFix';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './assets/update-notification.css'; // Import update notification styles

// Import our service connector and error handling utilities
import { initializeExternalServices, initializeErrorHandling } from './utils/serviceConnector';
import './utils/externalScripts'; // This auto-initializes

// Import error monitoring
import { initErrorMonitoring } from './utils/error/errorMonitoring';

// Import security initialization for Snakkaz Chat - SIMPLIFIED VERSION
import { initializeSnakkazChat, applyAllCspFixes } from './services/simplified-initialize';

// Initialize error monitoring as early as possible
initErrorMonitoring();

// Initialize error handlers from service connector
initializeErrorHandling();

// Apply the emergency CSP fixes first to prevent loading issues
applyAllCspFixes();

// Log environment setup
console.log('Snakkaz Chat environment initialized');

// Initialize Snakkaz Chat security features with the simplified implementation
initializeSnakkazChat();

// PWA registration function
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Use stable service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      console.log('Improved Service Worker registered with scope:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('Service Worker update found!');

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New Service Worker installed, ready to take over');
              // Show notification about update
              const updateNotification = document.createElement('div');
              updateNotification.className = 'update-notification';
              updateNotification.innerHTML = `
                <div class="update-banner">
                  <p>En ny versjon av appen er tilgjengelig!</p>
                  <button id="update-now">Oppdater nå</button>
                </div>
              `;
              document.body.appendChild(updateNotification);
              
              // Add event listener for the update button
              document.getElementById('update-now')?.addEventListener('click', () => {
                if (newWorker.state === 'installed') {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
                window.location.reload();
              });
            }
          });
        }
      });

      // Check if there's an existing controller, indicating PWA is already installed
      if (navigator.serviceWorker.controller) {
        console.log('PWA already installed and active');
        
        // Add listener for controlling service worker changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('New service worker controller, reloading page for fresh content');
          window.location.reload();
        });
        
        // Set up messaging for existing service workers
        navigator.serviceWorker.ready.then((registration) => {
          console.log('Service worker is ready');
        });
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Register PWA service worker
registerServiceWorker();

// Initialize external services (non-blocking)
if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_EXTERNAL_SERVICES === 'true') {
  // Use setTimeout to ensure this doesn't block initial rendering
  setTimeout(() => {
    initializeExternalServices().catch(() => {
      // Silent catch - errors are already handled in the service
    });
  }, 1000);
}

// Get the root element
const rootElement = document.getElementById("root");

// Ensure the root element exists before rendering
if (!rootElement) {
  throw new Error("Root element not found! Please check your HTML file.");
}

// Create root and render the app
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
