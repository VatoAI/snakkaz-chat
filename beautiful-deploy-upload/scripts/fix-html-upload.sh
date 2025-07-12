#!/bin/bash

# 🔧 FINAL HTML UPLOAD FIX
echo "🔧 FINAL HTML UPLOAD FIX"
echo "======================="

cd /workspaces/snakkaz-chat

echo "📋 Lokal HTML størrelse: $(wc -c < dist/index.html) bytes"
echo "📋 Server HTML størrelse før: $(curl -s https://snakkaz.com/ | wc -c) bytes"

echo ""
echo "🚀 Forsøker upload med binary mode..."

lftp -e "
set ssl:verify-certificate no
set ftp:passive-mode on
set net:timeout 60
set ftp:ssl-allow no
open ftp://admin@snakkaz.com:Rompetroll123!@ftp.snakkaz.com:21

# Slett eksisterende fil
rm index.html

# Upload med binary mode
set ftp:transfer-mode binary
put dist/index.html index.html

# Verifiser opplasting
ls -la index.html

quit
" 2>&1

echo ""
echo "⏳ Venter på propagering..."
sleep 5

echo "📋 Server HTML størrelse etter: $(curl -s https://snakkaz.com/ | wc -c) bytes"

if curl -s "https://snakkaz.com/" | grep -q "BivGdyB"; then
    echo "✅ HTML inneholder nye asset-referanser!"
else
    echo "❌ HTML inneholder fortsatt ikke nye asset-referanser"
    echo "🔍 Sjekker hva som faktisk er på server:"
    curl -s "https://snakkaz.com/" | tail -20
fi
