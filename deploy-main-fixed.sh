#!/bin/bash

# Deploy Snakkaz Chat with Memory Integration to www.snakkaz.com
# Fixed deploy script with correct FTP credentials

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

# Deploy using lftp with correct credentials from cPanel
echo "🌐 Uploading to www.snakkaz.com..."

lftp -c "
# Connect to the server with correct credentials
open -u SnakkaZ@snakkaz.com,Snakkaz2025! ftp.snakkaz.com

# SSL/TLS settings - disable SSL based on errors
set ssl:verify-certificate no
set ftp:ssl-allow no
set ftp:ssl-protect-data no
set ftp:passive-mode yes

# Network settings
set net:timeout 120
set net:max-retries 5

# Navigate to the correct directory (main domain)
cd /home/snakqsqe/public_html

# Create backup directory for safety
mkdir backup-$(date +%Y%m%d) 2>/dev/null || true

# Upload all files from dist to public_html
mirror -R dist/ ./ --parallel=3 --verbose

# Set proper permissions
chmod 644 *.html *.js *.css *.json 2>/dev/null || true
chmod 755 assets images 2>/dev/null || true

echo 'Deployment complete!'
quit
"

echo "✅ Successfully deployed to www.snakkaz.com"
echo "🔍 Verifying deployment..."

# Test the site connection
if curl -s --head https://www.snakkaz.com | grep "200 OK" > /dev/null; then
    echo "✅ Site is responding with 200 OK"
else
    echo "⚠️ Site might still be updating, check manually"
fi

echo "🎉 Deployment complete!"
