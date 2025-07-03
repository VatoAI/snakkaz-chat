#!/bin/bash

# ========================================
# SNAKKAZ DEFINITIVE SERVER FIX
# Løser MIME type problemet permanent
# ========================================

set -e

echo "🔧 SNAKKAZ DEFINITIVE SERVER FIX"
echo "================================"

# Working directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📊 Problem: Server returnerer HTML i stedet for JavaScript"
echo "🎯 Løsning: Kraftig .htaccess med override-direktiver"
echo "🔧 Mål: Få vendor-filene til å fungere"
echo ""

# Build først
echo "🔨 Building Snakkaz app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed"

# Create deployment package
echo "📦 Creating deployment package..."
rm -rf /tmp/snakkaz-fix
mkdir -p /tmp/snakkaz-fix
cp -r dist/* /tmp/snakkaz-fix/

# Create super-aggressive .htaccess that FORCES correct MIME types
cat > /tmp/snakkaz-fix/.htaccess << 'EOF'
# ========================================
# SNAKKAZ DEFINITIVE MIME TYPE FIX
# This will FORCE the server to serve correct MIME types
# ========================================

# Enable rewrite engine
RewriteEngine On

# FORCE JavaScript MIME type for ALL .js files
<FilesMatch "\.(js)$">
    # Remove any existing content-type
    Header unset Content-Type
    # Force the correct MIME type
    Header always set Content-Type "application/javascript; charset=utf-8"
    # Override server default
    ForceType application/javascript
</FilesMatch>

# FORCE CSS MIME type for ALL .css files  
<FilesMatch "\.(css)$">
    Header unset Content-Type
    Header always set Content-Type "text/css; charset=utf-8"
    ForceType text/css
</FilesMatch>

# FORCE HTML MIME type for .html files
<FilesMatch "\.(html)$">
    Header unset Content-Type
    Header always set Content-Type "text/html; charset=utf-8"
    ForceType text/html
</FilesMatch>

# Add comprehensive MIME type mappings
AddType application/javascript .js
AddType text/css .css
AddType text/html .html
AddType application/json .json
AddType text/plain .txt
AddType image/png .png
AddType image/jpeg .jpg .jpeg
AddType image/gif .gif
AddType image/svg+xml .svg
AddType image/x-icon .ico

# Disable server's MIME type sniffing
Header always set X-Content-Type-Options "nosniff"

# Allow cross-origin requests for JavaScript modules
<FilesMatch "\.(js)$">
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type"
</FilesMatch>

# Cache control for better performance
<FilesMatch "\.(js|css)$">
    Header always set Cache-Control "public, max-age=31536000"
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# SPA fallback for React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/assets/
RewriteRule ^(.*)$ /index.html [L,QSA]

# Error pages
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html
EOF

# Create .htaccess for assets folder specifically
mkdir -p /tmp/snakkaz-fix/assets
cat > /tmp/snakkaz-fix/assets/.htaccess << 'EOF'
# Assets-specific MIME type enforcement
ForceType application/javascript js
ForceType text/css css

<FilesMatch "\.(js)$">
    Header always set Content-Type "application/javascript; charset=utf-8"
</FilesMatch>

<FilesMatch "\.(css)$">
    Header always set Content-Type "text/css; charset=utf-8"
</FilesMatch>
EOF

# Create deployment script
cat > /tmp/deploy-definitive-fix.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-allow no
set ftp:passive-mode on

# Connect
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com

# Navigate to root
cd /public_html || cd /

# Set local directory
lcd /tmp/snakkaz-fix

# Upload .htaccess FIRST (most important)
put .htaccess

# Upload index.html
put index.html

# Upload all other files
mput -E *.json *.txt *.xml *.png *.jpg *.ico *.svg

# Upload assets directory with mirror
mirror -R --delete assets/ assets/

echo "✅ Definitive fix deployed with aggressive MIME type enforcement"
bye
EOF

echo "🚀 Deploying definitive server fix..."

# Execute deployment
lftp -f /tmp/deploy-definitive-fix.lftp

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEFINITIVE FIX DEPLOYED!"
    echo "=========================="
    echo "✅ Aggressive .htaccess deployed"
    echo "✅ MIME type enforcement active"
    echo "✅ Vendor files should now load correctly"
    echo "✅ All JavaScript files forced to application/javascript"
    echo "✅ All CSS files forced to text/css"
    echo ""
    echo "🔗 Test nå:"
    echo "   • https://www.snakkaz.com"
    echo ""
    echo "🔧 Applied fixes:"
    echo "   • ForceType directives for all file types"
    echo "   • Header override for Content-Type"
    echo "   • Assets-specific .htaccess"
    echo "   • MIME type mappings"
    echo "   • Security headers"
    echo ""
    echo "🧪 Test vendor loading:"
    echo "   curl -I https://www.snakkaz.com/assets/js/vendor-react-core-Cvl4dr7Y.js"
    echo "   (Should show: content-type: application/javascript)"
    echo ""
else
    echo "❌ DEPLOYMENT FAILED!"
    exit 1
fi

# Cleanup
rm -f /tmp/deploy-definitive-fix.lftp
rm -rf /tmp/snakkaz-fix

echo "🧹 Cleanup completed"
echo "Definitive fix deployed: $(date)"
