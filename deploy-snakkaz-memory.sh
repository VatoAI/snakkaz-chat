#!/bin/bash

# Deploy Snakkaz Chat med Memory Integration til www.snakkaz.com
# Comprehensive deployment script med error handling

echo "🚀 Starting deployment to www.snakkaz.com..."
echo "📦 Deploying Memory-Enhanced AI Chat System"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Running build first..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Aborting deployment."
        exit 1
    fi
fi

echo "✅ Build files ready for deployment"

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf snakkaz-memory-deployment.tar.gz dist/

# Deploy using lftp with enhanced settings
echo "🌐 Uploading to www.snakkaz.com..."

lftp -c "
# Åpne tilkobling
open -u SnakkaZ@snakkaz.com,Snakkaz2025! premium123.web-hosting.com

# SSL/TLS innstillinger
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:passive-mode yes

# Timeout og retry innstillinger
set net:timeout 60
set net:max-retries 3
set net:reconnect-interval-base 5

# Gå til public_html
cd public_html

# Backup existing files først
echo 'Creating backup of existing files...'
mkdir -p backup-\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# Mirror dist content til public_html
echo 'Uploading new files...'
mirror -R dist/ ./ --delete --ignore-time --parallel=3 --verbose

# Upload spesial .htaccess for SPA routing
echo 'Uploading .htaccess for SPA routing...'
put -O ./ - <<'EOF'
# Snakkaz Chat SPA Routing Configuration
# Enable mod_rewrite
RewriteEngine On

# MIME Type fixes for modern web apps
AddType application/javascript .js .mjs
AddType text/css .css
AddType application/json .json
AddType image/svg+xml .svg
AddType font/woff2 .woff2
AddType font/woff .woff

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection \"1; mode=block\"
Header always set Referrer-Policy \"strict-origin-when-cross-origin\"

# SPA Routing - send all requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\\.(css|js|json|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ [NC]
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch \"\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$\">
    ExpiresActive On
    ExpiresDefault \"access plus 1 month\"
    Header set Cache-Control \"public, max-age=2592000\"
</FilesMatch>

# No cache for HTML files
<FilesMatch \"\\.html$\">
    Header set Cache-Control \"no-cache, no-store, must-revalidate\"
    Header set Pragma \"no-cache\"
    Header set Expires 0
</FilesMatch>
EOF

echo 'Deployment completed successfully!'
echo 'Site available at: https://www.snakkaz.com'

# Avslutt
bye
"

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Site: https://www.snakkaz.com"
    echo "🧠 Memory Integration: Active"
    echo "🔧 Features deployed:"
    echo "   - AI Chat with Memory Integration"
    echo "   - Memory Dashboard at /memory"
    echo "   - Multi-provider AI support"
    echo "   - Enhanced error handling"
    echo "   - Performance optimizations"
    
    # Clean up
    rm -f snakkaz-memory-deployment.tar.gz
    
    echo ""
    echo "🎉 Snakkaz Chat med Memory Integration er nå live!"
    echo "Sjekk nettsiden på: https://www.snakkaz.com"
else
    echo "❌ Deployment failed. Check connection and credentials."
    exit 1
fi
