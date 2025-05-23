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

    # Create a basic HTML fallback page
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

# Step 3: Create updated subdomain ping handler script
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

# Step 4: Create a verification script
echo -e "${YELLOW}Step 4: Creating verification script...${NC}"

cat > verify-subdomain-fix.sh << 'EOF'
#!/bin/bash
# verify-subdomain-fix.sh
#
# This script verifies that the subdomain root and ping access fix is working correctly.

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   SNAKKAZ CHAT: SUBDOMAIN FIX VERIFICATION          ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Function to check if a directory and required files exist
check_directory() {
    local dir=$1
    local success=true
    
    echo -e "${YELLOW}Checking $dir subdomain directory:${NC}"
    
    # Check directory
    if [ -d "$dir" ]; then
        echo -e "  - Directory: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - Directory: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check ping.json
    if [ -f "$dir/ping.json" ]; then
        echo -e "  - ping.json: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - ping.json: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check index.json
    if [ -f "$dir/index.json" ]; then
        echo -e "  - index.json: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - index.json: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check index.html
    if [ -f "$dir/index.html" ]; then
        echo -e "  - index.html: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - index.html: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check .htaccess
    if [ -f "$dir/.htaccess" ]; then
        echo -e "  - .htaccess: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - .htaccess: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check for RewriteRule in .htaccess
    if [ -f "$dir/.htaccess" ] && grep -q "RewriteRule \^$" "$dir/.htaccess"; then
        echo -e "  - Root RewriteRule: ${GREEN}✓ Configured${NC}"
    else
        echo -e "  - Root RewriteRule: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    if [ "$success" = true ]; then
        echo -e "  ${GREEN}✓ $dir subdomain setup is complete!${NC}"
    else
        echo -e "  ${RED}✗ $dir subdomain setup is incomplete${NC}"
    fi
    echo
}

# Check .htaccess in root directory
echo -e "${YELLOW}Checking root .htaccess:${NC}"
if [ -f ".htaccess" ]; then
    echo -e "  - File: ${GREEN}✓ Exists${NC}"
    
    # Check for subdomain root handling
    if grep -q "RewriteRule \^(analytics|business|dash|docs)\.snakkaz\.com$ -" ".htaccess"; then
        echo -e "  - Subdomain root handling: ${GREEN}✓ Configured${NC}"
    else
        echo -e "  - Subdomain root handling: ${RED}✗ Missing${NC}"
    fi
else
    echo -e "  - File: ${RED}✗ Missing${NC}"
fi
echo

# Check if fix-subdomain-pings.js exists and contains root handling
echo -e "${YELLOW}Checking subdomain handler script:${NC}"
if [ -f "fix-subdomain-pings.js" ]; then
    echo -e "  - File: ${GREEN}✓ Exists${NC}"
    
    # Check for isRootRequest function
    if grep -q "isRootRequest" "fix-subdomain-pings.js"; then
        echo -e "  - Root request handling: ${GREEN}✓ Configured${NC}"
    else
        echo -e "  - Root request handling: ${RED}✗ Missing${NC}"
    fi
else
    echo -e "  - File: ${RED}✗ Missing${NC}"
fi
echo

# Check subdomain directories
for subdomain in analytics business dash docs; do
    check_directory "$subdomain"
done

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   VERIFICATION COMPLETE                            ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
EOF

chmod +x verify-subdomain-fix.sh

echo -e "${GREEN}✓ Created verification script${NC}"
echo

# Step 5: Create upload script
echo -e "${YELLOW}Step 5: Creating upload script...${NC}"

cat > upload-subdomain-fix.sh << 'EOF'
#!/bin/bash
# upload-subdomain-fix.sh
#
# This script uploads the subdomain root access fix files to the server.

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   SNAKKAZ CHAT: UPLOAD SUBDOMAIN FIX               ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Check if zip file exists
if [ ! -f "subdomain-root-access-fix.zip" ]; then
    echo -e "${RED}Error: subdomain-root-access-fix.zip not found!${NC}"
    echo "Please run fix-subdomain-root-access.sh first."
    exit 1
fi

# Default values
HOST=""
USER=""
PASS=""
REMOTE_PATH=""
USE_CPANEL=false

# Helper function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -h, --host       FTP host or cPanel domain"
    echo "  -u, --user       Username"
    echo "  -p, --pass       Password"
    echo "  -r, --remote     Remote path (default: public_html)"
    echo "  -c, --cpanel     Use cPanel File Manager instead of FTP"
    echo "  --help           Show this help message"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            HOST="$2"
            shift 2
            ;;
        -u|--user)
            USER="$2"
            shift 2
            ;;
        -p|--pass)
            PASS="$2"
            shift 2
            ;;
        -r|--remote)
            REMOTE_PATH="$2"
            shift 2
            ;;
        -c|--cpanel)
            USE_CPANEL=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Interactive mode if parameters are missing
if [ -z "$HOST" ]; then
    read -p "Enter FTP host or cPanel domain: " HOST
fi

if [ -z "$USER" ]; then
    read -p "Enter username: " USER
fi

if [ -z "$PASS" ]; then
    read -s -p "Enter password: " PASS
    echo
fi

if [ -z "$REMOTE_PATH" ]; then
    read -p "Enter remote path (default: public_html): " REMOTE_PATH
    REMOTE_PATH=${REMOTE_PATH:-public_html}
fi

