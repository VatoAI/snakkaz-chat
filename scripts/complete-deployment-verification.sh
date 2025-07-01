#!/bin/bash

# 🔧 KOMPLETT ASSET VERIFIKASJON & DEPLOYMENT
echo "🔧 KOMPLETT ASSET VERIFIKASJON & DEPLOYMENT"
echo "==========================================="

cd /workspaces/snakkaz-chat

# 1. LOKAL VERIFIKASJON FØRST
echo "🔍 1. VERIFISERER LOKAL BUILD..."

# Sjekk at dist/ finnes
if [ ! -d "dist" ]; then
    echo "❌ dist/ mappe finnes ikke! Kjører build..."
    npm run build
fi

# 2. ASSET VERIFIKASJON
echo ""
echo "🔍 2. SJEKKER AT ALLE REFERERTE ASSETS FINNES..."

# Extract alle asset referanser fra HTML
MISSING_COUNT=0
grep -oP '/assets/[^"]+' dist/index.html | sort | uniq | while read -r asset; do
    if [ ! -f "dist$asset" ]; then
        echo "❌ MANGLER: dist$asset"
        ((MISSING_COUNT++))
    else
        echo "✅ Finnes: dist$asset"
    fi
done

# Sjekk ikoner
if [ ! -f "icons/snakkaz-icon-192.png" ]; then
    echo "❌ MANGLER: icons/snakkaz-icon-192.png"
else
    echo "✅ Finnes: icons/snakkaz-icon-192.png"
fi

# 3. LIST ALLE FILER SOM SKAL LASTES OPP
echo ""
echo "📋 3. FILER SOM SKAL LASTES OPP:"
echo "HTML:"
ls -la dist/index.html

echo ""
echo "CSS:"
ls -la dist/assets/css/

echo ""
echo "JS:"
ls -la dist/assets/js/

echo ""
echo "Ikoner:"
ls -la icons/

# 4. LOKAL TEST (valgfritt)
echo ""
echo "🧪 4. LOKAL PRODUKSJONSTEST (valgfritt)"
echo "For å teste lokalt først, kjør:"
echo "   npx serve dist"
echo "   Åpne http://localhost:3000"
echo "   Sjekk Developer Console for feil"
echo ""

read -p "Fortsette med deployment? (y/n): " CONTINUE
if [ "$CONTINUE" != "y" ]; then
    echo "Avbrutt."
    exit 0
fi

# 5. KOMPLETT DEPLOYMENT
echo ""
echo "🚀 5. KOMPLETT DEPLOYMENT..."

# Last opp HTML først
echo "📄 Laster opp HTML..."
curl -X PUT -u "admin@snakkaz.com:Rompetroll123!" -T "dist/index.html" "ftp://ftp.snakkaz.com/index.html" -s

# Last opp CSS
echo "🎨 Laster opp CSS..."
for css_file in dist/assets/css/*.css; do
    if [ -f "$css_file" ]; then
        filename=$(basename "$css_file")
        echo "  Laster opp: $filename"
        curl -X PUT -u "admin@snakkaz.com:Rompetroll123!" -T "$css_file" "ftp://ftp.snakkaz.com/assets/css/$filename" -s
    fi
done

# Last opp ALLE JS filer
echo "📦 Laster opp ALLE JavaScript filer..."
for js_file in dist/assets/js/*.js; do
    if [ -f "$js_file" ]; then
        filename=$(basename "$js_file")
        echo "  Laster opp: $filename"
        curl -X PUT -u "admin@snakkaz.com:Rompetroll123!" -T "$js_file" "ftp://ftp.snakkaz.com/assets/js/$filename" -s
    fi
done

# Last opp ikoner
echo "🖼️ Laster opp ikoner..."
for icon_file in icons/*.png; do
    if [ -f "$icon_file" ]; then
        filename=$(basename "$icon_file")
        echo "  Laster opp: $filename"
        curl -X PUT -u "admin@snakkaz.com:Rompetroll123!" -T "$icon_file" "ftp://ftp.snakkaz.com/icons/$filename" -s
    fi
done

echo ""
echo "✅ DEPLOYMENT FULLFØRT!"

# 6. VERIFIKASJON AV DEPLOYMENT
echo ""
echo "🧪 6. VERIFISERER DEPLOYMENT..."

sleep 3

echo "📋 Tester kritiske assets:"
echo "HTML størrelse: $(curl -s https://snakkaz.com/ | wc -c) bytes"

# Test alle assets som HTML refererer til
grep -oP '/assets/[^"]+' dist/index.html | head -5 | while read -r asset; do
    status=$(curl -I "https://snakkaz.com$asset" 2>/dev/null | grep "HTTP" | head -1)
    echo "Asset $asset: $status"
done

echo ""
echo "🎯 TESTING INSTRUKSJONER:"
echo "1. Gå til https://snakkaz.com"
echo "2. Åpne Developer Console (F12)"
echo "3. Trykk Ctrl+Shift+R (hard refresh)"
echo "4. Sjekk for feil i Console og Network tabs"
