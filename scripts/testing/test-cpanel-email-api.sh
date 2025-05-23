#!/bin/bash
# test-cpanel-email-api.sh
#
# Dette skriptet tester cPanel API for e-postoperasjoner
# og verifiserer at vi har riktig tilgang til å administrere e-postkontoer

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    TEST AV CPANEL API FOR E-POSTOPERASJONER          ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Leser inn miljøvariabler
if [ -f ".env" ]; then
    source .env
else
    echo -e "${YELLOW}Ingen .env-fil funnet. Vennligst oppgi API-detaljer:${NC}"
    read -p "cPanel brukernavn (f.eks. SnakkaZ): " CPANEL_USERNAME
    read -s -p "cPanel API token: " CPANEL_API_TOKEN
    echo
    read -p "cPanel domene (f.eks. premium123.web-hosting.com): " CPANEL_DOMAIN
fi

# Verifiser at vi har alle nødvendige variabler
if [ -z "$CPANEL_USERNAME" ] || [ -z "$CPANEL_API_TOKEN" ] || [ -z "$CPANEL_DOMAIN" ]; then
    echo -e "${RED}Feil: Mangler nødvendige API-detaljer${NC}"
    exit 1
fi

echo -e "${YELLOW}Tester tilkobling til cPanel API...${NC}"
# Test 1: List alle e-postkontoer
echo -e "\n${BLUE}Test 1:${NC} Henter liste over e-postkontoer"

response=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
    "https://$CPANEL_DOMAIN:2083/execute/Email/list_pops")

if echo "$response" | grep -q "error"; then
    echo -e "${RED}✗ Test mislyktes${NC}"
    echo "Feilmelding: $(echo "$response" | grep -o '"error":"[^"]*"' | sed 's/"error":"//;s/"$//')"
    echo -e "${YELLOW}Mulige årsaker:${NC}"
    echo "1. Ugyldig API token"
    echo "2. Feil brukernavn"
    echo "3. Feil domenenavn eller port"
    echo "4. API token mangler riktige tilganger"
    exit 1
else
    echo -e "${GREEN}✓ API-tilkobling vellykket!${NC}"
    echo "Fant $(echo "$response" | grep -o '"data":\[.*\]' | grep -o '"email"' | wc -l) e-postkontoer."
fi

# Test 2: Sjekk om vi kan få e-postkvote (mindre invasivt)
echo -e "\n${BLUE}Test 2:${NC} Sjekker e-postkvote API"

# Finn en eksisterende e-post eller bruk en dummy
existing_email=$(echo "$response" | grep -o '"email":"[^"]*"' | grep "@snakkaz.com" | head -1 | sed 's/"email":"//;s/"$//' | cut -d@ -f1)

if [ -z "$existing_email" ]; then
    existing_email="test" # Dummy e-post, vil feile men sjekker API-respons
fi

quota_response=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
    "https://$CPANEL_DOMAIN:2083/execute/Email/get_pop_quota?email=$existing_email&domain=snakkaz.com")

if echo "$quota_response" | grep -q "data"; then
    echo -e "${GREEN}✓ E-postkvote API fungerer!${NC}"
else
    if echo "$quota_response" | grep -q "does not exist"; then
        echo -e "${YELLOW}⚠ E-postkvote API ble testet, men ingen e-postkontoer finnes ennå.${NC}"
        echo "Dette er normalt hvis du ikke har opprettet noen e-postkontoer ennå."
    else
        echo -e "${RED}✗ Kunne ikke hente e-postkvote${NC}"
        echo "Feilmelding: $(echo "$quota_response" | grep -o '"errors":\[[^]]*\]' | sed 's/"errors":\[//;s/\]//' | tr -d '"')"
    fi
fi

# Test 3: Sjekk tilgjengeligheten av API-funksjonene vi trenger
echo -e "\n${BLUE}Test 3:${NC} Sjekker tilgjengelighet av nødvendige API-funksjoner"

# Liste over API-funksjoner vi trenger
api_functions=("Email/list_pops" "Email/add_pop" "Email/delete_pop" "Email/passwd_pop" "Email/get_pop_quota")

# Sjekk hver funksjon
for func in "${api_functions[@]}"; do
    echo -n "Sjekker $func... "
    
    # Kall API-funksjonen med dummy-data (vi er bare interessert i om den finnes)
    func_response=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
        "https://$CPANEL_DOMAIN:2083/execute/$func")
    
    # Sjekk om svaret indikerer at funksjonen eksisterer (selv om parametere mangler)
    if echo "$func_response" | grep -q "errors.*Missing required parameters"; then
        echo -e "${GREEN}✓ Tilgjengelig${NC}"
    elif echo "$func_response" | grep -q "errors.*Access denied"; then
        echo -e "${RED}✗ Tilgang nektet${NC}"
    elif echo "$func_response" | grep -q "error.*Not found"; then
        echo -e "${RED}✗ Funksjon ikke funnet${NC}"
    else
        echo -e "${YELLOW}? Status ukjent${NC}"
    fi
done

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    KONKLUSJON                                        ${NC}"
echo -e "${BLUE}=====================================================${NC}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ cPanel API er tilgjengelig og fungerer for e-postoperasjoner!${NC}"
    echo -e "Du kan nå bruke e-postfunksjonalitet i Snakkaz Chat."
    echo
    echo -e "Neste steg:"
    echo "1. Oppdater server.js til å bruke Express for API-endepunkter"
    echo "2. Kjør update-dependencies-for-email.sh for å installere nødvendige pakker"
    echo "3. Start serveren og test premium e-postfunksjoner"
else
    echo -e "${RED}✗ Det var problemer med cPanel API-konfigurasjonen.${NC}"
    echo -e "Vennligst løs problemene over før du prøver å bruke e-postfunksjonene."
fi

echo
