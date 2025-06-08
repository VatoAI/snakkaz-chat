#!/bin/bash

# 🚨 EMERGENCY DEPLOYMENT SCRIPT WITH CORRECTED FTP CREDENTIALS
# Based on cPanel screenshots provided by user showing correct credentials
# Juni 8, 2025 - Critical deployment fix

echo "🚨 EMERGENCY DEPLOYMENT - CORRECTED FTP CREDENTIALS"
echo "=================================================="
echo "Using corrected FTP credentials from cPanel screenshots:"
echo "Server: ftp.snakkaz.com"
echo "Username: snakqsqe"
echo "Path: /home/snakqsqe/public_html"
echo ""

# Set correct FTP credentials from cPanel screenshots
FTP_SERVER="ftp.snakkaz.com"
FTP_USERNAME="snakqsqe"
FTP_PATH="/home/snakqsqe/public_html"

# Check if we have the built dist directory
if [ ! -d "dist" ]; then
    echo "❌ No dist directory found. Building first..."
    npm run build --no-lint
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Cannot proceed."
        exit 1
    fi
fi

echo "✅ Found dist directory with new bundles:"
ls -la dist/assets/ | grep -E "(index|vendor)"

# Create LFTP script with corrected credentials
cat > emergency-deploy-corrected.lftp << EOF
# Emergency deployment with corrected FTP credentials
open -u ${FTP_USERNAME} ${FTP_SERVER}
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-protect-list yes
set net:timeout 60
set net:max-retries 10
set net:reconnect-interval-base 5
set cmd:fail-exit yes

# List current directory to verify connection
pwd
ls -la

# Change to public_html directory
cd public_html

# Mirror the dist directory with parallel transfers
echo "Starting file upload..."
mirror -R dist/ ./ --no-perms --parallel=3 --verbose

# Verify upload by listing files
echo "Verifying uploaded files..."
ls -la assets/

bye
EOF

echo ""
echo "🚀 Starting LFTP deployment with corrected credentials..."
echo "This will upload the NEW bundles to fix the 'Nt is undefined' error"
echo ""

# Run LFTP with the corrected script
if lftp -f emergency-deploy-corrected.lftp; then
    echo ""
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo "New bundles should now be live on www.snakkaz.com"
    echo ""
    echo "📊 Checking live site status..."
    
    # Quick status check
    if curl -s -o /dev/null -w "%{http_code}" "https://www.snakkaz.com" | grep -q "200"; then
        echo "✅ Site is responding with HTTP 200"
    else
        echo "⚠️  Site may not be responding correctly"
    fi
    
    echo ""
    echo "🔍 Please verify:"
    echo "1. Check https://www.snakkaz.com in browser"
    echo "2. Open developer console to verify no 'Nt is undefined' errors"
    echo "3. Confirm new bundle names are loaded:"
    echo "   - index-CEa86-6h.js"
    echo "   - vendor-misc-npIDrE24.js"
    
else
    echo ""
    echo "❌ DEPLOYMENT FAILED"
    echo "Trying alternative curl method..."
    
    # Fallback method using curl
    echo "📤 Uploading index.html..."
    curl -v -T dist/index.html --user "${FTP_USERNAME}" "ftp://${FTP_SERVER}${FTP_PATH}/index.html"
    
    echo "📤 Uploading main JavaScript bundle..."
    curl -v -T dist/assets/index-*.js --user "${FTP_USERNAME}" "ftp://${FTP_SERVER}${FTP_PATH}/assets/"
    
    echo "📤 Uploading vendor bundle..."
    curl -v -T dist/assets/vendor-*.js --user "${FTP_USERNAME}" "ftp://${FTP_SERVER}${FTP_PATH}/assets/"
fi

echo ""
echo "🎯 EMERGENCY DEPLOYMENT COMPLETE"
echo "Norwegian tech community should now have access to working chat!"
echo "Monitor: https://www.snakkaz.com"

# Clean up
rm -f emergency-deploy-corrected.lftp
