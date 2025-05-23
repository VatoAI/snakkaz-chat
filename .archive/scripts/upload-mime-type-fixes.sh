#!/bin/bash
# upload-mime-type-fixes.sh
#
# This script uploads the MIME type fixes to the Namecheap server

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Upload MIME Type Fixes to Server     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo -e "${RED}Error: .env file not found!${NC}"
  echo "Please create an .env file with your FTP settings first."
  exit 1
fi

# Source the .env file to load FTP settings
source .env

# Verify that FTP settings are set
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ] || [ -z "$FTP_REMOTE_DIR" ]; then
  echo -e "${RED}Error: Missing FTP settings in .env file.${NC}"
  echo "Make sure you have defined the following variables:"
  echo "FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR"
  exit 1
fi

# Verify the necessary files exist
for file in "dist/.htaccess" "dist/serve-assets.php" "dist/test-mime-types.html"; do
  if [ ! -f "$file" ]; then
    echo -e "${RED}Error: $file not found!${NC}"
    echo "Run the fix-mime-type-issues.sh script first."
    exit 1
  fi
done

echo -e "${YELLOW}FTP Settings:${NC}"
echo "Host: $FTP_HOST"
echo "User: $FTP_USER"
echo "Remote Dir: $FTP_REMOTE_DIR"
echo

# Create a temporary batch file for FTP commands
FTP_COMMANDS=$(mktemp)

# Function to upload a file via FTP
upload_file() {
  local local_file="$1"
  local remote_file="$2"
  local description="$3"
  
  echo -e "${YELLOW}Uploading $description...${NC}"
  
  # For curl FTP upload
  if command -v curl &> /dev/null; then
    echo "Using curl for upload..."
    curl -v -T "$local_file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$remote_file"
    return $?
  fi
  
  # Fallback to standard FTP
  cat > "$FTP_COMMANDS" << EOL
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $FTP_REMOTE_DIR
put $local_file $remote_file
bye
EOL
  
  ftp -n < "$FTP_COMMANDS"
  return $?
}

# Upload .htaccess file
upload_file "dist/.htaccess" ".htaccess" ".htaccess file with MIME type configurations"

# Upload PHP fallback script
upload_file "dist/serve-assets.php" "serve-assets.php" "PHP fallback script for MIME types"

# Upload test file
upload_file "dist/test-mime-types.html" "test-mime-types.html" "MIME type test page"

# Upload fallback index.html if it exists
if [ -f "dist/fallback-index.html" ]; then
  upload_file "dist/fallback-index.html" "fallback-index.html" "Fallback index.html with MIME type fixes"
fi

# Clean up temporary file
rm "$FTP_COMMANDS"

echo
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}      MIME TYPE FIXES UPLOADED           ${NC}"
echo -e "${GREEN}==========================================${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit https://www.snakkaz.com/test-mime-types.html to verify MIME types"
echo "2. Check if the main application loads correctly now"
echo "3. If issues persist, try using the fallback index:"
echo "   https://www.snakkaz.com/fallback-index.html"
echo
echo -e "${BLUE}If you see errors about missing files on the server, make sure to:${NC}"
echo "1. Extract all asset files properly on the server"
echo "2. Verify file permissions (should be 644 for files, 755 for directories)"
echo "3. Check that paths are correct in the PHP script"
echo
echo -e "${YELLOW}To verify MIME types on the server, run:${NC}"
echo "  ./scripts/verify-mime-types-on-server.sh https://www.snakkaz.com"
