#!/bin/bash
# install-ssl-certificates.sh
#
# This script installs SSL certificates for Snakkaz domains and subdomains
# on Namecheap shared hosting using Let's Encrypt

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz SSL Certificate Installer   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if running with root privileges
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run this script as root or with sudo privileges${NC}"
  exit 1
fi

# Check if required tools are installed
command -v certbot >/dev/null 2>&1 || { 
  echo -e "${RED}Error: certbot is not installed. Installing...${NC}"
  apt-get update && apt-get install -y certbot
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install certbot. Please install it manually.${NC}"
    exit 1
  fi
}

# List of domains to include in the certificate
MAIN_DOMAIN="snakkaz.com"
SUBDOMAINS=("www" "dash" "business" "docs" "analytics" "mcp" "help")

# Combine domains for certificate request
DOMAIN_ARGS="-d ${MAIN_DOMAIN}"
for subdomain in "${SUBDOMAINS[@]}"; do
  DOMAIN_ARGS="$DOMAIN_ARGS -d ${subdomain}.${MAIN_DOMAIN}"
done

echo -e "${YELLOW}The following domains will be included in the certificate:${NC}"
echo -e "- ${MAIN_DOMAIN}"
for subdomain in "${SUBDOMAINS[@]}"; do
  echo -e "- ${subdomain}.${MAIN_DOMAIN}"
done
echo

# Ask for confirmation
read -p "Do you want to proceed with certificate installation? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Operation cancelled by user${NC}"
  exit 0
fi

# Ask for FTP credentials for Namecheap hosting
echo -e "${BLUE}Please enter your Namecheap hosting credentials:${NC}"
read -p "FTP Username (e.g., snakkaz@snakkaz.com): " FTP_USER
read -s -p "FTP Password: " FTP_PASS
echo

# Create a temporary configuration file for certbot
CONFIG_DIR=$(mktemp -d)
cat > "${CONFIG_DIR}/certbot.ini" <<EOF
authenticator = webroot
webroot-path = /var/www/html
email = admin@snakkaz.com
agree-tos = True
non-interactive = True
EOF

# Ask user to create a verification directory on the server
echo -e "${YELLOW}Important: Please create a directory named '.well-known/acme-challenge' in your web root directory.${NC}"
echo -e "This can typically be done through your Namecheap cPanel file manager or via FTP."
echo -e "The path should be: public_html/.well-known/acme-challenge"
echo
read -p "Press Enter once you've created the directory..." -n 1 -r
echo

# Run certbot to issue certificate
echo -e "${BLUE}Running certbot to issue certificate...${NC}"
certbot certonly \
  --config "${CONFIG_DIR}/certbot.ini" \
  --cert-name "${MAIN_DOMAIN}" \
  $DOMAIN_ARGS

if [ $? -ne 0 ]; then
  echo -e "${RED}Certificate issuance failed. Please check the error messages above.${NC}"
  rm -rf "${CONFIG_DIR}"
  exit 1
fi

echo -e "${GREEN}Certificate successfully issued!${NC}"

# Export certificates for upload to Namecheap
CERT_DIR="/etc/letsencrypt/live/${MAIN_DOMAIN}"
EXPORT_DIR="/tmp/snakkaz-certs"
mkdir -p "${EXPORT_DIR}"

cp "${CERT_DIR}/cert.pem" "${EXPORT_DIR}/certificate.crt"
cp "${CERT_DIR}/privkey.pem" "${EXPORT_DIR}/private.key"
cp "${CERT_DIR}/chain.pem" "${EXPORT_DIR}/ca_bundle.crt"

echo -e "${GREEN}Certificates exported to ${EXPORT_DIR}${NC}"
echo

# Instructions for uploading to Namecheap
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Login to your Namecheap cPanel"
echo -e "2. Go to SSL/TLS -> SSL/TLS Status"
echo -e "3. Click on 'Manage' for your domain"
echo -e "4. Choose 'Upload a New Certificate'"
echo -e "5. Copy and paste the contents of the following files:"
echo -e "   - Certificate (CRT): ${EXPORT_DIR}/certificate.crt"
echo -e "   - Private Key: ${EXPORT_DIR}/private.key"
echo -e "   - Certificate Authority Bundle: ${EXPORT_DIR}/ca_bundle.crt"
echo
echo -e "6. Click 'Install Certificate'"
echo
echo -e "${YELLOW}Important: After installation, run the check-ssl-certificates.sh script to verify all domains${NC}"

# Clean up
rm -rf "${CONFIG_DIR}"

echo -e "${BLUE}SSL Certificate Installation Completed${NC}"
