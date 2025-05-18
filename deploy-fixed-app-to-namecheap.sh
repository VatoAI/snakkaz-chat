#!/bin/bash
# deploy-fixed-app-to-namecheap.sh
#
# This script builds the app and deploys it to Namecheap,
# ensuring MIME types are correctly configured

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for required environment variables
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
  echo -e "${RED}Error: FTP credentials not set.${NC}"
  echo "Please set the following environment variables:"
  echo "  - FTP_HOST (e.g., server123.namecheaphosting.com)"
  echo "  - FTP_USER (your FTP username)"
  echo "  - FTP_PASS (your FTP password)"
  
  # Prompt for FTP credentials if not set
  read -p "Enter FTP host (e.g., server123.namecheaphosting.com): " FTP_HOST
  read -p "Enter FTP username: " FTP_USER
  read -s -p "Enter FTP password: " FTP_PASS
  echo
  
  if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo -e "${RED}Error: FTP credentials are required.${NC}"
    exit 1
  fi
fi

# Check for required tools
if ! command -v curl &> /dev/null; then
  echo -e "${RED}Error: curl is not installed.${NC}"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo -e "${RED}Error: npm is not installed.${NC}"
  exit 1
fi

# Create a temp directory for FTP uploads
TEMP_DIR=$(mktemp -d)
echo -e "${BLUE}Created temporary directory: ${TEMP_DIR}${NC}"

# Make sure we clean up on exit
trap 'echo "Cleaning up temporary files..."; rm -rf "$TEMP_DIR"' EXIT

# Function to build the application
build_app() {
  echo -e "${BLUE}=============================================${NC}"
  echo -e "${BLUE}  Building Snakkaz Chat application          ${NC}"
  echo -e "${BLUE}=============================================${NC}"
  
  # Build the app
  npm run build
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Build successful!${NC}"
}

# Function to prepare htaccess files
prepare_htaccess() {
  echo -e "${BLUE}=============================================${NC}"
  echo -e "${BLUE}  Preparing .htaccess files                  ${NC}"
  echo -e "${BLUE}=============================================${NC}"
  
  # Copy our MIME types fix to the distribution folder
  cp fix-mime-types.htaccess dist/.htaccess
  
  echo -e "${GREEN}Added MIME type fixes to .htaccess${NC}"
  
  # Add HTTPS redirect rules
  echo "
# Force HTTPS for all connections
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
" >> dist/.htaccess
  
  echo -e "${GREEN}Added HTTPS redirect to .htaccess${NC}"
  
  # Create a test file to verify MIME type fixes
  echo '
console.log("MIME type test successful!");
export const mimeTypeTest = { 
  success: true,
  tested: new Date().toISOString()
};
' > dist/mime-test.js
  
  echo -e "${GREEN}Created mime-test.js to verify MIME type configuration${NC}"
}

