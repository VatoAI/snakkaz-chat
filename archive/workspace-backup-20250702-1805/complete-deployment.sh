#!/bin/bash

# Complete Deployment Script - Fix Hash Mismatch Issue
# This script ensures all build files are uploaded correctly and synchronously

set -e  # Exit on any error

echo "🚀 Starting complete deployment for snakkaz.com..."

# Step 1: Clean build
echo "📦 Building application..."
npm run build
echo "✅ Build completed"

# Step 2: Verify build files exist
echo "🔍 Verifying build files..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html not found in dist/"
    exit 1
fi

JS_FILES=$(find dist/assets/js -name "*.js" | wc -l)
CSS_FILES=$(find dist/assets/css -name "*.css" | wc -l)

echo "   Found $JS_FILES JavaScript files"
echo "   Found $CSS_FILES CSS files"

if [ "$JS_FILES" -eq 0 ] || [ "$CSS_FILES" -eq 0 ]; then
    echo "❌ Missing essential files"
    exit 1
fi

echo "✅ Build verification passed"

# Step 3: Clean duplicate files
echo "🧹 Cleaning duplicate files..."
cd dist
# Remove duplicate _routes.json if it exists
if [ -f "_routes.json" ]; then
    # Keep only one _routes.json file
    ls -la _routes.json* | head -1
    rm -f _routes.json.*
fi
cd ..

# Step 4: Deploy via LFTP with proper synchronization
echo "📤 Deploying to production server..."

lftp -c "
set ssl:verify-certificate no
set ftp:passive-mode on
set cmd:fail-exit yes
set ftp:charset utf8
set file:charset utf8

# Connect to FTP
open -u admin@snakkaz.com,Rompetroll123! ftp://ftp.snakkaz.com

echo 'Connected to FTP server'

# Upload files without trying to change permissions
lcd dist
cd /

# Upload index.html first
put index.html
echo 'index.html uploaded'

# Upload assets directory
mirror -R --delete --no-perms --verbose assets/ assets/
echo 'Assets uploaded'

# Upload other files (avoid permission changes)
mput -O / *.json *.txt *.ico 2>/dev/null || echo 'No additional files to upload'

# Verify upload by listing key files
echo 'Verifying upload:'
ls -la index.html
ls -la assets/js/ | head -5
ls -la assets/css/ | head -5

quit
"

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Site should be updated at: https://www.snakkaz.com"
    echo ""
    echo "📋 Deployment Summary:"
    echo "   • HTML file: index.html"
    echo "   • JavaScript files: $JS_FILES"
    echo "   • CSS files: $CSS_FILES"
    echo "   • All files synchronized with hashes"
else
    echo "❌ Deployment failed!"
    exit 1
fi
