#!/bin/bash
# upload-htaccess-fix.sh
#
# This script adds the .htaccess file to the existing application
# and uploads it to the server for immediate SPA routing fix

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Snakkaz Chat: .htaccess Fix Upload    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if .htaccess file exists
if [ ! -f ".htaccess" ]; then
  echo -e "${RED}Error: .htaccess file not found!${NC}"
  echo "Please make sure the file is in the current directory."
  exit 1
fi

# Check if we have a FTP connection method (simple manual upload if not)
echo -e "${YELLOW}Select your upload method:${NC}"
echo "1) Direct upload of .htaccess only (Recommended)"
echo "2) Include .htaccess in the full zip file"
echo "3) Print instructions for manual upload"
read -p "Enter your choice (1-3): " upload_method

case $upload_method in
  1)
    # Direct upload of .htaccess only
    echo -e "${YELLOW}Uploading .htaccess directly to the server...${NC}"
    echo -e "${YELLOW}Please provide FTP credentials:${NC}"
    read -p "Enter FTP host (e.g. ftp.snakkaz.com): " FTP_HOST
    read -p "Enter FTP username: " FTP_USER
    read -s -p "Enter FTP password: " FTP_PASS
    echo

    # Create a temporary script for lftp
    LFTP_SCRIPT=$(mktemp)
    cat > "$LFTP_SCRIPT" << EOF
open -u "$FTP_USER","$FTP_PASS" "$FTP_HOST"
cd public_html
put .htaccess
chmod 644 .htaccess
bye
EOF

    # Upload using lftp
    if command -v lftp &> /dev/null; then
      lftp -f "$LFTP_SCRIPT"
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ .htaccess file uploaded successfully!${NC}"
      else
        echo -e "${RED}✗ Failed to upload .htaccess file!${NC}"
      fi
    else
      echo -e "${YELLOW}lftp not found. Trying with curl...${NC}"
      curl -T .htaccess -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/public_html/.htaccess"
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ .htaccess file uploaded successfully using curl!${NC}"
      else
        echo -e "${RED}✗ Failed to upload .htaccess file!${NC}"
      fi
    fi

    # Clean up
    rm -f "$LFTP_SCRIPT"
    ;;
    
  2)
    # Include .htaccess in the full zip file
    echo -e "${YELLOW}Adding .htaccess to the zip file and redeploying...${NC}"
    
    # Check if the fixed zip file exists
    if [ ! -f "snakkaz-chat-fixed.zip" ]; then
      echo -e "${RED}Error: snakkaz-chat-fixed.zip file not found!${NC}"
      echo "Please make sure the file is in the current directory."
      exit 1
    fi
    
    # Create a temporary directory
    TEMP_DIR=$(mktemp -d)
    echo -e "${YELLOW}Extracting existing zip file...${NC}"
    unzip -q snakkaz-chat-fixed.zip -d "$TEMP_DIR"
    
    # Copy the .htaccess file to the temp directory
    cp .htaccess "$TEMP_DIR/"
    
    # Create a new zip file with the .htaccess file
    echo -e "${YELLOW}Creating new zip file with .htaccess...${NC}"
    cd "$TEMP_DIR"
    zip -q -r ../snakkaz-chat-fixed-with-htaccess.zip .
    cd - > /dev/null
    
    echo -e "${GREEN}✓ Created snakkaz-chat-fixed-with-htaccess.zip${NC}"
    echo
    echo -e "${YELLOW}Please use this new zip file to deploy the application.${NC}"
    echo "You can use the deploy-fixed-application.sh script to deploy it."
    
    # Clean up
    rm -rf "$TEMP_DIR"
    ;;
    
  3)
    # Print instructions for manual upload
    echo -e "${BLUE}Instructions for manually uploading .htaccess:${NC}"
    echo
    echo "1. Log in to your hosting control panel (cPanel, Plesk, etc.)"
    echo "2. Navigate to the File Manager"
    echo "3. Navigate to the public_html directory"
    echo "4. Look for an existing .htaccess file"
    echo "   - If one exists, download it as a backup"
    echo "   - Then upload the new .htaccess file, overwriting the existing one"
    echo "   - If no file exists, simply upload the new .htaccess file"
    echo "5. Ensure the file has the correct permissions (644)"
    echo "6. Test your website to ensure the routing is working correctly"
    echo
    echo -e "${YELLOW}Note: The .htaccess file name starts with a period, which means${NC}"
    echo -e "${YELLOW}it's a hidden file. Make sure your file manager is set to show${NC}"
    echo -e "${YELLOW}hidden files, or the file might not be visible.${NC}"
    ;;
    
  *)
    echo -e "${RED}Invalid choice. Please run the script again and select a valid option.${NC}"
    exit 1
    ;;
esac

# Provide next steps
echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Next Steps After .htaccess Upload    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "${YELLOW}After the .htaccess file is uploaded:${NC}"
echo 
echo "1. Open a new incognito/private browser window"
echo "2. Navigate to https://www.snakkaz.com"
echo "3. Verify that the authentication interface appears"
echo "4. Try logging in to ensure all features work correctly"
echo 
echo -e "${YELLOW}If problems persist, check the following:${NC}"
echo
echo "1. Service Worker Issues:"
echo "   - Open Developer Tools (F12)"
echo "   - Go to Application tab → Service Workers"
echo "   - Unregister any existing service workers"
echo "   - Reload the page"
echo
echo "2. Check Browser Console for errors:"
echo "   - Open Developer Tools (F12)"
echo "   - Go to Console tab"
echo "   - Look for any JavaScript errors"
echo
echo "3. Clear Browser Cache:"
echo "   - In Chrome: Ctrl+Shift+Delete"
echo "   - In Firefox: Ctrl+Shift+Delete"
echo "   - Select to clear cached images and files"
echo "   - Reload the page"
echo
echo -e "${GREEN}✓ SPA routing fix completed!${NC}"
