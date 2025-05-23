#!/bin/bash
# superenkel-assets-upload.sh
# Veldig enkelt skript for å laste opp assets-filer
# INSTRUKSJONER: Fyll inn FTP-detaljer direkte i skriptet nedenfor

# FTP-INNSTILLINGER - FYLL INN HER
FTP_HOST="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Snakkaz2025!"   # ERSTATT MED DITT FAKTISKE PASSORD
FTP_DIR="public_html"

# Fargedefinisjoner
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # Ingen farge

echo "*** SNAKKAZ SUPERENKEL ASSETS-OPPLASTING ***"
echo "FTP-server: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_DIR"
echo ""

# Sjekk at dist/assets finnes
if [ ! -d "dist/assets" ]; then
    echo "FEIL: dist/assets-mappen finnes ikke!"
    echo "Bygger applikasjonen..."
    npm run build
    
    if [ ! -d "dist/assets" ]; then
        echo "FEIL: Kunne ikke bygge applikasjonen!"
        exit 1
    fi
fi

echo "Oppretter assets-mappe på serveren..."
curl -s --ftp-create-dirs "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/" -Q "NOOP"

echo "Laster opp JS-filer..."
for file in dist/assets/*.js; do
    filename=$(basename "$file")
    echo "Laster opp $filename..."
    curl -s -T "$file" "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/$filename"
    
    if [ $? -eq 0 ]; then
        echo "✓ $filename"
    else
        echo "✗ $filename"
    fi
done

echo "Laster opp CSS-filer..."
for file in dist/assets/*.css; do
    filename=$(basename "$file")
    echo "Laster opp $filename..."
    curl -s -T "$file" "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/$filename"
    
    if [ $? -eq 0 ]; then
        echo "✓ $filename"
    else
        echo "✗ $filename"
    fi
done

echo ""
echo "Opplasting ferdig!"
echo "Besøk https://www.snakkaz.com og trykk CTRL+F5 for å tømme bufferen"
