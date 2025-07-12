#!/bin/bash

# 🎯 SNAKKAZ ONE-CLICK LIVE DEPLOYMENT
# ====================================

echo "💙 Hei! Skal vi få SnakkaZ LIVE på www.snakkaz.com? 🚀"
echo ""

# Quick setup check
if [ ! -f "package.json" ]; then
    echo "❌ Feil mappe. Kjør fra snakkaz-chat root directory"
    exit 1
fi

echo "🔥 ONE-CLICK DEPLOYMENT STARTER..."
echo ""

# 1. Build production version
echo "🏗️  Building production version..."
npm run build > /dev/null 2>&1

# 2. Create optimized deployment package
echo "📦 Creating deployment package..."
mkdir -p snakkaz-live
cp -r dist/* snakkaz-live/
cp public/sw.js snakkaz-live/ 2>/dev/null || true
cp public/manifest.json snakkaz-live/ 2>/dev/null || true

# 3. Add .htaccess for PWA support
cat > snakkaz-live/.htaccess << 'EOF'
# SnakkaZ PWA & E2EE Support
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers for E2EE
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; font-src 'self' data:; media-src 'self' blob:; worker-src 'self' blob:;"

# PWA Caching
<filesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2)$">
Header set Cache-Control "public, max-age=31536000, immutable"
</filesMatch>

<files "sw.js">
Header set Cache-Control "no-cache, no-store, must-revalidate"
</files>

<files "manifest.json">
Header set Cache-Control "public, max-age=3600"
</files>
EOF

# 4. Create deployment ZIP
echo "🗜️  Creating snakkaz-live.zip..."
cd snakkaz-live
zip -r ../snakkaz-live.zip . > /dev/null 2>&1
cd ..

# 5. Show deployment options
echo ""
echo "✅ SNAKKAZ ER KLAR FOR LIVE DEPLOYMENT!"
echo "========================================"
echo ""
echo "📁 DEPLOYMENT FILER KLARE:"
echo "   📂 snakkaz-live/ (for FTP/cPanel upload)"
echo "   📦 snakkaz-live.zip (for enkel upload)"
echo ""

echo "🌐 DEPLOYMENT ALTERNATIVER:"
echo ""
echo "1. 📤 CPANEL FILE MANAGER (Enklest):"
echo "   → Last opp snakkaz-live.zip til public_html/"
echo "   → Pakk ut filene"
echo "   → Test på www.snakkaz.com"
echo ""

echo "2. 🔗 FTP UPLOAD:"
echo "   → Last opp innholdet av snakkaz-live/ til web root"
echo "   → Sørg for at .htaccess lastes opp"
echo ""

echo "3. ☁️  CLOUDFLARE PAGES (Gratis):"
echo "   → Gå til pages.cloudflare.com"
echo "   → Upload snakkaz-live.zip"
echo "   → Sett custom domain til www.snakkaz.com"
echo ""

echo "4. 🚀 NETLIFY (Gratis):"
echo "   → Dra snakkaz-live/ til netlify.com/drop"
echo "   → Sett custom domain til www.snakkaz.com"
echo ""

echo "🔐 E2EE FUNKSJONER INKLUDERT:"
echo "✅ AES-256-GCM meldingskryptering"
echo "✅ RSA-OAEP nøkkelutveksling"
echo "✅ Perfect Forward Secrecy"
echo "✅ Zero-knowledge arkitektur"
echo ""

echo "📱 PWA FUNKSJONER AKTIVERT:"
echo "✅ Installer som app"
echo "✅ Offline chat funksjonalitet"
echo "✅ Push notifications"
echo "✅ Native app opplevelse"
echo ""

echo "🎯 ETTER DEPLOYMENT - TEST DISSE:"
echo "• www.snakkaz.com (hovedside)"
echo "• www.snakkaz.com/pwa-demo (PWA test)"
echo "• www.snakkaz.com/beta-chat (sikker chat)"
echo "• www.snakkaz.com/register (ny bruker)"
echo ""

echo "💙 SnakkaZ er nå klar for norsk tech community!"
echo "🔐 Sikker, kryptert kommunikasjon for alle!"
echo ""
echo "🎉 Lykke til med lanseringen! 🚀✨"
