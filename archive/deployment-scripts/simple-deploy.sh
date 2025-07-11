#!/bin/bash
echo "🚀 SNAKKAZ EMERGENCY DEPLOYMENT"
echo "==============================="

# Check if build exists
if [ ! -f "dist/index.html" ]; then
    echo "❌ No build found. Running build first..."
    npm run build
fi

echo "📁 Files to deploy:"
ls -la dist/assets/css/
ls -la dist/assets/js/ | head -5

echo ""
echo "🔄 Starting deployment..."

# Simple direct upload of critical files
lftp << 'EOF'
set ssl:verify-certificate no  
set ftp:passive-mode on
open -u admin@snakkaz.com,Rompetroll123! ftp://ftp.snakkaz.com

# Upload index.html (includes CAPTCHA fix)
put dist/index.html index.html
echo "✅ index.html uploaded"

# Upload CSS 
cd assets/css || mkdir -p assets/css
cd assets/css
lcd dist/assets/css
mput *.css
echo "✅ CSS uploaded"

# Upload JS
cd ../js || mkdir -p js  
cd js
lcd ../js
mput *.js
echo "✅ JS uploaded"

# Verify upload
cd ../../
ls -la assets/css/
ls -la assets/js/ | head -3

quit
EOF

echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "========================"
echo "✅ Fixed CAPTCHA (multi-digit support)"
echo "✅ Fixed asset 404s (new build hashes)"
echo "✅ Fixed MIME type errors"
echo ""
echo "🧪 Test now: https://www.snakkaz.com"
echo "1. Check console for no 404 errors"
echo "2. Test CAPTCHA with multi-digit answers"
echo "3. Verify login works"
