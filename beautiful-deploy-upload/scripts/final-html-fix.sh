#!/bin/bash

# 🎯 FINAL FIX - Deploy ren HTML med kun riktige asset-referanser
echo "🎯 FINAL FIX - Deploying clean HTML"
echo "=================================="

# Konfigurasjon  
FTP_HOST="ftp.snakkaz.com"
FTP_USER="admin@snakkaz.com"
FTP_PASS="Rompetroll123!"

# Upload ren HTML
echo "🚀 Uploader final clean HTML..."
lftp -e "
set ssl:verify-certificate no
set ftp:passive-mode on
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST:21
cd .
put /workspaces/snakkaz-chat/dist/index.html -o index.html
chmod 644 index.html
quit
" 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Clean HTML deployed!"
    echo ""
    echo "⏳ Venter 5 sekunder på oppdatering..."
    sleep 5
    
    echo "🧪 Testing clean HTML..."
    echo "📋 CSS referanser i live HTML:"
    curl -s "https://snakkaz.com/" | grep -E "\.css"
    
    echo ""
    echo "🎯 Testing for gamle CSS referanser:"
    if curl -s "https://snakkaz.com/" | grep -q "index-uDlWtT9E.css"; then
        echo "❌ Gammel CSS referanse fortsatt der"
    else
        echo "✅ Alle gamle CSS referanser fjernet!"
    fi
    
    echo ""
    echo "🧪 Testing CSS loading:"
    curl -I "https://snakkaz.com/assets/css/index-BztST-au.css" | grep "HTTP\|Content-Type"
    
else
    echo "❌ HTML upload feilet"
fi

echo ""
echo "📱 Test nå: https://snakkaz.com"
echo "🔧 Trykk Ctrl+F5 for hard refresh hvis nødvendig"
