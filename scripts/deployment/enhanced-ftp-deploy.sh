#!/bin/bash
# enhanced-ftp-deploy.sh
#
# Dette er et forbedret FTP-deploymentskript som håndterer IP-restriksjoner og
# tilgangsproblemer med Namecheap FTP.

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: ENHANCED FTP DEPLOYMENT             ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Leser inn FTP-variabler fra .env
if [ -f ".env" ]; then
    echo -e "${YELLOW}Leser inn FTP-variabler fra .env fil...${NC}"
    source .env
else
    echo -e "${YELLOW}Finner ikke .env fil. Vennligst oppgi FTP-detaljer:${NC}"
    read -p "FTP Host (f.eks. premium123.web-hosting.com): " FTP_HOST
    read -p "FTP Brukernavn: " FTP_USER
    read -s -p "FTP Passord: " FTP_PASS
    echo
    read -p "Ekstern mappe (f.eks. public_html): " FTP_REMOTE_DIR
fi

echo -e "${YELLOW}FTP-innstillinger:${NC}"
echo "Host: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_REMOTE_DIR"
echo

# Sjekk om dist-mappen finnes
if [ ! -d "dist" ]; then
    echo -e "${RED}Feil: dist-mappen mangler! Bygger prosjektet først...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}Bygging feilet. Avbryter.${NC}"
        exit 1
    fi
fi

# Test FTP-tilkobling først
echo -e "${YELLOW}Tester FTP-tilkoblingen...${NC}"
mkdir -p .ftp-test
echo "Dette er en testfil" > .ftp-test/test.txt

# Bruk anonymisert utskrift for passord
HIDDEN_PASS=$(echo $FTP_PASS | sed 's/./*/g')
echo -e "${YELLOW}Testing med brukernavn: $FTP_USER og passord: $HIDDEN_PASS${NC}"

# Test med passive modus og TLS/SSL
echo -e "open $FTP_HOST\nuser $FTP_USER $FTP_PASS\nls\nbye" > .ftp-commands
RESULT=$(ftp -n < .ftp-commands 2>&1)
rm .ftp-commands

if echo "$RESULT" | grep -q "530"; then
    echo -e "${RED}Standard FTP-tilkobling feilet med 530 feil.${NC}"
    echo -e "${YELLOW}Prøver med LFTP og eksplisitte innstillinger...${NC}"
else
    echo -e "${GREEN}Standard FTP-tilkobling ser ut til å fungere!${NC}"
fi

# Oppretter en mer detaljert LFTP-konfigurasjonsfil
cat > enhanced-upload.lftp << EOF
# Start med å åpne tilkoblingen
open -u $FTP_USER,$FTP_PASS $FTP_HOST

# Debug-modus for å se alle kommandoer
debug 3

# SSL/TLS-innstillinger
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-force no
set ftp:passive-mode yes

# Nettverkstilkoblingsinnstillinger
set net:timeout 30
set net:max-retries 5
set net:reconnect-interval-base 5
set net:reconnect-interval-multiplier 1

# Fil overføringsinnstillinger
set ftp:use-feat yes
set ftp:use-mdtm yes
set ftp:use-size yes

# Bytt til riktig mappe
cd $FTP_REMOTE_DIR

# Last opp .htaccess først
put -O $FTP_REMOTE_DIR fix-mime-types.htaccess -o .htaccess

# Last opp dist-mappen (med mindre parallelitet for mer pålitelighet)
mirror -R dist/ $FTP_REMOTE_DIR --no-perms --parallel=2

# Avslutt
bye
EOF

echo -e "${YELLOW}Laster opp med forbedrede innstillinger...${NC}"
lftp -f enhanced-upload.lftp

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ LFTP-opplasting fullført!${NC}"
else
    echo -e "${RED}✗ LFTP-opplasting feilet.${NC}"
    
    # Alternativer ved feil
    echo -e "${YELLOW}Prøver alternativ metode med curl...${NC}"
    
    # Last opp .htaccess med curl
    echo -e "${YELLOW}Laster opp .htaccess via curl...${NC}"
    curl -v -T fix-mime-types.htaccess --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/.htaccess"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ .htaccess lastet opp via curl.${NC}"
        
        # Lag en zip-fil av dist-mappen og last opp den
        echo -e "${YELLOW}Komprimerer dist-mappen til zip...${NC}"
        zip -r snakkaz-dist.zip dist/
        
        echo -e "${YELLOW}Laster opp zip-fil via curl...${NC}"
        curl -v -T snakkaz-dist.zip --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/snakkaz-dist.zip"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Zip-fil lastet opp.${NC}"
            echo -e "${YELLOW}MERK: Du må logge inn på cPanel og pakke ut zip-filen manuelt.${NC}"
        else
            echo -e "${RED}✗ Kunne ikke laste opp zip-fil.${NC}"
        fi
    else
        echo -e "${RED}✗ Kunne ikke laste opp .htaccess via curl.${NC}"
    fi
fi

echo
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}    DEPLOYMENT PROSESS FULLFØRT                      ${NC}"
echo -e "${GREEN}=====================================================${NC}"

# Rydde opp
rm -f .ftp-test/test.txt
rmdir .ftp-test

echo
echo -e "${YELLOW}Neste steg:${NC}"
echo "1. Verifiser at nettstedet fungerer på https://www.snakkaz.com"
echo "2. Sjekk at MIME-typene er riktig konfigurert"
echo "3. Test SPA-ruting og at HTTPS-omdirigering fungerer"
echo
