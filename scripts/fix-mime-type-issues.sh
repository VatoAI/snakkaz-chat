#!/bin/bash
# fix-mime-type-issues.sh
#
# This script adds MIME type fixes to the Snakkaz Chat application
# after migration from Cloudflare to Namecheap hosting

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   MIME Type Fix for Snakkaz Chat      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: This script must be run from the root directory of the Snakkaz Chat project${NC}"
  echo "Navigate to the root directory and try again."
  exit 1
fi

# 1. Create a .htaccess file for MIME types
echo -e "${YELLOW}Step 1: Creating .htaccess file for MIME types...${NC}"

# Create the htaccess file
cat > dist/.htaccess << 'EOF'
# Snakkaz Chat .htaccess
# Configures MIME types and SPA routing

# Enable rewrite engine
RewriteEngine On

# Redirect all requests to https
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Set MIME types correctly
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
    AddType application/x-javascript .js
    AddType text/javascript .js
    AddType application/json .json
    
    # CSS
    AddType text/css .css
    
    # Images
    AddType image/svg+xml .svg
    AddType image/svg+xml .svgz
    AddType image/png .png
    AddType image/jpeg .jpg .jpeg
    AddType image/gif .gif
    AddType image/webp .webp
    
    # Fonts
    AddType font/woff .woff
    AddType font/woff2 .woff2
    AddType application/vnd.ms-fontobject .eot
    AddType font/ttf .ttf
    AddType font/otf .otf
</IfModule>

# Force files to be loaded with correct MIME type
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>

# Don't redirect if the file or directory actually exists
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Send all other requests to index.html for SPA routing
RewriteRule ^ index.html [L]
EOF

echo -e "${GREEN}✅ .htaccess file created${NC}"
echo

# 2. Create PHP fallback for serving assets with correct MIME types
echo -e "${YELLOW}Step 2: Creating PHP fallback for correct MIME types...${NC}"

# Create the PHP file
cat > dist/serve-assets.php << 'EOF'
<?php
/**
 * serve-assets.php
 * 
 * This script serves asset files with the correct MIME types.
 * Use this as a fallback if .htaccess configuration isn't working.
 * 
 * Usage examples:
 * <link href="serve-assets.php?file=index-ZtK66PHB.css" rel="stylesheet">
 * <script src="serve-assets.php?file=index-iEerSh2Y.js"></script>
 */

// Get the requested file name
$file = $_GET['file'] ?? '';

// Security check - prevent directory traversal
$file = str_replace('../', '', $file);
$file = str_replace('./', '', $file);

// Get file extension
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

// Define MIME types
$mimeTypes = [
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'webp' => 'image/webp',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf' => 'font/ttf',
    'eot' => 'application/vnd.ms-fontobject',
    'otf' => 'font/otf'
];

// Set default MIME type if not found
$mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

// Set the correct MIME type header
header("Content-Type: $mimeType");

// Path to the file
$filePath = $file;

// Check if file exists
if (!file_exists($filePath)) {
    // Try looking in assets directory
    $filePath = "assets/$file";
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo "File not found: $file";
        exit;
    }
}

// Read and output the file
readfile($filePath);
EOF

echo -e "${GREEN}✅ PHP fallback created${NC}"
echo

# 3. Create a test HTML file to verify assets are loading correctly
echo -e "${YELLOW}Step 3: Creating test file to verify assets are loading...${NC}"

# Create the test HTML file
cat > dist/test-assets.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snakkaz Chat - Assets Test</title>
    
    <!-- Test CSS via direct link -->
    <link rel="stylesheet" href="assets/index-ZtK66PHB.css">
    
    <!-- Test CSS via PHP fallback -->
    <link rel="stylesheet" href="serve-assets.php?file=index-ZtK66PHB.css">
    
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .test-section {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
        }
        h1, h2 {
            color: #0066cc;
        }
        .success {
            color: green;
            font-weight: bold;
        }
        .failure {
            color: red;
            font-weight: bold;
        }
        .test-result {
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 3px;
        }
        button {
            padding: 8px 16px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #0055aa;
        }
    </style>
