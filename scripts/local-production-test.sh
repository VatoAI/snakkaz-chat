#!/bin/bash

# 🧪 LOKAL PRODUKSJONSTEST - Test før deployment
echo "🧪 LOKAL PRODUKSJONSTEST"
echo "========================"

cd /workspaces/snakkaz-chat

# 1. Build hvis nødvendig
if [ ! -d "dist" ]; then
    echo "📦 Bygger applikasjon..."
    npm run build
fi

# 2. Verifiser alle assets finnes
echo ""
echo "🔍 VERIFISERER ASSETS..."

MISSING_ASSETS=0

# Sjekk HTML
if [ ! -f "dist/index.html" ]; then
    echo "❌ dist/index.html mangler!"
    ((MISSING_ASSETS++))
else
    echo "✅ HTML finnes"
fi

# Sjekk alle refererte assets
echo ""
echo "📋 Sjekker alle refererte assets:"
grep -oP '/assets/[^"]+' dist/index.html | sort | uniq | while read -r asset; do
    if [ ! -f "dist$asset" ]; then
        echo "❌ MANGLER: dist$asset"
        ((MISSING_ASSETS++))
    else
        SIZE=$(stat -c%s "dist$asset")
        echo "✅ $asset (${SIZE} bytes)"
    fi
done

# 3. Start lokal server
echo ""
echo "🚀 STARTER LOKAL PRODUKSJONSSERVER..."
echo ""
echo "🌐 Serveren starter på: http://localhost:3000"
echo ""
echo "🔍 TESTING INSTRUKSJONER:"
echo "1. Åpne http://localhost:3000 i nettleseren"
echo "2. Åpne Developer Console (F12)"
echo "3. Sjekk Console tab for JavaScript-feil"
echo "4. Sjekk Network tab for 404-feil"
echo "5. Test appens funksjonalitet"
echo ""
echo "📝 Hvis alt ser bra ut, trykk Ctrl+C og kjør deployment-scriptet"
echo ""

# Start serve hvis den er installert
if command -v serve &> /dev/null; then
    serve dist -p 3000
else
    echo "⚠️ 'serve' er ikke installert. Installerer..."
    npm install -g serve
    serve dist -p 3000
fi
