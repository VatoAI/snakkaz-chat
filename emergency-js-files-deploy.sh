#!/bin/bash
# filepath: /workspaces/snakkaz-chat/emergency-js-files-deploy.sh
# Emergency deployment script for JavaScript files and index.html

set -e

echo "🚨 EMERGENCY: Deploying JavaScript files and index.html to fix MIME type errors"
echo "Timestamp: $(date)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Status: Preparing emergency deployment...${NC}"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: dist directory not found!${NC}"
    echo "Running build first..."
    npm run build
fi

# Check if dist/index.html exists
if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}❌ Error: dist/index.html not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found dist directory with built files${NC}"

# Create FTP deployment script
cat > emergency-js-deploy.lftp << 'EOF'
#!/usr/bin/lftp -f

# Emergency JavaScript files and index.html deployment
set ssl:verify-certificate false
set ftp:ssl-force true
set ftp:ssl-protect-data true

# Connect to server
open -u snakkaz.com,B48@.m*VhQUF sftp://ftp.domeneshop.no

# Create a deployment timestamp
quote SITE CHMOD 755 /www

# Upload index.html first (most critical)
echo "🔄 Uploading index.html..."
put dist/index.html index.html

# Upload all JavaScript files
echo "🔄 Uploading JavaScript files..."
mirror -R --only-newer --verbose dist/assets/js/ assets/js/

# Upload CSS files too (just in case)
echo "🔄 Uploading CSS files..."
mirror -R --only-newer --verbose dist/assets/css/ assets/css/

# Upload .htaccess to ensure MIME types are correct
echo "🔄 Uploading .htaccess..."
put .htaccess .htaccess

# Set proper permissions
echo "🔧 Setting permissions..."
chmod 644 index.html
chmod 644 .htaccess
chmod -R 644 assets/js/
chmod -R 644 assets/css/

echo "✅ Emergency deployment completed"
quit
EOF

# Make the LFTP script executable
chmod +x emergency-js-deploy.lftp

echo -e "${YELLOW}🚀 Executing emergency deployment...${NC}"

# Run the deployment
./emergency-js-deploy.lftp

# Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

# Test if index.html was uploaded
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/)
if [ "$RESPONSE_CODE" = "200" ]; then
    echo -e "${GREEN}✅ index.html deployed successfully (HTTP $RESPONSE_CODE)${NC}"
else
    echo -e "${RED}❌ index.html deployment failed (HTTP $RESPONSE_CODE)${NC}"
fi

# Test a JavaScript file
MAIN_JS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/assets/js/index-Cu5v56qg.js)
if [ "$MAIN_JS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Main JavaScript file deployed successfully (HTTP $MAIN_JS_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Main JavaScript file deployment failed (HTTP $MAIN_JS_RESPONSE)${NC}"
fi

# Test MIME type
echo -e "${YELLOW}🧪 Testing MIME type...${NC}"
MIME_TYPE=$(curl -s -I https://snakkaz.com/assets/js/index-Cu5v56qg.js | grep -i "content-type" | cut -d':' -f2 | tr -d ' \r\n')
if [[ "$MIME_TYPE" == *"javascript"* ]]; then
    echo -e "${GREEN}✅ MIME type is correct: $MIME_TYPE${NC}"
else
    echo -e "${RED}❌ MIME type is incorrect: $MIME_TYPE${NC}"
    echo -e "${YELLOW}💡 The .htaccess rules may need time to take effect or server restart${NC}"
fi

echo -e "${GREEN}🎉 Emergency deployment completed!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)"
echo "2. Test https://snakkaz.com in browser"
echo "3. Check console for any remaining errors"

# Cleanup
rm -f emergency-js-deploy.lftp

echo -e "${GREEN}✨ All done! Please test the website now.${NC}"
