#!/bin/bash
# setup-cpanel-deployment.sh
#
# Dette skriptet hjelper med å sette opp cPanel API-basert deployment for Snakkaz Chat.
# Det henter inn nødvendige detaljer og tester tilkoblingen.

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: OPPSETT AV cPANEL API DEPLOYMENT    ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Legg inn cPanel-påloggingsdetaljer
echo -e "${YELLOW}Oppgi cPanel påloggingsdetaljer:${NC}"
read -p "cPanel brukernavn (sannsynligvis SnakkaZ@snakkaz.com): " CPANEL_USER
read -s -p "cPanel passord: " CPANEL_PASS
echo
read -p "cPanel URL (f.eks. premium123.web-hosting.com:2083): " CPANEL_URL

# Lagre disse i en fil som GitHub Actions oppsett-referanse
echo -e "${YELLOW}Lagrer tilkoblingsdetaljer til cpanel-credentials-reference.txt...${NC}"

cat > cpanel-credentials-reference.txt << EOF
# cPanel API-tilkoblingsdetaljer for Snakkaz Chat
# MERK: DENNE FILEN SKAL IKKE COMMITTES TIL GIT!
# Disse detaljene skal legges inn som GitHub secrets.

CPANEL_USERNAME=${CPANEL_USER}
CPANEL_PASSWORD=********** (ikke lagret av sikkerhetshensyn)
CPANEL_URL=${CPANEL_URL}

# For å sette opp GitHub secrets:
# 1. Gå til GitHub-repositoryet
# 2. Klikk på "Settings" fanen
# 3. I venstre sidepanel, klikk på "Secrets and variables" → "Actions"
# 4. Klikk på "New repository secret"
# 5. Legg til hver av de nødvendige hemmelighetene:
#    - CPANEL_USERNAME: ${CPANEL_USER}
#    - CPANEL_PASSWORD: (ditt cPanel-passord)
#    - CPANEL_URL: ${CPANEL_URL}
EOF

echo -e "${GREEN}Credentials-referansefil opprettet: cpanel-credentials-reference.txt${NC}"
echo -e "${YELLOW}MERK: Ikke commit denne filen til Git!${NC}"
echo

# Test tilkoblingen
echo -e "${YELLOW}Tester cPanel API-tilkobling...${NC}"

# Konstruer API-URL for å liste opp filer
LIST_FILES_URL="https://${CPANEL_URL}/execute/Fileman/list_files?dir=/public_html"

# Bruk curl for å teste tilkoblingen
RESPONSE=$(curl -s -k -w "\nSTATUS:%{http_code}" -u "${CPANEL_USER}:${CPANEL_PASS}" "${LIST_FILES_URL}")
STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/STATUS:/d')

# Sjekk statusen
if [[ $STATUS -ge 200 && $STATUS -lt 300 ]]; then
    echo -e "${GREEN}✓ Tilkobling vellykket!${NC}"
    echo -e "${YELLOW}Filene i public_html-mappen:${NC}"
    echo "$BODY" | grep -o '"name":"[^"]*' | sed 's/"name":"/- /'
else
    echo -e "${RED}✗ Tilkobling feilet! Status-kode: $STATUS${NC}"
    echo -e "${RED}Svar:${NC}"
    echo "$BODY"
    echo
    echo -e "${YELLOW}Mulige årsaker til feil:${NC}"
    echo "1. Feil brukernavn eller passord"
    echo "2. Feil URL eller port-nummer"
    echo "3. cPanel API-tilgang er begrenset"
    echo
    echo -e "${YELLOW}Vennligst kontakt Namecheap support hvis problemet vedvarer.${NC}"
    exit 1
fi

echo
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}    OPPSETT AV cPANEL API DEPLOYMENT FULLFØRT         ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo
echo -e "${YELLOW}Neste steg:${NC}"
echo "1. Legg til GitHub secrets som vist i cpanel-credentials-reference.txt"
echo "2. Kjør GitHub Actions workflow 'Deploy Snakkaz Chat via cPanel (No FTP)'"
echo "3. Sjekk deployment-status på https://github.com/[brukernavn]/snakkaz-chat/actions"
echo
echo -e "${GREEN}Du er nå klar til å bruke cPanel API-basert deployment!${NC}"
