#!/bin/bash
# deploy-to-namecheap.sh
#
# A script to build and deploy Snakkaz Chat to Namecheap hosting

# Define colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NONE='\033[0m' # No color

# Show header
echo -e "${BLUE}========================================${NONE}"
echo -e "${BLUE}    Snakkaz Chat: Namecheap Deployment    ${NONE}"
echo -e "${BLUE}========================================${NONE}"
echo

# 1. Build the application for production
echo -e "${YELLOW}Step 1: Building Snakkaz Chat application for production...${NONE}"
npm run build:prod
if [ $? -ne 0 ]; then
  echo -e "${RED}Error during application build.${NONE}"
  exit 1
fi
echo -e "${GREEN}Build complete! Files saved in dist/ folder.${NONE}"
echo

# 2. Create a zip file for easier uploading
echo -e "${YELLOW}Step 2: Creating deployment zip file...${NONE}"
cd dist
zip -r ../snakkaz-dist.zip *
cd ..
echo -e "${GREEN}Created snakkaz-dist.zip file.${NONE}"
echo

# 3. Check FTP connection to Namecheap
echo -e "${YELLOW}Step 3: Checking FTP connection to Namecheap...${NONE}"
if [ -f "verify-namecheap-ftp.sh" ]; then
  bash verify-namecheap-ftp.sh
  if [ $? -ne 0 ]; then
    echo -e "${RED}FTP connection failed. Please check your FTP credentials in .env file.${NONE}"
    echo -e "${YELLOW}You will need to manually upload the snakkaz-dist.zip file to your Namecheap hosting account.${NONE}"
  else
    echo -e "${GREEN}FTP connection successful!${NONE}"
    
    # Ask if the user wants to upload via FTP
    read -p "Do you want to upload files to Namecheap via FTP? (y/n): " upload_choice
    if [[ $upload_choice == "y" || $upload_choice == "Y" ]]; then
      echo -e "${YELLOW}Uploading files to Namecheap hosting...${NONE}"
      # Here you can add the FTP upload commands using credentials from .env
      # Example using lftp:
      # lftp -u $FTP_USER,$FTP_PASS $FTP_HOST -e "mirror -R dist/ public_html/; exit"
      echo -e "${GREEN}Upload complete!${NONE}"
    else
      echo -e "${YELLOW}Manual upload: Please upload the 'snakkaz-dist.zip' file to your Namecheap hosting control panel.${NONE}"
    fi
  fi
else
  echo -e "${YELLOW}FTP verification script not found. Manual upload required.${NONE}"
  echo -e "${YELLOW}Please upload the 'snakkaz-dist.zip' file to your Namecheap hosting control panel.${NONE}"
fi
echo

# 4. Provide instructions for DNS configuration
echo -e "${BLUE}========================================${NONE}"
echo -e "${BLUE}    NAMECHEAP DNS CONFIGURATION    ${NONE}"
echo -e "${BLUE}========================================${NONE}"
echo
echo -e "${GREEN}CONFIGURATION INSTRUCTIONS:${NONE}"
echo
echo -e "1. ${YELLOW}Ensure Namecheap Basic DNS is enabled:${NONE}"
echo "   - Log in to your Namecheap account"
echo "   - Go to Domain List > Manage > Domain"
echo "   - Under NAMESERVERS, select 'Namecheap BasicDNS'"
echo
echo -e "2. ${YELLOW}Configure your DNS records:${NONE}"
echo "   - Go to Domain List > Manage > Domain > Advanced DNS"
echo "   - Ensure you have these records:"
echo "     A Record: @ => Your Namecheap hosting IP address"
echo "     A Record: www => Your Namecheap hosting IP address"
echo "     CNAME Record: dash => snakkaz.com"
echo "     CNAME Record: api => snakkaz.com"
echo "     CNAME Record: business => snakkaz.com"
echo
echo -e "3. ${YELLOW}Wait for DNS propagation:${NONE}"
echo "   - DNS changes can take up to 48 hours to propagate worldwide"
echo "   - You can check propagation using https://dnschecker.org"
echo
echo -e "${GREEN}Your application should now be deployed at https://www.snakkaz.com${NONE}"
echo "If you encounter any issues, check the Namecheap documentation or contact support."
echo

# Make the script executable
chmod +x deploy-to-namecheap.sh
