#!/bin/bash

echo "📦 Snakkaz Chat - Files Ready for Subdomain Deployment"
echo "====================================================="
echo ""
echo "📂 Source directory: /workspaces/snakkaz-chat/dist/"
echo ""
echo "📋 Files to upload to EACH subdomain directory:"
echo "   (/public_html/dash/, /public_html/business/, etc.)"
echo ""

cd /workspaces/snakkaz-chat/dist/

echo "📄 ROOT FILES:"
find . -maxdepth 1 -type f | sort | sed 's/^\./ /'

echo ""
echo "📁 DIRECTORIES:"
find . -maxdepth 1 -type d | grep -v "^\.$" | sort | sed 's/^\./ /'

echo ""
echo "📊 TOTAL FILE COUNT:"
echo "   Files: $(find . -type f | wc -l)"
echo "   Directories: $(find . -type d | wc -l)"
echo "   Total size: $(du -sh . | cut -f1)"

echo ""
echo "⭐ CRITICAL FILES (must be present):"
echo "   ✅ index.html - Main app entry point"
echo "   ✅ assets/index-*.js - Contains subdomain detection code"
echo "   ✅ assets/index-*.css - App styling"
echo "   ✅ favicon.ico - App icon"

echo ""
echo "🔍 Verify subdomain detection code is included:"
if find assets -name "*.js" -exec grep -l "detectSubdomain" {} \; | head -1; then
    echo "   ✅ Subdomain detection code found in JavaScript bundle"
else
    echo "   ❌ Subdomain detection code NOT found - rebuild needed!"
fi

echo ""
echo "📋 DEPLOYMENT CHECKLIST:"
echo "   □ Upload ALL files to /public_html/dash/"
echo "   □ Upload ALL files to /public_html/business/"  
echo "   □ Upload ALL files to /public_html/docs/"
echo "   □ Upload ALL files to /public_html/analytics/"
echo "   □ Upload ALL files to /public_html/mcp/"
echo "   □ Upload ALL files to /public_html/help/"
echo "   □ Create .htaccess in each directory (see deployment guide)"
echo "   □ Test each subdomain in browser"
echo "   □ Verify console logs show subdomain detection"

echo ""
echo "🚀 Once deployed, all subdomains will serve the same React app"
echo "   but with different behavior based on subdomain detection!"
