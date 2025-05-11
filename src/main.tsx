import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import our service connector and error handling utilities
import { initializeExternalServices, initializeErrorHandling } from './utils/serviceConnector';
import './utils/externalScripts'; // This auto-initializes

// Import security initialization for Snakkaz Chat
import { initializeSnakkazChat } from './services/encryption/initialize';

// Initialize error handlers as early as possible to prevent console errors
initializeErrorHandling();

// Initialize Snakkaz Chat security features
initializeSnakkazChat();

// PWA registration function
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('Service Worker update found!');

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New Service Worker installed, ready to take over');
              // You could show a toast notification here about the update
            }
          });
        }
      });

      // Check if there's an existing controller, indicating PWA is already installed
      if (navigator.serviceWorker.controller) {
        console.log('PWA already installed and active');
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
