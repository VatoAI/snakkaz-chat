#!/bin/bash
# setup-cpanel-deployment.sh
#
# Dette skriptet hjelper med å sette opp nødvendige hemmeligheter for GitHub Actions
# for å bruke cPanel API token for deployment

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: OPPSETT FOR CPANEL API TOKEN       ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Innsamling av informasjon
echo -e "${YELLOW}Vennligst oppgi følgende informasjon for cPanel API token oppsett:${NC}"
read -p "cPanel brukernavn (f.eks. SnakkaZ): " CPANEL_USERNAME
read -s -p "cPanel API token (opprettet via Manage API Tokens i cPanel): " CPANEL_API_TOKEN
echo
read -p "cPanel domene (f.eks. premium123.web-hosting.com): " CPANEL_DOMAIN

# Generer GitHub Actions-syntaks for hemmeligheter
echo
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}    GITHUB ACTIONS HEMMELIGHETER SOM MÅ LEGGES TIL   ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo
echo "For å legge til disse hemmelighetene i GitHub repo:"
echo "1. Gå til GitHub repository"
echo "2. Klikk på 'Settings' fanen"
echo "3. Velg 'Secrets and variables' -> 'Actions'"
echo "4. Klikk på 'New repository secret'"
echo "5. Legg til følgende hemmeligheter:"
echo
echo -e "${YELLOW}Navn:${NC} CPANEL_USERNAME"
echo -e "${YELLOW}Verdi:${NC} $CPANEL_USERNAME"
echo
echo -e "${YELLOW}Navn:${NC} CPANEL_API_TOKEN"
echo -e "${YELLOW}Verdi:${NC} $CPANEL_API_TOKEN"
echo
echo -e "${YELLOW}Navn:${NC} CPANEL_DOMAIN"
echo -e "${YELLOW}Verdi:${NC} $CPANEL_DOMAIN"
echo

# Test API token tilkobling
echo -e "${YELLOW}Tester cPanel API token tilkobling...${NC}"

# Test API token ved å liste filer i hjemmekatalogen
TEST_RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
                 "https://$CPANEL_DOMAIN:2083/execute/Fileman/list_files?dir=%2Fhome")

if echo "$TEST_RESPONSE" | grep -q "error"; then
    echo -e "${RED}✗ API token test feilet!${NC}"
    echo "Feilmelding: $(echo "$TEST_RESPONSE" | grep -o '"error":"[^"]*"')"
    echo -e "${YELLOW}Sjekk at API token er gyldig og har riktige tilganger.${NC}"
    echo -e "${YELLOW}Se docs/CPANEL-API-TOKEN-DEPLOYMENT.md for mer informasjon.${NC}"
else
    echo -e "${GREEN}✓ API token test vellykket!${NC}"
    echo -e "${GREEN}API token virker korrekt og er klar til bruk med GitHub Actions.${NC}"
fi

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    NESTE STEG                                       ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo "1. Legg til hemmelighetene i GitHub repository"
echo "2. Aktiver GitHub Actions workflow i .github/workflows/deploy-cpanel-token.yml"
echo "3. Push kode til main-grenen eller kjør workflow manuelt for å teste deployment"
echo
echo -e "${YELLOW}Se docs/CPANEL-API-TOKEN-DEPLOYMENT.md for mer detaljert veiledning.${NC}"
echo
