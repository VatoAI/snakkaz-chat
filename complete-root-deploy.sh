#!/bin/bash
echo "🚀 SNAKKAZ COMPLETE ROOT DEPLOYMENT"
echo "====================================="

echo "📁 Uploading all assets to ROOT directory..."

lftp << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
open -u admin@snakkaz.com,Rompetroll123! ftp://ftp.snakkaz.com

# Show where we are
pwd
echo "Current directory files:"
ls -la | head -5

# Remove old assets completely
rm -rf assets 2>/dev/null || echo "No old assets to remove"

# Create fresh asset directories in root
mkdir -p assets
mkdir -p assets/css
mkdir -p assets/js

echo "✅ Directories created"

# Upload CSS files
cd assets/css
lcd dist/assets/css
mput *.css
echo "✅ CSS files uploaded to root/assets/css"

# Upload JS files  
cd ../js
lcd ../js
mput *.js
echo "✅ JS files uploaded to root/assets/js"

# Upload .htaccess for MIME type fixes
cd ../../
put production-htaccess .htaccess
echo "✅ .htaccess uploaded to root"

# Final verification
echo "📊 Final verification:"
echo "CSS directory:"
ls -la assets/css/
echo "JS directory (first 3 files):"
ls -la assets/js/ | head -3
echo "Root .htaccess:"
ls -la .htaccess

quit
EOF

echo "🎉 Deployment completed!"
echo "🧪 Test at: https://www.snakkaz.com"
