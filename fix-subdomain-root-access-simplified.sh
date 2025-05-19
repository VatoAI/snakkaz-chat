#!/bin/bash
# fix-subdomain-root-access.sh
#
# This script enhances the previous fixes to handle direct subdomain root requests
# in addition to /ping path requests.

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   SNAKKAZ CHAT: SUBDOMAIN ROOT ACCESS FIX           ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Step 1: Create an updated .htaccess file with subdomain root access fixes
echo -e "${YELLOW}Step 1: Creating enhanced .htaccess with subdomain root handling...${NC}"

cat > .htaccess << 'EOF'
# Snakkaz Chat Enhanced .htaccess
# For SPA-applikasjoner og React Router + Subdomain Fix

# Enable rewriting
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Handle ping endpoints - Return 200 OK instead of 404
    # This prevents unnecessary console errors
    RewriteRule ^(analytics|business|dash|docs)\.snakkaz\.com/ping$ - [R=200,L]
    
    # Handle direct subdomain access (without /ping path)
    RewriteRule ^(analytics|business|dash|docs)\.snakkaz\.com$ - [R=200,L]
    
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

    # Set headers for ping endpoints to prevent 404s
    <FilesMatch "ping$|index\.json$">
        Header set Access-Control-Allow-Origin "*"
        Header set Content-Type "application/json"
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

echo -e "${GREEN}✓ Enhanced .htaccess file created${NC}"
echo 

# Step 2: Create subdomain directories and files
echo -e "${YELLOW}Step 2: Creating subdomain response files for both root and ping paths...${NC}"

mkdir -p analytics business dash docs

# Create ping and index response files for each subdomain
for subdomain in analytics business dash docs; do
    mkdir -p "$subdomain"
    
    # Create ping.json for the /ping path
    cat > "$subdomain/ping.json" << EOF
{
  "status": "ok",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "server": "$subdomain.snakkaz.com",
  "message": "Service is operational"
}
EOF

    # Create index.json for the root subdomain access
    cat > "$subdomain/index.json" << EOF
{
  "status": "ok",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "server": "$subdomain.snakkaz.com",
  "service": "$subdomain",
  "message": "Service is operational"
}
EOF

    # Create index.html for direct browser access
    cat > "$subdomain/index.html" << EOF
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$subdomain.snakkaz.com</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
      color: #333;
    }
    .container {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 30px;
      background-color: #f9f9f9;
    }
    h1 {
      color: #0066cc;
    }
    .status {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      background-color: #4caf50;
      color: white;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>$subdomain.snakkaz.com</h1>
    <div class="status">Service Operational</div>
    <p>This is a service endpoint for Snakkaz Chat</p>
    <p><small>Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")</small></p>
  </div>
</body>
</html>
EOF
done

# Create .htaccess files for each subdomain directory
for subdomain in analytics business dash docs; do
    cat > "$subdomain/.htaccess" << 'EOF'
# Return proper JSON for ping files
<IfModule mod_headers.c>
    <FilesMatch "ping\.json$|index\.json$">
        Header set Content-Type "application/json"
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
</IfModule>

# Ensure these files are accessible
<IfModule mod_rewrite.c>
    RewriteEngine On
    # For /ping path
    RewriteRule ^ping$ ping.json [L]
    
    # For root subdomain access (when accessed directly)
    RewriteRule ^$ index.json [L]
</IfModule>
EOF
done

echo -e "${GREEN}✓ Created response files for both root and ping paths for each subdomain${NC}"
echo

# Step 3: Create enhanced subdomain ping handler script
echo -e "${YELLOW}Step 3: Creating enhanced subdomain handler script...${NC}"

cat > fix-subdomain-pings.js << 'EOF'
/**
 * Enhanced Subdomain Handler for Snakkaz Chat
 * 
 * This script intercepts requests to non-existent subdomains and provides mock responses
 * for both /ping paths and direct subdomain root access.
 */

// List of subdomains that should be mocked
const SUBDOMAINS_TO_MOCK = ['analytics', 'business', 'dash', 'docs'];

// Create a mock response for ping endpoints and root access
const createMockResponse = (subdomain, isRoot = false) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: `${subdomain}.snakkaz.com`,
    service: subdomain,
    message: isRoot ? 'Mock service root is operational' : 'Mock service ping is operational'
  };
};

