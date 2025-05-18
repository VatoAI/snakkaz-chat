#!/bin/bash
# configure-ssl-namecheap.sh
#
# This script assists with configuring SSL certificates on Namecheap hosting

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Namecheap SSL Certificate Setup     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: This script must be run from the root directory of the Snakkaz Chat project${NC}"
  echo "Navigate to the root directory and try again."
  exit 1
fi

# Source environment variables if .env exists
if [ -f ".env" ]; then
  source .env
fi

# Prompt for credentials if not in environment
if [ -z "$FTP_USER" ]; then
  read -p "Enter your Namecheap FTP username: " FTP_USER
fi

if [ -z "$FTP_PASS" ]; then
  read -s -p "Enter your Namecheap FTP password: " FTP_PASS
  echo
fi

if [ -z "$FTP_HOST" ]; then
  read -p "Enter your Namecheap FTP host (default: ftp.namecheap.com): " FTP_HOST
  FTP_HOST=${FTP_HOST:-ftp.namecheap.com}
fi

echo
echo -e "${YELLOW}SSL Certificate Options:${NC}"
echo "1. Use Namecheap AutoSSL (recommended)"
echo "2. Use Namecheap PositiveSSL Certificate"
echo "3. Use Let's Encrypt (manual setup)"
read -p "Select an option [1-3]: " SSL_OPTION

case $SSL_OPTION in
  1)
    # AutoSSL Option
    echo -e "${BLUE}You selected: Namecheap AutoSSL${NC}"
    echo
    echo -e "${YELLOW}Instructions to set up AutoSSL:${NC}"
    echo "1. Log in to your Namecheap cPanel"
    echo "2. Navigate to 'Security' > 'SSL/TLS Status'"
    echo "3. Click on 'Run AutoSSL' button"
    echo "4. Wait for the process to complete (may take a few minutes)"
    echo
    echo -e "${YELLOW}Would you like to create an .htaccess file that forces HTTPS?${NC}"
    read -p "Create HTTPS redirect rule? (y/n): " CREATE_HTACCESS
    
    if [[ "$CREATE_HTACCESS" =~ ^[Yy]$ ]]; then
      # Create temp file with HTTPS redirection
      cat > /tmp/ssl_htaccess << 'EOL'
# Force HTTPS for all connections
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Maintain existing rules below this line
EOL

      # Upload the file
      echo -e "${YELLOW}Uploading .htaccess with HTTPS redirection...${NC}"
      # Check if an existing .htaccess exists
      if curl -s --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/.htaccess" -o /tmp/existing_htaccess 2>/dev/null; then
        echo "Merging with existing .htaccess file..."
        cat /tmp/ssl_htaccess /tmp/existing_htaccess | grep -v "RewriteEngine On" > /tmp/final_htaccess
        curl -s -T "/tmp/final_htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/.htaccess"
      else
        curl -s -T "/tmp/ssl_htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/.htaccess"
      fi
      echo -e "${GREEN}✅ HTTPS redirection added to .htaccess${NC}"
    fi
    ;;
    
  2)
    # PositiveSSL Option
    echo -e "${BLUE}You selected: Namecheap PositiveSSL Certificate${NC}"
    echo
    echo -e "${YELLOW}Instructions to set up PositiveSSL:${NC}"
    echo "1. Log in to your Namecheap account"
    echo "2. Navigate to 'SSL Certificates' > 'List'"
    echo "3. Purchase a PositiveSSL certificate if you don't have one"
    echo "4. Once purchased, click 'Activate' next to your certificate"
    echo "5. Select 'Web Hosting' as the server type"
    echo "6. Follow the activation steps, including domain verification"
    echo "7. After activation, go to your cPanel > 'SSL/TLS' > 'Install and Manage SSL'"
    echo "8. Select your domain and install the certificate"
    ;;
    
  3)
    # Let's Encrypt Option
    echo -e "${BLUE}You selected: Let's Encrypt${NC}"
    echo
    echo -e "${YELLOW}Instructions to set up Let's Encrypt with Namecheap:${NC}"
    echo "1. Log in to cPanel"
    echo "2. Navigate to 'Security' > 'SSL/TLS'"
    echo "3. Select 'Let's Encrypt™ SSL'"
    echo "4. Select the domains you want to secure"
    echo "5. Click 'Issue' to generate the certificates"
    echo "6. Wait for the process to complete"
    echo "7. Certificates will auto-renew every 90 days"
    ;;
    
  *)
    echo -e "${RED}Invalid option selected.${NC}"
    exit 1
    ;;
esac

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Testing SSL Configuration           ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Ask for domain to test
read -p "Enter your domain to test SSL (e.g., snakkaz.com): " TEST_DOMAIN

echo -e "${YELLOW}Testing SSL configuration for $TEST_DOMAIN...${NC}"
SSL_OUTPUT=$(curl -sI "https://$TEST_DOMAIN" | head -20)

if [[ $SSL_OUTPUT == *"HTTP/2 200"* || $SSL_OUTPUT == *"HTTP/1.1 200"* ]]; then
  echo -e "${GREEN}✅ SSL is properly configured!${NC}"
