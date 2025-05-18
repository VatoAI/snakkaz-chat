#!/bin/bash
# simple-ftp-upload.sh
#
# Dette er en enklere versjon av FTP-opplastingsskriptet for å sikre at opplasting fungerer

# Leser inn FTP-variabler fra .env
source .env

echo "Starter opplasting til $FTP_HOST med bruker $FTP_USER"
echo "Fjernmappe: $FTP_REMOTE_DIR"

# Pakker dist-mappen for opplasting
echo "Pakker dist-mappen..."
zip -r snakkaz-dist.zip dist

# Tester FTP-tilkobling først
echo "Tester FTP-tilkobling..."
curl -v --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" > ftp-test-output.txt 2>&1

# Viser resultatet
cat ftp-test-output.txt

echo "Dette er en test-fil som bekrefter FTP-tilkoblingen" > test-ftp-upload.txt

# Laster opp test-filen
echo "Laster opp test-fil..."
curl -v -T test-ftp-upload.txt --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/test-ftp-upload.txt"

echo "Opplasting av test-fil fullført. Sjekk serveren for å bekrefte at filen ble lastet opp."
echo "Hvis test-filen ble lastet opp, fortsett med å laste opp hele appen."