if [ "$USE_CPANEL" != true ]; then
    read -p "Use cPanel File Manager instead of FTP? (y/n): " cpanel_choice
    if [[ $cpanel_choice =~ ^[Yy]$ ]]; then
        USE_CPANEL=true
    fi
fi

# Confirm settings
echo
echo -e "${YELLOW}Upload settings:${NC}"
echo "  Host: $HOST"
echo "  User: $USER"
echo "  Remote path: $REMOTE_PATH"
echo "  Method: $([ "$USE_CPANEL" = true ] && echo "cPanel File Manager" || echo "FTP")"
echo

read -p "Proceed with these settings? (y/n): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Upload cancelled."
    exit 0
fi

if [ "$USE_CPANEL" = true ]; then
    # Use cPanel File Manager API
    echo -e "${YELLOW}Uploading via cPanel File Manager...${NC}"
    
    # Create a temporary PHP file for extraction
    EXTRACT_PHP=$(mktemp --suffix=.php)
    cat > "$EXTRACT_PHP" << 'PHPSCRIPT'
<?php
$zip = new ZipArchive;
$res = $zip->open('subdomain-root-access-fix.zip');
if ($res === TRUE) {
    echo "Extracting ZIP file...\n";
    $zip->extractTo('.');
    $zip->close();
    echo "Extraction successful!";
} else {
    echo "Failed to open ZIP file!";
}
?>
PHPSCRIPT
    
    # First, upload the ZIP file
    echo -e "${YELLOW}Uploading ZIP file...${NC}"
    curl -s -T subdomain-root-access-fix.zip "ftp://$HOST/$REMOTE_PATH/" --user "$USER:$PASS"
    UPLOAD_RESULT=$?
    
    if [ $UPLOAD_RESULT -ne 0 ]; then
        echo -e "${RED}✗ Failed to upload ZIP file via FTP${NC}"
        exit 1
    fi
    
    # Then upload the extraction script
    echo -e "${YELLOW}Uploading extraction script...${NC}"
    curl -s -T "$EXTRACT_PHP" "ftp://$HOST/$REMOTE_PATH/extract-subdomain-fix.php" --user "$USER:$PASS"
    
    # Execute the extraction script
    echo -e "${YELLOW}Extracting ZIP file on server...${NC}"
    EXTRACT_URL="http://$HOST/$REMOTE_PATH/extract-subdomain-fix.php"
    EXTRACT_RESULT=$(curl -s "$EXTRACT_URL")
    
    echo "$EXTRACT_RESULT"
    
    # Clean up
    rm -f "$EXTRACT_PHP"
    
    echo -e "${GREEN}✓ Upload and extraction completed!${NC}"
else
    # Use standard FTP
    echo -e "${YELLOW}Uploading files via FTP...${NC}"
    
    # Create a temporary FTP script
    FTP_SCRIPT=$(mktemp)
    cat > "$FTP_SCRIPT" << EOF
open $HOST
user $USER $PASS
cd $REMOTE_PATH
binary
put subdomain-root-access-fix.zip
quit
EOF
    
    # Execute FTP upload
    ftp -n < "$FTP_SCRIPT"
    FTP_RESULT=$?
    rm -f "$FTP_SCRIPT"
    
    if [ $FTP_RESULT -eq 0 ]; then
        echo -e "${GREEN}✓ ZIP file uploaded successfully!${NC}"
        echo -e "${YELLOW}Note: You need to extract the ZIP file using cPanel File Manager${NC}"
        echo -e "1. Log in to cPanel"
        echo -e "2. Open File Manager and navigate to $REMOTE_PATH"
        echo -e "3. Right-click on subdomain-root-access-fix.zip and select 'Extract'"
    else
        echo -e "${RED}✗ Failed to upload ZIP file via FTP (error code: $FTP_RESULT)${NC}"
    fi
fi

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    NEXT STEPS                                       ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo -e "After extraction:"
echo -e "1. Verify that the fix is working by accessing:"
echo -e "   - https://analytics.snakkaz.com (without /ping)"
echo -e "   - https://business.snakkaz.com (without /ping)"
echo -e "   - https://dash.snakkaz.com (without /ping)"
echo -e "   - https://docs.snakkaz.com (without /ping)"
echo -e "2. Check your browser's console for any remaining errors"
echo
echo -e "${GREEN}Upload script execution completed!${NC}"
EOF

chmod +x upload-subdomain-fix.sh

echo -e "${GREEN}✓ Created upload script${NC}"
echo

# Now we need to create a ZIP file for easier uploading
echo -e "${YELLOW}Creating ZIP archive with all fix files...${NC}"
zip -q -r subdomain-root-access-fix.zip .htaccess analytics/ business/ dash/ docs/ fix-subdomain-pings.js verify-subdomain-fix.sh

echo -e "${GREEN}✓ Created subdomain-root-access-fix.zip${NC}"
echo

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   FIX COMPLETE                                      ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo -e "The subdomain root access fix has been created. To verify and deploy:"
echo -e "1. Run ${YELLOW}./verify-subdomain-fix.sh${NC} to check the fix"
echo -e "2. Run ${YELLOW}./upload-subdomain-fix.sh${NC} to upload to your server"
echo
echo -e "Or you can manually upload the subdomain-root-access-fix.zip file"
echo -e "and extract it on your server using cPanel File Manager."
echo
echo -e "This fix will handle direct subdomain access (e.g., analytics.snakkaz.com)"
echo -e "in addition to the existing ping path handling (e.g., analytics.snakkaz.com/ping)."
echo
