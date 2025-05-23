#!/bin/bash
# check-htaccess.sh
# Dette skriptet sjekker om .htaccess-filen på serveren er riktig konfigurert

# Fargedefinisjoner
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   SJEKK .HTACCESS KONFIGURASJON PÅ SERVEREN          ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Funksjon for å sjekke om en streng finnes i .htaccess
check_htaccess_config() {
    local search_string="$1"
    local description="$2"
    
    if curl -s https://www.snakkaz.com/.htaccess | grep -q "$search_string"; then
        echo -e "${GREEN}✓ $description funnet i .htaccess${NC}"
        return 0
    else
        echo -e "${RED}✗ $description IKKE funnet i .htaccess${NC}"
        return 1
    fi
}

# Prøv å hente .htaccess-filen fra serveren
echo -e "${YELLOW}Forsøker å hente .htaccess fra serveren...${NC}"
HTACCESS=$(curl -s https://www.snakkaz.com/.htaccess)

if [ -z "$HTACCESS" ]; then
    echo -e "${RED}✗ Kunne ikke hente .htaccess fra serveren${NC}"
    echo -e "${YELLOW}Dette kan bety at:${NC}"
    echo -e "1. Serveren ikke tillater tilgang til .htaccess-filen"
    echo -e "2. Filen ikke eksisterer"
    echo -e "3. Det er en konfigurasjon som blokkerer tilgangen"
else
    echo -e "${GREEN}✓ Hentet .htaccess-fil fra serveren${NC}"
    echo -e "${YELLOW}Innhold av .htaccess (første 10 linjer):${NC}"
    echo "$HTACCESS" | head -10
    echo -e "${YELLOW}...${NC}"
    
    # Sjekk konfigurasjon
    echo -e "\n${YELLOW}Sjekker kritisk .htaccess-konfigurasjon:${NC}"
    
    check_htaccess_config "AddType application/javascript" "JavaScript MIME-type konfigurasjon"
    check_htaccess_config "AddType text/css" "CSS MIME-type konfigurasjon"
    check_htaccess_config "RewriteEngine On" "URL-rewriting konfigurasjon"
    check_htaccess_config "ExpiresActive On" "Browser caching konfigurasjon"
    check_htaccess_config "Access-Control-Allow-Origin" "CORS-konfigurasjon"
fi

echo -e "\n${YELLOW}Sjekker om serveren respekterer .htaccess MIME-typer...${NC}"

# Test for JavaScript
JS_MIME=$(curl -s -I https://www.snakkaz.com/assets/index-DQJNfLon.js | grep -i "Content-Type")
echo -e "JavaScript Content-Type: ${BLUE}$JS_MIME${NC}"

# Test for CSS
CSS_MIME=$(curl -s -I https://www.snakkaz.com/assets/index-GRqizV24.css | grep -i "Content-Type")
echo -e "CSS Content-Type: ${BLUE}$CSS_MIME${NC}"

echo -e "\n${YELLOW}Anbefalinger basert på tester:${NC}"

if [[ "$JS_MIME" != *"application/javascript"* && "$JS_MIME" != *"text/javascript"* ]]; then
    echo -e "${RED}→ JavaScript serveres med feil MIME-type${NC}"
    echo -e "${YELLOW}  Last opp og verifiser at .htaccess-filen er riktig konfigurert${NC}"
fi

if [[ "$CSS_MIME" != *"text/css"* ]]; then
    echo -e "${RED}→ CSS serveres med feil MIME-type${NC}"
    echo -e "${YELLOW}  Last opp og verifiser at .htaccess-filen er riktig konfigurert${NC}"
fi

echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}NESTE STEG:${NC}"
echo -e "1. Verifiser at .htaccess har riktige MIME-typer"
echo -e "2. Last opp assets-filene med prepare-assets-for-cpanel.sh"
echo -e "3. Sjekk MIME-typene igjen etter opplasting"
echo -e "4. Tøm nettleserens buffer med CTRL+F5"
echo -e "${BLUE}======================================================${NC}"
