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
    echo "Please run fix-subdomain-root-access.sh first."
    exit 1
fi

# Default values
HOST=""
USER=""
PASS=""
REMOTE_PATH=""
USE_CPANEL=false

# Helper function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -h, --host       FTP host or cPanel domain"
    echo "  -u, --user       Username"
    echo "  -p, --pass       Password"
    echo "  -r, --remote     Remote path (default: public_html)"
    echo "  -c, --cpanel     Use cPanel File Manager instead of FTP"
    echo "  --help           Show this help message"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            HOST="$2"
            shift 2
            ;;
        -u|--user)
            USER="$2"
            shift 2
            ;;
        -p|--pass)
            PASS="$2"
            shift 2
            ;;
        -r|--remote)
            REMOTE_PATH="$2"
            shift 2
            ;;
        -c|--cpanel)
            USE_CPANEL=true
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Interactive mode if parameters are missing
if [ -z "$HOST" ]; then
    read -p "Enter FTP host or cPanel domain: " HOST
fi

if [ -z "$USER" ]; then
    read -p "Enter username: " USER
fi

if [ -z "$PASS" ]; then
    read -s -p "Enter password: " PASS
    echo
fi

if [ -z "$REMOTE_PATH" ]; then
    read -p "Enter remote path (default: public_html): " REMOTE_PATH
    REMOTE_PATH=${REMOTE_PATH:-public_html}
fi

if [ "$USE_CPANEL" != true ]; then
    read -p "Use cPanel File Manager instead of FTP? (y/n): " cpanel_choice
    if [[ $cpanel_choice =~ ^[Yy]$ ]]; then
        USE_CPANEL=true
    fi
fi

# Confirm settings
echo
echo -e "${YELLOW}Upload settings:${NC}"
echo "  Host: $HOST"
echo "  User: $USER"
echo "  Remote path: $REMOTE_PATH"
echo "  Method: $([ "$USE_CPANEL" = true ] && echo "cPanel File Manager" || echo "FTP")"
echo

read -p "Proceed with these settings? (y/n): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Upload cancelled."
    exit 0
fi

if [ "$USE_CPANEL" = true ]; then
    # Use cPanel File Manager API
    echo -e "${YELLOW}Uploading via cPanel File Manager...${NC}"
    
    # Create a temporary PHP file for extraction
    EXTRACT_PHP=$(mktemp --suffix=.php)
    cat > "$EXTRACT_PHP" << 'PHPSCRIPT'
<?php
$zip = new ZipArchive;
$res = $zip->open('subdomain-root-access-fix.zip');
if ($res === TRUE) {
    echo "Extracting ZIP file...\n";
    $zip->extractTo('.');
    $zip->close();
    echo "Extraction successful!";
} else {
    echo "Failed to open ZIP file!";
}
?>
PHPSCRIPT
    
    # First, upload the ZIP file
    echo -e "${YELLOW}Uploading ZIP file...${NC}"
    curl -s -T subdomain-root-access-fix.zip "ftp://$HOST/$REMOTE_PATH/" --user "$USER:$PASS"
    UPLOAD_RESULT=$?
    
    if [ $UPLOAD_RESULT -ne 0 ]; then
        echo -e "${RED}✗ Failed to upload ZIP file via FTP${NC}"
        exit 1
    fi
    
    # Then upload the extraction script
    echo -e "${YELLOW}Uploading extraction script...${NC}"
    curl -s -T "$EXTRACT_PHP" "ftp://$HOST/$REMOTE_PATH/extract-subdomain-fix.php" --user "$USER:$PASS"
    
    # Execute the extraction script
    echo -e "${YELLOW}Extracting ZIP file on server...${NC}"
    EXTRACT_URL="http://$HOST/$REMOTE_PATH/extract-subdomain-fix.php"
    EXTRACT_RESULT=$(curl -s "$EXTRACT_URL")
    
    echo "$EXTRACT_RESULT"
    
    # Clean up
    rm -f "$EXTRACT_PHP"
    
    echo -e "${GREEN}✓ Upload and extraction completed!${NC}"
else
    # Use standard FTP
    echo -e "${YELLOW}Uploading files via FTP...${NC}"
    
    # Create a temporary FTP script
    FTP_SCRIPT=$(mktemp)
    cat > "$FTP_SCRIPT" << EOF
open $HOST
user $USER $PASS
cd $REMOTE_PATH
binary
put subdomain-root-access-fix.zip
quit
