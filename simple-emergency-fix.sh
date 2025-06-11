#!/bin/bash
# Enkel emergency fix for snakkaz.com

echo "🚨 EMERGENCY: Fixing JavaScript loading issues"
echo "Timestamp: $(date)"

# Sjekk at vi har dist-filer
if [ ! -f "dist/index.html" ]; then
    echo "❌ Ingen dist/index.html funnet!"
    exit 1
fi

# Upload med lftp i enkelt format
echo "🔄 Uploading files..."

lftp -c "
set ssl:verify-certificate false;
set ftp:ssl-force true;
set ftp:ssl-protect-data true;
open -u snakkaz.com,B48@.m*VhQUF sftp://ftp.domeneshop.no;

# Upload index.html
put dist/index.html index.html;

# Sørg for at assets-mapper eksisterer
mkdir -p assets;
mkdir -p assets/js;  
mkdir -p assets/css;

# Upload viktigste JS-filer en for en
put dist/assets/js/index-BqZ1ZR0w.js assets/js/index-BqZ1ZR0w.js;
put dist/assets/js/vendor-react-core-BSO5imIi.js assets/js/vendor-react-core-BSO5imIi.js;
put dist/assets/js/vendor-react-dom-j8zB92ij.js assets/js/vendor-react-dom-j8zB92ij.js;
put dist/assets/js/vendor-router-gbecoqwO.js assets/js/vendor-router-gbecoqwO.js;

# Upload CSS
put dist/assets/css/index-uDlWtT9E.css assets/css/index-uDlWtT9E.css;

# Upload .htaccess
put .htaccess .htaccess;

quit;
"

echo "✅ Upload completed"

# Test
echo "🧪 Testing..."
sleep 5

MAIN_JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/assets/js/index-BqZ1ZR0w.js)
INDEX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/)

echo "Index.html status: $INDEX_STATUS"
echo "Main JS status: $MAIN_JS_STATUS"

if [ "$MAIN_JS_STATUS" = "200" ]; then
    echo "✅ SUCCESS! JavaScript files are now accessible"
    echo "🎉 Please test https://snakkaz.com in your browser"
    echo "💡 Remember to clear browser cache (Ctrl+F5)"
else
    echo "❌ Still issues with JavaScript files"
    echo "💡 May need server restart or DNS propagation time"
fi
