#!/bin/bash

# ========================================
# CRITICAL HTACCESS MIME TYPE FIX
# Ultra-aggressiv fix for MIME type problem
# ========================================

set -e

echo "🚨 CRITICAL: HTACCESS MIME TYPE FIX"
echo "==================================="

# Create the most aggressive .htaccess possible
cat > /tmp/critical-htaccess << 'EOF'
# ULTRA-AGGRESSIVE MIME TYPE FIX
# Force correct MIME types for all assets

# JavaScript files - FORCE application/javascript
<FilesMatch "\.(js|mjs)$">
    ForceType application/javascript
    Header set Content-Type "application/javascript; charset=utf-8"
</FilesMatch>

# CSS files - FORCE text/css
<FilesMatch "\.css$">
    ForceType text/css
    Header set Content-Type "text/css; charset=utf-8"
</FilesMatch>

# HTML files
<FilesMatch "\.html$">
    ForceType text/html
    Header set Content-Type "text/html; charset=utf-8"
</FilesMatch>

# JSON files
<FilesMatch "\.json$">
    ForceType application/json
    Header set Content-Type "application/json; charset=utf-8"
</FilesMatch>

# Source map files
<FilesMatch "\.map$">
    ForceType application/json
    Header set Content-Type "application/json; charset=utf-8"
</FilesMatch>

# Image files
<FilesMatch "\.(png|jpg|jpeg|gif|svg|ico)$">
    Header set Content-Type "image/*"
</FilesMatch>

# Add fallback MIME types
AddType application/javascript .js .mjs
AddType text/css .css
AddType text/html .html
AddType application/json .json .map
AddType image/png .png
AddType image/jpeg .jpg .jpeg
AddType image/gif .gif
AddType image/svg+xml .svg
AddType image/x-icon .ico

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Disable server signature
ServerSignature Off

# Error pages for SPA
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html

# HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache control for assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|ico)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# Prevent access to sensitive files
<FilesMatch "\.(env|log|sql|bak|backup|old)$">
    Order deny,allow
    Deny from all
</FilesMatch>
EOF

echo "📦 Created ultra-aggressive .htaccess"

# Create emergency deployment script
cat > /tmp/critical-deploy.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-allow no

# Connect
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com

# Go to root directory
cd /public_html || cd /

# Upload .htaccess with HIGHEST PRIORITY
put /tmp/critical-htaccess .htaccess

echo "✅ Critical .htaccess deployed"
bye
EOF

echo "🚀 Deploying critical MIME type fix..."

# Execute deployment
lftp -f /tmp/critical-deploy.lftp

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 CRITICAL FIX DEPLOYED!"
    echo "========================="
    echo "✅ Ultra-aggressive .htaccess uploaded"
    echo "✅ ForceType directives for all asset types"
    echo "✅ Content-Type headers explicitly set"
    echo "✅ AddType fallbacks included"
    echo ""
    echo "🔗 Test immediately:"
    echo "   https://www.snakkaz.com"
    echo ""
    echo "🔧 Applied:"
    echo "   • ForceType application/javascript for .js"
    echo "   • ForceType text/css for .css"
    echo "   • Explicit Content-Type headers"
    echo "   • Multiple fallback mechanisms"
    echo ""
else
    echo "❌ CRITICAL DEPLOYMENT FAILED!"
    exit 1
fi

# Cleanup
rm -f /tmp/critical-deploy.lftp /tmp/critical-htaccess

echo "🚨 CRITICAL FIX COMPLETED: $(date)"
