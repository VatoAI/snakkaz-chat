#!/bin/bash
# test-subdomain-status.sh
# 
# This script checks the HTTP status of all Snakkaz subdomains
# to help diagnose the 403 errors mentioned in the migration tasks.

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

# Base domain
DOMAIN="snakkaz.com"

# List of subdomains to check
SUBDOMAINS=("www" "dash" "business" "docs" "analytics" "mcp" "help")

# Function to check HTTP status
check_status() {
    local url="https://$1"
    echo -ne "Checking ${BLUE}$url${NC}... "
    
    # Get HTTP status code with timeout of 5 seconds
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url")
    
    # Check status code and print appropriate message
    if [ "$status_code" == "200" ]; then
        echo -e "${GREEN}OK (200)${NC}"
        return 0
    elif [ "$status_code" == "403" ]; then
        echo -e "${YELLOW}FORBIDDEN (403)${NC}"
        return 1
    elif [ "$status_code" == "000" ]; then
        echo -e "${RED}TIMEOUT or CONNECTION ERROR${NC}"
        return 2
    else
        echo -e "${RED}ERROR ($status_code)${NC}"
        return 3
    fi
}

# Check main domain first
echo -e "${BLUE}Checking main domain...${NC}"
check_status "$DOMAIN"
echo

# Check all subdomains
echo -e "${BLUE}Checking subdomains...${NC}"
TOTAL=${#SUBDOMAINS[@]}
OK_COUNT=0
FORBIDDEN_COUNT=0
ERROR_COUNT=0

for subdomain in "${SUBDOMAINS[@]}"; do
    check_status "${subdomain}.${DOMAIN}"
    result=$?
    
    if [ $result -eq 0 ]; then
        ((OK_COUNT++))
    elif [ $result -eq 1 ]; then
        ((FORBIDDEN_COUNT++))
    else
        ((ERROR_COUNT++))
    fi
done

# Print summary
echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}              SUMMARY                  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total subdomains checked: ${TOTAL}"
echo -e "Status 200 (OK): ${GREEN}${OK_COUNT}${NC}"
echo -e "Status 403 (Forbidden): ${YELLOW}${FORBIDDEN_COUNT}${NC}"
echo -e "Other errors: ${RED}${ERROR_COUNT}${NC}"
echo

# Provide troubleshooting advice if there are 403 errors
if [ $FORBIDDEN_COUNT -gt 0 ]; then
    echo -e "${YELLOW}Troubleshooting 403 Errors:${NC}"
    echo "1. Verify web server configuration for these subdomains"
    echo "2. Check SSL certificate coverage (SAN or wildcard)"
    echo "3. Look for restrictive .htaccess rules or IP restrictions"
    echo "4. Ensure DNS has fully propagated (can take up to 48 hours)"
    echo
    echo "For more details, check: /workspaces/snakkaz-chat/docs/CLOUDFLARE-TO-NAMECHEAP-MIGRATION-STATUS.md"
fi

echo
echo -e "${BLUE}Test completed at: $(date)${NC}"
echo
