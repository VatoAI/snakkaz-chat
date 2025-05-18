#!/bin/bash
# check-assets-extraction.sh
#
# This script checks if assets were properly extracted on the server

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Assets Extraction Checker   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo -e "${RED}Error: .env file not found.${NC}"
  exit 1
fi

# Check if assets.zip exists
echo -e "${YELLOW}Checking if assets.zip exists on server...${NC}"
ASSETS_ZIP_EXISTS=$(curl -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/" | grep "assets.zip")

if [ -n "$ASSETS_ZIP_EXISTS" ]; then
  echo -e "${GREEN}✓ assets.zip exists on server${NC}"
else
  echo -e "${RED}✗ assets.zip not found on server. It may have been deleted after extraction or never uploaded.${NC}"
fi

# Check if assets directory exists
echo -e "${YELLOW}Checking if assets directory exists...${NC}"
ASSETS_DIR_EXISTS=$(curl -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/" | grep "assets$")

if [ -n "$ASSETS_DIR_EXISTS" ]; then
  echo -e "${GREEN}✓ assets directory exists${NC}"
else
  echo -e "${RED}✗ assets directory not found. The zip file may not have been extracted.${NC}"
  echo -e "${YELLOW}Attempting to upload individual asset files...${NC}"
  
  # Upload CSS files
  for css_file in dist/assets/*.css; do
    filename=$(basename "$css_file")
    echo -e "  Uploading $filename..."
    curl -s -T "$css_file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/$filename"
  done
  
  # Upload JS files
  for js_file in dist/assets/*.js; do
    filename=$(basename "$js_file")
    echo -e "  Uploading $filename..."
    curl -s -T "$js_file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/$filename"
  done
  
  echo -e "${GREEN}✓ Asset files manually uploaded${NC}"
fi

# Check specific files that were in the error message
echo -e "${YELLOW}Checking specific files mentioned in error messages...${NC}"

# List of files to check
FILES_TO_CHECK=(
  "assets/auth-bg.css"
  "assets/index-ZtK66PHB.css"
  "assets/index-iEerSh2Y.js"
)

for file in "${FILES_TO_CHECK[@]}"; do
  echo -e "  Checking $file..."
  FILE_EXISTS=$(curl -s --head --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$file" | head -n 1)
  
  if [[ "$FILE_EXISTS" == *"213"* ]]; then
    echo -e "    ${GREEN}✓ File exists${NC}"
  else
    echo -e "    ${RED}✗ File not found${NC}"
    
    # Try to upload the file if it's missing
    local_file="dist/$file"
    if [ -f "$local_file" ]; then
      echo -e "    Uploading $file..."
      curl -s -T "$local_file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$file"
      echo -e "    ${GREEN}✓ File uploaded${NC}"
    else
      echo -e "    ${RED}✗ File not found locally either${NC}"
    fi
  fi
done

# Create or update .htaccess file with correct MIME types
echo -e "${YELLOW}Creating/updating .htaccess file with correct MIME types...${NC}"

cat > /tmp/mime_htaccess << 'EOL'
# MIME Type Configuration
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
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
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType font/woff .woff
    AddType font/woff2 .woff2
    
    # Web App Manifest
    AddType application/manifest+json .webmanifest
    AddType application/manifest+json .manifest
    
    # Other
    AddType text/html .html .htm
    AddType text/plain .txt
    AddType text/xml .xml
</IfModule>
EOL

curl -s -T "/tmp/mime_htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/.htaccess"
echo -e "${GREEN}✓ MIME type .htaccess created in assets directory${NC}"

# Update main .htaccess with proper MIME types if it doesn't already have them
echo -e "${YELLOW}Updating main .htaccess with MIME types...${NC}"
MAIN_HTACCESS=$(curl -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/.htaccess")

if [[ "$MAIN_HTACCESS" != *"AddType application/javascript"* ]]; then
  echo -e "  Main .htaccess needs updating with MIME types"
  
  # Create temporary file with updated .htaccess
  cat > /tmp/main_htaccess << 'EOL'
# Main .htaccess file for Snakkaz Chat
# This configuration handles routing for a React SPA on Namecheap hosting

# Enable rewrite engine
RewriteEngine On

# Ensure correct MIME types are served
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
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
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType font/woff .woff
    AddType font/woff2 .woff2
    
    # Web App Manifest
    AddType application/manifest+json .webmanifest
    AddType application/manifest+json .manifest
</IfModule>

# Set security headers
<IfModule mod_headers.c>
    # Enable HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Prevent XSS attacks
    Header always set X-XSS-Protection "1; mode=block"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Referrer policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy (derived from cspConfig.ts)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co; connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com mcp.snakkaz.com help.snakkaz.com cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in; font-src 'self' data:; media-src 'self' blob:; worker-src 'self' blob:; object-src 'none'; frame-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'self';"
    
    # Permissions policy
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
</IfModule>

# Force file types to be downloaded rather than displayed in browser
<FilesMatch "\.(?i:pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|tar|gz|mp3|mp4|mov|avi)$">
    Header set Content-Disposition attachment
</FilesMatch>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json application/xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/x-javascript "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
    ExpiresDefault "access plus 1 week"
</IfModule>

# Redirect HTTP to HTTPS (once SSL is configured)
# Uncomment the following lines after SSL is set up
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle subdomains
RewriteCond %{HTTP_HOST} ^dash\.snakkaz\.com$ [NC]
RewriteRule ^(.*)$ /dash/$1 [L]

RewriteCond %{HTTP_HOST} ^business\.snakkaz\.com$ [NC]
RewriteRule ^(.*)$ /business/$1 [L]

RewriteCond %{HTTP_HOST} ^docs\.snakkaz\.com$ [NC]
RewriteRule ^(.*)$ /docs/$1 [L]

RewriteCond %{HTTP_HOST} ^analytics\.snakkaz\.com$ [NC]
RewriteRule ^(.*)$ /analytics/$1 [L]

RewriteCond %{HTTP_HOST} ^mcp\.snakkaz\.com$ [NC]
RewriteRule ^(.*)$ /mcp/$1 [L]

RewriteCond %{HTTP_HOST} ^help\.snakkaz\.com$ [NC]
RewriteRule ^(.*)$ /help/$1 [L]

# SPA routing - send all requests to index.html except for actual files/directories
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
EOL

  # Upload the updated .htaccess file
  curl -s -T "/tmp/main_htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/.htaccess"
  echo -e "${GREEN}✓ Main .htaccess updated with MIME types${NC}"
else
  echo -e "${GREEN}✓ Main .htaccess already contains MIME type definitions${NC}"
fi

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Assets verification completed!${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Check if the website loads correctly now"
echo -e "2. If issues persist, you may need to extract assets.zip manually through cPanel"
echo -e "3. Verify that the updated .htaccess file is working by checking file MIME types"
