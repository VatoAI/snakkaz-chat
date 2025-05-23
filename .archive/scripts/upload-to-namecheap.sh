#!/bin/bash
# upload-to-namecheap.sh
# 
# Dette skriptet laster opp Snakkaz Chat-applikasjonen til Namecheap-hostingen
# ved hjelp av FTP-innstillingene i .env-filen.

set -e # Exit on error

# ANSI colors
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}======================================================${INGEN}"
echo -e "${BLA}     OPPLASTING AV SNAKKAZ CHAT TIL NAMECHEAP         ${INGEN}"
echo -e "${BLA}======================================================${INGEN}"
echo

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${ROD}Feil: .env-fil mangler!${INGEN}"
  echo "Opprett en .env-fil med FTP-innstillingene dine først."
  exit 1
fi

# Source the .env file to load FTP settings
source .env

# Verify that FTP settings are set
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ] || [ -z "$FTP_REMOTE_DIR" ]; then
  echo -e "${ROD}Feil: Manglende FTP-innstillinger i .env-filen.${INGEN}"
  echo "Sørg for at du har definert følgende variabler:"
  echo "FTP_HOST, FTP_USER, FTP_PASS, FTP_REMOTE_DIR"
  exit 1
fi

# Verify that dist folder exists
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

# Check if ncftp is available (better than standard ftp)
if command -v ncftp &> /dev/null; then
  echo -e "${GUL}Laster opp med ncftp (raskere FTP-klient)...${INGEN}"
  
  # Create a temporary batch file for ncftp
  BATCH_FILE=$(mktemp)
  echo "open -u $FTP_USER -p $FTP_PASS $FTP_HOST" > "$BATCH_FILE"
  echo "cd $FTP_REMOTE_DIR" >> "$BATCH_FILE"
  echo "mirror -R dist/ ." >> "$BATCH_FILE"
  echo "bye" >> "$BATCH_FILE"
  
  # Upload using ncftp
  ncftp -f "$BATCH_FILE"
  
  # Remove temporary file
  rm "$BATCH_FILE"
  
  echo -e "${GRONN}✓ Opplasting fullført med ncftp${INGEN}"

# Check if lftp is available (also better than standard ftp)
elif command -v lftp &> /dev/null; then
  echo -e "${GUL}Laster opp med lftp (robust FTP-klient)...${INGEN}"
  
  lftp -d -c "
  set ftp:ssl-allow true;
  set ssl:verify-certificate no;
  set net:timeout 120;
  set net:max-retries 3;
  set net:reconnect-interval-base 5;
  set net:reconnect-interval-multiplier 1;
  open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
  lcd dist;
  cd $FTP_REMOTE_DIR;
  mirror -R --parallel=1 --use-cache --verbose ./;
  bye
  "
  
  echo -e "${GRONN}✓ Opplasting fullført med lftp${INGEN}"

# Fallback to standard ftp command
else
  echo -e "${GUL}Laster opp med curl ftps (mer kompatibel med Namecheap)...${INGEN}"
  
  # Lag en liste over filer og mapper som skal lastes opp
  find dist -type f | while read FILE; do
    # Får relativ sti
    RELATIVE_PATH="${FILE#dist/}"
    REMOTE_PATH="$FTP_REMOTE_DIR/$RELATIVE_PATH"
    REMOTE_DIR=$(dirname "$REMOTE_PATH")
    
    # Opprett alle nødvendige mapper på forhånd
    echo -e "Oppretter mappe $REMOTE_DIR..."
    curl -s --ftp-create-dirs -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$REMOTE_DIR/" || true
    
    # Last opp filen
    echo -e "Laster opp $RELATIVE_PATH..."
    curl -T "$FILE" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$REMOTE_PATH"
    
    # Viser status
    if [ $? -eq 0 ]; then
      echo -e "${GRONN}✓ Lastet opp $RELATIVE_PATH${INGEN}"
    else
      echo -e "${ROD}✗ Feilet å laste opp $RELATIVE_PATH${INGEN}"
    fi
  done
  
  echo -e "${GRONN}✓ Opplasting fullført med curl${INGEN}"
fi

echo
echo -e "${GRONN}==========================================${INGEN}"
echo -e "${GRONN}      OPPLASTING TIL NAMECHEAP FULLFØRT   ${INGEN}"
echo -e "${GRONN}==========================================${INGEN}"
echo
echo -e "${GUL}Neste steg:${INGEN}"
echo "1. Åpne https://www.snakkaz.com i nettleseren din"
echo "2. Bekreft at alle funksjoner fungerer som forventet"
echo "3. Sjekk om innlogging, registrering og chat virker"
echo
echo -e "${BLA}Hvis du møter problemer, sjekk følgende:${INGEN}"
echo "- Sjekk nettleserens utviklerkonsoll for feil"
echo "- Verifiser at .htaccess-filen ble lastet opp korrekt"
echo "- Bekreft at Supabase-API-konfigurasjonen er riktig"
echo
echo "Dokumentasjon: /docs/SNAKKAZ-FIX-2025-05-18.md"
echo
