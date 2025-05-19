#!/bin/bash
# fix-service-worker.sh
#
# This script helps diagnose and fix Service Worker issues
# that might be preventing the Snakkaz Chat application from loading correctly

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Snakkaz Chat: Service Worker Fix    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Create a JavaScript code to unregister service workers
echo -e "${YELLOW}Creating service worker unregistration code...${NC}"
cat > unregister-sw.js << 'EOF'
// Service Worker Unregistration Script
// Run this in the browser console to unregister problematic service workers

// Function to unregister all service workers
async function unregisterAllServiceWorkers() {
  try {
    console.log('[SW Fix] Starting service worker unregistration...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      console.log('[SW Fix] No service workers found to unregister.');
      return false;
    }
    
    let unregisteredCount = 0;
    for (const registration of registrations) {
      const scope = registration.scope;
      const success = await registration.unregister();
      
      if (success) {
        console.log(`[SW Fix] Successfully unregistered service worker with scope: ${scope}`);
        unregisteredCount++;
      } else {
        console.warn(`[SW Fix] Failed to unregister service worker with scope: ${scope}`);
      }
    }
    
    console.log(`[SW Fix] Unregistered ${unregisteredCount} of ${registrations.length} service workers.`);
    return unregisteredCount > 0;
  } catch (error) {
    console.error('[SW Fix] Error unregistering service workers:', error);
    return false;
  }
}

// Function to clear all caches
async function clearAllCaches() {
  try {
    console.log('[SW Fix] Starting cache clearing...');
    const cacheNames = await caches.keys();
    
    if (cacheNames.length === 0) {
      console.log('[SW Fix] No caches found to clear.');
      return false;
    }
    
    let clearedCount = 0;
    for (const cacheName of cacheNames) {
      const success = await caches.delete(cacheName);
      
      if (success) {
        console.log(`[SW Fix] Successfully cleared cache: ${cacheName}`);
        clearedCount++;
      } else {
        console.warn(`[SW Fix] Failed to clear cache: ${cacheName}`);
      }
    }
    
    console.log(`[SW Fix] Cleared ${clearedCount} of ${cacheNames.length} caches.`);
    return clearedCount > 0;
  } catch (error) {
    console.error('[SW Fix] Error clearing caches:', error);
    return false;
  }
}

// Execute both functions and reload if successful
async function fixServiceWorkerIssues() {
  console.log('======================================');
  console.log('  Snakkaz Chat: Service Worker Fix');
  console.log('======================================');
  
  const swUnregistered = await unregisterAllServiceWorkers();
  const cachesCleared = await clearAllCaches();
  
  if (swUnregistered || cachesCleared) {
    console.log('[SW Fix] Fixed service worker issues! Reloading page in 3 seconds...');
    setTimeout(() => {
      console.log('[SW Fix] Reloading now!');
      window.location.reload(true);
    }, 3000);
  } else {
    console.log('[SW Fix] No service worker issues found to fix.');
  }
}

// Run the fix function
fixServiceWorkerIssues();
EOF

echo -e "${GREEN}✓ Created unregister-sw.js script${NC}"
echo

