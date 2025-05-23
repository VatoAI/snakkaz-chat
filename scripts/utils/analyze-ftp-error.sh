#!/bin/bash
# analyze-ftp-error.sh
#
# Dette skriptet analyserer "530 Access Denied" FTP-feilen og gir mulige løsninger.

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: FTP ERROR ANALYSIS                 ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Leser inn FTP-variabler fra .env
if [ -f ".env" ]; then
    source .env
else
    read -p "FTP Host (f.eks. premium123.web-hosting.com): " FTP_HOST
    read -p "FTP Brukernavn: " FTP_USER
    read -s -p "FTP Passord: " FTP_PASS
    echo
    read -p "Ekstern mappe (f.eks. public_html): " FTP_REMOTE_DIR
fi

echo -e "${YELLOW}Analyserer FTP-feil med 'Access denied: 530'...${NC}"
echo

# Test 1: Sjekk grunnleggende tilkobling
echo -e "${YELLOW}Test 1: Grunnleggende tilkobling${NC}"
CONN_TEST=$(curl -s --connect-timeout 10 -I "ftp://$FTP_HOST" 2>&1)

if echo "$CONN_TEST" | grep -q "Failed to connect"; then
    echo -e "${RED}✗ FTP-serveren er ikke tilgjengelig.${NC}"
    echo "   Dette kan skyldes blokkert port 21 eller at serveren er nede."
else
    echo -e "${GREEN}✓ Serveren er tilgjengelig på port 21.${NC}"
fi

# Test 2: Sjekk brukernavn/passord kombinasjon
echo -e "\n${YELLOW}Test 2: Autentisering${NC}"
AUTH_TEST=$(curl -v --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/" 2>&1)

if echo "$AUTH_TEST" | grep -q "530 Login authentication failed"; then
    echo -e "${RED}✗ Brukernavn/passord fungerer ikke.${NC}"
    echo "   Dobbeltsjekk at brukernavnet og passordet er korrekt."
elif echo "$AUTH_TEST" | grep -q "Access denied: 530"; then
    echo -e "${YELLOW}⚠ Autentisering fungerer, men tilgang ble nektet.${NC}"
    echo "   Dette indikerer en IP-restriksjon eller manglende tilgangsrettigheter."
else
    echo -e "${GREEN}✓ Brukernavn og passord godkjent.${NC}"
fi

# Test 3: Sjekk om katalog eksisterer og tilgang
echo -e "\n${YELLOW}Test 3: Katalog-tilgang${NC}"
DIR_TEST=$(curl -v --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/" 2>&1)

if echo "$DIR_TEST" | grep -q "550"; then
    echo -e "${RED}✗ Katalogen '$FTP_REMOTE_DIR' eksisterer ikke eller du har ikke tilgang.${NC}"
elif echo "$DIR_TEST" | grep -q "Access denied: 530"; then
    echo -e "${YELLOW}⚠ IP-restriksjoner forhindrer tilgang til denne katalogen.${NC}"
else
    echo -e "${GREEN}✓ Du har tilgang til katalogen '$FTP_REMOTE_DIR'.${NC}"
fi

# Test 4: Prøv å hente IP-adresseinformasjon
echo -e "\n${YELLOW}Test 4: IP-adresseinformasjon${NC}"
MY_IP=$(curl -s https://api.ipify.org)
echo -e "Din nåværende IP-adresse er: ${GREEN}$MY_IP${NC}"
echo -e "GitHub Actions bruker ulike IP-adresser, som kan være blokkert av Namecheap."

# Konklusjon og løsninger
echo -e "\n${BLUE}Analyse og mulige løsninger:${NC}"
echo -e "------------------------"

if echo "$AUTH_TEST" | grep -q "Access denied: 530"; then
    echo -e "1. ${YELLOW}IP-RESTRIKSJONER:${NC}"
    echo "   Namecheap har sannsynligvis IP-restriksjoner aktivert på din FTP-konto."
    echo "   - Logg inn på Namecheap cPanel"
    echo "   - Gå til 'FTP Accounts' eller 'Security'"
    echo "   - Sjekk IP-restriksjoner og fjern dem eller legg til GitHub Actions IP-rekkevidder"
    echo
    
    echo -e "2. ${YELLOW}FTPS I STEDET FOR FTP:${NC}"
    echo "   Prøv å bruke FTPS (FTP over SSL/TLS) i stedet for vanlig FTP."
    echo "   - Oppdater deploy.yml til å bruke eksplisitt FTPS"
    echo "   - Eller bruk 'enhanced-ftp-deploy.sh' skriptet vi nettopp laget"
    echo
    
    echo -e "3. ${YELLOW}BRUK CPANEL API:${NC}"
    echo "   Bruk cPanel API-tilnærming som ikke avhenger av FTP."
    echo "   - Setup script: setup-cpanel-deployment.sh"
    echo "   - GitHub Actions workflow: deploy-cpanel.yml"
fi

echo
echo -e "${YELLOW}Sjekk disse innstillingene i cPanel:${NC}"
echo "1. FTP-konto > IP-restriksjoner (IP Address Restrictions)"
echo "2. Sikkerhet > IP Blokkering (IP Blocker)"
echo "3. Sikkerhet > ModSecurity (kan blokkere GitHub IPs)"
echo "4. Tilgangskontroll (hos Namecheap support)"

echo
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}    ANALYSE FULLFØRT                                 ${NC}"
echo -e "${GREEN}=====================================================${NC}"