</head>
<body>
    <h1>Snakkaz Chat - Assets Test</h1>
    <p>This page tests if assets are loading with correct MIME types.</p>
    
    <div class="test-section">
        <h2>1. CSS Test (Direct Link)</h2>
        <p>Testing: <code>assets/index-ZtK66PHB.css</code></p>
        <div class="test-result" id="css-test-result">Checking...</div>
    </div>
    
    <div class="test-section">
        <h2>2. CSS Test (PHP Fallback)</h2>
        <p>Testing: <code>serve-assets.php?file=index-ZtK66PHB.css</code></p>
        <div class="test-result" id="css-php-test-result">Checking...</div>
    </div>
    
    <div class="test-section">
        <h2>3. JavaScript Test (Direct Link)</h2>
        <p>Testing: <code>assets/index-iEerSh2Y.js</code></p>
        <div class="test-result" id="js-test-result">Checking...</div>
        <button onclick="testJS()">Test JS Loading</button>
    </div>
    
    <div class="test-section">
        <h2>4. JavaScript Test (PHP Fallback)</h2>
        <p>Testing: <code>serve-assets.php?file=index-iEerSh2Y.js</code></p>
        <div class="test-result" id="js-php-test-result">Checking...</div>
        <button onclick="testJSPHP()">Test JS Loading (PHP)</button>
    </div>
    
    <p><a href="index.html">Return to Snakkaz Chat Application</a></p>
    
    <script>
        // Check CSS direct link
        function checkCSS() {
            fetch('assets/index-ZtK66PHB.css')
                .then(response => {
                    const contentType = response.headers.get('content-type');
                    const result = document.getElementById('css-test-result');
                    
                    if (contentType && contentType.includes('text/css')) {
                        result.innerHTML = '<span class="success">SUCCESS!</span> CSS is served with correct MIME type: ' + contentType;
                    } else {
                        result.innerHTML = '<span class="failure">FAILED!</span> CSS has incorrect MIME type: ' + contentType;
                    }
                })
                .catch(error => {
                    document.getElementById('css-test-result').innerHTML = 
                        '<span class="failure">ERROR!</span> Could not load CSS file: ' + error.message;
                });
        }
        
        // Check CSS via PHP
        function checkCSSPHP() {
            fetch('serve-assets.php?file=index-ZtK66PHB.css')
                .then(response => {
                    const contentType = response.headers.get('content-type');
                    const result = document.getElementById('css-php-test-result');
                    
                    if (contentType && contentType.includes('text/css')) {
                        result.innerHTML = '<span class="success">SUCCESS!</span> CSS is served with correct MIME type: ' + contentType;
                    } else {
                        result.innerHTML = '<span class="failure">FAILED!</span> CSS has incorrect MIME type: ' + contentType;
                    }
                })
                .catch(error => {
                    document.getElementById('css-php-test-result').innerHTML = 
                        '<span class="failure">ERROR!</span> Could not load CSS file via PHP: ' + error.message;
                });
        }
        
        // Test JS loading (direct)
        function testJS() {
            const script = document.createElement('script');
            script.src = 'assets/index-iEerSh2Y.js';
            script.onload = function() {
                document.getElementById('js-test-result').innerHTML = 
                    '<span class="success">SUCCESS!</span> JavaScript loaded correctly';
            };
            script.onerror = function() {
                document.getElementById('js-test-result').innerHTML = 
                    '<span class="failure">FAILED!</span> JavaScript failed to load';
            };
            document.head.appendChild(script);
        }
        
        // Test JS loading (PHP)
        function testJSPHP() {
            const script = document.createElement('script');
            script.src = 'serve-assets.php?file=index-iEerSh2Y.js';
            script.onload = function() {
                document.getElementById('js-php-test-result').innerHTML = 
                    '<span class="success">SUCCESS!</span> JavaScript loaded correctly via PHP';
            };
            script.onerror = function() {
                document.getElementById('js-php-test-result').innerHTML = 
                    '<span class="failure">FAILED!</span> JavaScript failed to load via PHP';
            };
            document.head.appendChild(script);
        }
        
        // Run tests on page load
        window.onload = function() {
            checkCSS();
            checkCSSPHP();
        };
    </script>
