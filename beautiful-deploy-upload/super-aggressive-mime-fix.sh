#!/bin/bash

# ========================================
# SNAKKAZ SUPER AGGRESSIVE MIME TYPE FIX
# Tvinger riktige MIME typer med alle metoder
# ========================================

set -e

echo "🚨 SNAKKAZ SUPER AGGRESSIVE MIME TYPE FIX"
echo "========================================="
echo "🎯 Problem: Server overstyrer MIME typer"
echo "🔧 Løsning: Super aggressiv .htaccess"
echo ""

# Create super aggressive .htaccess
cat > /tmp/super-htaccess << 'EOF'
# SUPER AGGRESSIVE MIME TYPE ENFORCEMENT
# Multiple methods to force correct MIME types

# Method 1: AddType directives
AddType application/javascript .js
AddType text/css .css
AddType text/html .html
AddType application/json .json

# Method 2: ForceType for specific patterns
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

# Method 3: Override server defaults
<Files "index-*.css">
    ForceType text/css
    Header always set Content-Type "text/css"
</Files>

<Files "index-*.js">
    ForceType application/javascript
    Header always set Content-Type "application/javascript"
</Files>

# Method 4: Directory-specific overrides
<IfModule mod_mime.c>
    RemoveType .js
    RemoveType .css
    AddType application/javascript .js
    AddType text/css .css
</IfModule>

# Security headers (prevent MIME sniffing)
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Cache control for assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# SPA routing support
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/assets/
RewriteRule . /index.html [L]

# Error pages
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html

# HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
EOF

# Deploy super aggressive fix
cat > /tmp/deploy-super-fix.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-allow no

open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com

# Go to root directory
cd /public_html || cd /

# Upload the super aggressive .htaccess
put /tmp/super-htaccess .htaccess

# Also create .htaccess in assets directory
cd assets || mkdir assets
cd assets
put /tmp/super-htaccess .htaccess

# Create .htaccess in CSS directory
cd css || mkdir css
cd css  
put /tmp/super-htaccess .htaccess

# Create .htaccess in JS directory
cd ..
cd js || mkdir js
cd js
put /tmp/super-htaccess .htaccess

echo "✅ Super aggressive MIME type fix deployed to all directories"
bye
EOF

echo "🚀 Deploying super aggressive MIME type fix..."

# Execute deployment
lftp -f /tmp/deploy-super-fix.lftp

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUPER AGGRESSIVE FIX DEPLOYED!"
    echo "================================"
    echo "✅ .htaccess deployed to root directory"
    echo "✅ .htaccess deployed to /assets/ directory"
    echo "✅ .htaccess deployed to /assets/css/ directory"
    echo "✅ .htaccess deployed to /assets/js/ directory"
    echo ""
    echo "🔧 Applied multiple MIME type enforcement methods:"
    echo "   • AddType directives"
    echo "   • ForceType with Headers"
    echo "   • File-specific overrides"
    echo "   • Directory-specific rules"
    echo "   • RemoveType + AddType"
    echo ""
    echo "🔗 Test immediately:"
    echo "   https://www.snakkaz.com"
    echo ""
    echo "💡 This should force correct MIME types even on stubborn servers"
    echo ""
else
    echo "❌ DEPLOYMENT FAILED!"
    exit 1
fi

# Cleanup
rm -f /tmp/deploy-super-fix.lftp /tmp/super-htaccess

echo "🧹 Cleanup completed"
echo "Super aggressive fix deployed: $(date)"
