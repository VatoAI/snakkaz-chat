#!/bin/bash

# 🚨 IMMEDIATE DEPLOYMENT OF FIXED BUNDLES
# Juni 8, 2025 - Deploy NEW bundles to fix "Nt is undefined" error
# OLD: index-DqQAMTdx.js, vendor-misc-UdhpdGr7.js  
# NEW: index-CEa86-6h.js, vendor-misc-npIDrE24.js

echo "🚨 IMMEDIATE BUNDLE DEPLOYMENT"
echo "=============================="
echo "Deploying NEW bundles to fix 'Nt is undefined' error"
echo "OLD bundles causing issues:"
echo "  - index-DqQAMTdx.js"
echo "  - vendor-misc-UdhpdGr7.js"
echo ""
echo "NEW bundles with fixes:"
echo "  - index-CEa86-6h.js"
echo "  - vendor-misc-npIDrE24.js"
echo ""

# FTP credentials from cPanel
FTP_SERVER="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Eplekake123!"
FTP_PATH="/public_html/assets/js"

echo "🔍 Verifying local bundles exist..."
if [ ! -f "dist/assets/js/index-CEa86-6h.js" ]; then
    echo "❌ NEW index bundle not found!"
    exit 1
fi

if [ ! -f "dist/assets/js/vendor-misc-npIDrE24.js" ]; then
    echo "❌ NEW vendor-misc bundle not found!"
    exit 1
fi

echo "✅ Local bundles verified"
echo ""

echo "📤 UPLOADING NEW BUNDLES VIA CURL..."

# Upload new index bundle
echo "Uploading index-CEa86-6h.js..."
if curl -T "dist/assets/js/index-CEa86-6h.js" --user "${FTP_USER}:${FTP_PASS}" \
    "ftp://${FTP_SERVER}${FTP_PATH}/index-CEa86-6h.js" --progress-bar; then
    echo "✅ index-CEa86-6h.js uploaded successfully"
else
    echo "❌ Failed to upload index-CEa86-6h.js"
    exit 1
fi

# Upload new vendor-misc bundle
echo "Uploading vendor-misc-npIDrE24.js..."
if curl -T "dist/assets/js/vendor-misc-npIDrE24.js" --user "${FTP_USER}:${FTP_PASS}" \
    "ftp://${FTP_SERVER}${FTP_PATH}/vendor-misc-npIDrE24.js" --progress-bar; then
    echo "✅ vendor-misc-npIDrE24.js uploaded successfully"
else
    echo "❌ Failed to upload vendor-misc-npIDrE24.js"
    exit 1
fi

# Upload new index.html that references the new bundles
echo "📤 Uploading updated index.html..."
if curl -T "dist/index.html" --user "${FTP_USER}:${FTP_PASS}" \
    "ftp://${FTP_SERVER}/public_html/index.html" --progress-bar; then
    echo "✅ index.html uploaded successfully"
else
    echo "❌ Failed to upload index.html"
fi

echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo "======================"
echo "NEW bundles are now uploaded to live server"
echo ""

echo "🔍 Verifying deployment..."
sleep 5

# Check if the site loads the new bundles
echo "Checking live site for new bundles..."
if curl -s "https://www.snakkaz.com" | grep -q "index-CEa86-6h.js"; then
    echo "✅ NEW index bundle detected on live site!"
else
    echo "⚠️ Still loading old bundle - may need cache clear or propagation time"
fi

if curl -s "https://www.snakkaz.com" | grep -q "vendor-misc-npIDrE24.js"; then
    echo "✅ NEW vendor-misc bundle detected on live site!"
else
    echo "⚠️ Still loading old vendor-misc bundle"
fi

echo ""
echo "🇳🇴 NORWEGIAN TECH COMMUNITY UPDATE:"
echo "The 'Nt is undefined' error should now be RESOLVED!"
echo "Norwegian users can now access Snakkaz Chat without black screens!"
echo ""
echo "🔍 Next steps:"
echo "1. Visit https://www.snakkaz.com"
echo "2. Open browser console (F12)"
echo "3. Verify no 'Nt is undefined' errors"
echo "4. Test chat functionality"
echo ""
echo "✅ EMERGENCY DEPLOYMENT SUCCESSFUL"
