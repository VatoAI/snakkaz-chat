#!/bin/bash
# CORRECTED Emergency Fix for snakkaz.com JavaScript loading

echo "🚨 EMERGENCY: Fixing JavaScript loading with CORRECT FTP details"
echo "Timestamp: $(date)"

# Check if dist directory exists and has files
if [ ! -f "dist/index.html" ]; then
    echo "❌ No dist/index.html found. Building first..."
    npm run build
    sleep 2
fi

echo "📋 Files to deploy:"
echo "- index.html: $(ls -lh dist/index.html | awk '{print $5}')"
echo "- Main JS: $(ls -lh dist/assets/js/index-*.js | head -1 | awk '{print $5 " " $9}' | cut -d'/' -f4)"

# Get the actual main JS filename from dist
MAIN_JS_FILE=$(ls dist/assets/js/index-*.js | head -1 | xargs basename)
echo "🎯 Target JS file: $MAIN_JS_FILE"

# Create corrected FTP deployment
cat > corrected-emergency-deploy.lftp << EOF
#!/usr/bin/lftp -f

# CORRECTED FTP connection details
set ssl:verify-certificate false
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode on
set net:timeout 30
set net:max-retries 3

# Connect with CORRECT details
open -u SnakkaZ@snakkaz.com,Eplekake123! ftp://ftp.snakkaz.com

# Show current directory to confirm connection
pwd
ls -la

# Create directories if they don't exist
mkdir -p assets
mkdir -p assets/js  
mkdir -p assets/css

# Upload index.html (MOST CRITICAL)
echo "🔄 Uploading index.html..."
put dist/index.html index.html

# Upload the main JavaScript file
echo "🔄 Uploading main JS file: $MAIN_JS_FILE"
put dist/assets/js/$MAIN_JS_FILE assets/js/$MAIN_JS_FILE

# Upload essential vendor files one by one
echo "🔄 Uploading vendor files..."
put dist/assets/js/vendor-react-core-*.js assets/js/
put dist/assets/js/vendor-react-dom-*.js assets/js/
put dist/assets/js/vendor-router-*.js assets/js/

# Upload CSS
echo "🔄 Uploading CSS..."
put dist/assets/css/index-*.css assets/css/

# Upload .htaccess for MIME type fix
echo "🔄 Uploading .htaccess..."
put .htaccess .htaccess

# Set permissions
echo "🔧 Setting permissions..."
chmod 644 index.html
chmod 644 .htaccess
chmod -R 644 assets/

echo "✅ Emergency deployment completed successfully"
quit
EOF

chmod +x corrected-emergency-deploy.lftp

echo "🚀 Starting emergency deployment..."
./corrected-emergency-deploy.lftp

# Wait a moment for propagation
echo "⏳ Waiting for files to propagate..."
sleep 10

# Test the deployment
echo "🧪 Testing deployment..."

INDEX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/)
JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://snakkaz.com/assets/js/$MAIN_JS_FILE")

echo "📊 Results:"
echo "Index.html: HTTP $INDEX_STATUS"
echo "Main JS file: HTTP $JS_STATUS"

if [ "$INDEX_STATUS" = "200" ] && [ "$JS_STATUS" = "200" ]; then
    echo "🎉 SUCCESS! Both files deployed correctly"
    
    # Test MIME type
    MIME_TYPE=$(curl -s -I "https://snakkaz.com/assets/js/$MAIN_JS_FILE" | grep -i content-type | cut -d':' -f2 | tr -d ' \r\n')
    echo "🧪 MIME type: $MIME_TYPE"
    
    if [[ "$MIME_TYPE" == *"javascript"* ]]; then
        echo "✅ MIME type is correct!"
    else
        echo "⚠️  MIME type may need time to update"
    fi
    
    echo ""
    echo "🌟 NEXT STEPS:"
    echo "1. Go to https://snakkaz.com"
    echo "2. Press Ctrl+F5 (or Cmd+Shift+R on Mac) to hard refresh"
    echo "3. Check browser console (F12) for errors"
    echo ""
    echo "If you still see errors, wait 2-3 minutes for server cache to clear"
    
else
    echo "❌ Issues detected:"
    if [ "$INDEX_STATUS" != "200" ]; then
        echo "   - index.html not accessible (HTTP $INDEX_STATUS)"
    fi
    if [ "$JS_STATUS" != "200" ]; then
        echo "   - JavaScript file not accessible (HTTP $JS_STATUS)"
    fi
    echo ""
    echo "💡 Try using cPanel File Manager as backup:"
    echo "1. Login to your cPanel"
    echo "2. Go to File Manager"
    echo "3. Upload dist/index.html to public_html/"
    echo "4. Upload dist/assets/ folder contents to public_html/assets/"
fi

# Cleanup
rm -f corrected-emergency-deploy.lftp

echo "🏁 Emergency fix completed!"
