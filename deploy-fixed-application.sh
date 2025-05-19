#!/bin/bash
# deploy-fixed-application.sh
#
# This script deploys the fixed Snakkaz Chat application to your hosting provider
# It uploads the zip file, extracts it to the web root, and verifies the application

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Snakkaz Chat: Fixed App Deployment    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if fixed zip file exists
if [ ! -f "snakkaz-chat-fixed.zip" ]; then
  echo -e "${RED}Error: snakkaz-chat-fixed.zip file not found!${NC}"
  echo "Please make sure the file is in the current directory."
  exit 1
fi

# Deployment Method Selection
echo -e "${YELLOW}Select your deployment method:${NC}"
echo "1) cPanel API Token (Recommended)"
echo "2) FTP Upload"
echo "3) Manual Upload Instructions"
read -p "Enter your choice (1-3): " deploy_method

case $deploy_method in
  1)
    # cPanel API Token Deployment
    echo -e "${CYAN}Deploying using cPanel API Token...${NC}"
    
    # Check for required environment variables
    if [ -z "$CPANEL_USERNAME" ] || [ -z "$CPANEL_API_TOKEN" ] || [ -z "$CPANEL_DOMAIN" ]; then
      echo -e "${YELLOW}cPanel API token credentials not found in environment variables.${NC}"
      read -p "Enter cPanel username: " CPANEL_USERNAME
      read -p "Enter cPanel domain (e.g. premium123.web-hosting.com): " CPANEL_DOMAIN
      read -s -p "Enter cPanel API token: " CPANEL_API_TOKEN
      echo
    fi
    
    # Create temporary directory for extraction
    TEMP_DIR=$(mktemp -d)
    echo -e "${BLUE}Created temporary directory: ${TEMP_DIR}${NC}"
    
    # Extract the zip file to temp directory
    echo -e "${YELLOW}Extracting application files...${NC}"
    unzip -q snakkaz-chat-fixed.zip -d "$TEMP_DIR"
    
    # Upload using cPanel API
    echo -e "${YELLOW}Uploading to web server using cPanel API...${NC}"
    echo -e "${YELLOW}This may take a few minutes depending on your connection speed.${NC}"
    
    # Create a JSON file for the file upload
    UPLOAD_JSON=$(mktemp)
    echo "{\"dir\":\"/public_html\",\"overwrite\":1}" > "$UPLOAD_JSON"
    
    # Create a tar archive to upload
    echo -e "${YELLOW}Creating archive for upload...${NC}"
    tar -czf "$TEMP_DIR/snakkaz-upload.tar.gz" -C "$TEMP_DIR" .
    
    # Upload using cPanel API
    echo -e "${YELLOW}Uploading files to server...${NC}"
    curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
      "https://$CPANEL_DOMAIN:2083/execute/Fileman/upload_files" \
      -F "file=@$TEMP_DIR/snakkaz-upload.tar.gz" \
      -F "dir=/public_html" \
      -F "overwrite=1" \
      -F "extract=1"
    
    # Check if upload was successful
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to upload files using cPanel API.${NC}"
      echo -e "${YELLOW}Please try the FTP upload method instead.${NC}"
      rm -f "$UPLOAD_JSON"
      rm -rf "$TEMP_DIR"
      exit 1
    fi
    
    echo -e "${GREEN}Files uploaded successfully using cPanel API!${NC}"
    
    # Clean up
    rm -f "$UPLOAD_JSON"
    rm -rf "$TEMP_DIR"
    ;;
    
  2)
    # FTP Upload
    echo -e "${CYAN}Deploying using FTP...${NC}"
    
    # Check for required environment variables
    if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
      echo -e "${YELLOW}FTP credentials not found in environment variables.${NC}"
      read -p "Enter FTP host (e.g., server123.namecheaphosting.com): " FTP_HOST
      read -p "Enter FTP username: " FTP_USER
      read -s -p "Enter FTP password: " FTP_PASS
      echo
    fi
    
    # Check for required tools
    if ! command -v curl &> /dev/null; then
      echo -e "${RED}Error: curl is not installed.${NC}"
      exit 1
    fi
    
    if ! command -v lftp &> /dev/null; then
      echo -e "${YELLOW}lftp not found. Attempting to install...${NC}"
      sudo apt-get update && sudo apt-get install -y lftp
      if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install lftp. Please install it manually or use another deployment method.${NC}"
        exit 1
      fi
    fi
    
    # Create temporary directory for extraction
    TEMP_DIR=$(mktemp -d)
    echo -e "${BLUE}Created temporary directory: ${TEMP_DIR}${NC}"
    
    # Extract the zip file to temp directory
    echo -e "${YELLOW}Extracting application files...${NC}"
    unzip -q snakkaz-chat-fixed.zip -d "$TEMP_DIR"
    
    # Upload using lftp (more reliable than standard ftp)
    echo -e "${YELLOW}Uploading files to server via FTP...${NC}"
    echo -e "${YELLOW}This may take a few minutes depending on your connection speed.${NC}"
    
    # Create lftp script
    LFTP_SCRIPT=$(mktemp)
    cat > "$LFTP_SCRIPT" << EOF
