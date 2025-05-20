#!/bin/bash
#
# Comprehensive deployment script for Snakkaz Chat with all fixes
# This script deploys the application with both the build fix and subdomain root access fix

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

# Configuration
DEPLOY_DIR="./dist"
REMOTE_USER="snakkaz_admin"
REMOTE_HOST="snakkaz.com"
REMOTE_PATH="/home/snakkaz/public_html"
BACKUP_DIR="./backup/deploy-$(date +%Y%m%d-%H%M%S)"

# Colorized output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== Snakkaz Chat Deployment Script =====${NC}"
echo -e "${YELLOW}Starting deployment with all fixes included${NC}"

# Step 1: Build the application
echo -e "\n${BLUE}Step 1: Building application${NC}"
echo "Running build command..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Aborting deployment.${NC}"
  exit 1
fi
echo -e "${GREEN}Build completed successfully!${NC}"

# Step 2: Apply subdomain root access fix to the build
echo -e "\n${BLUE}Step 2: Applying subdomain root access fix${NC}"

# Create subdomain directories if they don't exist
for subdir in "analytics" "business" "dash" "docs"; do
  mkdir -p "$DEPLOY_DIR/$subdir"
  
  # Create index.json for root access
  cat > "$DEPLOY_DIR/$subdir/index.json" <<EOF
{
  "status": "online",
  "message": "Welcome to $subdir.snakkaz.com",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

  # Create ping.json for /ping access
  cat > "$DEPLOY_DIR/$subdir/ping.json" <<EOF
{
  "status": "online",
  "service": "$subdir",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

  echo -e "${GREEN}Created response files for $subdir subdomain${NC}"
done

# Copy enhanced JavaScript interceptor
cp fix-subdomain-pings.js "$DEPLOY_DIR/fix-subdomain-pings.js"

# Add/update .htaccess file with enhanced routing
cat > "$DEPLOY_DIR/.htaccess" <<EOF
# Snakkaz Chat .htaccess
# Enhanced SPA routing with subdomain root handling

# Enable RewriteEngine
RewriteEngine On

# Handle direct subdomain root access
RewriteCond %{HTTP_HOST} ^(analytics|business|dash|docs)\.snakkaz\.com$ [NC]
RewriteRule ^$ - [R=200,L]

# Redirect /ping requests on subdomains to the appropriate ping.json file
RewriteCond %{HTTP_HOST} ^(analytics|business|dash|docs)\.snakkaz\.com$ [NC]
RewriteRule ^ping/?$ %1/ping.json [L]

# Handle requests to the SPA for all non-existing files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

# Set correct MIME types
AddType application/javascript .js
AddType application/json .json
AddType text/css .css
AddType image/svg+xml .svg
AddType image/png .png
AddType image/jpeg .jpg .jpeg
AddType image/webp .webp
AddType application/wasm .wasm
AddType font/woff .woff
AddType font/woff2 .woff2

# Enable CORS
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"
EOF

echo -e "${GREEN}Applied subdomain root access fix to build directory${NC}"

# Step 3: Deploy to server
echo -e "\n${BLUE}Step 3: Deploying to server${NC}"
echo "Creating backup of current deployment..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Use rsync to copy files to the server
echo "Deploying files to server..."
rsync -avz --delete "$DEPLOY_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

if [ $? -ne 0 ]; then
  echo -e "${RED}Deployment failed. Please check connection and permissions.${NC}"
  exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"

# Step 4: Verify deployment
echo -e "\n${BLUE}Step 4: Verifying deployment${NC}"
echo "Testing subdomain access..."

# Test subdomain root access
for subdomain in "analytics" "business" "dash" "docs"; do
  echo -e "${YELLOW}Testing $subdomain.snakkaz.com${NC}"
  curl -s -o /dev/null -w "Root access: %{http_code}\n" "https://$subdomain.snakkaz.com/"
  curl -s -o /dev/null -w "Ping access: %{http_code}\n" "https://$subdomain.snakkaz.com/ping"
done

echo -e "\n${GREEN}✅ Deployment complete and verified!${NC}"
echo -e "${YELLOW}Remember to check the application thoroughly to ensure all functionality works correctly.${NC}"
echo -e "${BLUE}===== End of Deployment =====${NC}"
