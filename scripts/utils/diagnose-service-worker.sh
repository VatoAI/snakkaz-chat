#!/bin/bash
# diagnose-service-worker.sh
#
# This script helps diagnose if service worker issues are causing
# the Snakkaz Chat application routing problems.

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}   Snakkaz Chat: Service Worker Diagnosis   ${NC}"
echo -e "${BLUE}==========================================${NC}"
echo

echo -e "${YELLOW}This script will help you determine if service worker issues${NC}"
echo -e "${YELLOW}are preventing the authentication interface from appearing.${NC}"
echo

# Check if curl is installed
if ! command -v curl &> /dev/null; then
  echo -e "${RED}Error: curl is required but not installed.${NC}"
  echo "Please install curl and try again."
  exit 1
fi

# Function to check if URLs are accessible
check_url() {
  local url=$1
  local description=$2
  
  echo -e "${YELLOW}Checking ${description}...${NC}"
  
  # Try to get the URL with curl
  if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
    echo -e "${GREEN}✓ ${description} is accessible (HTTP 200)${NC}"
    return 0
  else
    echo -e "${RED}✗ ${description} is not accessible${NC}"
    return 1
  fi
}

# Main execution
echo -e "${YELLOW}Step 1: Checking website accessibility${NC}"
if check_url "https://www.snakkaz.com" "Main website"; then
  echo "The website is accessible, but the authentication interface might not be appearing."
  echo
else
  echo "The website is not accessible. This could indicate a more serious issue."
  echo "Please check your hosting configuration and ensure the website is online."
  exit 1
fi

echo -e "${YELLOW}Step 2: Checking for common routing issues${NC}"

# Check if the fix-service-worker.html file is accessible
if check_url "https://www.snakkaz.com/fix-service-worker.html" "Service worker fix page"; then
  echo -e "${YELLOW}The service worker fix page is already uploaded.${NC}"
  echo "You can visit https://www.snakkaz.com/fix-service-worker.html in your browser"
  echo "and click the 'Fix Service Worker Issues' button to resolve potential issues."
  echo
else
  echo -e "${YELLOW}The service worker fix page is not yet uploaded.${NC}"
  echo "Please upload the fix-service-worker.html file to your web server."
  echo
fi

# Check if the .htaccess file appears to be working
echo -e "${YELLOW}Step 3: Testing .htaccess configuration${NC}"
echo "Making a request to a non-existent URL to check if it's properly redirected..."

if curl -s -I "https://www.snakkaz.com/this-page-does-not-exist-testing-routing" | grep -q "200"; then
  echo -e "${GREEN}✓ SPA routing appears to be working correctly!${NC}"
  echo "Non-existent URLs are being redirected to the main application."
  echo "This suggests the .htaccess file is working properly."
  echo
  echo -e "${YELLOW}If the authentication interface still isn't appearing, it's likely a service worker issue.${NC}"
  echo "Please visit https://www.snakkaz.com/fix-service-worker.html to fix it."
else
  echo -e "${RED}✗ SPA routing is not working correctly.${NC}"
  echo "Non-existent URLs are not being redirected to the main application."
  echo "This suggests the .htaccess file is either not present or not working properly."
  echo
  echo -e "${YELLOW}Please ensure the .htaccess file is properly uploaded to your web server.${NC}"
fi

echo
echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}   Diagnosis Complete   ${NC}"
echo -e "${BLUE}==========================================${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo
echo "1. Ensure the .htaccess file is properly uploaded to your web server's public_html directory."
echo "2. Upload the fix-service-worker.html and unregister-sw.js files if they're not already there."
echo "3. Visit https://www.snakkaz.com/fix-service-worker.html in your browser to fix service worker issues."
echo "4. Try accessing https://www.snakkaz.com again in a new private/incognito window."
echo
echo -e "${YELLOW}If problems persist after following these steps, please check:${NC}"
echo " - Server error logs"
echo " - Browser console for any JavaScript errors"
echo " - That your web hosting supports .htaccess files and mod_rewrite"
echo
echo -e "${GREEN}Diagnosis script completed!${NC}"
