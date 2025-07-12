#!/bin/bash

# SnakkaZ Quick Diagnostic and Fix
echo "🔍 SnakkaZ Deployment Diagnostikk"
echo "=================================="
echo "Dato: $(date)"
echo ""

# Test asset files
CSS_FILE="index-BztST-au.css"
JS_FILE="index-BivGdyB-.js"

echo "🧪 Testing asset files..."
echo -n "CSS Response Code: "
curl -s -w "%{http_code}" -o /dev/null "https://snakkaz.com/assets/css/$CSS_FILE"
echo ""

echo -n "JS Response Code: "
curl -s -w "%{http_code}" -o /dev/null "https://snakkaz.com/assets/js/$JS_FILE"
echo ""

echo -n "CSS Content-Type: "
curl -s -I "https://snakkaz.com/assets/css/$CSS_FILE" | grep -i content-type | cut -d: -f2 | xargs
echo ""

echo -n "JS Content-Type: "
curl -s -I "https://snakkaz.com/assets/js/$JS_FILE" | grep -i content-type | cut -d: -f2 | xargs
echo ""

# Check file sizes
echo -n "CSS File Size: "
curl -s "https://snakkaz.com/assets/css/$CSS_FILE" | wc -c
echo " bytes"

echo -n "JS File Size: "
curl -s "https://snakkaz.com/assets/js/$JS_FILE" | wc -c  
echo " bytes"

echo ""
echo "📋 Expected file sizes:"
echo "CSS: ~193KB (197,000+ bytes)"
echo "JS: ~14KB (14,000+ bytes)"

echo ""
echo "🔧 If files are small (HTML fallback), possible fixes:"
echo "1. Wait 5-10 minutes for CDN/cache to refresh"
echo "2. Check if .htaccess is working properly"
echo "3. Verify files were uploaded to correct location"

echo ""
echo "🚀 Quick test - check if React error is fixed:"
echo "Open https://snakkaz.com in browser and check console"
echo "The 'useLayoutEffect' error should be gone if deployment worked"
