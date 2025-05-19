#!/bin/bash
# fix-snakkaz-spa-routing.sh
#
# This script implements a comprehensive fix for Snakkaz Chat SPA routing issues
# It addresses both the .htaccess configuration and service worker problems

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    Snakkaz Chat: Comprehensive SPA Routing Fix    ${NC}"
echo -e "${BLUE}================================================${NC}"
echo

# Step 1: Create/update .htaccess file
echo -e "${YELLOW}Step 1: Creating .htaccess file for SPA routing...${NC}"
cat > .htaccess << 'EOF'
# Snakkaz Chat .htaccess
# For SPA-applikasjoner og React Router

# Enable rewriting
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # If the requested resource exists as a file or directory, skip rewriting
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-l
    
    # Otherwise, rewrite all requests to the index.html file
    RewriteRule ^ index.html [QSA,L]
</IfModule>

# Set proper MIME types
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType application/json .json
    AddType image/svg+xml .svg
    AddType application/font-woff .woff
    AddType application/font-woff2 .woff2
    AddType application/vnd.ms-fontobject .eot
    AddType application/x-font-ttf .ttf
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
    <FilesMatch "\.(ttf|ttc|otf|eot|woff|woff2|font.css|css|js|json|svg)$">
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
</IfModule>

# Disable directory listing
Options -Indexes

# Disable server signature
ServerSignature Off
EOF

echo -e "${GREEN}✓ .htaccess file created${NC}"
echo 

# Step 2: Create service worker fix files
echo -e "${YELLOW}Step 2: Creating service worker fix files...${NC}"

# Create unregister-sw.js
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

# Create fix-service-worker.html
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

echo -e "${GREEN}✓ Created service worker fix files${NC}"
echo

# Step 3: Create a deployment package
echo -e "${YELLOW}Step 3: Creating deployment package...${NC}"

# Check if the fixed zip file exists
if [ -f "snakkaz-chat-fixed.zip" ]; then
  # Create a temporary directory
  TEMP_DIR=$(mktemp -d)
  
  # Extract the existing zip file
  echo -e "${YELLOW}Extracting existing zip file...${NC}"
  unzip -q snakkaz-chat-fixed.zip -d "$TEMP_DIR"
  
  # Add the new files
  echo -e "${YELLOW}Adding fix files to the package...${NC}"
  cp .htaccess "$TEMP_DIR/"
  cp unregister-sw.js "$TEMP_DIR/"
  cp fix-service-worker.html "$TEMP_DIR/"
  
  # Create a new zip file
  echo -e "${YELLOW}Creating new zip file with fixes...${NC}"
  cd "$TEMP_DIR"
  zip -q -r ../snakkaz-chat-fixed-with-spa-fix.zip .
  cd - > /dev/null
  
  echo -e "${GREEN}✓ Created snakkaz-chat-fixed-with-spa-fix.zip${NC}"
  
  # Clean up
  rm -rf "$TEMP_DIR"
else
  echo -e "${YELLOW}snakkaz-chat-fixed.zip not found, creating standalone fix package...${NC}"
  
  # Create a zip file with just the fix files
  zip -q snakkaz-chat-spa-fix.zip .htaccess unregister-sw.js fix-service-worker.html
  
  echo -e "${GREEN}✓ Created snakkaz-chat-spa-fix.zip${NC}"
fi

echo

# Step 4: Provide deployment instructions
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    Deployment Instructions    ${NC}"
echo -e "${BLUE}================================================${NC}"
echo
echo -e "${YELLOW}Option 1: Deploy full application with fixes${NC}"
echo
if [ -f "snakkaz-chat-fixed-with-spa-fix.zip" ]; then
  echo "1. Upload snakkaz-chat-fixed-with-spa-fix.zip to your web server"
  echo "2. Extract all files to the public_html directory"
  echo "3. Ensure all files have correct permissions (files: 644, directories: 755)"
else
  echo "1. Upload snakkaz-chat-fixed.zip to your web server"
  echo "2. Extract all files to the public_html directory"
  echo "3. Then upload and extract snakkaz-chat-spa-fix.zip to the same directory"
  echo "4. Ensure all files have correct permissions (files: 644, directories: 755)"
fi
echo
echo -e "${YELLOW}Option 2: Deploy just the fix files${NC}"
echo
echo "1. Upload the following files to your public_html directory:"
echo "   - .htaccess"
echo "   - unregister-sw.js"
echo "   - fix-service-worker.html"
echo "2. Ensure the files have correct permissions (644)"
echo
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}    After Deployment    ${NC}"
echo -e "${BLUE}================================================${NC}"
echo
echo "1. Clear your browser cache or use an incognito/private window"
echo "2. Visit https://www.snakkaz.com"
echo "3. If the authentication interface doesn't appear, visit:"
echo "   https://www.snakkaz.com/fix-service-worker.html"
echo "4. Click the 'Fix Service Worker Issues' button"
echo "5. After the fix is complete, try https://www.snakkaz.com again"
echo
echo -e "${GREEN}✓ Snakkaz Chat SPA routing fix complete!${NC}"
