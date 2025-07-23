/**
 * Snakkaz Chat import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import marketplace functionality
import { testMarketplaceFunctions } from './marketplace/MarketplaceSecurity.js'

// Test marketplace functions on startup
console.log('🚀 SnakkaZ Beta - E-Commerce Marketplace Loading...')
const marketplaceSystems = testMarketplaceFunctions()
console.log('✅ Marketplace systems initialized:', marketplaceSystems)

// Add global marketplace access for development
window.SnakkaZ = {
  marketplace: marketplaceSystems,
  version: '1.0.0-beta',
  features: {
    pinSecurity: true,
    groupAccess: true,
    locationMaps: true,
    trustSystem: true,
    productListings: true,
    mobileOptimized: true
  }
}in Entry Point
 * Enhanced for Norwegian Tech Community - Juni 7, 2025
 */

// ULTRA-CRITICAL: Import the ultra-early React fix FIRST BEFORE ANYTHING ELSE
import './utils/reactFixUltraEarly';

// VENDOR-MISC SPECIFIC: Import the vendor-misc patch
import './utils/vendorMiscPatch';

// CRITICAL: Import the optimized React fix FIRST to prevent runtime errors
import './utils/reactFixOptimized';

// Import environment fix to ensure process.env is available
import './utils/env/environmentFix';

// Norwegian UX Performance Monitoring
import './utils/PerformanceMonitor';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
)
import './assets/update-notification.css';

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
