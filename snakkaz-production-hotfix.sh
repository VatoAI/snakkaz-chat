#!/bin/bash
# SnakkaZ Quick Hotfix - Production Deployment
# Date: July 13, 2025

echo "🚀 SnakkaZ Hotfix - Fixing Production Issues..."

echo "1. Creating fixed .htaccess with proper CSP..."
cat > dist/.htaccess << 'EOF'
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Force www subdomain
RewriteCond %{HTTP_HOST} ^snakkaz\.com [NC]
RewriteRule ^(.*)$ https://www.snakkaz.com/$1 [L,R=301]

# Handle SPA routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers with FIXED CSP
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wqp0ozrbxcucynsojmbk.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://wqp0ozrbxcucynsojmbk.supabase.co wss://wqp0ozrbxcucynsojmbk.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com"
</IfModule>

# PWA Service Worker
<Files "sw.js">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</Files>

# Manifest
<Files "manifest.json">
    Header set Content-Type "application/manifest+json"
</Files>
EOF

echo "2. Creating missing icon files..."
# Copy existing icon as fallback for missing icons
if [ -f "dist/icons/snakkaz-icon-192.png" ]; then
    cp dist/icons/snakkaz-icon-192.png dist/icons/icon-144x144.png
    echo "   ✅ Created icon-144x144.png"
fi

echo "3. Fixing manifest.json..."
cat > dist/manifest.json << 'EOF'
{
  "name": "SnakkaZ Chat",
  "short_name": "SnakkaZ",
  "description": "Sikker norsk chat med E2EE kryptering",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "scope": "/",
  "id": "com.snakkaz.chat",
  "icons": [
    {
      "src": "/icons/snakkaz-icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon.ico",
      "sizes": "16x16 32x32 48x48",
      "type": "image/x-icon"
    }
  ]
}
EOF

echo "4. Creating updated ZIP package..."
rm -f snakkaz-production-hotfix.zip
zip -r snakkaz-production-hotfix.zip dist/

echo ""
echo "🎉 HOTFIX COMPLETE!"
echo "📦 New ZIP: snakkaz-production-hotfix.zip"
echo "🔧 Fixed: CSP for Google Fonts, manifest icons, .htaccess"
echo ""
echo "📋 UPLOAD INSTRUCTIONS:"
echo "1. Download: snakkaz-production-hotfix.zip" 
echo "2. Upload til cPanel File Manager"
echo "3. Extract til /public_html/"
echo "4. Test: www.snakkaz.com"
echo ""
echo "✨ Neste steg: Refresh nettsiden for å se fixes!"
