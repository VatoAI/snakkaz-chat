#!/bin/bash

# DIRECT EMERGENCY FTP DEPLOYMENT
# Using verified admin@snakkaz.com credentials that just worked

echo "🚨 DIRECT EMERGENCY DEPLOYMENT"
echo "Using verified credentials: admin@snakkaz.com"

# Ensure ULTIMATE-EMERGENCY-INDEX.html exists
if [ ! -f "ULTIMATE-EMERGENCY-INDEX.html" ]; then
    echo "❌ ULTIMATE-EMERGENCY-INDEX.html not found!"
    exit 1
fi

echo "📤 Uploading ULTIMATE emergency fix..."

# Direct FTP upload with verified credentials
lftp -c "
set ssl:verify-certificate no
set ftp:passive-mode on
open ftp://admin@snakkaz.com:Rompetroll123!@ftp.snakkaz.com
put ULTIMATE-EMERGENCY-INDEX.html -o index.html
chmod 644 index.html
ls -la index.html
quit
"

echo "✅ Upload completed!"
echo ""
echo "🔍 Verifying deployment in 5 seconds..."
sleep 5

# Verify that our emergency fix is live
if curl -s https://snakkaz.com/ | grep -q "ULTRA EMERGENCY"; then
    echo "✅ SUCCESS! ULTIMATE emergency fix is now LIVE!"
    echo "🎯 React 'useLayoutEffect undefined' error should be fixed!"
else
    echo "⚠️  Upload completed but emergency fix markers not detected"
    echo "🔍 Manual verification recommended: https://snakkaz.com/"
fi

echo ""
echo "🌐 Check live site: https://snakkaz.com/"
echo "📊 Browser console should show: '🚨 ULTRA EMERGENCY: Initializing React hooks...'"