elif [[ $SSL_OUTPUT == *"HTTP/1.1"* || $SSL_OUTPUT == *"HTTP/2"* ]]; then
  echo -e "${YELLOW}⚠️ Server is responding but returned status:${NC}"
  echo "$SSL_OUTPUT" | grep "HTTP"
else
  echo -e "${RED}❌ Could not connect securely to $TEST_DOMAIN${NC}"
  echo -e "${YELLOW}This could mean:${NC}"
  echo "1. SSL is not yet configured"
  echo "2. DNS propagation is not complete"
  echo "3. The server is not responding"
fi

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Verifying SSL Certificate           ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if openssl is available
if command -v openssl &> /dev/null; then
  echo -e "${YELLOW}Retrieving SSL certificate information...${NC}"
  CERT_INFO=$(openssl s_client -showcerts -connect ${TEST_DOMAIN}:443 -servername ${TEST_DOMAIN} 2>/dev/null | openssl x509 -noout -dates -issuer -subject)
  
  if [[ ! -z "$CERT_INFO" ]]; then
    echo "$CERT_INFO"
    echo
    echo -e "${GREEN}✅ Valid SSL certificate detected${NC}"
  else
    echo -e "${RED}❌ No valid SSL certificate found${NC}"
  fi
else
  echo -e "${YELLOW}⚠️ openssl not available, skipping certificate verification${NC}"
fi

echo
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Next Steps                          ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

echo -e "${YELLOW}After SSL is properly configured:${NC}"
echo "1. Update your Content Security Policy to use HTTPS URLs"
echo "2. Check all subdomains to ensure they're also secured"
echo "3. Test your application thoroughly for mixed content warnings"
echo "4. Add SSL configuration to your CI/CD pipeline for future deployments"
echo
echo -e "${GREEN}For more information, see the docs/SSL-CONFIGURATION.md file${NC}"

# Create documentation file
mkdir -p docs
cat > docs/SSL-CONFIGURATION.md << 'EOF'
# SSL Configuration Guide for Snakkaz Chat on Namecheap

This guide provides detailed instructions for configuring SSL certificates for the Snakkaz Chat application hosted on Namecheap.

## Option 1: AutoSSL (Recommended)

Namecheap provides AutoSSL which automatically issues and renews SSL certificates for your domains.

1. Log in to your Namecheap cPanel
2. Navigate to 'Security' > 'SSL/TLS Status'
3. Click on 'Run AutoSSL' button
4. Wait for the process to complete (may take a few minutes)
5. Verify that all domains and subdomains are secured

## Option 2: Namecheap PositiveSSL Certificate

PositiveSSL certificates are trusted by all major browsers and provide strong encryption.

1. Log in to your Namecheap account
2. Navigate to 'SSL Certificates' > 'List'
3. Purchase a PositiveSSL certificate if you don't have one
4. Once purchased, click 'Activate' next to your certificate
5. Select 'Web Hosting' as the server type
6. Follow the activation steps, including domain verification
7. After activation, go to your cPanel > 'SSL/TLS' > 'Install and Manage SSL'
8. Select your domain and install the certificate

## Option 3: Let's Encrypt

Let's Encrypt provides free SSL certificates that are valid for 90 days and auto-renew.

1. Log in to cPanel
2. Navigate to 'Security' > 'SSL/TLS'
3. Select 'Let's Encrypt™ SSL'
4. Select the domains you want to secure
5. Click 'Issue' to generate the certificates
6. Wait for the process to complete
7. Certificates will auto-renew every 90 days

## Force HTTPS with .htaccess

To ensure all traffic uses HTTPS, add the following to your .htaccess file:

```apache
# Force HTTPS for all connections
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Troubleshooting SSL Issues

If you experience SSL-related issues:

1. **Certificate Not Found**: Ensure the certificate is properly installed in cPanel
2. **Mixed Content Warnings**: Update all hardcoded HTTP URLs to HTTPS
3. **Invalid Certificate**: Check that the certificate matches your domain name
4. **Certificate Expiration**: Monitor expiration dates and renew certificates before they expire

## Testing SSL Configuration

Use these tools to verify your SSL configuration:

- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [HTTP Observatory](https://observatory.mozilla.org/)
- Browser Developer Tools (check for mixed content warnings)

## SSL Best Practices

1. Use strong cipher suites and disable weak protocols
2. Implement HTTP Strict Transport Security (HSTS)
3. Use secure cookies with the 'secure' flag
4. Properly configure your Content Security Policy
5. Regularly monitor SSL certificate status

## Updating Snakkaz Chat for HTTPS

After configuring SSL, update your Snakkaz Chat application:

1. Update Content Security Policy in index.html to use HTTPS
2. Check all API endpoints to ensure they use HTTPS
3. Update any hardcoded URLs in your code to use HTTPS
4. Test the application thoroughly to ensure all resources load securely

EOF

echo -e "${GREEN}✅ SSL configuration guide created in docs/SSL-CONFIGURATION.md${NC}"
