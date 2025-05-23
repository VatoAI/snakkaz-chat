#!/bin/bash
# enkel-assets-upload.sh
# Forenklet skript for å laste opp assets-filer som feilet tidligere
# Bruker bare curl som er standard på de fleste systemer

# Fargedefinisjoner for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   SNAKKAZ ENKEL ASSETS-OPPLASTING FOR NAMECHEAP      ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Sjekk for nødvendige verktøy
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Feil: curl er ikke installert.${NC}"
    echo -e "${YELLOW}Prøver å installere curl...${NC}"
    apt-get update && apt-get install -y curl || sudo apt-get update && sudo apt-get install -y curl
    
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Kunne ikke installere curl. Vennligst installer curl manuelt.${NC}"
        exit 1
    fi
fi

# FTP-innstillinger - forhåndsutfylt med verdier
FTP_HOST="ftp.snakkaz.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_DIR="public_html"

# Spør om passord
read -s -p "Skriv inn FTP-passord: " FTP_PASS
echo

# Sjekk om passord er oppgitt
if [ -z "$FTP_PASS" ]; then
    echo -e "${RED}Feil: FTP-passord er påkrevd.${NC}"
    exit 1
fi

echo -e "${YELLOW}Sjekker om dist-mappen eksisterer...${NC}"
if [ ! -d "dist" ] || [ ! -d "dist/assets" ]; then
    echo -e "${RED}Feil: dist/assets-mappen finnes ikke.${NC}"
    echo -e "${YELLOW}Bygger applikasjonen på nytt...${NC}"
    
    npm run build
    
    if [ ! -d "dist/assets" ]; then
        echo -e "${RED}Kunne ikke bygge applikasjonen. Vennligst fiks byggfeilene og prøv igjen.${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}Forsøker først å opprette assets-mappe på serveren...${NC}"

# Opprett assets-mappen med curl
curl -s --ftp-create-dirs "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/" -Q "NOOP"

# Sjekk om mappen ble opprettet
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Assets-mappe opprettet eller eksisterer allerede${NC}"
else
    echo -e "${RED}✗ Kunne ikke opprette assets-mappe. Prøver å fortsette likevel...${NC}"
fi

echo -e "${YELLOW}Laster opp filer med curl...${NC}"
echo -e "${YELLOW}Dette kan ta litt tid, vær tålmodig...${NC}"

# Last opp alle JS-filer
UPLOAD_COUNT=0
FAILED_COUNT=0

# Tell alle filer som skal lastes opp
TOTAL_FILES=$(find dist/assets -type f -name "*.js" -o -name "*.css" | wc -l)
echo -e "${BLUE}Fant ${TOTAL_FILES} filer som skal lastes opp${NC}"

# Last opp alle filer
find dist/assets -type f -name "*.js" -o -name "*.css" | while read file; do
    filename=$(basename "$file")
    echo -ne "${YELLOW}[$((UPLOAD_COUNT+1))/${TOTAL_FILES}] Laster opp $filename...${NC}"
    
    # Bruk curl med økt timeout og retry
    curl --connect-timeout 30 --max-time 120 --retry 3 --retry-delay 5 --retry-max-time 60 -s -T "$file" "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/assets/$filename"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN} ✓${NC}"
        ((UPLOAD_COUNT++))
    else
        echo -e "${RED} ✗${NC}"
        ((FAILED_COUNT++))
        
        # Legg til den feilede filen i en liste
        echo "$filename" >> failed_uploads.txt
    fi
    
    # Legg til en kort pause for å unngå å overbelaste serveren
    sleep 0.5
done

# Vis oppsummering
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Lastet opp $UPLOAD_COUNT filer${NC}"
if [ $FAILED_COUNT -gt 0 ]; then
    echo -e "${RED}$FAILED_COUNT filer kunne ikke lastes opp${NC}"
    echo -e "${YELLOW}Se failed_uploads.txt for detaljer${NC}"
else
    echo -e "${GREEN}Alle filer ble lastet opp uten feil!${NC}"
    # Fjern feilfil hvis den finnes
    rm -f failed_uploads.txt
fi

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}Assets-opplasting ferdig!${NC}"
echo -e "${BLUE}======================================================${NC}"

# Foreslå neste steg basert på resultatet
if [ -f "failed_uploads.txt" ]; then
    echo -e "${YELLOW}Noen filer ble ikke lastet opp. Du kan prøve følgende:${NC}"
    echo -e "1. Sjekk tilgangen til FTP-serveren med cPanel"
    echo -e "2. Last opp de manglende filene manuelt gjennom cPanel File Manager"
    echo -e "3. Sørg for at assets-mappen har riktige tillatelser (chmod 755)"
else
    echo -e "${GREEN}Alle filer ble lastet opp. Nå bør du kunne se endringene på www.snakkaz.com${NC}"
fi

echo -e "${YELLOW}🔰 VIKTIGE STEG ETTERPÅ:${NC}"
echo -e "1. Tøm nettleserens buffer med CTRL+F5"
echo -e "2. Sjekk at filene er tilgjengelige ved å gå til:"
echo -e "   https://www.snakkaz.com/assets/index-GRqizV24.css"
echo -e "3. Åpne utviklerverktøyet (F12) for å se om det er noen konsollfeil"
echo -e "${BLUE}======================================================${NC}"

# Lag en enkel test for å sjekke om assets-filene er tilgjengelige
echo -e "${YELLOW}Vil du kjøre en rask test for å sjekke om filene er tilgjengelige? (y/n)${NC}"
read -r RUN_TEST

if [[ $RUN_TEST == "y" ]]; then
    echo -e "${BLUE}Tester tilgang til assets-filer...${NC}"
    
    # Test en CSS- og en JS-fil
    CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://www.snakkaz.com/assets/index-GRqizV24.css")
    JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://www.snakkaz.com/assets/index-DQJNfLon.js")
    
    if [ "$CSS_STATUS" == "200" ] && [ "$JS_STATUS" == "200" ]; then
        echo -e "${GREEN}✅ Filene er tilgjengelige på serveren!${NC}"
        echo -e "${GREEN}👍 Nå bør nettsiden fungere når du besøker www.snakkaz.com${NC}"
    else
        echo -e "${RED}❌ Kunne ikke bekrefte at filene er tilgjengelige.${NC}"
        echo -e "${YELLOW}CSS-fil status: $CSS_STATUS${NC}"
        echo -e "${YELLOW}JS-fil status: $JS_STATUS${NC}"
        echo -e "${YELLOW}Dette kan skyldes:${NC}"
        echo -e "1. Det tar litt tid før endringene propagerer"
        echo -e "2. Filnavnene er annerledes (sjekk dist/assets for riktige filnavn)"
        echo -e "3. Det er problemer med serveren eller tilganger"
    fi
fi
