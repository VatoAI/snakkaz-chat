#!/bin/bash

# MASS VENDOR UPLOAD - Final Fix for Black Screen
# Date: June 8, 2025

echo "🚀 MASS UPLOADING ALL VENDOR BUNDLES TO FIX SNAKKAZ.COM"
echo "======================================================="

# FTP Configuration
FTP_SERVER="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Eplekake123!"
LOCAL_DIR="/workspaces/snakkaz-chat/dist/assets/js"

echo "📂 Source directory: $LOCAL_DIR"
echo "🎯 Target: $FTP_SERVER/public_html/assets/js/"
echo ""

# Count total vendor files
VENDOR_COUNT=$(ls $LOCAL_DIR/vendor-*.js 2>/dev/null | wc -l)
echo "📊 Found $VENDOR_COUNT vendor bundle files to upload"
echo ""

# Upload each vendor file individually
counter=1
for file in $LOCAL_DIR/vendor-*.js; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        echo "[$counter/$VENDOR_COUNT] 📤 Uploading: $filename"
        
        # Upload with curl
        curl --silent --show-error \
             -T "$file" \
             "ftp://${FTP_USER}:${FTP_PASS}@${FTP_SERVER}/public_html/assets/js/$filename" && \
        echo "  ✅ Success: $filename" || \
        echo "  ❌ Failed: $filename"
        
        ((counter++))
        sleep 1  # Brief pause between uploads
    fi
done

echo ""
echo "🔍 VERIFICATION: Testing a few key vendor files..."
sleep 5  # Wait for propagation

# Test key files
key_files=(
    "vendor-react-core-iFRBiayd.js"
    "vendor-react-dom-DJJO0aee.js" 
    "vendor-supabase-core-BqDz4zbK.js"
    "vendor-router-B0BV1ApG.js"
)

for file in "${key_files[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://snakkaz.com/assets/js/$file")
    if [[ "$status" == "200" ]]; then
        echo "✅ $file - ACCESSIBLE"
    else
        echo "❌ $file - Status: $status"
    fi
done

echo ""
echo "🌐 Testing main site after vendor uploads..."
main_status=$(curl -s -o /dev/null -w "%{http_code}" "https://snakkaz.com/")
echo "Main site status: $main_status"

echo ""
echo "🎉 VENDOR UPLOAD COMPLETE!"
echo "🇳🇴 Snakkaz Norwegian Tech Community Chat should now be fully functional!"
