#!/bin/bash
# better-ftp-upload.sh
#
# Et forbedret FTP-opplastingsskript som bruker lftp for mer robuste overføringer

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: DIREKTE FTP-OPPLASTING             ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# 1. Sjekk om lftp er installert
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}lftp er ikke installert. Installerer...${NC}"
    sudo apt-get update && sudo apt-get install -y lftp
    if [ $? -ne 0 ]; then
        echo -e "${RED}Kunne ikke installere lftp. Vennligst installer manuelt.${NC}"
        exit 1
    fi
    echo -e "${GREEN}lftp er nå installert.${NC}"
fi

# 2. Leser inn FTP-variabler fra .env
if [ -f ".env" ]; then
    echo -e "${YELLOW}Leser inn FTP-variabler fra .env fil...${NC}"
    source .env
else
    echo -e "${RED}Finner ikke .env fil. Vennligst oppgi FTP-detaljer:${NC}"
    read -p "FTP Host (f.eks. ftp.snakkaz.com): " FTP_HOST
    read -p "FTP Brukernavn: " FTP_USER
    read -p "FTP Passord: " FTP_PASS
    read -p "Ekstern mappe (f.eks. public_html): " FTP_REMOTE_DIR
fi

echo -e "${YELLOW}FTP-innstillinger:${NC}"
echo "Host: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_REMOTE_DIR"
echo

# 3. Sjekk om dist-mappen finnes
if [ ! -d "dist" ]; then
    echo -e "${RED}Feil: dist-mappen mangler!${NC}"
    echo -e "${YELLOW}Vil du bygge prosjektet nå? (y/n)${NC}"
    read -p "> " build_choice
    if [[ $build_choice == "y" || $build_choice == "Y" ]]; then
        echo -e "${YELLOW}Bygger prosjektet...${NC}"
        npm run build
        if [ $? -ne 0 ]; then
            echo -e "${RED}Bygging feilet. Kan ikke fortsette.${NC}"
            exit 1
        fi
        echo -e "${GREEN}Bygging fullført.${NC}"
    else
        echo -e "${RED}Avbryter. Kan ikke laste opp uten dist-mappen.${NC}"
        exit 1
    fi
fi

# 4. Last opp .htaccess separat først
if [ -f "fix-mime-types.htaccess" ]; then
    echo -e "${YELLOW}Laster opp .htaccess-filen...${NC}"
    lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; put -O $FTP_REMOTE_DIR fix-mime-types.htaccess -o .htaccess"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ .htaccess lastet opp.${NC}"
    else
        echo -e "${RED}✗ Feil ved opplasting av .htaccess${NC}"
    fi
fi

# 5. Last opp hele dist-mappen
echo -e "${YELLOW}Laster opp applikasjonen til serveren...${NC}"
echo -e "${YELLOW}Dette kan ta noen minutter, vær tålmodig...${NC}"

# Oppretter lftp-script for mer robuste overføringer
cat > upload.lftp << EOF
open -u $FTP_USER,$FTP_PASS $FTP_HOST
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-protect-list yes
set net:timeout 10
set net:max-retries 3
set net:reconnect-interval-base 5
set net:reconnect-interval-multiplier 1
mirror -R dist/ $FTP_REMOTE_DIR --no-perms --parallel=5
bye