open -u "$FTP_USER","$FTP_PASS" "$FTP_HOST"
set ssl:verify-certificate no
mirror -R "$TEMP_DIR" /public_html
quit
EOF

    # Execute lftp script
    lftp -f "$LFTP_SCRIPT"
    
    # Check if upload was successful
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to upload files via FTP.${NC}"
      echo -e "${YELLOW}Please try uploading manually using the instructions below.${NC}"
      rm -f "$LFTP_SCRIPT"
      rm -rf "$TEMP_DIR"
      exit 1
    fi
    
    echo -e "${GREEN}Files uploaded successfully via FTP!${NC}"
    
    # Clean up
    rm -f "$LFTP_SCRIPT"
    rm -rf "$TEMP_DIR"
    ;;
    
  3)
    # Manual Upload Instructions
    echo -e "${CYAN}Manual Upload Instructions:${NC}"
    echo
    echo -e "${YELLOW}Step 1: Access your hosting provider's control panel (cPanel, Plesk, etc.)${NC}"
    echo
    echo -e "${YELLOW}Step 2: Upload the zip file${NC}"
    echo "- Navigate to the File Manager in your control panel"
    echo "- Navigate to the public_html directory"
    echo "- Upload the snakkaz-chat-fixed.zip file"
    echo
    echo -e "${YELLOW}Step 3: Extract the zip file${NC}"
    echo "- Select the zip file in the file manager"
    echo "- Select 'Extract' or 'Unzip' option"
    echo "- Extract to the public_html directory"
    echo "- Make sure to check 'Overwrite existing files' option"
    echo
    echo -e "${YELLOW}Step 4: Verify file permissions${NC}"
    echo "- All directories should have permission 755"
    echo "- All files should have permission 644"
    echo
    echo -e "${YELLOW}Step 5: Create or update .htaccess file${NC}"
    echo "- Check if there's an existing .htaccess file in public_html"
    echo "- If not, create one with the following content:"
    echo
    echo "    # Enable browser caching"
    echo "    <IfModule mod_expires.c>"
    echo "      ExpiresActive On"
    echo "      ExpiresByType image/jpeg \"access plus 1 month\""
    echo "      ExpiresByType image/png \"access plus 1 month\""
    echo "      ExpiresByType text/css \"access plus 1 week\""
    echo "      ExpiresByType application/javascript \"access plus 1 week\""
    echo "      ExpiresByType application/wasm \"access plus 1 year\""
    echo "    </IfModule>"
    echo
    echo "    # Set proper MIME types"
    echo "    AddType application/wasm .wasm"
    echo "    AddType application/javascript .js"
    echo "    AddType text/css .css"
    echo
    echo "    # Handle SPA routing"
    echo "    <IfModule mod_rewrite.c>"
    echo "      RewriteEngine On"
    echo "      RewriteBase /"
    echo "      RewriteRule ^index\.html$ - [L]"
    echo "      RewriteCond %{REQUEST_FILENAME} !-f"
    echo "      RewriteCond %{REQUEST_FILENAME} !-d"
    echo "      RewriteCond %{REQUEST_FILENAME} !-l"
    echo "      RewriteRule . /index.html [L]"
    echo "    </IfModule>"
    echo
    ;;
    
  *)
    echo -e "${RED}Invalid choice. Please run the script again and select a valid option.${NC}"
    exit 1
    ;;
esac

# Verification instructions
echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}    Verification Steps    ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo
echo -e "${CYAN}To verify that the application is working correctly:${NC}"
echo
echo "1. Open your website in a browser (https://www.snakkaz.com)"
echo "2. Check that the login page loads correctly"
echo "3. Try logging in with a test account"
echo "4. Verify that the chat interface loads"
echo "5. Test sending and receiving messages"
echo "6. Check the browser console for any errors (F12 > Console)"
echo
echo -e "${YELLOW}If you encounter any issues:${NC}"
echo "1. Check the browser console for error messages"
echo "2. Verify that the service worker is registered correctly"
echo "3. Check the network tab for any failed requests"
echo "4. Ensure that the Supabase connection is working properly"
echo
echo -e "${GREEN}Deployment process completed!${NC}"
echo -e "${BLUE}=======================================${NC}"