# Create a simple HTML page to unregister service workers
echo -e "${YELLOW}Creating service worker fix HTML page...${NC}"
cat > fix-service-worker.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snakkaz Chat - Service Worker Fix</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      color: #0066cc;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      background-color: #f9f9f9;
    }
    button {
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px 0;
    }
    button:hover {
      background-color: #004c99;
    }
    .success {
      color: #2e7d32;
      font-weight: bold;
    }
    .warning {
      color: #ff9800;
      font-weight: bold;
    }
    .error {
      color: #d32f2f;
      font-weight: bold;
    }
    #console {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      margin-top: 20px;
      height: 200px;
      overflow-y: auto;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>Snakkaz Chat - Service Worker Fix</h1>
  
  <div class="card">
    <h2>Fix Service Worker Issues</h2>
    <p>
      This tool will help fix issues with the Snakkaz Chat application by unregistering any problematic service workers
      and clearing browser caches. Click the button below to start the fix process.
    </p>
    <button id="fixButton">Fix Service Worker Issues</button>
  </div>
  
  <div class="card">
    <h2>Status</h2>
    <div id="status">Ready to fix service worker issues.</div>
    
    <h3>Log</h3>
    <div id="console"></div>
  </div>
  
  <div class="card">
    <h2>Next Steps</h2>
    <p>
      After fixing service worker issues:
    </p>
    <ol>
      <li>Close this page and return to <a href="https://www.snakkaz.com" target="_blank">www.snakkaz.com</a></li>
      <li>Check if the login interface appears correctly</li>
      <li>If issues persist, contact technical support</li>
    </ol>
  </div>
  
  <script>
    const consoleEl = document.getElementById('console');
    const statusEl = document.getElementById('status');
    const fixButton = document.getElementById('fixButton');
    
    // Override console logging to display in our custom console
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
    
    console.log = function(...args) {
      originalConsole.log(...args);
      const message = args.join(' ');
      appendToConsole(message);
    };
    
    console.warn = function(...args) {
      originalConsole.warn(...args);
      const message = args.join(' ');
      appendToConsole(message, 'warning');
    };
    
    console.error = function(...args) {
      originalConsole.error(...args);
      const message = args.join(' ');
      appendToConsole(message, 'error');
    };
    
    function appendToConsole(message, type = '') {
      const line = document.createElement('div');
      line.textContent = message;
      if (type) {
        line.classList.add(type);
      }
      consoleEl.appendChild(line);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
    
    // Function to unregister all service workers
    async function unregisterAllServiceWorkers() {
      try {
        console.log('Starting service worker unregistration...');
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        if (registrations.length === 0) {
          console.log('No service workers found to unregister.');
          return false;
        }
        
        let unregisteredCount = 0;
        for (const registration of registrations) {
          const scope = registration.scope;
          const success = await registration.unregister();
          
          if (success) {
            console.log(`Successfully unregistered service worker with scope: ${scope}`);
            unregisteredCount++;
          } else {
            console.warn(`Failed to unregister service worker with scope: ${scope}`);
          }
        }
        
        console.log(`Unregistered ${unregisteredCount} of ${registrations.length} service workers.`);
        return unregisteredCount > 0;
      } catch (error) {
        console.error('Error unregistering service workers:', error);
        return false;
      }
    }
    
    // Function to clear all caches
    async function clearAllCaches() {
      try {
        console.log('Starting cache clearing...');
        const cacheNames = await caches.keys();
        
        if (cacheNames.length === 0) {
          console.log('No caches found to clear.');
          return false;
        }
        
        let clearedCount = 0;
        for (const cacheName of cacheNames) {
          const success = await caches.delete(cacheName);
          
          if (success) {
            console.log(`Successfully cleared cache: ${cacheName}`);
            clearedCount++;
          } else {
            console.warn(`Failed to clear cache: ${cacheName}`);
          }
        }
        
        console.log(`Cleared ${clearedCount} of ${cacheNames.length} caches.`);
        return clearedCount > 0;
      } catch (error) {
        console.error('Error clearing caches:', error);
        return false;
      }
    }
    
    // Execute both functions when the fix button is clicked
    fixButton.addEventListener('click', async () => {
      fixButton.disabled = true;
      statusEl.textContent = 'Fixing service worker issues...';
      
      try {
        const swUnregistered = await unregisterAllServiceWorkers();
        const cachesCleared = await clearAllCaches();
        
        if (swUnregistered || cachesCleared) {
          statusEl.innerHTML = '<span class="success">Fixed service worker issues! Page will reload in 5 seconds...</span>';
          console.log('Fixed service worker issues! Page will reload in 5 seconds...');
          
          setTimeout(() => {
            console.log('Reloading now!');
            window.location.reload(true);
          }, 5000);
        } else {
          statusEl.innerHTML = '<span class="warning">No service worker issues found to fix.</span>';
          fixButton.disabled = false;
        }
      } catch (error) {
        console.error('Error fixing service worker issues:', error);
        statusEl.innerHTML = `<span class="error">Error: ${error.message}</span>`;
        fixButton.disabled = false;
      }
    });
  </script>
</body>
</html>
EOF

echo -e "${GREEN}✓ Created fix-service-worker.html page${NC}"
echo

# Print instructions for uploading these files
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Upload Instructions    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "${YELLOW}To fix service worker issues:${NC}"
echo
echo "1. Upload these files to your web server:"
echo "   - unregister-sw.js"
echo "   - fix-service-worker.html"
echo
echo "2. You can upload them using FTP or your hosting control panel"
echo
echo "3. Access the fix page at: https://www.snakkaz.com/fix-service-worker.html"
echo
echo "4. Click the 'Fix Service Worker Issues' button on that page"
echo
echo "5. After fixing, return to https://www.snakkaz.com to see if the authentication interface appears"
echo
echo -e "${GREEN}✓ Service worker fix files created!${NC}"
