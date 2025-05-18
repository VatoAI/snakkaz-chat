#!/bin/bash
# finalize-namecheap-migration.sh
#
# Dette scriptet hjelper med å ferdigstille migreringen til Namecheap
# ved å ekstrahere assets.zip på serveren og aktivere HTTPS-redirect

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Migration Finalization      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if cURL is installed
if ! command -v curl &> /dev/null; then
  echo -e "${RED}Error: curl is not installed.${NC}"
  exit 1
fi

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo -e "${RED}Error: .env file not found.${NC}"
  exit 1
fi

# Verify FTP credentials
echo -e "${YELLOW}Verifying FTP credentials...${NC}"
if curl -s --max-time 10 --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > /dev/null; then
  echo -e "${GREEN}✓ FTP credentials are valid${NC}"
else
  echo -e "${RED}✗ FTP credentials are invalid or server is unreachable${NC}"
  exit 1
fi

# Check if assets.zip exists on the server
echo -e "${YELLOW}Checking if assets.zip exists on the server...${NC}"
if curl -s --head --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets.zip" | head -n 1 | grep -q "213"; then
  echo -e "${GREEN}✓ assets.zip found on server${NC}"
else
  echo -e "${RED}✗ assets.zip not found on server. Please upload it first.${NC}"
  exit 1
fi

echo -e "${YELLOW}To finalize the migration, perform these steps manually:${NC}"
echo
echo -e "${BLUE}1. Extract assets.zip:${NC}"
echo -e "   a. Log in to Namecheap cPanel"
echo -e "   b. Open File Manager"
echo -e "   c. Navigate to public_html"
echo -e "   d. Right-click on assets.zip and select 'Extract'"
echo -e "   e. Ensure it extracts to the public_html directory"
echo
echo -e "${BLUE}2. Enable HTTPS redirect:${NC}"
echo -e "   a. Open the .htaccess file in public_html"
echo -e "   b. Find and uncomment the HTTPS redirect lines:"
echo -e "      # RewriteCond %{HTTPS} off"
echo -e "      # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]"
echo -e "   c. Save the file"
echo
echo -e "${BLUE}3. Verify installation:${NC}"
echo -e "   a. Open https://www.snakkaz.com in your browser"
echo -e "   b. Check that all assets load correctly"
echo -e "   c. Test basic functionality"
echo
echo -e "${GREEN}Upon completion of these steps, the migration will be fully finalized.${NC}"
echo -e "${YELLOW}Remember to update the migration status in docs/MIGRATION-FINAL-STATUS.md${NC}"