</body>
</html>
EOF

echo -e "${GREEN}✅ Test file created${NC}"
echo

# 4. Create a script to verify MIME types on the server
echo -e "${YELLOW}Step 4: Creating script to verify MIME types on the server...${NC}"

# Create the verification script
cat > scripts/verify-mime-types-on-server.sh << 'EOF'
#!/bin/bash
# verify-mime-types-on-server.sh
#
# This script verifies MIME types for key assets on the Snakkaz server

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz MIME Type Server Verifier   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Function to check MIME type
check_mime_type() {
  local url="$1"
  local expected_type="$2"
  local description="$3"
  
  echo -e "${YELLOW}Checking $description: $url${NC}"
  
  # Using curl to get headers only
  local content_type=$(curl -sI "$url" | grep -i "content-type" | head -n 1)
  
  if [ -z "$content_type" ]; then
    echo -e "${RED}ERROR: Could not get Content-Type header${NC}"
    return 1
  fi
  
  echo "  Content-Type: $content_type"
  
  if echo "$content_type" | grep -q "$expected_type"; then
    echo -e "  ${GREEN}SUCCESS! MIME type is correct${NC}"
    return 0
  else
    echo -e "  ${RED}FAILED! MIME type is incorrect${NC}"
    echo -e "  Expected: $expected_type"
    return 1
  fi
}

# Check if URL base provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: $0 <site-url>${NC}"
  echo "Example: $0 https://www.snakkaz.com"
  exit 1
fi

# Base URL from argument
BASE_URL="$1"

echo -e "${BLUE}Testing CSS files:${NC}"
check_mime_type "$BASE_URL/assets/auth-bg.css" "text/css" "Authentication background CSS"
check_mime_type "$BASE_URL/assets/index-ZtK66PHB.css" "text/css" "Main CSS file"
echo

echo -e "${BLUE}Testing JavaScript files:${NC}"
check_mime_type "$BASE_URL/assets/index-iEerSh2Y.js" "javascript" "Main JS file"
echo

echo -e "${BLUE}Testing PHP fallback:${NC}"
check_mime_type "$BASE_URL/serve-assets.php?file=index-ZtK66PHB.css" "text/css" "CSS via PHP fallback"
check_mime_type "$BASE_URL/serve-assets.php?file=index-iEerSh2Y.js" "javascript" "JS via PHP fallback"
echo

echo -e "${YELLOW}MIME type verification complete!${NC}"
echo -e "If there were any failures, please check your server configuration."
echo
EOF

chmod +x scripts/verify-mime-types-on-server.sh
echo -e "${GREEN}✅ MIME type verification script created${NC}"
echo

# 5. Create a script to add MIME type configurations to existing HTML files
echo -e "${YELLOW}Step 5: Creating script to add fallback MIME type solutions to HTML...${NC}"

# Create the HTML update script
cat > scripts/update-html-with-mime-fixes.sh << 'EOF'
#!/bin/bash
# update-html-with-mime-fixes.sh
#
# This script updates HTML files with MIME type fixes

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Update HTML with MIME Type Fixes     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check we're in the right directory
if [ ! -f "dist/index.html" ]; then
  echo -e "${RED}Error: dist/index.html not found!${NC}"
  echo "Make sure to build the application first."
  exit 1
fi

# 1. Backup original index.html
echo -e "${YELLOW}Backing up original index.html...${NC}"
cp dist/index.html dist/index.html.backup
echo -e "${GREEN}✅ Backup created${NC}"
echo

