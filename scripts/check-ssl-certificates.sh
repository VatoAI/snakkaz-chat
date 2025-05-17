#!/bin/bash
# check-ssl-certificates.sh
#
# This script checks SSL certificates for Snakkaz domains and subdomains

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz SSL Certificate Checker     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# List of domains to check
DOMAINS=("snakkaz.com" "www.snakkaz.com" "dash.snakkaz.com" "business.snakkaz.com" "docs.snakkaz.com" "analytics.snakkaz.com" "mcp.snakkaz.com" "help.snakkaz.com")

for domain in "${DOMAINS[@]}"; do
  echo -e "${BLUE}Checking SSL certificate for ${domain}:${NC}"
  
  # Get certificate info
  cert_info=$(echo | openssl s_client -servername "${domain}" -connect "${domain}:443" 2>/dev/null)
  
  # Check if connection was successful
  if [ $? -ne 0 ]; then
    echo -e "  ${RED}Error: Could not connect to ${domain}${NC}"
    echo
    continue
  fi
  
  # Extract certificate information
  subject=$(echo "$cert_info" | openssl x509 -noout -subject 2>/dev/null)
  issuer=$(echo "$cert_info" | openssl x509 -noout -issuer 2>/dev/null)
  san=$(echo "$cert_info" | openssl x509 -noout -text 2>/dev/null | grep -A1 "Subject Alternative Name" | tail -1)
  dates=$(echo "$cert_info" | openssl x509 -noout -dates 2>/dev/null)
  
  # Display information
  if [ -n "$subject" ]; then
    echo -e "  ${GREEN}Subject:${NC} ${subject#subject=}"
    echo -e "  ${GREEN}Issuer:${NC} ${issuer#issuer=}"
    echo -e "  ${GREEN}SAN:${NC} ${san}"
    echo -e "  ${GREEN}Validity:${NC}"
    echo "    ${dates}"
    echo
  else
    echo -e "  ${RED}No valid certificate found${NC}"
    echo
  fi
done

echo -e "${BLUE}SSL Certificate Check Completed${NC}"
