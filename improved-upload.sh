#!/bin/bash
# improved-upload.sh
#
# Dette er et forbedret FTP-opplastingsskript som bruker curl for robusthet

# Fargedefinisjoner
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}======================================================${INGEN}"
echo -e "${BLA}     OPPLASTING AV SNAKKAZ CHAT TIL NAMECHEAP         ${INGEN}"
echo -e "${BLA}======================================================${INGEN}"
echo

# Leser inn FTP-variabler fra .env
source .env

# Verifiser at dist-mappen eksisterer
if [ ! -d "dist" ]; then
  echo -e "${ROD}Feil: 'dist'-mappe mangler!${INGEN}"
  echo "Du må bygge applikasjonen ved å kjøre 'npm run build' først."
  exit 1
fi

echo -e "${GUL}FTP-innstillinger:${INGEN}"
echo "Host: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_REMOTE_DIR"
echo

# Laster opp index.html først for å verifisere tilkobling
echo -e "${GUL}Tester opplasting med index.html...${INGEN}"
if curl -v -T "dist/index.html" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/index.html"; then
  echo -e "${GRONN}✓ Test-opplasting vellykket${INGEN}"
else
  echo -e "${ROD}✗ Kunne ikke laste opp testfil. Sjekk FTP-innstillingene.${INGEN}"
  exit 1
fi

echo -e "${GUL}Laster opp .htaccess...${INGEN}"
curl -s -T "dist/.htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/.htaccess"
echo -e "${GRONN}✓ .htaccess lastet opp${INGEN}"

# Laster opp subdomain-mappene
for subdir in dist/*/; do
  subdirname=$(basename "$subdir")
  echo -e "${GUL}Oppretter subdomain-mappe: $subdirname${INGEN}"
  
  # Opprett mappe hvis den ikke finnes
  curl -s --ftp-create-dirs --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$subdirname/" -Q "MKD $FTP_REMOTE_DIR/$subdirname"
  
  # Last opp .htaccess for subdomenet
  if [ -f "$subdir/.htaccess" ]; then
    echo -e "  Laster opp .htaccess for $subdirname..."
    curl -s -T "$subdir/.htaccess" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$subdirname/.htaccess"
  fi
  
  # Last opp index.html for subdomenet
  if [ -f "$subdir/index.html" ]; then
    echo -e "  Laster opp index.html for $subdirname..."
    curl -s -T "$subdir/index.html" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$subdirname/index.html"
  fi
  
  echo -e "${GRONN}✓ Subdomain $subdirname oppsett fullført${INGEN}"
done

# Lag en zip-fil av assets-mappen og last opp
echo -e "${GUL}Pakker assets-mappen...${INGEN}"
cd dist
zip -r assets.zip assets/
cd ..

echo -e "${GUL}Laster opp assets.zip...${INGEN}"
curl -s -T "dist/assets.zip" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/assets.zip"

echo -e "${GUL}Unzipper assets.zip på serveren...${INGEN}"
# Dette krever at du har shell-tilgang eller PHP-unzip på serveren
# Alternativt må du laste opp fil-for-fil, som kan være tidkrevende

# Last opp individuelle filer i rotkatalogen
echo -e "${GUL}Laster opp gjenværende filer...${INGEN}"
for file in dist/*; do
  if [ -f "$file" ] && [ "$(basename "$file")" != "assets.zip" ]; then
    filename=$(basename "$file")
    echo -e "  Laster opp $filename..."
    curl -s -T "$file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/$filename"
  fi
done

echo -e "${GRONN}✓ Hovedfiler er lastet opp${INGEN}"

echo
echo -e "${GRONN}==========================================${INGEN}"
echo -e "${GRONN}      OPPLASTING TIL NAMECHEAP FULLFØRT   ${INGEN}"
echo -e "${GRONN}==========================================${INGEN}"
echo
echo -e "${GUL}Merk: assets.zip må pakkes ut på serveren!${INGEN}"
echo -e "Du kan gjøre dette via cPanel File Manager eller SSH-tilgang."
echo
echo -e "${GUL}Neste steg:${INGEN}"
echo "1. Logg inn på cPanel og pakk ut assets.zip"
echo "2. Åpne https://www.snakkaz.com i nettleseren din"
echo "3. Bekreft at alle funksjoner fungerer som forventet"
echo
echo -e "${BLA}For å sette opp SSL-sertifikater:${INGEN}"
echo "1. Følg instruksjonene i docs/MIGRATION-COMPLETION-GUIDE.md"
echo "2. Bruk scriptet scripts/install-ssl-certificates.sh"
echo
