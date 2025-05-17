#!/bin/bash
# check-subdomain-status.sh
#
# This script checks HTTP status for Snakkaz domains and subdomains

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Subdomain Status Checker    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# List of domains to check
DOMAINS=("snakkaz.com" "www.snakkaz.com" "dash.snakkaz.com" "business.snakkaz.com" "docs.snakkaz.com" "analytics.snakkaz.com" "mcp.snakkaz.com" "help.snakkaz.com")

for domain in "${DOMAINS[@]}"; do
  echo -e "${BLUE}Checking status for ${domain}:${NC}"
  
  # Check HTTP status
  http_status=$(curl -s -o /dev/null -w "%{http_code}" "https://${domain}")
  
  # Check if connection was successful
  if [ "$http_status" == "000" ]; then
    echo -e "  ${RED}Error: Could not connect to ${domain}${NC}"
  elif [ "$http_status" == "200" ]; then
    echo -e "  ${GREEN}Status: ${http_status} OK${NC}"
  elif [ "$http_status" == "301" ] || [ "$http_status" == "302" ]; then
    redirect=$(curl -s -I "https://${domain}" | grep -i "location:" | awk '{print $2}')
    echo -e "  ${YELLOW}Status: ${http_status} Redirect${NC}"
    echo -e "  ${YELLOW}Redirects to: ${redirect}${NC}"
  elif [ "$http_status" == "403" ]; then
    echo -e "  ${RED}Status: ${http_status} Forbidden${NC}"
    echo -e "  ${YELLOW}This could be due to web server configuration or .htaccess rules${NC}"
  elif [ "$http_status" == "404" ]; then
    echo -e "  ${RED}Status: ${http_status} Not Found${NC}"
  else
    echo -e "  ${YELLOW}Status: ${http_status}${NC}"
  fi
  
  echo
done

echo -e "${BLUE}Subdomain Status Check Completed${NC}"
