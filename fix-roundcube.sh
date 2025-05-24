#!/bin/bash
# fix-roundcube.sh - Fix the Roundcube "Invalid request" error
# This script uploads a corrected config file to the server

# Colors for readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}     Roundcube Configuration Fix Tool        ${NC}"
echo -e "${BLUE}=============================================${NC}"
echo

# Check if .env file exists and load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo -e "${YELLOW}Using default values or asking for input${NC}"
fi

# Check if roundcube-config.inc.php exists
if [ ! -f "roundcube-config.inc.php" ]; then
    echo -e "${RED}Error: roundcube-config.inc.php file not found${NC}"
    exit 1
fi

# Get FTP credentials if not already in environment
if [ -z "$FTP_HOST" ]; then
    read -p "Enter FTP host (e.g., premium123.web-hosting.com): " FTP_HOST
fi

if [ -z "$FTP_USER" ]; then
    read -p "Enter FTP username: " FTP_USER
fi

if [ -z "$FTP_PASS" ]; then
    read -sp "Enter FTP password: " FTP_PASS
    echo
fi

# Create temporary upload script
echo -e "\n${BLUE}Creating upload script...${NC}"
cat > upload-config.lftp << EOF
# LFTP script to upload Roundcube configuration
# Generated on $(date)

# Open connection
open -u "$FTP_USER","$FTP_PASS" "$FTP_HOST"

# Turn on FTPS 
set ftps:initial-prot ""
set ftp:ssl-protect-data true

# Upload configuration file
cd /home/snakqsqe/mail.snakkaz.com/config/
put -O . roundcube-config.inc.php -o config.inc.php

# Set permissions
chmod 644 config.inc.php

# Exit when done
bye
EOF

echo -e "${GREEN}✅ Upload script created${NC}"

# Execute the upload
echo -e "\n${BLUE}Uploading configuration file to server...${NC}"
lftp -f upload-config.lftp

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to upload configuration file${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Configuration file uploaded successfully${NC}"
fi

# Clean up
rm upload-config.lftp

echo -e "\n${BLUE}Testing Roundcube webmail...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://mail.snakkaz.com)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo -e "${GREEN}✅ Roundcube webmail is responding (HTTP status $HTTP_STATUS)${NC}"
else
    echo -e "${RED}⚠️ Roundcube webmail returned unexpected status code: $HTTP_STATUS${NC}"
    
    # Try direct hosting URL
    DIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://premium123.web-hosting.com:2096)
    if [ "$DIRECT_STATUS" = "200" ] || [ "$DIRECT_STATUS" = "302" ]; then
        echo -e "${GREEN}✅ Direct hosting webmail is responding (HTTP status $DIRECT_STATUS)${NC}"
        echo -e "${YELLOW}You may need to use https://premium123.web-hosting.com:2096 until DNS issues are resolved${NC}"
    fi
fi

echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}     Roundcube configuration fix completed!       ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo
echo -e "Next steps:"
echo -e "1. Try logging in to Roundcube at https://mail.snakkaz.com"
echo -e "2. If the 'Invalid request' error persists, try:"
echo -e "   - Clear your browser cache and cookies"
echo -e "   - Try using a different browser"
echo -e "   - Check if direct access works: https://premium123.web-hosting.com:2096"
echo -e "3. Run the mail system test script:"
echo -e "   ./mail-system-test.sh"
