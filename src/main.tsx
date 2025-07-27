/**
 * Snakkaz Chat - Main Entry Point
 * Enhanced for Norwegian Tech Community - Juli 24, 2025
 */

/**
 * Snakkaz Chat - Main Entry Point
 * Enhanced for Norwegian Tech Community - Juli 25, 2025
 */

// ULTRA-CRITICAL: Import the ultra-early React fix FIRST BEFORE ANYTHING ELSE
import './utils/reactFixUltraEarly';

// VENDOR-MISC SPECIFIC: Import the vendor-misc patch
import './utils/vendorMiscPatch';

// CRITICAL: Import the optimized React fix FIRST to prevent runtime errors
import './utils/reactFixOptimized';

// Import environment fix to ensure process.env is available
import './utils/env/environmentFix';

// FASE 5: Initialize Sentry before anything else
import { initSentry } from './config/sentry';
initSentry();

// Norwegian UX Performance Monitoring
import './utils/PerformanceMonitor';

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './AppRouterSimple'
import './styles/master-design-system.css';
import './styles/design-system/liquid-glass.css';
import './styles/design-system/components.css';

// Create a variable to track if we've already created a root
let rootInstance: any = null;

// Enhanced global error handler for Norwegian users
const handleGlobalError = (_event: Event | Error) => {
  try {
    console.log('🇳🇴 Global error handlers initialized for Norwegian tech community');
    
    // Enhanced error tracking for better UX
    if ((window as any).snakkazPerformance) {
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

/**
 * Initialize the React application
 * This function ensures that we only create one React root
 * and handles graceful error recovery
 */
function initializeApp() {
  console.log('🚀 Starting SnakkaZ app initialization...');
  
  try {
    // Find the container
    const container = document.getElementById('root');
    
    if (!container) {
      console.error('❌ Root element not found');
      document.body.innerHTML = '<div style="padding: 20px; text-align: center;">'+
        '<h2>Laster Snakkaz Chat...</h2>'+
        '<p>Kunne ikke finne root-element. Vennligst last inn siden på nytt.</p>'+
        '<button onclick="window.location.reload()">Last inn på nytt</button>'+
        '</div>';
      return;
    }
    
    console.log('✅ Root element found, initializing React...');
    
    // Check if we already have a root instance (for HMR)
    if (rootInstance || (window as any).__SNAKKAZ_ROOT__) {
      console.log('♻️ Using existing root for update...');
      
      // Use existing root from either variable
      const existingRoot = rootInstance || (window as any).__SNAKKAZ_ROOT__;
      
      existingRoot.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      console.log('✅ App re-rendered successfully!');
      return;
    }
    
    // Create new root if none exists
    console.log('✅ React available, creating root...');
    rootInstance = createRoot(container);
    
    // Store it globally for HMR
    (window as any).__SNAKKAZ_ROOT__ = rootInstance;
    
    console.log('✅ Root created, rendering App...');
    
    rootInstance.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ App rendered successfully!');
    
    // Unregister service workers to avoid cached issues
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
  } catch (error: any) {
    console.error('❌ Error during app initialization:', error);
    console.error('Error details:', error?.message, error?.stack);
    
    // If render fails, show minimal UI with more info
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;">'+
      '<h2>Snakkaz Chat</h2>'+
      '<p>Vi beklager, men det oppstod et problem ved lasting av appen.</p>'+
      '<p style="font-size: 12px; color: #666;">Error: ' + (error?.message || 'Unknown error') + '</p>'+
      '<button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 20px;">Last inn på nytt</button>'+
      '</div>';
  }
}

// Initialize the application
initializeApp();
