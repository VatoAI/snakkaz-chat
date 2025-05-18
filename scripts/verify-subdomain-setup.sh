#!/bin/bash
# verify-subdomain-setup.sh
#
# This script verifies the subdomain setup for Snakkaz on Namecheap

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Subdomain Verification      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check for required tools
for cmd in dig host curl nslookup; do
  if ! command -v $cmd &> /dev/null; then
    echo -e "${RED}Error: $cmd is not installed.${NC}"
    echo -e "Please install it with: apt-get install dnsutils curl"
    exit 1
  fi
done

# List of domains to check
MAIN_DOMAIN="snakkaz.com"
SUBDOMAINS=("www" "dash" "business" "docs" "analytics" "mcp" "help")

# Function to check DNS settings
check_dns() {
  local domain="$1"
  local full_domain="${domain}"
  
  if [ "$domain" != "$MAIN_DOMAIN" ]; then
    full_domain="${domain}.${MAIN_DOMAIN}"
  fi
  
  echo -e "${BLUE}Checking DNS for ${full_domain}:${NC}"
  
  # Get A record
  echo -e "  ${YELLOW}A Record:${NC}"
  dig +short A "$full_domain"
  
  # Get CNAME record if it's a subdomain
  if [ "$domain" != "$MAIN_DOMAIN" ]; then
    echo -e "  ${YELLOW}CNAME Record:${NC}"
    dig +short CNAME "$full_domain"
  fi
  
  # Check if website is reachable
  echo -e "  ${YELLOW}HTTP Status:${NC}"
  http_status=$(curl -s -o /dev/null -w "%{http_code}" "http://${full_domain}")
  if [ "$http_status" == "200" ] || [ "$http_status" == "301" ] || [ "$http_status" == "302" ]; then
    echo -e "    ${GREEN}HTTP: $http_status${NC}"
  else
    echo -e "    ${RED}HTTP: $http_status${NC}"
  fi
  
  echo -e "  ${YELLOW}HTTPS Status:${NC}"
  https_status=$(curl -s -o /dev/null -w "%{http_code}" "https://${full_domain}")
  if [ "$https_status" == "200" ] || [ "$https_status" == "301" ] || [ "$https_status" == "302" ]; then
    echo -e "    ${GREEN}HTTPS: $https_status${NC}"
  else
    echo -e "    ${RED}HTTPS: $https_status${NC}"
  fi
  
  echo
}

# Check main domain
check_dns "$MAIN_DOMAIN"

# Check each subdomain
for subdomain in "${SUBDOMAINS[@]}"; do
  check_dns "$subdomain"
done

# Function to check DNS propagation
check_global_dns() {
  local domain="$MAIN_DOMAIN"
  echo -e "${BLUE}Checking global DNS propagation for ${domain}:${NC}"
  
  # List of DNS servers to check
  DNS_SERVERS=(
    "8.8.8.8"        # Google DNS
    "1.1.1.1"        # Cloudflare DNS
    "208.67.222.222" # OpenDNS
    "9.9.9.9"        # Quad9
  )
  
  for dns in "${DNS_SERVERS[@]}"; do
    echo -e "  ${YELLOW}DNS Server: ${dns}${NC}"
    nslookup "$domain" "$dns" | grep -A2 "Non-authoritative"
    echo
  done
}

# Ask if user wants to check global DNS propagation
echo -e "${BLUE}Do you want to check global DNS propagation? (y/n)${NC}"
read -n1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  check_global_dns
fi

# Function to check website content
check_website_content() {
  local domain="$1"
  local full_domain="${domain}"
  
  if [ "$domain" != "$MAIN_DOMAIN" ]; then
    full_domain="${domain}.${MAIN_DOMAIN}"
  fi
  
  echo -e "${BLUE}Checking website content for ${full_domain}:${NC}"
  
  # Download website content to a temporary file
  local temp_file=$(mktemp)
  curl -s "https://${full_domain}" -o "$temp_file"
  
  # Check if content was downloaded
  if [ -s "$temp_file" ]; then
    # Check for specific content markers for each subdomain
    case "$domain" in
      "$MAIN_DOMAIN"|"www")
        if grep -q "Snakkaz" "$temp_file"; then
          echo -e "  ${GREEN}✓ Main website content found${NC}"
        else
          echo -e "  ${RED}✗ Main website content not found${NC}"
        fi
        ;;
      "dash")
        if grep -q "Dashboard" "$temp_file"; then
          echo -e "  ${GREEN}✓ Dashboard content found${NC}"
        else
          echo -e "  ${RED}✗ Dashboard content not found${NC}"
        fi
        ;;
      "business")
        if grep -q "Business" "$temp_file"; then
          echo -e "  ${GREEN}✓ Business content found${NC}"
        else
          echo -e "  ${RED}✗ Business content not found${NC}"
        fi
        ;;
      "docs")
        if grep -q "Documentation" "$temp_file"; then
          echo -e "  ${GREEN}✓ Documentation content found${NC}"
        else
          echo -e "  ${RED}✗ Documentation content not found${NC}"
        fi
        ;;
      "analytics")
        if grep -q "Analytics" "$temp_file"; then
          echo -e "  ${GREEN}✓ Analytics content found${NC}"
        else
          echo -e "  ${RED}✗ Analytics content not found${NC}"
        fi
        ;;
      "mcp")
        if grep -q "MCP" "$temp_file"; then
          echo -e "  ${GREEN}✓ MCP content found${NC}"
        else
          echo -e "  ${RED}✗ MCP content not found${NC}"
        fi
        ;;
      "help")
        if grep -q "Help" "$temp_file"; then
          echo -e "  ${GREEN}✓ Help content found${NC}"
        else
          echo -e "  ${RED}✗ Help content not found${NC}"
        fi
        ;;
    esac
  else
    echo -e "  ${RED}✗ Could not download content${NC}"
  fi
  
  # Clean up
  rm -f "$temp_file"
  echo
}

# Ask if user wants to check website content
echo -e "${BLUE}Do you want to check website content for all domains? (y/n)${NC}"
read -n1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  check_website_content "$MAIN_DOMAIN"
  for subdomain in "${SUBDOMAINS[@]}"; do
    check_website_content "$subdomain"
  done
fi

echo -e "${BLUE}Subdomain Verification Completed${NC}"
echo
echo -e "${YELLOW}Summary:${NC}"
echo -e "1. Make sure all subdomains have valid DNS entries"
echo -e "2. Ensure all subdomains are accessible via HTTPS"
echo -e "3. Verify that correct content is displayed on each subdomain"
echo -e "4. If any issues were found, refer to configure-namecheap-subdomains.sh for guidance"
echo
