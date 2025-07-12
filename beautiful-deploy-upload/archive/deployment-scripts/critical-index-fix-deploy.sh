#!/bin/bash

# CRITICAL FIX: Deploy corrected index.html with production bundle references
# This fixes the "useLayoutEffect undefined" error by using the built bundle instead of dev entry

set -e

echo "🚨 CRITICAL FIX: Deploying corrected index.html with production bundle..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# FTP settings
FTP_HOST="snakkaz.com"
FTP_USER="snakkazzo@snakkaz.com"
FTP_PASS="Snakkaz123!"
FTP_DIR="public_html"

echo -e "${YELLOW}📋 What this script will do:${NC}"
echo "1. Verify the corrected index.html (should reference /assets/js/index-*.js)"
echo "2. Upload the corrected index.html to replace the broken dev version"
echo "3. Verify the upload was successful"
echo ""

# Verify the index.html has the correct bundle reference
echo -e "${YELLOW}🔍 Verifying index.html references production bundle...${NC}"
if grep -q "/assets/js/index-" index.html; then
    echo -e "${GREEN}✅ Correct: index.html references production bundle${NC}"
else
    echo -e "${RED}❌ ERROR: index.html still references /src/main.tsx!${NC}"
    echo "This would cause the useLayoutEffect error. Fixing now..."
    
    # Get the correct script tag from dist/index.html
    SCRIPT_TAG=$(grep -o '<script type="module" crossorigin src="/assets/js/index-[^"]*\.js"></script>' dist/index.html)
    CSS_TAG=$(grep -o '<link rel="stylesheet" crossorigin href="/assets/css/index-[^"]*\.css">' dist/index.html)
    
    if [ ! -z "$SCRIPT_TAG" ] && [ ! -z "$CSS_TAG" ]; then
        echo "Found correct tags in dist/index.html:"
        echo "Script: $SCRIPT_TAG"
        echo "CSS: $CSS_TAG"
        
        # Replace the old script tag
        sed -i 's|<script type="module" src="/src/main.tsx"></script>|'"$SCRIPT_TAG"'|g' index.html
        
        # Add CSS tag if not present
        if ! grep -q "/assets/css/index-" index.html; then
            sed -i 's|</head>|    '"$CSS_TAG"'\n  </head>|g' index.html
        fi
        
        echo -e "${GREEN}✅ Fixed index.html to reference production bundle${NC}"
    else
        echo -e "${RED}❌ Could not find correct script/css tags in dist/index.html${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}🚀 Uploading corrected index.html...${NC}"

# Create temporary lftp script
cat > /tmp/critical_fix_upload.lftp << EOF
set ssl:verify-certificate no
set ftp:ssl-allow no
open -u ${FTP_USER},${FTP_PASS} ${FTP_HOST}
cd ${FTP_DIR}

# Upload the corrected index.html
put index.html

# Verify upload
ls -la index.html

bye
EOF

# Execute upload
if lftp -f /tmp/critical_fix_upload.lftp; then
    echo -e "${GREEN}✅ Successfully uploaded corrected index.html${NC}"
else
    echo -e "${RED}❌ FTP upload failed. Manual upload required.${NC}"
    echo ""
    echo -e "${YELLOW}📋 MANUAL UPLOAD INSTRUCTIONS:${NC}"
    echo "1. Go to cPanel File Manager: https://snakkaz.com:2083"
    echo "2. Navigate to public_html/"
    echo "3. Upload or edit index.html with the content from the local index.html"
    echo "4. Ensure it references: /assets/js/index-C8UgCmie.js (not /src/main.tsx)"
    echo ""
    
    # Show the critical lines that need to be correct
    echo -e "${YELLOW}🔧 Critical lines in index.html should be:${NC}"
    grep -A2 -B2 "/assets/js/index-" index.html || echo "Script tag with /assets/js/index-*.js"
    echo ""
fi

# Clean up
rm -f /tmp/critical_fix_upload.lftp

echo ""
echo -e "${GREEN}🎉 CRITICAL FIX DEPLOYMENT COMPLETE${NC}"
echo ""
echo -e "${YELLOW}🧪 Test the fix:${NC}"
echo "1. Visit https://snakkaz.com"
echo "2. Open browser console (F12)"
echo "3. Should NOT see 'useLayoutEffect undefined' error"
echo "4. Chat should load and work properly"
echo ""
echo -e "${YELLOW}📊 If still having issues:${NC}"
echo "- Check browser cache (Ctrl+F5 to hard refresh)"
echo "- Verify all /assets/js/ files are uploaded"
echo "- Check server error logs in cPanel"
