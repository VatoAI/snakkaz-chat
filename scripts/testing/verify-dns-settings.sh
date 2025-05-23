#!/bin/bash
# verify-dns-settings.sh
#
# This script checks if the domain is correctly pointing to Namecheap's nameservers
# and verifies that DNS records are properly configured

# Define colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NONE='\033[0m' # No color

echo -e "${BLUE}======================================================${NONE}"
echo -e "${BLUE}      SNAKKAZ DNS CONFIGURATION VERIFICATION          ${NONE}"
echo -e "${BLUE}======================================================${NONE}"
echo

# Domain to check
DOMAIN="snakkaz.com"
EXPECTED_IP="162.0.229.214"
EXPECTED_NS1="dns1.namecheaphosting.com"
EXPECTED_NS2="dns2.namecheaphosting.com"

echo -e "${YELLOW}Verifying DNS configuration for ${DOMAIN}...${NONE}"
echo

# Check if dig command is available
if ! command -v dig &> /dev/null; then
    echo -e "${RED}The 'dig' command is not available. Installing dnsutils...${NONE}"
    apt-get update -qq && apt-get install -y dnsutils > /dev/null
    echo -e "${GREEN}dnsutils installed successfully.${NONE}"
fi

# Check nameservers
echo -e "${YELLOW}Checking nameservers...${NONE}"
NS_RECORDS=$(dig +short NS ${DOMAIN})

echo "Current nameservers for ${DOMAIN}:"
echo "${NS_RECORDS}"
echo

if echo "${NS_RECORDS}" | grep -q "${EXPECTED_NS1}" && echo "${NS_RECORDS}" | grep -q "${EXPECTED_NS2}"; then
    echo -e "${GREEN}✓ Nameservers are correctly set to Namecheap hosting nameservers.${NONE}"
else
    echo -e "${RED}✗ Nameservers are not correctly set to Namecheap hosting nameservers.${NONE}"
    echo -e "${YELLOW}Expected: ${EXPECTED_NS1} and ${EXPECTED_NS2}${NONE}"
    echo -e "${YELLOW}Please update your domain's nameservers at your domain registrar.${NONE}"
fi
echo

# Check A Record
echo -e "${YELLOW}Checking IP address (A record)...${NONE}"
IP_ADDRESS=$(dig +short A ${DOMAIN})
echo "IP address for ${DOMAIN}: ${IP_ADDRESS}"

if [ "${IP_ADDRESS}" = "${EXPECTED_IP}" ]; then
    echo -e "${GREEN}✓ A record is correctly pointing to ${EXPECTED_IP}.${NONE}"
else
    echo -e "${RED}✗ A record is not correctly pointing to ${EXPECTED_IP}.${NONE}"
    echo -e "${YELLOW}Current IP: ${IP_ADDRESS}${NONE}"
fi
echo

# Check www CNAME or A record
echo -e "${YELLOW}Checking www.${DOMAIN}...${NONE}"
WWW_CNAME=$(dig +short CNAME www.${DOMAIN})

if [ -n "${WWW_CNAME}" ]; then
    echo "www.${DOMAIN} is a CNAME pointing to: ${WWW_CNAME}"
    if [ "${WWW_CNAME}" = "${DOMAIN}." ]; then
        echo -e "${GREEN}✓ www CNAME record is correctly configured.${NONE}"
    else
        echo -e "${YELLOW}⚠ www CNAME doesn't point directly to ${DOMAIN}.${NONE}"
    fi
else
    WWW_IP=$(dig +short A www.${DOMAIN})
    echo "www.${DOMAIN} A record: ${WWW_IP}"
    if [ "${WWW_IP}" = "${EXPECTED_IP}" ]; then
        echo -e "${GREEN}✓ www A record is correctly pointing to ${EXPECTED_IP}.${NONE}"
    else
        echo -e "${RED}✗ www record is not correctly configured.${NONE}"
    fi
fi
echo

# Check MX Records
echo -e "${YELLOW}Checking MX records...${NONE}"
MX_RECORDS=$(dig +short MX ${DOMAIN})
echo "MX records for ${DOMAIN}:"
echo "${MX_RECORDS}"

if echo "${MX_RECORDS}" | grep -q "hosting.jellyfish.systems"; then
    echo -e "${GREEN}✓ MX records are correctly configured.${NONE}"
else
    echo -e "${YELLOW}⚠ MX records might not be correctly configured.${NONE}"
fi
echo

# Check if domain responds on HTTP
echo -e "${YELLOW}Checking if website responds to HTTP requests...${NONE}"

if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://${DOMAIN})
    echo "HTTP status code: ${HTTP_STATUS}"
    
    if [ "${HTTP_STATUS}" -ge 200 ] && [ "${HTTP_STATUS}" -lt 400 ]; then
        echo -e "${GREEN}✓ Website is responding on HTTP.${NONE}"
    else
        echo -e "${RED}✗ Website is not responding correctly on HTTP.${NONE}"
    fi
else
    echo -e "${YELLOW}⚠ 'curl' command not found. Skipping HTTP check.${NONE}"
fi
echo

# Check if domain responds on HTTPS
echo -e "${YELLOW}Checking if website responds to HTTPS requests...${NONE}"

if command -v curl &> /dev/null; then
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} 2>/dev/null || echo "Failed")
    echo "HTTPS status code: ${HTTPS_STATUS}"
    
    if [ "${HTTPS_STATUS}" = "Failed" ]; then
        echo -e "${RED}✗ HTTPS connection failed. SSL certificate might not be set up.${NONE}"
        echo -e "${YELLOW}⚠ Please set up SSL certificates using the setup-ssl-certificates.sh guide.${NONE}"
    elif [ "${HTTPS_STATUS}" -ge 200 ] && [ "${HTTPS_STATUS}" -lt 400 ]; then
        echo -e "${GREEN}✓ Website is properly responding on HTTPS.${NONE}"
    else
        echo -e "${RED}✗ Website is not responding correctly on HTTPS.${NONE}"
    fi
else
    echo -e "${YELLOW}⚠ 'curl' command not found. Skipping HTTPS check.${NONE}"
fi
echo

echo -e "${BLUE}======================================================${NONE}"
echo -e "${BLUE}      DNS VERIFICATION COMPLETE                       ${NONE}"
echo -e "${BLUE}======================================================${NONE}"
