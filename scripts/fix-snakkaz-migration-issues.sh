#!/bin/bash
# fix-snakkaz-migration-issues.sh
#
# This script fixes common issues with the Snakkaz Chat migration to Namecheap
# It addresses asset loading issues, MIME type problems, and extracts assets.zip

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Migration Issue Fixer       ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo -e "${RED}Error: .env file not found.${NC}"
  exit 1
fi

# Function to check if a directory exists on the server
check_directory_exists() {
  local dir="$1"
  local exists=$(curl -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/" | grep "$dir$")
  
  if [ -n "$exists" ]; then
    return 0  # Directory exists
  else
    return 1  # Directory does not exist
  fi
}

# Function to create a directory if it doesn't exist
create_directory_if_not_exists() {
  local dir="$1"
  
  if check_directory_exists "$dir"; then
    echo -e "  ${GREEN}✓ Directory $dir already exists${NC}"
  else
    echo -e "  ${YELLOW}Creating directory $dir...${NC}"
    curl -s --ftp-create-dirs --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$dir/" -Q "MKD $FTP_REMOTE_DIR/$dir"
    echo -e "  ${GREEN}✓ Directory $dir created${NC}"
  fi
}

# Step 1: Check and create assets directory
echo -e "${YELLOW}Step 1: Checking and creating assets directory...${NC}"
create_directory_if_not_exists "assets"
echo

# Step 2: Check if assets.zip exists and upload if needed
echo -e "${YELLOW}Step 2: Checking assets.zip...${NC}"
ASSETS_ZIP_EXISTS=$(curl -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/" | grep "assets.zip")

if [ -n "$ASSETS_ZIP_EXISTS" ]; then
  echo -e "  ${GREEN}✓ assets.zip exists on server${NC}"
else
  echo -e "  ${RED}✗ assets.zip not found on server${NC}"
  
  # Check if we have assets.zip locally
  if [ -f "dist/assets.zip" ]; then
    echo -e "  ${YELLOW}Uploading assets.zip...${NC}"
    curl -s -T "dist/assets.zip" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets.zip"
    echo -e "  ${GREEN}✓ assets.zip uploaded${NC}"
  else
    # Create assets.zip if it doesn't exist
    echo -e "  ${YELLOW}Creating assets.zip...${NC}"
    cd dist
    zip -r assets.zip assets/
    cd ..
    
    echo -e "  ${YELLOW}Uploading newly created assets.zip...${NC}"
    curl -s -T "dist/assets.zip" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets.zip"
    echo -e "  ${GREEN}✓ assets.zip uploaded${NC}"
  fi
fi
echo

# Step 3: Upload individual files mentioned in error messages
echo -e "${YELLOW}Step 3: Uploading individual asset files...${NC}"

# List of important files to check and upload
IMPORTANT_FILES=(
  "assets/auth-bg.css"
  "assets/index-ZtK66PHB.css"
  "assets/index-iEerSh2Y.js"
  "assets/index-BrP4NlT6.js"
  "assets/index-CDM4-srC.js"
  "assets/index-DRlBkaN6.js"
  "assets/index-ZZdeBv8i.js"
  "assets/index-BdQq_4o_.js"
)

for file in "${IMPORTANT_FILES[@]}"; do
  echo -e "  ${YELLOW}Checking and uploading $file...${NC}"
  
  # Upload the file regardless of whether it exists or not (will overwrite if it does)
  local_file="dist/$file"
  if [ -f "$local_file" ]; then
    # Create parent directory if needed
    parent_dir=$(dirname "$file")
    create_directory_if_not_exists "$parent_dir"
    
    # Upload the file
    curl -s -T "$local_file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$file"
    echo -e "  ${GREEN}✓ File $file uploaded${NC}"
  else
    echo -e "  ${RED}✗ File $local_file not found locally${NC}"
  fi
done
echo

# Step 4: Create .htaccess files with proper MIME types
echo -e "${YELLOW}Step 4: Creating/updating .htaccess files with correct MIME types...${NC}"

# Create .htaccess for assets directory
echo -e "  ${YELLOW}Creating .htaccess for assets directory...${NC}"
cat > /tmp/assets_htaccess << 'EOL'
# MIME Type Configuration for assets directory
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

# Force files to be loaded as their correct MIME type regardless of server config
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>

# Enable CORS for asset files
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
</IfModule>
EOL

curl -s -T "/tmp/assets_htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/.htaccess"
echo -e "  ${GREEN}✓ MIME type .htaccess created in assets directory${NC}"

# Update main .htaccess
echo -e "  ${YELLOW}Updating main .htaccess with enhanced MIME types...${NC}"
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

# Force files to be loaded as their correct MIME type regardless of server config
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>

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

curl -s -T "/tmp/main_htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/.htaccess"
echo -e "  ${GREEN}✓ Main .htaccess updated with enhanced MIME types${NC}"
echo

# Step 5: Create instructions for extracting assets.zip through cPanel
echo -e "${YELLOW}Step 5: Creating instructions for manual extraction...${NC}"
cat > manual_extraction_instructions.txt << 'EOL'
Manual Extraction Instructions for assets.zip
=============================================

If the assets are still not loading correctly, follow these steps to
manually extract assets.zip through cPanel:

1. Log in to Namecheap cPanel
2. Click on "File Manager"
3. Navigate to the "public_html" directory
4. Find "assets.zip" in the file list
5. Right-click on "assets.zip" and select "Extract"
6. In the dialog that appears, ensure extraction path is set to "public_html"
7. Click "Extract Files" or "Extract" button
8. Wait for the extraction to complete
9. Verify that an "assets" folder now appears in the file list
10. Check that the assets folder contains CSS and JS files

After extraction, check the website again to see if the assets load correctly.
If issues persist, contact your hosting provider for assistance.
EOL

echo -e "${GREEN}✓ Manual extraction instructions created in 'manual_extraction_instructions.txt'${NC}"
echo

# Step 6: Upload all remaining assets
echo -e "${YELLOW}Step 6: Uploading all remaining assets files...${NC}"

if [ -d "dist/assets" ]; then
  echo -e "  ${YELLOW}Found assets directory in dist, checking file count...${NC}"
  ASSET_COUNT=$(find dist/assets -type f | wc -l)
  echo -e "  Found $ASSET_COUNT asset files to upload"
  
  if [ "$ASSET_COUNT" -gt 0 ]; then
    echo -e "  ${YELLOW}Uploading all asset files...${NC}"
    
    # Upload JS files
    find dist/assets -name "*.js" -type f | while read -r file; do
      rel_path=${file#dist/}
      filename=$(basename "$file")
      echo -e "  Uploading $rel_path..."
      curl -s -T "$file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$rel_path"
    done
    
    # Upload CSS files
    find dist/assets -name "*.css" -type f | while read -r file; do
      rel_path=${file#dist/}
      filename=$(basename "$file")
      echo -e "  Uploading $rel_path..."
      curl -s -T "$file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$rel_path"
    done
    
    echo -e "  ${GREEN}✓ All asset files uploaded${NC}"
  else
    echo -e "  ${RED}✗ No asset files found in dist/assets${NC}"
  fi
else
  echo -e "  ${RED}✗ dist/assets directory not found${NC}"
fi
echo

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   Migration Issue Fixes Completed     ${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Check the website in a browser to confirm it loads without errors"
echo -e "2. If issues persist, follow the manual extraction instructions in 'manual_extraction_instructions.txt'"
echo -e "3. Verify that all subdomains are also working correctly"