# 2. Add PHP fallback option for problematic CSS files
echo -e "${YELLOW}Adding PHP fallback for CSS files...${NC}"

# Check for index-ZtK66PHB.css in the HTML
if grep -q 'index-ZtK66PHB.css' dist/index.html; then
  sed -i 's#href="/assets/index-ZtK66PHB.css"#href="/serve-assets.php?file=index-ZtK66PHB.css"#g' dist/index.html
  echo -e "${GREEN}✅ Updated CSS reference to use PHP fallback${NC}"
else
  echo -e "${YELLOW}Could not find index-ZtK66PHB.css in index.html${NC}"
fi

# Check for auth-bg.css in the HTML
if grep -q 'auth-bg.css' dist/index.html; then
  sed -i 's#href="/assets/auth-bg.css"#href="/serve-assets.php?file=auth-bg.css"#g' dist/index.html
  echo -e "${GREEN}✅ Updated auth-bg.css reference to use PHP fallback${NC}"
else
  echo -e "${YELLOW}Could not find auth-bg.css in index.html${NC}"
fi
echo

# 3. Add PHP fallback for JS files
echo -e "${YELLOW}Adding PHP fallback for JavaScript files...${NC}"

# Check for index-iEerSh2Y.js in the HTML
if grep -q 'index-iEerSh2Y.js' dist/index.html; then
  sed -i 's#src="/assets/index-iEerSh2Y.js"#src="/serve-assets.php?file=index-iEerSh2Y.js"#g' dist/index.html
  echo -e "${GREEN}✅ Updated JS reference to use PHP fallback${NC}"
else
  echo -e "${YELLOW}Could not find index-iEerSh2Y.js in index.html${NC}"
fi
echo

echo -e "${GREEN}HTML update complete!${NC}"
echo -e "Original file backed up as dist/index.html.backup"
echo
EOF

chmod +x scripts/update-html-with-mime-fixes.sh
echo -e "${GREEN}✅ HTML update script created${NC}"
echo

# 6. Create comprehensive documentation
echo -e "${YELLOW}Step 6: Creating documentation for MIME type fixes...${NC}"

# Create documentation file
cat > docs/FIXING-MIME-TYPE-ISSUES.md << 'EOF'
# Fixing MIME Type Issues for Snakkaz Chat on Namecheap

This document provides step-by-step instructions to fix the MIME type issues observed with CSS and JavaScript files on the Snakkaz Chat application after migrating to Namecheap.

## The Problem

The following error messages were observed when loading the website:

```
The stylesheet http://www.snakkaz.com/assets/auth-bg.css was not loaded because its MIME type, "text/html", is not "text/css".
Loading module from "http://www.snakkaz.com/assets/index-iEerSh2Y.js" was blocked because of a disallowed MIME type ("text/html").
Loading failed for the module with source "http://www.snakkaz.com/assets/index-iEerSh2Y.js".
The stylesheet http://www.snakkaz.com/assets/index-ZtK66PHB.css was not loaded because its MIME type, "text/html", is not "text/css".
```

These errors indicate that:
1. The server is not serving the correct MIME types for CSS and JavaScript files.
2. It's possible that the assets files don't exist at the specified paths.

## Solution Steps

### 1. Fix MIME Type Configuration with .htaccess

Create a `.htaccess` file in the root directory of your website with the following content:

```apache
# Snakkaz Chat .htaccess
# Configures MIME types and SPA routing

# Enable rewrite engine
RewriteEngine On

# Set MIME types correctly
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
    AddType application/x-javascript .js
    AddType text/javascript .js
    AddType application/json .json
    
    # CSS
    AddType text/css .css
    
    # Images
    AddType image/svg+xml .svg
    AddType image/svg+xml .svgz
    AddType image/png .png
    AddType image/jpeg .jpg .jpeg
    AddType image/gif .gif
    AddType image/webp .webp
    
    # Fonts
    AddType font/woff .woff
    AddType font/woff2 .woff2
    AddType application/vnd.ms-fontobject .eot
    AddType font/ttf .ttf
    AddType font/otf .otf
</IfModule>

# Force files to be loaded with correct MIME type
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>
```

