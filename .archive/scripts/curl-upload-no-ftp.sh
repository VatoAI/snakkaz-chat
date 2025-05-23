#!/bin/bash
# curl-upload-no-ftp.sh
#
# Alternativ metode for å laste opp filer til Namecheap uten å bruke FTP-protokollen
# Bruker curl med HTTP (via cPanel File Manager API) istedenfor FTP

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: HTTP OPPLASTING (IKKE FTP)          ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# 1. Legg inn cPanel-påloggingsdetaljer
echo -e "${YELLOW}Oppgi cPanel påloggingsdetaljer:${NC}"
read -p "cPanel brukernavn (normalt det samme som FTP): " CPANEL_USER
read -s -p "cPanel passord: " CPANEL_PASS
echo
read -p "cPanel URL (f.eks. premium123.web-hosting.com:2083): " CPANEL_URL

# 2. Bygg prosjektet hvis nødvendig
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}dist-mappen finnes ikke. Vil du bygge prosjektet nå? (y/n)${NC}"
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

# 3. Pakk sammen dist-mappen til en zip-fil
echo -e "${YELLOW}Pakker dist-mappen til en zip-fil...${NC}"
zip -r snakkaz-dist.zip dist
if [ $? -ne 0 ]; then
    echo -e "${RED}Kunne ikke lage zip-fil. Er zip installert?${NC}"
    exit 1
fi
echo -e "${GREEN}Zip-fil opprettet: snakkaz-dist.zip${NC}"

# 4. Last opp zip-filen via cPanel File Manager API
echo -e "${YELLOW}Laster opp zip-fil til serveren...${NC}"
echo -e "${YELLOW}Dette kan ta litt tid, vennligst vent...${NC}"

# Bruker curl til å laste opp til cPanel File Manager
curl -k -u "$CPANEL_USER:$CPANEL_PASS" -F "file=@snakkaz-dist.zip" "https://$CPANEL_URL/execute/Fileman/upload_files?dir=/public_html"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Zip-fil lastet opp til serveren!${NC}"
    
    echo -e "${YELLOW}VIKTIG MANUELT STEG:${NC}"
    echo -e "${YELLOW}1. Logg inn på cPanel${NC}"
    echo -e "${YELLOW}2. Gå til File Manager${NC}"
    echo -e "${YELLOW}3. Naviger til public_html${NC}"
    echo -e "${YELLOW}4. Finn snakkaz-dist.zip${NC}"
    echo -e "${YELLOW}5. Høyreklikk og velg 'Extract'${NC}"
    echo -e "${YELLOW}6. Sørg for at filene pakkes ut i riktig mappe${NC}"
else
    echo -e "${RED}✗ Opplasting av zip-fil feilet.${NC}"
fi

# 5. Last opp .htaccess filen separat
if [ -f "fix-mime-types.htaccess" ]; then
    echo -e "${YELLOW}Laster opp .htaccess-filen...${NC}"
    
    # Lager en kopi med riktig navn
    cp fix-mime-types.htaccess .htaccess
    
    # Last opp .htaccess via cPanel File Manager API
    curl -k -u "$CPANEL_USER:$CPANEL_PASS" -F "file=@.htaccess" "https://$CPANEL_URL/execute/Fileman/upload_files?dir=/public_html"
    
    # Fjern den midlertidige kopien
    rm .htaccess
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ .htaccess lastet opp.${NC}"
    else
        echo -e "${RED}✗ Feil ved opplasting av .htaccess${NC}"
    fi
fi

echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}  OPPLASTING TIL NAMECHEAP FULLFØRT                  ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo
echo -e "${YELLOW}IKKE GLEM: Du må pakke ut zip-filen manuelt via cPanel!${NC}"
echo -e "${YELLOW}Nettsted: https://www.snakkaz.com${NC}"
echo
