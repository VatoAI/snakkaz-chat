#!/bin/bash
# setup-ssl-certificates.sh
#
# This script provides guidance and commands for setting up SSL certificates
# for the Snakkaz domains on Namecheap hosting

# Define colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NONE='\033[0m' # No color

echo -e "${BLUE}========================================${NONE}"
echo -e "${BLUE}  SNAKKAZ SSL CERTIFICATE SETUP GUIDE   ${NONE}"
echo -e "${BLUE}========================================${NONE}"
echo

echo -e "${YELLOW}The screenshots show that your domains are missing SSL certificates.${NONE}"
echo -e "SSL certificates are essential for:"
echo -e "  1. Secure HTTPS connections"
echo -e "  2. Preventing browser warnings"
echo -e "  3. Better search engine rankings"
echo -e "  4. Required for many browser APIs"
echo

echo -e "${YELLOW}Steps to set up SSL certificates in cPanel:${NONE}"
echo -e "1. Log in to your Namecheap cPanel"
echo -e "2. Navigate to 'Security' > 'SSL/TLS Status'"
echo -e "3. Click on 'Run AutoSSL' button to automatically install certificates"
echo -e "   This usually covers your main domain and all subdomains"
echo -e "4. If AutoSSL doesn't work, go to 'Security' > 'SSL/TLS' > 'Certificate Manager'"
echo -e "   and request a certificate for each domain manually"
echo
echo -e "${YELLOW}For manual SSL setup (if needed):${NONE}"
echo -e "1. Go to 'Security' > 'SSL/TLS' > 'Manage SSL Sites'"
echo -e "2. Select your domain from the dropdown"
echo -e "3. If certificates are already generated, install them"
echo -e "4. If not, go back to 'Certificate Manager' and create certificates first"
echo

echo -e "${GREEN}Once SSL is set up:${NONE}"
echo -e "1. Test your site with https://www.ssllabs.com/ssltest/"
echo -e "2. Make sure all resources load over HTTPS"
echo -e "3. Update any hardcoded HTTP URLs in your code to HTTPS"
echo

echo -e "${YELLOW}Current domains needing SSL:${NONE}"
echo -e " - snakkaz.com (IP: 162.0.229.214)"
echo -e " - www.snakkaz.com (CNAME → snakkaz.com)"
echo -e " - analytics.snakkaz.com"
echo -e " - dash.snakkaz.com"
echo -e " - business.snakkaz.com"
echo -e " - docs.snakkaz.com"
echo -e " - cpanel.snakkaz.com"
echo -e " - cpcalendars.snakkaz.com"
echo -e " - cpcontacts.snakkaz.com"
echo

echo -e "${BLUE}Server Information:${NONE}"
echo -e "Server Hostname: premium123.web-hosting.com"
echo -e "Server IP: 162.0.229.214"
echo -e "Nameservers: dns1.namecheaphosting.com and dns2.namecheaphosting.com"
echo -e "Hosting Plan: Namecheap Stellar Plus (expires May 16, 2026)"
echo -e " - dash.snakkaz.com"
echo -e " - business.snakkaz.com"
echo -e " - docs.snakkaz.com"
echo -e " - autodiscover.snakkaz.com"
echo -e " - mail.snakkaz.com"
echo -e " - cpanel.snakkaz.com"
echo -e " - cpcalendars.snakkaz.com"
echo -e " - cpcontacts.snakkaz.com"
echo -e " - and any other subdomains you wish to use"
echo

echo -e "${BLUE}NOTE:${NONE} After setting up SSL, you should update your Content Security Policy"
echo -e "in index.html to use https:// URLs instead of http:// URLs"
