#!/bin/bash

echo "🚀 Snakkaz Chat Subdomain Deployment Package Creator"
echo "=================================================="

# Configuration
LOCAL_BUILD_DIR="/workspaces/snakkaz-chat/dist"
DEPLOY_DIR="/workspaces/snakkaz-chat/deployment-packages"
SUBDOMAINS=("dash" "business" "docs" "analytics" "mcp" "help")

# Check build directory
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo "❌ Error: Build directory not found at $LOCAL_BUILD_DIR"
    exit 1
fi

echo "📦 Build directory found with $(ls -1 $LOCAL_BUILD_DIR | wc -l) files"

# Create deployment directory
mkdir -p "$DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"/*

echo "📁 Creating deployment packages..."

# Create .htaccess content
HTACCESS_CONTENT='# Snakkaz Chat Subdomain Configuration
DirectoryIndex index.html

# Enable mod_rewrite
RewriteEngine On

# Handle React Router (SPA) - redirect all requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Don'\''t cache HTML files
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# Error pages - redirect 404s to index.html for SPA routing
ErrorDocument 404 /index.html'

# Create packages for each subdomain
for subdomain in "${SUBDOMAINS[@]}"; do
    echo "📦 Creating package for $subdomain.snakkaz.com..."
    
    package_dir="$DEPLOY_DIR/$subdomain-package"
    mkdir -p "$package_dir"
    
    # Copy all build files
    cp -r "$LOCAL_BUILD_DIR"/* "$package_dir/"
    
    # Create .htaccess file
    echo "$HTACCESS_CONTENT" > "$package_dir/.htaccess"
    
    # Create ZIP package
    cd "$DEPLOY_DIR"
    zip -r "$subdomain-snakkaz-deployment.zip" "$subdomain-package/" > /dev/null 2>&1
    
    echo "   ✅ Package created: $subdomain-snakkaz-deployment.zip"
    echo "   📁 Files: $(ls -1 $package_dir | wc -l) items"
done

echo ""
echo "🎉 All deployment packages created!"
echo ""
echo "📍 Location: $DEPLOY_DIR"
echo ""

# List created packages
echo "📦 Created packages:"
cd "$DEPLOY_DIR"
for subdomain in "${SUBDOMAINS[@]}"; do
    if [ -f "$subdomain-snakkaz-deployment.zip" ]; then
        size=$(ls -lh "$subdomain-snakkaz-deployment.zip" | awk '{print $5}')
        echo "   📁 $subdomain-snakkaz-deployment.zip ($size)"
    fi
done

echo ""
echo "📋 Deployment Instructions:"
echo "=========================="
echo "1. Download the ZIP files above"
echo "2. Extract each ZIP and upload ALL files to the corresponding subdomain directory:"
echo ""
for subdomain in "${SUBDOMAINS[@]}"; do
    echo "   🌐 $subdomain-snakkaz-deployment.zip -> /public_html/$subdomain/"
done
echo ""
echo "3. Ensure .htaccess file is uploaded for SPA routing"
echo "4. Test each subdomain to verify it shows Snakkaz Chat (not directory listing)"
echo ""
echo "🚀 Ready for deployment!"
