#!/bin/bash

# Safe FTP Deployment - No Permission Changes
# This script uploads files without attempting to change permissions

set -e

echo "🚀 Safe deployment starting..."

# Check if lftp is available
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp not found. Installing..."
    sudo apt-get update && sudo apt-get install -y lftp
fi

echo "📦 Building application..."
npm run build

# Clean up duplicate files in dist
echo "🧹 Cleaning dist directory..."
cd dist

# Remove any duplicate _routes.json files
if ls _routes.json* 1> /dev/null 2>&1; then
    echo "Found _routes.json files, keeping only one..."
    # Keep the first one, remove others
    ls -la _routes.json*
    find . -name "_routes.json*" -type f | tail -n +2 | xargs rm -f 2>/dev/null || true
fi

cd ..

echo "📤 Uploading files via FTP..."

# Use lftp with minimal permission handling
lftp -c "
set ssl:verify-certificate no
set ftp:passive-mode on
set cmd:fail-exit yes
set net:timeout 30
set net:max-retries 3

# Connect
open -u admin@snakkaz.com,Rompetroll123! ftp://ftp.snakkaz.com

echo 'FTP connection established'

# Go to local dist and remote root
lcd dist
cd /

# Upload critical files first
echo 'Uploading index.html...'
put index.html

# Upload assets with specific flags to avoid permission issues
echo 'Uploading JavaScript files...'
mirror -R --no-perms --no-umask --verbose assets/js/ assets/js/

echo 'Uploading CSS files...'
mirror -R --no-perms --no-umask --verbose assets/css/ assets/css/

# Upload any other asset directories
mirror -R --no-perms --no-umask --verbose assets/images/ assets/images/ || echo 'No images directory found'

# Upload root files carefully
echo 'Uploading configuration files...'
mput -O / *.json *.txt *.ico *.xml *.webmanifest 2>/dev/null || echo 'No additional files found'

echo 'Upload completed, verifying...'

# Quick verification
ls -la index.html
ls assets/js/*.js | head -3
ls assets/css/*.css | head -3

quit
"

if [ $? -eq 0 ]; then
    echo "✅ Safe deployment completed successfully!"
    echo "🌐 Check your site: https://www.snakkaz.com"
    
    # Show what was deployed
    echo ""
    echo "📋 Deployed files:"
    echo "   HTML: $(ls dist/*.html | wc -l) files"
    echo "   JS: $(find dist/assets/js -name '*.js' | wc -l) files"
    echo "   CSS: $(find dist/assets/css -name '*.css' | wc -l) files"
else
    echo "❌ Deployment failed!"
    exit 1
fi