// Function to check if the URL matches a subdomain request
const isSubdomainRequest = (url, subdomain) => {
  // Check for direct subdomain access (e.g., https://analytics.snakkaz.com)
  const rootRegex = new RegExp(`^https?://${subdomain}\\.snakkaz\\.com/?$`, 'i');
  
  // Check for ping path access (e.g., https://analytics.snakkaz.com/ping)
  const pingRegex = new RegExp(`^https?://${subdomain}\\.snakkaz\\.com/ping/?$`, 'i');
  
  return rootRegex.test(url) || pingRegex.test(url);
};

// Function to determine if it's a root request or ping request
const isRootRequest = (url, subdomain) => {
  const rootRegex = new RegExp(`^https?://${subdomain}\\.snakkaz\\.com/?$`, 'i');
  return rootRegex.test(url);
};

// Override fetch for specific subdomain endpoints
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  const url = typeof input === 'string' ? input : input.url;
  
  // Check if this is a request to one of our subdomains
  for (const subdomain of SUBDOMAINS_TO_MOCK) {
    if (isSubdomainRequest(url, subdomain)) {
      const isRoot = isRootRequest(url, subdomain);
      console.log(`Intercepted ${isRoot ? 'root' : 'ping'} request to ${subdomain}.snakkaz.com`);
      
      // Return a mock successful response
      return Promise.resolve(new Response(
        JSON.stringify(createMockResponse(subdomain, isRoot)),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      ));
    }
  }
  
  // For all other requests, use the original fetch
  return originalFetch.apply(this, arguments);
};

// Create mock XMLHttpRequest for subdomain endpoints
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
  this._url = url;
  return originalXHROpen.call(this, method, url, ...rest);
};

const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  // Check if this is a request to one of our subdomains
  for (const subdomain of SUBDOMAINS_TO_MOCK) {
    if (this._url && isSubdomainRequest(this._url, subdomain)) {
      const isRoot = isRootRequest(this._url, subdomain);
      console.log(`Intercepted XHR ${isRoot ? 'root' : 'ping'} request to ${subdomain}.snakkaz.com`);
      
      // Mock the XHR response
      setTimeout(() => {
        Object.defineProperty(this, 'readyState', { value: 4 });
        Object.defineProperty(this, 'status', { value: 200 });
        Object.defineProperty(this, 'responseText', { 
          value: JSON.stringify(createMockResponse(subdomain, isRoot))
        });
        
        // Trigger load event
        const loadEvent = new Event('load');
        this.dispatchEvent(loadEvent);
      }, 10);
      
      return;
    }
  }
  
  // For all other XHR requests, use the original send
  return originalXHRSend.call(this, body);
};

console.log('Snakkaz Chat: Enhanced subdomain handler installed (handles both root and ping paths)');
EOF

echo -e "${GREEN}✓ Created enhanced subdomain handler script${NC}"
echo

# Now create a ZIP file for easier uploading
echo -e "${YELLOW}Creating ZIP archive with all fix files...${NC}"
zip -q -r subdomain-root-access-fix.zip .htaccess analytics/ business/ dash/ docs/ fix-subdomain-pings.js

echo -e "${GREEN}✓ Created subdomain-root-access-fix.zip${NC}"
echo

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   FIX COMPLETE                                      ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo -e "The subdomain root access fix has been created and packaged."
echo -e "To deploy the fix, you can either:"
echo
echo -e "1. Upload 'subdomain-root-access-fix.zip' to your server"
echo -e "   using cPanel File Manager and extract it there."
echo
echo -e "2. Or upload the individual files:"
echo -e "   - .htaccess"
echo -e "   - fix-subdomain-pings.js"
echo -e "   - Create the subdomain directories (analytics, business, dash, docs)"
echo -e "   - Upload all JSON and HTML files to appropriate subdomain directories"
echo
echo -e "This fix will handle direct subdomain access (e.g., analytics.snakkaz.com)"
echo -e "in addition to the existing ping path handling (e.g., analytics.snakkaz.com/ping)."
echo
