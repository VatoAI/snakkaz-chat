#!/bin/bash
# verify-spa-fix.sh
#
# Dette skriptet sjekker om SPA routing fiksen fungerer som forventet

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: VERIFISERING AV SPA FIX            ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Sjekk at curl er installert
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Feil: curl er nødvendig men ikke installert.${NC}"
    echo "Vennligst installer curl og prøv igjen."
    exit 1
fi

# Funksjon for å sjekke om en URL er tilgjengelig
check_url() {
    local url=$1
    local description=$2
    
    echo -e "${YELLOW}Sjekker ${description}...${NC}"
    
    # Prøv å hente URL-en med curl
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$STATUS_CODE" -eq 200 ]; then
        echo -e "${GREEN}✓ ${description} er tilgjengelig (HTTP 200)${NC}"
        return 0
    else
        echo -e "${RED}✗ ${description} er ikke tilgjengelig (HTTP $STATUS_CODE)${NC}"
        return 1
    fi
}

# Hovedprogram
echo -e "${YELLOW}Steg 1: Sjekker om hovedsiden er tilgjengelig${NC}"
if check_url "https://www.snakkaz.com" "Hovedsiden"; then
    echo "Hovedsiden er tilgjengelig."
    echo
else
    echo "Hovedsiden er ikke tilgjengelig. Dette kan indikere et mer alvorlig problem."
    echo "Vennligst sjekk at nettsiden er oppe og kjører."
    exit 1
fi

echo -e "${YELLOW}Steg 2: Sjekker om fix-service-worker.html er lastet opp${NC}"
if check_url "https://www.snakkaz.com/fix-service-worker.html" "Service worker fix side"; then
    echo -e "${GREEN}✓ Service worker fix siden er tilgjengelig!${NC}"
    echo "Du kan besøke https://www.snakkaz.com/fix-service-worker.html"
    echo "for å fikse potensielle service worker problemer."
    echo
else
    echo -e "${RED}✗ Service worker fix siden er ikke tilgjengelig.${NC}"
    echo "Vennligst sjekk at fix-service-worker.html ble lastet opp korrekt."
    echo
fi

# Sjekk om .htaccess-filen fungerer som forventet
echo -e "${YELLOW}Steg 3: Tester .htaccess-konfigurasjonen${NC}"
echo "Gjør en forespørsel til en ikke-eksisterende URL for å sjekke om den blir riktig omdirigert..."

# Lag en tilfeldig URL som garantert ikke eksisterer
RANDOM_URL="https://www.snakkaz.com/test-routing-fix-$(date +%s)"

# Hent HTTP-statuskoden for den tilfeldige URL-en
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$RANDOM_URL")

if [ "$STATUS_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ SPA routing fungerer korrekt!${NC}"
    echo "Ikke-eksisterende URL-er blir omdirigert til hovedapplikasjonen."
    echo "Dette indikerer at .htaccess-filen fungerer som forventet."
    echo
    echo -e "${GREEN}✓ SPA routing fiksen er suksessfull!${NC}"
else
    echo -e "${RED}✗ SPA routing fungerer ikke som forventet.${NC}"
    echo "Ikke-eksisterende URL-er blir ikke riktig omdirigert (HTTP $STATUS_CODE)."
    echo "Dette kan indikere at .htaccess-filen ikke er tilgjengelig eller ikke fungerer."
    echo
    echo -e "${YELLOW}Mulige problemer:${NC}"
    echo "1. .htaccess-filen ble ikke lastet opp til riktig plassering"
    echo "2. Webserveren støtter ikke .htaccess eller mod_rewrite"
    echo "3. .htaccess-innstillingene er ikke riktige for din serveroppsett"
    echo
    echo "Vennligst sjekk serverloggene for mer informasjon."
fi

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    NESTE STEG    ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo -e "${YELLOW}For å verifisere at påloggingsgrensesnittet vises:${NC}"
echo
echo "1. Åpne en ny inkognitofane i nettleseren"
echo "2. Besøk https://www.snakkaz.com"
echo "3. Hvis påloggingsgrensesnittet vises, er SPA-ruting fikset!"
echo
echo -e "${YELLOW}Hvis problemet fortsatt oppstår:${NC}"
echo "1. Besøk https://www.snakkaz.com/fix-service-worker.html"
echo "2. Klikk på 'Fix Service Worker Issues' knappen"
echo "3. Gå tilbake til https://www.snakkaz.com etter at fiksen er ferdig"
echo
echo -e "${GREEN}Verifisering fullført!${NC}"