This configuration tells the server to serve the correct MIME types for various file extensions.

### 2. PHP Fallback Solution

If the `.htaccess` method doesn't work (some hosting providers restrict `.htaccess` functionality), you can use a PHP script to serve assets with the correct MIME types.

Create a file called `serve-assets.php` in your website's root directory:

```php
<?php
// Get the requested file name
$file = $_GET['file'] ?? '';

// Security check - prevent directory traversal
$file = str_replace('../', '', $file);
$file = str_replace('./', '', $file);

// Get file extension
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

// Define MIME types
$mimeTypes = [
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'webp' => 'image/webp',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf' => 'font/ttf',
    'eot' => 'application/vnd.ms-fontobject',
    'otf' => 'font/otf'
];

// Set default MIME type if not found
$mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

// Set the correct MIME type header
header("Content-Type: $mimeType");

// Path to the file
$filePath = "assets/$file";

// Check if file exists
if (!file_exists($filePath)) {
    http_response_code(404);
    echo "File not found: $file";
    exit;
}

// Read and output the file
readfile($filePath);
```

Then, update your HTML files to use this PHP script instead of directly linking to the assets:

```html
<!-- Original -->
<link rel="stylesheet" href="/assets/index-ZtK66PHB.css">
<script src="/assets/index-iEerSh2Y.js"></script>

<!-- Updated -->
<link rel="stylesheet" href="/serve-assets.php?file=index-ZtK66PHB.css">
<script src="/serve-assets.php?file=index-iEerSh2Y.js"></script>
```

### 3. Upload Missing Asset Files

Make sure all your asset files actually exist in the assets directory on the server. You can use the provided `scripts/upload-missing-assets.sh` script to check for and upload any missing asset files.

### 4. Verify Correct Asset Extraction

If you're deploying by uploading a zip file, ensure that all assets are properly extracted. Use the provided `scripts/check-assets-extraction.sh` script to verify this.

### 5. Test the Fix

Access your website and check the browser console for any remaining MIME type errors. You can also use the provided `test-assets.html` page to test if assets are loading correctly.

### 6. Verify MIME Types on the Server

Use the provided `scripts/verify-mime-types-on-server.sh` script to verify that MIME types are correctly configured on the server.

## Troubleshooting

If you continue to see MIME type errors after applying these fixes:

1. **Check Server Logs**: Access your hosting control panel and check the server error logs for more details.

2. **Contact Hosting Provider**: Some hosting providers have specific requirements for MIME type configuration. Contact Namecheap support for assistance.

3. **Alternative Method**: If both the `.htaccess` and PHP methods fail, consider using a Node.js server with Express to serve your files with correct MIME types, or consider using a CDN service that handles MIME types correctly.

4. **Check File Permissions**: Ensure that your asset files have the correct read permissions (typically 644).

## Additional Resources

- [Namecheap's .htaccess Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/9313/29/how-to-create-and-use-htaccess-file/)
- [MIME Types Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- [PHP readfile() Documentation](https://www.php.net/manual/en/function.readfile.php)
EOF

echo -e "${GREEN}✅ Documentation created${NC}"
echo

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All MIME type fixes have been created successfully!${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo "To apply these fixes:"
echo "1. Upload the .htaccess file to your server's root directory"
echo "2. Upload the serve-assets.php file to your server's root directory" 
echo "3. Verify that assets directory exists and contains all necessary files"
echo "4. Test your website to ensure all resources load with correct MIME types"
echo
echo "If you need to verify MIME types on the server, run:"
echo "  ./scripts/verify-mime-types-on-server.sh https://www.snakkaz.com"
echo
echo "For more details, see the documentation in docs/FIXING-MIME-TYPE-ISSUES.md"
