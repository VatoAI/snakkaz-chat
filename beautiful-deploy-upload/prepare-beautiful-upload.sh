#!/bin/bash

echo "🎨✨ UPLOADING BEAUTIFUL LIQUID GLASS VERSION TO WWW.SNAKKAZ.COM"
echo "================================================================"

# Create comprehensive upload package
echo "📦 Creating complete deployment package..."

# Create upload directory
rm -rf beautiful-deploy-upload
mkdir -p beautiful-deploy-upload

# Copy all current files (now with liquid glass)
cp -r * beautiful-deploy-upload/ 2>/dev/null || true
rm -rf beautiful-deploy-upload/beautiful-deploy-upload  # Remove recursive copy

cd beautiful-deploy-upload

echo "✅ Files prepared for upload:"
echo "  📄 $(find . -name "*.html" | wc -l) HTML files"
echo "  🎨 $(find . -name "*.css" | wc -l) CSS files"  
echo "  ⚡ $(find . -name "*.js" | wc -l) JavaScript files"
echo "  🖼️ $(find . -name "*.png" -o -name "*.jpg" -o -name "*.svg" -o -name "*.ico" | wc -l) Image files"

# Verify liquid glass is included
if [ -f "assets/css/pages-main-mrR2Awbu.css" ]; then
    echo "  ✨ Liquid Glass Design System: INCLUDED"
else
    echo "  ❌ Warning: Liquid Glass CSS missing"
fi

cd ..

echo ""
echo "🚀 Ready for FTP upload to www.snakkaz.com"
echo "📁 Upload directory: beautiful-deploy-upload/"
echo ""
echo "🎨 This version includes:"
echo "  ✨ Complete Liquid Glass Design System"
echo "  🌟 All variants (Subtle, Moderate, Dramatic, Premium)"
echo "  🎭 Color themes (Primary Blue, Brand Gold, Alert Red)"
echo "  📱 Mobile-optimized glass effects"
echo "  🔧 Emergency React fixes (integrated seamlessly)"
echo "  💎 Shimmer animations and bubble effects"
echo "  🚀 Performance-optimized CSS"
echo ""
echo "📋 Manual FTP upload steps:"
echo "1. Connect to your FTP client"
echo "2. Navigate to public_html/ directory"
echo "3. Upload all contents from beautiful-deploy-upload/"
echo "4. Verify index.html is uploaded correctly"
echo ""
echo "🎉 The beautiful liquid glass design will be restored! ✨"
