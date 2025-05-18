#!/bin/bash
# verify-mime-types.sh
#
# This script checks if the server is correctly serving MIME types for CSS and JS files

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz MIME Type Verifier         ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Function to check MIME type
check_mime_type() {
  local url="$1"
  local expected_mime="$2"
  local file_type="$3"
  
  echo -e "${YELLOW}Checking MIME type for $file_type file: $url${NC}"
  
  # Use curl to get the Content-Type header
  content_type=$(curl -sI "$url" | grep -i "Content-Type:" | tr -d '\r')
  
  if [ -z "$content_type" ]; then
    echo -e "${RED}✗ Failed to retrieve Content-Type header. The file may not exist.${NC}"
    return 1
  fi
  
  echo -e "  Content-Type: $content_type"
  
  if [[ "$content_type" == *"$expected_mime"* ]]; then
    echo -e "${GREEN}✓ Correct MIME type detected${NC}"
    return 0
  else
    echo -e "${RED}✗ Incorrect MIME type. Expected: $expected_mime${NC}"
    return 1
  fi
}

# Check CSS files
check_mime_type "http://www.snakkaz.com/assets/auth-bg.css" "text/css" "CSS"
echo
check_mime_type "http://www.snakkaz.com/assets/index-ZtK66PHB.css" "text/css" "CSS"
echo

# Check JS files
check_mime_type "http://www.snakkaz.com/assets/index-iEerSh2Y.js" "application/javascript" "JavaScript"
echo

# Check if website loads correctly
echo -e "${YELLOW}Attempting to load the main website...${NC}"
status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://www.snakkaz.com")

if [ "$status_code" -eq 200 ]; then
  echo -e "${GREEN}✓ Website returns HTTP 200 OK${NC}"
else
  echo -e "${RED}✗ Website returns HTTP $status_code${NC}"
fi

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   MIME Type Verification Complete    ${NC}"
echo -e "${BLUE}========================================${NC}"

if [[ $status_code -eq 200 ]]; then
  echo -e "\n${GREEN}The website appears to be loading correctly now.${NC}"
  echo -e "${YELLOW}Next steps:${NC}"
  echo -e "1. Check the website in a browser to confirm it loads without errors"
  echo -e "2. Make sure all subdomains are also working correctly"
else
  echo -e "\n${YELLOW}Additional troubleshooting steps:${NC}"
  echo -e "1. Log into cPanel and extract assets.zip manually"
  echo -e "2. Check if mod_mime module is enabled on the server"
  echo -e "3. Contact Namecheap support if issues persist"
fi
