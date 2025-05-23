#!/bin/bash
# debug-assets-upload.sh
# Forbedret debug-versjon for å laste opp assets-filer

# Fargedefinisjoner
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   SNAKKAZ DEBUG FTP OPPLASTING                       ${NC}"
echo -e "${BLUE}======================================================${NC}"

# FTP-INNSTILLINGER
FTP_HOST="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_DIR="public_html"

echo -e "${YELLOW}Denne script vil vise detaljert debugging for FTP opplasting${NC}"
echo -e "FTP-server: ${BLUE}$FTP_HOST${NC}"
echo -e "Bruker: ${BLUE}$FTP_USER${NC}"
echo -e "Mappe: ${BLUE}$FTP_DIR${NC}"

# Spør om passord
read -s -p "Skriv inn FTP-passord: " FTP_PASS
echo

if [ -z "$FTP_PASS" ]; then
    echo -e "${RED}Feil: Passord kan ikke være tomt${NC}"
    exit 1
fi

# Først sjekk om vi kan liste FTP-serveren for å bekrefte tilkobling
echo -e "${YELLOW}Tester FTP-tilkobling ved å liste rotmappen...${NC}"
curl -v --ftp-ssl "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/" 2>&1 | tee ftp-connection-debug.log

echo -e "\n${YELLOW}Tester å liste public_html-mappen...${NC}"
curl -v --ftp-ssl "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/" 2>&1 | tee -a ftp-connection-debug.log

# Alternativ metode: Prøv å lage en testfil først
echo -e "\n${YELLOW}Tester å laste opp en liten testfil...${NC}"
echo "Dette er en testfil for å sjekke FTP-opplasting" > test_upload.txt
curl -v --ftp-ssl -T test_upload.txt "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/test_upload.txt" 2>&1 | tee -a ftp-connection-debug.log

# Prøv å lage assets-mappen
echo -e "\n${YELLOW}Oppretter assets-mappe på serveren...${NC}"
curl -v --ftp-ssl --ftp-create-dirs "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/" -Q "NOOP" 2>&1 | tee -a ftp-connection-debug.log

# Sjekk om vi kan liste assets-mappen
echo -e "\n${YELLOW}Prøver å liste assets-mappen...${NC}"
curl -v --ftp-ssl "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/" 2>&1 | tee -a ftp-connection-debug.log

# Sjekk om dist/assets finnes
if [ ! -d "dist/assets" ]; then
    echo -e "${RED}FEIL: dist/assets-mappen finnes ikke!${NC}"
    exit 1
fi

# Last opp en enkelt testfil til assets-mappen
echo -e "\n${YELLOW}Laster opp en JS-testfil til assets-mappen...${NC}"
if [ -f "dist/assets/index-DQJNfLon.js" ]; then
    curl -v --ftp-ssl -T "dist/assets/index-DQJNfLon.js" "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/index-DQJNfLon.js" 2>&1 | tee -a ftp-connection-debug.log
else
    echo -e "${RED}FEIL: Kunne ikke finne testfilen dist/assets/index-DQJNfLon.js${NC}"
fi

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${YELLOW}FTP debugging ferdig! Sjekk ftp-connection-debug.log for detaljer.${NC}"
echo -e "${YELLOW}Hvis du ser feilmeldinger relatert til:${NC}"
echo -e "  - ${RED}530 Login authentication failed${NC} - Feil brukernavn/passord"
echo -e "  - ${RED}550 Permission Denied${NC} - Manglende rettigheter på server"
echo -e "  - ${RED}Connection refused${NC} - IP-blokkering/brannmur"
echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}Prøv følgende alternativer hvis FTP ikke fungerer:${NC}"
echo -e "1. Last opp med cPanel File Manager i stedet"
echo -e "2. Sjekk om din IP er blokkert på serveren (kontakt hosting provider)"
echo -e "3. Verifiser FTP-innstillinger på Namecheap kontrollpanel"
echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}Vil du sjekke om assets-filene er tilgjengelig på nettstedet? (y/n)${NC} "
read check_files

if [[ $check_files == "y" ]]; then
    echo -e "${YELLOW}Tester om filene er tilgjengelige via HTTP...${NC}"
    curl -I "https://www.snakkaz.com/assets/index-DQJNfLon.js"
    echo ""
    curl -I "https://www.snakkaz.com/assets/index-GRqizV24.css"
fi
