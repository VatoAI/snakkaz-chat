#!/bin/bash

# UPLOAD ALL MISSING VENDOR BUNDLES - Emergency Fix for Snakkaz.com Black Screen
# Date: June 8, 2024
# Purpose: Upload all missing vendor bundle files to fix 404 errors

echo "🚨 EMERGENCY: Uploading ALL missing vendor bundles to fix black screen"
echo "Target: snakkaz.com"
echo "=================================================================="

# FTP Configuration (VERIFIED WORKING)
FTP_SERVER="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Eplekake123!"
REMOTE_PATH="/public_html/assets/js"
LOCAL_DIR="/workspaces/snakkaz-chat/dist/assets/js"

# List of all missing vendor files causing 404 errors
MISSING_FILES=(
    "vendor-react-core-iFRBiayd.js"
    "vendor-react-scheduler-bNB6tsxG.js"
    "vendor-react-jsx-DRIO_5u7.js"
    "vendor-scoped-CoCOWFRB.js"
    "vendor-react-dom-DJJO0aee.js"
    "vendor-react-hooks-tlBJeDdq.js"
    "vendor-react-internals-BtRBMhjW.js"
    "vendor-react-misc-vIIz5mxn.js"
    "vendor-supabase-core-BqDz4zbK.js"
    "vendor-supabase-Cvi5R3PQ.js"
    "vendor-react-dom-client-B2glCzEE.js"
    "vendor-router-B0BV1ApG.js"
    "vendor-tailwind-DI7x5DrD.js"
    "vendor-security-BpbLSGV0.js"
)

# Also upload emergency-react-fix.js from root
echo "📤 Uploading emergency-react-fix.js..."
curl -T "/workspaces/snakkaz-chat/dist/emergency-react-fix.js" \
     "ftp://${FTP_USER}:${FTP_PASS}@${FTP_SERVER}/public_html/"
if [ $? -eq 0 ]; then
    echo "✅ emergency-react-fix.js uploaded successfully"
else
    echo "❌ Failed to upload emergency-react-fix.js"
fi

echo ""
echo "📤 Starting upload of ${#MISSING_FILES[@]} missing vendor bundles..."
echo ""

# Upload each missing vendor file
for file in "${MISSING_FILES[@]}"; do
    echo "🔄 Uploading: $file"
    
    # Check if file exists locally
    if [ ! -f "$LOCAL_DIR/$file" ]; then
        echo "❌ Local file not found: $LOCAL_DIR/$file"
        continue
    fi
    
    # Get file size for progress
    size=$(wc -c < "$LOCAL_DIR/$file")
    echo "   Size: $size bytes"
    
    # Upload file with curl
    curl --progress-bar \
         -T "$LOCAL_DIR/$file" \
         "ftp://${FTP_USER}:${FTP_PASS}@${FTP_SERVER}${REMOTE_PATH}/$file"
    
    if [ $? -eq 0 ]; then
        echo "✅ $file uploaded successfully"
        
        # Verify file exists on server
        curl -s -I "https://snakkaz.com/assets/js/$file" | head -1 | grep -q "200"
        if [ $? -eq 0 ]; then
            echo "✅ Verified: $file is accessible on live site"
        else
            echo "⚠️  Warning: $file uploaded but may not be immediately accessible"
        fi
    else
        echo "❌ Failed to upload: $file"
    fi
    
    echo ""
done

echo "=================================================================="
echo "🎯 DEPLOYMENT SUMMARY"
echo "=================================================================="
echo "Total files processed: ${#MISSING_FILES[@]} vendor bundles + emergency-react-fix.js"
echo ""
echo "🔍 Testing live site accessibility..."

# Test a few key vendor files
echo "Testing vendor-react-core-iFRBiayd.js..."
curl -s -I "https://snakkaz.com/assets/js/vendor-react-core-iFRBiayd.js" | head -1

echo "Testing vendor-supabase-core-BqDz4zbK.js..."
curl -s -I "https://snakkaz.com/assets/js/vendor-supabase-core-BqDz4zbK.js" | head -1

echo "Testing emergency-react-fix.js..."
curl -s -I "https://snakkaz.com/emergency-react-fix.js" | head -1

echo ""
echo "🌐 NEXT STEPS:"
echo "1. Wait 1-2 minutes for CDN propagation"
echo "2. Test https://snakkaz.com in browser"
echo "3. Check browser console for remaining 404 errors"
echo "4. Verify chat functionality is restored"
echo ""
echo "📱 Norwegian Tech Community Chat should now be FULLY FUNCTIONAL! 🇳🇴"
