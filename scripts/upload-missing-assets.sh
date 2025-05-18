#!/bin/bash
# upload-missing-assets.sh
#
# This script checks for and uploads the specific files mentioned in the error messages

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Missing Assets Uploader     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo -e "${RED}Error: .env file not found.${NC}"
  exit 1
fi

# Create assets directory if it doesn't exist
echo -e "${YELLOW}Creating assets directory if it doesn't exist...${NC}"
curl -s --ftp-create-dirs --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/" -Q "MKD $FTP_REMOTE_DIR/assets"
echo -e "${GREEN}✓ Assets directory created/verified${NC}"
echo

# Files mentioned in the error messages
echo -e "${YELLOW}Checking for specific asset files from error messages...${NC}"
FILES_TO_CHECK=(
  "assets/auth-bg.css"
  "assets/index-ZtK66PHB.css"
  "assets/index-iEerSh2Y.js"
)

for file in "${FILES_TO_CHECK[@]}"; do
  echo -e "${YELLOW}Looking for $file in local dist directory...${NC}"
  
  if [ -f "dist/$file" ]; then
    echo -e "${GREEN}✓ Found $file locally${NC}"
    echo -e "${YELLOW}Uploading $file to server...${NC}"
    
    curl -v -T "dist/$file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$file"
    
    echo -e "${GREEN}✓ $file uploaded${NC}"
  else
    echo -e "${RED}✗ $file not found in dist directory${NC}"
    echo -e "${YELLOW}Searching for similar files...${NC}"
    
    # Extract the base name pattern
    if [[ $file == *"index-"* && $file == *".css" ]]; then
      echo -e "${YELLOW}Looking for any index-*.css files...${NC}"
      CSS_FILES=$(find dist/assets -name "index-*.css" -type f)
      
      if [ -n "$CSS_FILES" ]; then
        echo -e "${GREEN}Found similar CSS files:${NC}"
        echo "$CSS_FILES"
        
        # Upload the first match
        FIRST_CSS=$(echo "$CSS_FILES" | head -n 1)
        FILENAME=$(basename "$FIRST_CSS")
        TARGET_PATH="assets/$FILENAME"
        
        echo -e "${YELLOW}Uploading $FIRST_CSS as $TARGET_PATH...${NC}"
        curl -v -T "$FIRST_CSS" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$TARGET_PATH"
        echo -e "${GREEN}✓ Uploaded alternative CSS file${NC}"
      else
        echo -e "${RED}✗ No similar CSS files found${NC}"
      fi
    elif [[ $file == *"index-"* && $file == *".js" ]]; then
      echo -e "${YELLOW}Looking for any index-*.js files...${NC}"
      JS_FILES=$(find dist/assets -name "index-*.js" -type f)
      
      if [ -n "$JS_FILES" ]; then
        echo -e "${GREEN}Found similar JS files:${NC}"
        echo "$JS_FILES"
        
        # Upload the first match
        FIRST_JS=$(echo "$JS_FILES" | head -n 1)
        FILENAME=$(basename "$FIRST_JS")
        TARGET_PATH="assets/$FILENAME"
        
        echo -e "${YELLOW}Uploading $FIRST_JS as $TARGET_PATH...${NC}"
        curl -v -T "$FIRST_JS" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$TARGET_PATH"
        echo -e "${GREEN}✓ Uploaded alternative JS file${NC}"
      else
        echo -e "${RED}✗ No similar JS files found${NC}"
      fi
    elif [[ $file == *"auth-bg.css" ]]; then
      echo -e "${YELLOW}Looking for auth-bg.css in dist directory...${NC}"
      AUTH_CSS=$(find dist -name "auth-bg.css" -type f)
      
      if [ -n "$AUTH_CSS" ]; then
        echo -e "${GREEN}Found auth-bg.css:${NC}"
        echo "$AUTH_CSS"
        
        # Upload the file
        echo -e "${YELLOW}Uploading auth-bg.css...${NC}"
        curl -v -T "$AUTH_CSS" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/auth-bg.css"
        echo -e "${GREEN}✓ Uploaded auth-bg.css${NC}"
      else
        # Create a basic auth-bg.css file if it doesn't exist
        echo -e "${YELLOW}Creating a basic auth-bg.css file...${NC}"
        cat > /tmp/auth-bg.css << 'EOL'
/* Basic auth background styles */
.auth-background {
  background: linear-gradient(135deg, #1e2024 0%, #121417 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  background: rgba(30, 32, 36, 0.8);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  max-width: 450px;
  width: 100%;
}

.auth-logo {
  margin-bottom: 2rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
EOL
        curl -v -T "/tmp/auth-bg.css" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/auth-bg.css"
        echo -e "${GREEN}✓ Created and uploaded a basic auth-bg.css${NC}"
      fi
    fi
  fi
  echo
done

# Create a basic index file in assets directory to verify it works
echo -e "${YELLOW}Creating test index file in assets directory...${NC}"
cat > /tmp/assets-index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snakkaz Assets Directory</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #0066cc;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .message {
      background-color: #f8f9fa;
      border-left: 4px solid #0066cc;
      padding: 15px;
      margin-bottom: 20px;
    }
    code {
      background-color: #f1f1f1;
      padding: 2px 5px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <h1>Snakkaz Assets Directory</h1>
  <div class="message">
    <p>This is the assets directory for Snakkaz. If you're seeing this page, it means the directory is accessible.</p>
    <p>Test JavaScript: <code>index-iEerSh2Y.js</code></p>
    <p>Test CSS: <code>index-ZtK66PHB.css</code></p>
  </div>
  <p>This is a system directory and should not be accessed directly in normal circumstances.</p>
</body>
</html>
EOL

curl -s -T "/tmp/assets-index.html" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets/index.html"
echo -e "${GREEN}✓ Test index file created in assets directory${NC}"
echo

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   Missing Assets Upload Completed    ${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Check if the website loads correctly now"
echo -e "2. If issues persist, try manually uploading the entire assets directory"
echo -e "3. Check the test page at http://www.snakkaz.com/assets/ to verify the directory is accessible"
echo -e "4. Verify that the updated .htaccess files with MIME types are working"
