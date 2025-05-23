#!/bin/bash
# verify-email-security.sh
#
# Dette skriptet kjører alle sikkerhetssjekker for 
# premium e-postfunksjonen i Snakkaz Chat

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}  SNAKKAZ CHAT: VERIFISERING AV E-POST SIKKERHET     ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Sjekk alle nødvendige filer
echo -e "${YELLOW}1. Sjekker at alle nødvendige filer finnes...${NC}"

FILES_TO_CHECK=(
    "src/middleware/apiSecurityMiddleware.js"
    "src/server/emailService.js"
    "src/middleware/authMiddleware.js"
    "src/server/api/emailRoutes.js"
    "test-security-implementation.js"
    "test-email-api-security.sh"
    "test-cpanel-email-api.sh"
)

ALL_FILES_EXIST=true

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (ikke funnet)"
        ALL_FILES_EXIST=false
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    echo -e "\n${RED}FEIL: Mangler nødvendige filer for sikkerhetsimplementasjonen.${NC}"
    echo "Vennligst se over SECURE-EMAIL-API.md for hvilke filer som trengs."
    exit 1
fi

echo -e "${GREEN}Alle nødvendige filer funnet!${NC}"
echo

# Kjør sikkerhetsimplementasjonstest
echo -e "${YELLOW}2. Kjører test av sikkerhetsimplementasjonen...${NC}"
node test-security-implementation.js

if [ $? -ne 0 ]; then
    echo -e "\n${RED}FEIL: Testen av sikkerhetsimplementasjonen feilet.${NC}"
    echo "Rett feilene over og kjør skriptet på nytt."
    exit 1
fi

echo

# Sjekk om vi kan bruke faktiske API-token
echo -e "${YELLOW}3. Vil du teste med faktisk cPanel API token? (anbefalt)${NC}"
read -p "Test med virkelig cPanel API token? (ja/nei): " TEST_REAL_TOKEN

if [[ "$TEST_REAL_TOKEN" =~ ^[Jj][Aa]$ ]]; then
    echo -e "${YELLOW}Kjører test av cPanel API...${NC}"
    ./test-cpanel-email-api.sh
    
    if [ $? -ne 0 ]; then
        echo -e "\n${RED}ADVARSEL: Testen av cPanel API feilet.${NC}"
        echo "Dette kan skyldes:"
        echo "1. Feil i API token-konfigurasjon"
        echo "2. Problemer med nettverkstilgang til cPanel"
        echo "3. Feil i cPanel API eller begrensninger på kontoen"
        
        read -p "Vil du fortsette til neste test likevel? (ja/nei): " CONTINUE_AFTER_FAIL
        if [[ ! "$CONTINUE_AFTER_FAIL" =~ ^[Jj][Aa]$ ]]; then
            exit 1
        fi
    fi
    echo
fi

# Sjekk Github secrets
echo -e "${YELLOW}4. Sjekker om GitHub Secrets er konfigurert...${NC}"

if command -v gh &> /dev/null; then
    gh auth status &> /dev/null
    if [ $? -eq 0 ]; then
        REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)
        if [ -n "$REPO" ]; then
            echo -e "  Sjekker secrets for repository: ${BLUE}$REPO${NC}"
            
            # Kan ikke vise innhold i secrets, men vi kan sjekke om de finnes
            SECRET_COUNT=$(gh secret list -R "$REPO" | grep -c "CPANEL_")
            
            if [ $SECRET_COUNT -ge 3 ]; then
                echo -e "  ${GREEN}✓${NC} Fant $SECRET_COUNT cPanel-relaterte secrets"
            else
                echo -e "  ${RED}✗${NC} Fant bare $SECRET_COUNT cPanel-relaterte secrets"
                echo -e "  ${YELLOW}Kjør ./setup-github-secrets-for-email.sh for å sette opp secrets${NC}"
            fi
        else
            echo -e "  ${RED}✗${NC} Kunne ikke finne GitHub repository informasjon"
            echo -e "  ${YELLOW}Logg inn med 'gh auth login' og prøv igjen${NC}"
        fi
    else
        echo -e "  ${RED}✗${NC} Ikke logget inn på GitHub CLI"
        echo -e "  ${YELLOW}Logg inn med 'gh auth login' for å sjekke secrets${NC}"
    fi
else
    echo -e "  ${RED}✗${NC} GitHub CLI (gh) er ikke installert"
    echo -e "  ${YELLOW}Installer med 'apt install gh' eller fra https://cli.github.com/${NC}"
fi

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}  OPPSUMMERING                                       ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

PASS_COUNT=0
TOTAL_TESTS=3  # Antall tester kjørt

# Tell bestått
if [ "$ALL_FILES_EXIST" = true ]; then
    PASS_COUNT=$((PASS_COUNT + 1))
fi

if [ "$(grep -c "✅ Security layer is functioning properly for regular users" <<< "$(node test-security-implementation.js)")" -gt 0 ]; then
    PASS_COUNT=$((PASS_COUNT + 1))
fi

if [[ "$TEST_REAL_TOKEN" =~ ^[Jj][Aa]$ ]]; then
    TOTAL_TESTS=4
    if [ $? -eq 0 ]; then
        PASS_COUNT=$((PASS_COUNT + 1))
    fi
fi

if [ $SECRET_COUNT -ge 3 ]; then
    PASS_COUNT=$((PASS_COUNT + 1))
fi

echo -e "Bestått ${GREEN}$PASS_COUNT${NC} av ${BLUE}$TOTAL_TESTS${NC} tester"

if [ $PASS_COUNT -eq $TOTAL_TESTS ]; then
    echo -e "\n${GREEN}✅ ALLE TESTER BESTÅTT!${NC}"
    echo -e "Premium e-postfunksjonalitet er riktig implementert og sikret."
    echo -e "Du kan nå trygt bruke cPanel API token for e-postadministrasjon."
elif [ $PASS_COUNT -ge $((TOTAL_TESTS - 1)) ]; then
    echo -e "\n${YELLOW}⚠️ DE FLESTE TESTER BESTÅTT${NC}"
    echo -e "De viktigste sikkerhetstestene er bestått, men det er noen advarsler."
    echo -e "Se på feilene over og vurder om de trenger å fikses før du går videre."
else
    echo -e "\n${RED}❌ FLERE TESTER FEILET${NC}"
    echo -e "Du bør fikse problemene over før du bruker e-postfunksjonaliteten i produksjon."
    echo -e "Se dokumentasjonen i docs/SECURE-EMAIL-API.md og docs/CPANEL-API-TOKEN-SECURITY.md for hjelp."
fi

echo
