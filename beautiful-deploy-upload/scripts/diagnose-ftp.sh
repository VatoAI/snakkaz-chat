#!/bin/bash

echo "🔍 SnakkaZ FTP Konto Diagnostikk"
echo "================================"
echo ""

echo "📋 FTP Kontoer fra cPanel analyse:"
echo "1. snakqsqe - Hovedkonto (full tilgang til public_html)"
echo "2. SnakkaZ@snakkaz.com - Kjent passord: Rompetroll123!"
echo "3. admin@snakkaz.com - Kun tilgang til public_html/Admin"
echo ""

echo "🎯 For å deploye til hoveddomenet (https://snakkaz.com) trenger vi:"
echo "   - snakqsqe kontoen (full tilgang)"
echo "   - ELLER at SnakkaZ@snakkaz.com har riktig tilgang"
echo ""

echo "🧪 Tester eksisterende SnakkaZ@snakkaz.com konto..."

# Test SnakkaZ@snakkaz.com kontoen
FTP_HOST="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Rompetroll123!"

if command -v lftp &> /dev/null; then
    echo "🔌 Tester FTP tilkobling..."
    
    lftp_result=$(timeout 15 lftp -e "
        set ssl:verify-certificate no
        set net:timeout 10
        open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST:21
        pwd
        ls -la
        quit
    " 2>&1)
    
    if echo "$lftp_result" | grep -q "Login failed\|Authentication failed\|Connection refused"; then
        echo "❌ SnakkaZ@snakkaz.com login feilet"
        echo "🔧 Du må sette nytt passord for snakqsqe i cPanel"
    else
        echo "✅ SnakkaZ@snakkaz.com login OK!"
        echo "📁 Tilgjengelige mapper:"
        echo "$lftp_result" | grep -E "^d|^-" | head -10
        
        if echo "$lftp_result" | grep -q "public_html"; then
            echo "✅ Har tilgang til public_html - kan deploye!"
            echo ""
            echo "🚀 Kjør deployment:"
            echo "   /workspaces/snakkaz-chat/scripts/deploy-ftp-snakkaz.sh"
        else
            echo "⚠️  Ser ikke public_html - begrensed tilgang"
            echo "🔧 Anbefaler å bruke snakqsqe kontoen i stedet"
        fi
    fi
else
    echo "📥 lftp ikke installert - installer først"
fi

echo ""
echo "💡 Anbefalinger:"
echo ""
echo "1. **Hvis SnakkaZ@snakkaz.com fungerer:**"
echo "   /workspaces/snakkaz-chat/scripts/deploy-ftp-snakkaz.sh"
echo ""
echo "2. **Hvis du må bruke snakqsqe:**"
echo "   - Gå til cPanel → User Manager"
echo "   - Klikk 'Change Password' for snakqsqe"
echo "   - Sett nytt passord"
echo "   - Kjør: /workspaces/snakkaz-chat/scripts/deploy-ftp-advanced.sh"
echo ""
echo "3. **Enkleste alternativ - cPanel File Manager:**"
echo "   - Last ned: /tmp/snakkaz-production-fixed.zip"
echo "   - Upload til cPanel File Manager"
echo "   - Pakk ut i public_html/"
echo ""
echo "🎯 Målet er å få alle filer fra deployment pakken inn i public_html/"
