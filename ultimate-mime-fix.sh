#!/bin/bash

# ========================================
# SNAKKAZ ULTIMATE MIME TYPE FIX
# Single .htaccess for root directory
# ========================================

set -e

echo "🚀 SNAKKAZ ULTIMATE MIME TYPE FIX"
echo "================================="
echo "🎯 Target: Root directory only"
echo "🔧 Method: Single comprehensive .htaccess"
echo ""

# Create the ultimate .htaccess fix
mkdir -p /tmp/ultimate-fix
cat > /tmp/ultimate-fix/.htaccess << 'EOF'
# ==================================================
# SNAKKAZ ULTIMATE MIME TYPE FIX
# Forces correct MIME types for ALL file types
# ==================================================

# Force correct MIME types - OVERRIDE SERVER DEFAULTS
<FilesMatch "\.js$">
    ForceType application/javascript
    Header set Content-Type "application/javascript"
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
    Header set Content-Type "text/css"
</FilesMatch>

<FilesMatch "\.html$">
    ForceType text/html
    Header set Content-Type "text/html"
</FilesMatch>

<FilesMatch "\.json$">
    ForceType application/json
    Header set Content-Type "application/json"
</FilesMatch>

# Additional MIME type declarations
AddType application/javascript .js
AddType text/css .css
AddType text/html .html
AddType application/json .json
AddType image/png .png
AddType image/jpeg .jpg .jpeg
AddType image/svg+xml .svg
AddType image/x-icon .ico

# Remove any charset conflicts for JS/CSS
<FilesMatch "\.(js|css)$">
    Header unset Content-Type
    Header set Content-Type "application/javascript" env=js
    Header set Content-Type "text/css" env=css
</FilesMatch>

# Security headers (keep existing)
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# SPA routing (keep existing)
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Error pages
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html
EOF

# Create simple deployment script
cat > /tmp/deploy-ultimate.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-allow no

# Connect
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com

# Go to root (try both common paths)
cd / || cd /public_html || pwd

# Set local directory
lcd /tmp/ultimate-fix

# Upload ONLY the .htaccess file
put .htaccess

echo "✅ Ultimate .htaccess uploaded to root"
quit
EOF

echo "🚀 Deploying ultimate .htaccess fix..."
lftp -f /tmp/deploy-ultimate.lftp

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ULTIMATE FIX DEPLOYED!"
    echo "========================"
    echo "✅ Single .htaccess in root directory"
    echo "✅ ForceType for JS and CSS files"
    echo "✅ Header overrides for Content-Type"
    echo "✅ No charset conflicts"
    echo ""
    echo "🔗 Test now:"
    echo "   https://www.snakkaz.com"
    echo ""
    echo "🔧 Should fix:"
    echo "   • CSS MIME type text/html → text/css"
    echo "   • JS MIME type errors"
    echo "   • Content-Type header conflicts"
    echo ""
else
    echo "❌ ULTIMATE DEPLOYMENT FAILED!"
    exit 1
fi

# Cleanup
rm -f /tmp/deploy-ultimate.lftp
rm -rf /tmp/ultimate-fix

echo "🧹 Cleanup completed"
echo "Ultimate fix deployed: $(date)"
