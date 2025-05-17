#!/bin/bash
#
# Verifiserer FTP-tilkobling til Namecheap hosting
#
# Dette skriptet tester om FTP-tilkoblingen til Namecheap fungerer
# og at innloggingsopplysningene er riktige.
#

echo "🔄 Tester FTP-tilkobling til Namecheap..."
echo "=========================================="

# Sjekk om vi har nødvendige verktøy
if ! command -v ftp &> /dev/null; then
    echo "❌ FTP-kommandoen mangler. Installer den med: apt-get install ftp"
    exit 1
fi

# Last inn miljøvariabler fra .env-filen
if [ -f .env ]; then
    source <(grep -v '^#' .env | sed -E 's/(.*)=(.*)/export \1="\2"/')
    echo "✅ Lastet inn miljøvariabler fra .env"
else 
    echo "❌ Finner ikke .env-fil. Vennligst opprett den med FTP-innloggingsinfo."
    exit 1
fi

# Sjekk om nødvendige variabler er satt
if [ -z "$FTP_SERVER" ] || [ -z "$FTP_USERNAME" ] || [ -z "$FTP_PASSWORD" ]; then
    echo "❌ Mangler FTP-innloggingsdetaljer i .env-filen."
    echo "Vennligst legg til følgende variabler i .env-filen:"
    echo "FTP_SERVER=premium123.web-hosting.com"
    echo "FTP_USERNAME=din-brukernavn"
    echo "FTP_PASSWORD=ditt-passord"
    exit 1
fi

# Test FTP-tilkobling med timeout
echo "📡 Tester tilkobling til $FTP_SERVER..."
echo "FTP_SERVER=$FTP_SERVER, FTP_USERNAME=$FTP_USERNAME"
timeout 15s bash -c "echo -e 'user $FTP_USERNAME $FTP_PASSWORD\nquit' | ftp -vn $FTP_SERVER 2>&1" > ftp-test-output.txt

if [ $? -eq 0 ]; then
    if grep -q "230" ftp-test-output.txt; then
        echo "✅ FTP-tilkobling vellykket!"
        echo "✅ Innlogging til $FTP_SERVER med bruker $FTP_USERNAME fungerer."
        echo "Detaljert respons:"
        cat ftp-test-output.txt
    else
        echo "❌ FTP-tilkobling mislyktes. Feil ved innlogging."
        echo "Sjekk brukernavnet og passordet i .env-filen."
        echo "Detaljert feilmelding:"
        cat ftp-test-output.txt
        # Ikke slett filen, slik at vi kan se den senere
        exit 1
    fi
else
    echo "❌ FTP-tilkobling tidsavbrutt eller mislyktes."
    echo "Sjekk at serveren $FTP_SERVER er tilgjengelig og at port 21 er åpen."
    echo "Detaljert feilmelding:"
    cat ftp-test-output.txt
    # Ikke slett filen, slik at vi kan se den senere
    exit 1
fi

echo ""
echo "📋 Anbefalinger for GitHub-secrets:"
echo "------------------------------------"
echo "Legg til følgende secrets i GitHub-repositoriet:"
echo "- FTP_SERVER:   $FTP_SERVER"
echo "- FTP_USERNAME: $FTP_USERNAME"
echo "- FTP_PASSWORD: [Ditt passord]"
echo "- SERVER_DIR:   /"
echo ""
echo "Du kan finne disse innstillingene under:"
echo "GitHub Repository > Settings > Secrets and variables > Actions"
echo ""
