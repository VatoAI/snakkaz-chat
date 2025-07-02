#!/bin/bash

echo "🚀 SnakkaZ Complete Cache-Busting Deployment Script"
echo "=================================================="
echo "🕐 Started: $(date)"

# Create comprehensive deployment script
cat > complete-cache-bust-deploy.lftp << 'EOF'
set ssl:verify-certificate no
set xfer:clobber on

open -u SnakkaZ@snakkaz.com,Eplekake123! ftp://snakkaz.com
cd public_html

# 1. REMOVE ALL OLD CACHED FILES
echo "🧹 Removing old JS files..."
rm -f assets/js/vendor-react-core-*.js
rm -f assets/js/vendor-react-dom-*.js  
rm -f assets/js/vendor-misc-*.js
rm -f assets/js/index-*.js
rm -f assets/js/*.js.map
rm -f emergency-react-fix.js

# 2. CLEAR CSS CACHE
echo "🎨 Clearing CSS cache..."
rm -f assets/css/index-*.css

# 3. UPLOAD REACT CORE FILES FIRST (CRITICAL ORDER)
echo "⚛️ Uploading React core files in correct order..."
cd assets/js
lcd dist/assets/js
put -c vendor-react-core-DwHMgWgV.js
put -c vendor-react-dom-DBKh3-U4.js
put -c vendor-misc-D0zU6y7X.js

# 4. UPLOAD ALL OTHER JS FILES
echo "📦 Uploading remaining JS files..."
mput -c *.js
mput -c *.js.map

# 5. UPLOAD CSS
echo "🎨 Uploading CSS..."
cd ../css
lcd ../css
mput -c *.css

# 6. UPLOAD INDEX.HTML LAST (TRIGGERS BROWSER REFRESH)
echo "📄 Uploading index.html..."
cd ../../
lcd dist/
put -c index.html

# 7. FORCE CACHE HEADERS UPDATE
echo "💾 Setting cache control headers..."
put -c .htaccess

quit
EOF

echo "📡 Executing deployment..."
lftp -f complete-cache-bust-deploy.lftp

echo ""
echo "🔍 Post-deployment verification..."
sleep 5

# Verify critical files
echo "🧪 Testing React core file..."
if curl -f https://snakkaz.com/assets/js/vendor-react-core-DwHMgWgV.js > /dev/null 2>&1; then
    echo "✅ React Core: OK"
else
    echo "❌ React Core: FAILED"
    exit 1
fi

echo "🧪 Testing React DOM file..."
if curl -f https://snakkaz.com/assets/js/vendor-react-dom-DBKh3-U4.js > /dev/null 2>&1; then
    echo "✅ React DOM: OK"
else
    echo "❌ React DOM: FAILED"
    exit 1
fi

echo "🧪 Testing main site..."
if curl -f https://snakkaz.com/ > /dev/null 2>&1; then
    echo "✅ Main site: OK"
else
    echo "❌ Main site: FAILED"
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "📋 Summary:"
echo "   - Removed all old cached JS/CSS files"
echo "   - Uploaded React files in correct order"
echo "   - Updated index.html with proper modulepreload sequence"
echo "   - All health checks passed"
echo ""
echo "🌐 Visit: https://snakkaz.com"
echo "🕐 Completed: $(date)"
