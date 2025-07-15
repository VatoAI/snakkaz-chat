#!/bin/bash

# 🚀 SNAKKAZ BETA - AUTOMATISK DEPLOYMENT MED LFTP
# Ingen mer manuell cPanel sletting/opplasting!

echo "🔥 SNAKKAZ AUTOMATISK DEPLOYMENT STARTER..."
echo "============================================"

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "📦 Installerer lftp..."
    sudo apt-get update && sudo apt-get install -y lftp
fi

echo ""
echo "🏗️ Bygger produksjonsversjon..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build feilet! Stopper deployment."
    exit 1
fi

echo ""
echo "📡 Kobler til FTP server..."
echo "Server: ftp.snakkaz.com"
echo "Bruker: snakqsqe"
echo "Domain: snakkaz.com"
echo "IP: 162.0.229.214"

# LFTP deployment script
lftp -c "
set ssl:verify-certificate no
set ftp:passive-mode on  
set cmd:fail-exit yes
set net:timeout 60
set net:max-retries 5
set cmd:verbose yes

# Connect to FTP with correct credentials
open -u snakqsqe,Rompetroll123! ftp://ftp.snakkaz.com

echo '✅ FTP tilkobling etablert'

# Go to local dist folder and remote public_html
lcd dist
cd /

echo '🗑️ Sletter gamle filer automatisk...'
# Remove old files (this replaces manual deletion!)
glob -a rm -f *.html *.js *.css *.json *.ico *.txt *.xml
rm -rf assets/

echo '📤 Laster opp nye filer...'

# Upload main files
echo 'Laster opp index.html...'
put index.html

echo 'Laster opp manifest og config filer...'
mput manifest.json robots.txt sitemap.xml favicon.ico 2>/dev/null || true

echo 'Laster opp JavaScript bundles...'
mirror -R --no-perms --verbose assets/js/ assets/js/

echo 'Laster opp CSS filer...'  
mirror -R --no-perms --verbose assets/css/ assets/css/

echo 'Laster opp ikoner og bilder...'
mirror -R --no-perms --verbose icons/ icons/ || true
mirror -R --no-perms --verbose images/ images/ || true

echo 'Laster opp service worker...'
mput sw.js service-worker.js 2>/dev/null || true

echo '✅ Alle filer lastet opp!'

# Verification
echo '🔍 Verifiserer deployment...'
ls -la index.html
echo 'JavaScript filer:'
ls assets/js/*.js | head -5
echo 'CSS filer:'  
ls assets/css/*.css | head -3

quit
"

# Check deployment result
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUKSESS!"
    echo "================================"
    echo "✅ Alle filer automatisk lastet opp"
    echo "✅ Gamle filer automatisk slettet"
    echo "✅ Ingen manuell cPanel arbeid nødvendig!"
    echo ""
    echo "🌐 Test nå: https://www.snakkaz.com"
    echo "🔍 Sjekk at alt fungerer som forventet"
    echo ""
    echo "💡 Neste gang: Bare kjør './AUTOMATIC-DEPLOY-LFTP.sh'"
    echo "   - Tar bare 2-3 minutter"
    echo "   - Sletter og laster opp automatisk"  
    echo "   - Ingen cPanel File Manager behov!"
else
    echo ""
    echo "❌ DEPLOYMENT FEILET"
    echo "================================" 
    echo "Mulige årsaker:"
    echo "- FTP tilkoblingsproblemer"
    echo "- Feil brukernavn/passord"
    echo "- Server tilgjengelighet"
    echo ""
    echo "💡 Backup plan: Manuell cPanel upload"
    echo "   Zip-fil er klar i: dist/"
fi
