#!/bin/bash

# Simple Snakkaz Chat Subdomain Deployment Script
# This script creates deployment packages for each subdomain

echo "🚀 Snakkaz Chat Subdomain Deployment Package Creator"
echo "=================================================="
echo ""

LOCAL_BUILD_DIR="/workspaces/snakkaz-chat/dist"
DEPLOY_DIR="/workspaces/snakkaz-chat/deployment-packages"

# Subdomain directories
SUBDOMAINS=("dash" "business" "docs" "analytics" "mcp" "help")

# Check if build directory exists
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo "❌ Error: Build directory not found at $LOCAL_BUILD_DIR"
    echo "Run 'npm run build' first!"
    exit 1
fi

# Create deployment directory
mkdir -p "$DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"/*

echo "📦 Creating deployment packages..."
echo ""

# Create subdomain-specific .htaccess file
create_subdomain_htaccess() {
    local subdomain="$1"
    cat > "$1" << 'EOF'
# Snakkaz Chat Subdomain Configuration
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
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Don't cache HTML files
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# Compress files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Error pages - redirect 404s to index.html for SPA routing
ErrorDocument 404 /index.html
EOF
}

# Function to create deployment package for each subdomain
create_deployment_package() {
    local subdomain="$1"
    local package_dir="$DEPLOY_DIR/$subdomain-package"
    
    echo "📦 Creating package for $subdomain.snakkaz.com..."
    
    # Create package directory
    mkdir -p "$package_dir"
    
    # Copy all build files
    cp -r "$LOCAL_BUILD_DIR"/* "$package_dir/"
    
    # Create subdomain-specific .htaccess
    create_subdomain_htaccess "$package_dir/.htaccess"
    
    # Create ZIP package
    cd "$DEPLOY_DIR"
    zip -r "$subdomain-snakkaz-deployment.zip" "$subdomain-package/" > /dev/null
    
    echo "   ✅ Package created: $subdomain-snakkaz-deployment.zip"
    echo "   📁 Files: $(ls -1 $package_dir | wc -l) items"
    echo ""
}

# Create packages for all subdomains
for subdomain in "${SUBDOMAINS[@]}"; do
    create_deployment_package "$subdomain"
done

echo "🎉 All deployment packages created!"
echo ""
echo "📍 Location: $DEPLOY_DIR"
echo ""
echo "📋 Deployment Instructions:"
echo "=========================="
echo ""
echo "For each subdomain, you need to:"
echo "1. Extract the corresponding ZIP file"
echo "2. Upload ALL files to the subdomain directory on your server:"
echo ""

for subdomain in "${SUBDOMAINS[@]}"; do
    echo "   🌐 $subdomain.snakkaz.com -> /public_html/$subdomain/"
done

echo ""
echo "3. Ensure the .htaccess file is uploaded to handle SPA routing"
echo "4. Verify subdomain shows the Snakkaz Chat app instead of directory listing"
echo ""
echo "🔧 Manual Upload Methods:"
echo "• cPanel File Manager"
echo "• FTP Client (FileZilla, WinSCP, etc.)"
echo "• SSH/rsync if available"
echo ""

# List all created packages
echo "📦 Created packages:"
ls -la "$DEPLOY_DIR"/*.zip 2>/dev/null | while read -r line; do
    filename=$(echo "$line" | awk '{print $9}')
    size=$(echo "$line" | awk '{print $5}')
    echo "   📁 $(basename "$filename") ($size bytes)"
done

echo ""
echo "🚀 Ready for deployment!"