# Function to upload files via FTP
upload_via_ftp() {
  echo -e "${BLUE}=============================================${NC}"
  echo -e "${BLUE}  Uploading files to Namecheap via FTP       ${NC}"
  echo -e "${BLUE}=============================================${NC}"
  
  # Create FTP script for .htaccess file (upload first)
  cat > "$TEMP_DIR/ftp_commands.txt" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
pwd
ls
cd public_html
pwd
ls
put dist/.htaccess .htaccess
EOL

  echo -e "${YELLOW}Uploading .htaccess file first...${NC}"
  echo -e "${BLUE}Testing FTP connection first...${NC}"
  ftp -vn $FTP_HOST << EOL
user $FTP_USER $FTP_PASS
pwd
quit
EOL

  ftp -n < "$TEMP_DIR/ftp_commands.txt" > "$TEMP_DIR/ftp_log.txt" 2>&1
  
  # Check if the upload was successful
  if grep -i "error\|failed\|denied" "$TEMP_DIR/ftp_log.txt"; then
    echo -e "${RED}Failed to upload .htaccess file. See log for details.${NC}"
    cat "$TEMP_DIR/ftp_log.txt"
    echo -e "${YELLOW}Trying alternative FTP approach with curl...${NC}"
    
    # Try with curl as an alternative
    curl -v --ftp-create-dirs -T "dist/.htaccess" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/public_html/.htaccess"
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to upload with curl as well. Check your FTP credentials.${NC}"
      echo -e "${YELLOW}Try using a dedicated FTP client like FileZilla to upload the files manually.${NC}"
      exit 1
    fi
  fi
  
  echo -e "${GREEN}Successfully uploaded .htaccess file${NC}"
  
  # Create FTP script for the rest of the files
  cat > "$TEMP_DIR/ftp_commands.txt" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
cd public_html
prompt off
mput dist/*
mput dist/assets/*
EOL

  echo -e "${YELLOW}Uploading application files...${NC}"
  ftp -n < "$TEMP_DIR/ftp_commands.txt" > "$TEMP_DIR/ftp_log.txt" 2>&1
  
  # Check if the upload was successful
  if grep -i "error\|failed" "$TEMP_DIR/ftp_log.txt"; then
    echo -e "${RED}Some files may have failed to upload. See log for details.${NC}"
    cat "$TEMP_DIR/ftp_log.txt"
  else
    echo -e "${GREEN}Successfully uploaded all application files${NC}"
  fi
  
  # Upload assets directory recursively using curl
  echo -e "${YELLOW}Uploading assets directory recursively...${NC}"
  
  # Find all files in the assets directory
  find dist/assets -type f | while read file; do
    # Get the relative path
    relative_path=${file#dist/}
    
    # Create the directory on the server if it doesn't exist
    remote_dir=$(dirname $relative_path)
    
    # Use curl to upload the file
    echo "Uploading $file to $remote_dir"
    curl -s --ftp-create-dirs -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/public_html/$relative_path"
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to upload $file${NC}"
    fi
  done
  
  echo -e "${GREEN}Assets directory upload complete${NC}"
}

# Function to verify the deployment
verify_deployment() {
  echo -e "${BLUE}=============================================${NC}"
  echo -e "${BLUE}  Verifying deployment                       ${NC}"
  echo -e "${BLUE}=============================================${NC}"
  
  # Wait a bit for the changes to propagate
  echo -e "${YELLOW}Waiting for changes to propagate...${NC}"
  sleep 5
  
  # Try to access the site with HTTPS
  echo -e "${YELLOW}Checking for HTTPS redirect...${NC}"
  HTTPS_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -L http://snakkaz.com)
  
  if [ "$HTTPS_CHECK" -eq 301 ] || [ "$HTTPS_CHECK" -eq 302 ]; then
    echo -e "${GREEN}HTTPS redirect is working!${NC}"
  else
    echo -e "${YELLOW}HTTPS redirect may not be working yet. Status code: $HTTPS_CHECK${NC}"
    echo "This may take some time to propagate."
  fi
  
  # Check for MIME type fix
  echo -e "${YELLOW}Checking MIME type configuration...${NC}"
  MIME_CHECK=$(curl -s -I http://snakkaz.com/mime-test.js | grep -i "Content-Type")
  
  if [[ "$MIME_CHECK" == *"application/javascript"* ]] || [[ "$MIME_CHECK" == *"text/javascript"* ]]; then
    echo -e "${GREEN}MIME type configuration is correct!${NC}"
  else
    echo -e "${YELLOW}MIME type configuration may not be correct yet.${NC}"
    echo "Content-Type header: $MIME_CHECK"
    echo "This may take some time to propagate."
  fi
  
  echo -e "${GREEN}Deployment verification checks complete${NC}"
}

# Main execution
echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  Deploying Fixed Snakkaz Chat to Namecheap  ${NC}"
echo -e "${BLUE}=============================================${NC}"
echo

# Build the app
build_app

# Prepare htaccess
prepare_htaccess

# Upload via FTP
upload_via_ftp

# Verify deployment
verify_deployment

echo
echo -e "${BLUE}=============================================${NC}"
echo -e "${GREEN}  Deployment Complete!                      ${NC}"
echo -e "${BLUE}=============================================${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit https://snakkaz.com to verify the site is working"
echo "2. Check browser console for any remaining errors"
echo "3. Verify that the Multiple GoTrueClient warning is gone"
echo "4. Verify that all assets are loading correctly"
echo
echo -e "${BLUE}If issues persist, refer to the docs/FIXES-SUMMARY-MAY-18-2025.md file${NC}"
