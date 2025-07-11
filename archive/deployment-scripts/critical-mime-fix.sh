#!/bin/bash

# ========================================
# SNAKKAZ CRITICAL MIME TYPE FIX
# Mer aggressiv .htaccess fix
# ========================================

set -e

echo "🚨 SNAKKAZ CRITICAL MIME TYPE FIX"
echo "================================="

# Working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📊 Status: CRITICAL MIME type fix - CSS og JS blokkert"
echo "🎯 Target: www.snakkaz.com"
echo "🔧 Issue: CSS servet som text/html, JS modul laster ikke"
echo ""

# Create critical .htaccess fix
cat > /tmp/critical-htaccess << 'EOF'
# CRITICAL MIME TYPE FIX - AGGRESSIVE
# Force correct MIME types for all static assets

# JavaScript Files
<FilesMatch "\.(js|mjs)$">
    ForceType application/javascript
    Header set Content-Type "application/javascript; charset=utf-8"
</FilesMatch>

# CSS Files  
<FilesMatch "\.css$">
    ForceType text/css
    Header set Content-Type "text/css; charset=utf-8"
</FilesMatch>

# HTML Files
<FilesMatch "\.html$">
    ForceType text/html
    Header set Content-Type "text/html; charset=utf-8"
</FilesMatch>

# JSON Files
<FilesMatch "\.json$">
    ForceType application/json
    Header set Content-Type "application/json; charset=utf-8"
</FilesMatch>

# Basic MIME Types (fallback)
AddType application/javascript .js .mjs
AddType text/css .css
AddType text/html .html
AddType application/json .json
AddType image/png .png
AddType image/jpeg .jpg .jpeg
AddType image/svg+xml .svg
AddType image/x-icon .ico

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# CORS for assets (if needed)
<FilesMatch "\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico)$">
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>

# Cache Control for assets
<FilesMatch "\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# SPA Routing - Only for HTML requests
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|xml|txt)$
RewriteRule ^.*$ /index.html [L]

# HTTPS Redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
EOF

# Create ultra-simple deployment script
cat > /tmp/deploy-critical.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-allow no

# Connect
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com

# Go to root (try both paths)
cd /public_html || cd /

# Upload critical .htaccess file
put /tmp/critical-htaccess .htaccess

echo "✅ Critical .htaccess deployed"
bye
EOF

echo "🚀 Deploying critical MIME type fix..."

# Execute critical deployment
lftp -f /tmp/deploy-critical.lftp

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 CRITICAL FIX DEPLOYED!"
    echo "========================"
    echo "✅ Aggressive .htaccess with ForceType uploaded"
    echo "✅ CSS files forced to text/css"
    echo "✅ JS files forced to application/javascript"
    echo "✅ Content-Type headers explicit"
    echo ""
    echo "🔗 Test immediately:"
    echo "   • https://www.snakkaz.com"
    echo "   • Check DevTools Network tab for MIME types"
    echo ""
    echo "🔧 Applied fixes:"
    echo "   • ForceType for .css and .js files"
    echo "   • Explicit Content-Type headers"
    echo "   • CORS headers for assets"
    echo "   • Improved SPA routing"
    echo ""
else
    echo "❌ CRITICAL DEPLOYMENT FAILED!"
    exit 1
fi

# Cleanup
rm -f /tmp/deploy-critical.lftp
rm -f /tmp/critical-htaccess

echo "🧹 Cleanup completed"
echo "Critical fix deployed: $(date)"
