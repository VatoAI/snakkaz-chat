#!/bin/bash
# upload-subdomain-fix.sh
#
# This script uploads the subdomain root access fix files to the server.

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   SNAKKAZ CHAT: UPLOAD SUBDOMAIN FIX               ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Check if zip file exists
if [ ! -f "subdomain-root-access-fix.zip" ]; then
    echo -e "${RED}Error: subdomain-root-access-fix.zip not found!${NC}"
    exit 1
fi

# Default values
HOST=""
USER=""
PASS=""
REMOTE_PATH=""

# Interactive mode to get upload details
echo -e "${YELLOW}Please provide FTP details for upload:${NC}"
read -p "Enter FTP host: " HOST
read -p "Enter username: " USER
read -s -p "Enter password: " PASS
echo
read -p "Enter remote path (default: public_html): " REMOTE_PATH
REMOTE_PATH=${REMOTE_PATH:-public_html}

# Confirm settings
echo
echo -e "${YELLOW}Upload settings:${NC}"
echo "  Host: $HOST"
echo "  User: $USER"
echo "  Remote path: $REMOTE_PATH"
echo

read -p "Proceed with these settings? (y/n): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Upload cancelled."
    exit 0
fi

# Create FTP script
FTP_SCRIPT=$(mktemp)
cat > "$FTP_SCRIPT" << EOF
open $HOST
user $USER $PASS
cd $REMOTE_PATH
binary
put subdomain-root-access-fix.zip
bye
EOF

# Upload the ZIP file
echo -e "${YELLOW}Uploading ZIP file...${NC}"
ftp -n < "$FTP_SCRIPT"
UPLOAD_RESULT=$?
rm -f "$FTP_SCRIPT"

if [ $UPLOAD_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ ZIP file uploaded successfully!${NC}"
    echo -e "${YELLOW}Note: You need to extract the ZIP file using cPanel File Manager:${NC}"
    echo -e "1. Log in to cPanel"
    echo -e "2. Open File Manager and navigate to $REMOTE_PATH"
    echo -e "3. Right-click on subdomain-root-access-fix.zip and select 'Extract'"
else
    echo -e "${RED}✗ Failed to upload ZIP file via FTP (error code: $UPLOAD_RESULT)${NC}"
fi

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    NEXT STEPS                                       ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo -e "After extraction:"
echo -e "1. Verify that the fix is working by accessing:"
echo -e "   - https://analytics.snakkaz.com (without /ping)"
echo -e "   - https://business.snakkaz.com (without /ping)"
echo -e "   - https://dash.snakkaz.com (without /ping)"
echo -e "   - https://docs.snakkaz.com (without /ping)"
echo -e "2. Check your browser's console for any remaining errors"
echo
echo -e "${GREEN}Upload script execution completed!${NC}"
