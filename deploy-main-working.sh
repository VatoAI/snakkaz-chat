#!/bin/bash

# Deploy Snakkaz Chat with Memory Integration to www.snakkaz.com
# Fixed deploy script based on successful connection test

echo "🚀 Starting deployment to www.snakkaz.com..."
echo "📦 Deploying Memory-Enhanced AI Chat System with useState fix"

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

# Deploy using lftp with known working configuration
echo "🌐 Uploading to www.snakkaz.com..."

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

# Upload all files from dist to public_html
mirror -R dist/ ./ --parallel=3 --verbose

echo 'Deployment complete!'
quit
"

echo "✅ Successfully deployed to www.snakkaz.com"
echo "🎉 Deployment complete!"
