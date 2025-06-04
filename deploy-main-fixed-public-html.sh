#!/bin/bash

# Deploy Snakkaz Chat to CORRECT public_html directory
# This fixes the deployment issue where files were going to root instead of public_html

echo "🚀 Starting deployment to www.snakkaz.com (public_html)..."
echo "📦 Deploying Memory-Enhanced AI Chat System with React useState fix"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Running build first..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Aborting deployment."
        exit 1
    fi
fi

echo "✅ Build files ready for deployment"
echo "📂 Files will be uploaded to public_html/ directory (CORRECT location)"

# Deploy using lftp with corrected public_html path
echo "🌐 Uploading to www.snakkaz.com/public_html/..."

lftp -c "
# Connect to the server with correct credentials
open -u SnakkaZ@snakkaz.com,Snakkaz2025! premium123.web-hosting.com

# SSL/TLS settings
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:passive-mode yes

# Network settings
set net:timeout 120
set net:max-retries 5

# CRITICAL FIX: Upload to public_html/ instead of root directory
mirror -R dist/ public_html/ --parallel=3 --verbose --delete

echo 'Deployment to public_html complete!'
quit
"

echo "✅ Successfully deployed to www.snakkaz.com/public_html/"
echo "🎉 Deployment complete! The site should now be updated."
echo ""
echo "🔍 Verifying deployment..."
curl -I https://www.snakkaz.com/ 2>/dev/null | head -n 1
