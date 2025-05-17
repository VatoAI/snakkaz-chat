#!/bin/bash
# check-dns-records.sh
#
# This script checks DNS records for Snakkaz domains and subdomains

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz DNS Records Checker         ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if dig command is available
if ! command -v dig &> /dev/null; then
    echo -e "${RED}Error: dig command not found. Please install dnsutils:${NC}"
    echo -e "sudo apt-get update && sudo apt-get install -y dnsutils"
    exit 1
fi

# List of domains to check
DOMAINS=("snakkaz.com" "www.snakkaz.com" "dash.snakkaz.com" "business.snakkaz.com" "docs.snakkaz.com" "analytics.snakkaz.com" "mcp.snakkaz.com" "help.snakkaz.com")

for domain in "${DOMAINS[@]}"; do
  echo -e "${BLUE}Checking DNS records for ${domain}:${NC}"
  
  # Check A records
  echo -e "  ${YELLOW}A Records:${NC}"
  dig +short A "${domain}"
  
  # Check CNAME records
  echo -e "  ${YELLOW}CNAME Records:${NC}"
  dig +short CNAME "${domain}"
  
  # Check MX records
  echo -e "  ${YELLOW}MX Records:${NC}"
  dig +short MX "${domain}"
  
  # Check TXT records
  echo -e "  ${YELLOW}TXT Records:${NC}"
  dig +short TXT "${domain}"
  
  echo
done

echo -e "${BLUE}DNS Records Check Completed${NC}"
