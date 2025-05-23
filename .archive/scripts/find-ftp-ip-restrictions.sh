#!/bin/bash
# find-ftp-ip-restrictions.sh
#
# Dette skriptet søker etter FTP IP-restriksjoner i cPanel og foreslår løsninger

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: FINN FTP IP-RESTRIKSJONER          ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Se etter kjente steder hvor FTP-konfigurasjoner kan være
echo -e "${YELLOW}Sjekker for kjente FTP konfigurasjonsfiler...${NC}"

# Liste over mulige GitHub Actions IP-områder
GITHUB_IP_RANGES=(
  "13.64.0.0/16"    # Microsoft Azure (brukt av GitHub Actions)
  "13.65.0.0/16" 
  "13.84.0.0/16"
  "13.85.0.0/16"
  "13.86.0.0/16"
  "13.87.0.0/16"
  "13.104.0.0/14"
  "20.33.0.0/16"
  "20.34.0.0/15"
  "20.36.0.0/14"
  "20.40.0.0/13"
  "20.48.0.0/12"
  "20.64.0.0/10"
  "20.128.0.0/16"
  "20.135.0.0/16"
  "20.136.0.0/16"
  "20.143.0.0/16"
  "20.150.0.0/15"
  "20.152.0.0/15"
  "20.160.0.0/12"
  "20.176.0.0/14"
  "20.180.0.0/14"
  "20.184.0.0/13"
  "40.64.0.0/10"
  "52.0.0.0/8"
  "65.52.0.0/14"
  "104.40.0.0/13"
  "104.146.0.0/15"
  "104.208.0.0/13"
  "157.54.0.0/15"
  "157.56.0.0/14"
  "157.60.0.0/16"
  "167.105.0.0/16"
  "167.220.0.0/16"
  "168.61.0.0/16"
  "168.62.0.0/15"
  "191.232.0.0/13"
  "192.40.0.0/13"
  "192.48.225.0/24"
  "192.84.159.0/24"
  "192.84.160.0/23"
  "192.197.157.0/24"
  "193.149.64.0/19"
  "193.221.113.0/24"
  "194.69.96.0/19"
  "194.110.197.0/24"
  "198.105.232.0/22"
  "198.200.130.0/24"
  "198.206.164.0/24"
  "199.60.28.0/24"
  "199.74.210.0/24"
  "199.103.90.0/23"
  "199.103.122.0/24"
  "207.46.0.0/16"
  "207.68.128.0/18"
)

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

# Teste vanlig FTP-tilkobling
echo -e "${YELLOW}Tester standard FTP-tilkobling...${NC}"
echo -e "open $FTP_HOST\nuser $FTP_USER $FTP_PASS\nls\nbye" > .ftp-commands
RESULT=$(ftp -n < .ftp-commands 2>&1)
rm .ftp-commands

if echo "$RESULT" | grep -q "230"; then
    echo -e "${GREEN}✓ Standard FTP-tilkobling OK!${NC}"
    echo -e "${GREEN}Dette betyr at din nåværende IP ikke er blokkert.${NC}"
elif echo "$RESULT" | grep -q "530 Login authentication failed"; then
    echo -e "${RED}✗ Feil brukernavn eller passord.${NC}"
elif echo "$RESULT" | grep -q "Access denied: 530"; then
    echo -e "${YELLOW}⚠ Autentisering OK, men tilgang nektet (530).${NC}"
    echo -e "${YELLOW}Dette tyder på IP-restriksjoner.${NC}"
else
    echo -e "${RED}✗ FTP-tilkobling feilet med ukjent feil.${NC}"
    echo "Resultat: $RESULT"
fi

# Sjekk for proftpd.conf eller pure-ftpd.conf
echo -e "\n${YELLOW}Søker etter måter å identifisere IP-restriksjoner på...${NC}"

# Metode 1: Test om curl kan få informasjon fra cPanel API
echo -e "${YELLOW}Tester cPanel API for FTP-innstillinger...${NC}"

if command -v curl &> /dev/null; then
    # Forsøk å sjekke FTP-konfigurasjonen via cPanel API
    echo -e "${YELLOW}Dette krever cPanel API-tilgang...${NC}"
    read -p "cPanel brukernavn (vanligvis samme som FTP): " CPANEL_USER
    read -s -p "cPanel passord: " CPANEL_PASS
    echo
    read -p "cPanel URL (f.eks. premium123.web-hosting.com:2083): " CPANEL_URL
    
    # Sjekk om vi kan få tilgang til FTP-konfigurasjonen
    echo -e "${YELLOW}Forsøker å hente FTP-konfigurasjon via cPanel API...${NC}"
    CPANEL_RESULT=$(curl -sk -u "$CPANEL_USER:$CPANEL_PASS" "https://$CPANEL_URL/execute/Fileman/list_files?dir=/etc")
    
    if echo "$CPANEL_RESULT" | grep -q "pure-ftpd"; then
        echo -e "${GREEN}✓ Fant Pure-FTPd konfigurasjonsfil i /etc.${NC}"
        echo -e "${YELLOW}Dette kan inneholde IP-restriksjoner.${NC}"
    elif echo "$CPANEL_RESULT" | grep -q "proftpd"; then
        echo -e "${GREEN}✓ Fant ProFTPD konfigurasjonsfil i /etc.${NC}"
        echo -e "${YELLOW}Dette kan inneholde IP-restriksjoner.${NC}"
    else
        echo -e "${RED}✗ Kunne ikke finne FTP-konfigurasjonsfiler.${NC}"
    fi
else
    echo -e "${RED}✗ curl ikke installert. Kan ikke sjekke cPanel API.${NC}"
fi

# Gi brukeren informasjon om hvordan man finner og fikser IP-restriksjoner
echo -e "\n${BLUE}Mulige steder å sjekke for IP-restriksjoner på Namecheap:${NC}"
echo -e "1. ${YELLOW}cPanel > FTP Accounts > Manage > Configure FTP Client${NC}"
echo -e "2. ${YELLOW}cPanel > Security > IP Deny Manager${NC}"
echo -e "3. ${YELLOW}cPanel > Advanced > FTP Configuration${NC}"
echo -e "4. ${YELLOW}cPanel > Security > ModSecurity${NC}"
echo -e "5. ${YELLOW}Kontakte Namecheap support direkte${NC}"

echo -e "\n${BLUE}For å omgå IP-restriksjoner, foreslår vi:${NC}"
echo -e "1. ${GREEN}Bruk cPanel API-metoden:${NC}"
echo -e "   - Kjør ./setup-cpanel-deployment.sh"
echo -e "   - Sett opp GitHub secrets for CPANEL_USERNAME, CPANEL_PASSWORD, og CPANEL_URL"
echo -e "   - Bruk GitHub Actions workflow deploy-cpanel.yml"
echo -e "2. ${GREEN}Bruk det forbedrede FTP-scriptet:${NC}"
echo -e "   - Kjør ./enhanced-ftp-deploy.sh lokalt (fra en ikke-blokkert IP)"

# Sjekk om vi kan identifisere en IP-adresse fra GitHub Actions
echo -e "\n${YELLOW}Prøver å identifisere en GitHub Actions IP for whitelist...${NC}"
curl -s https://api.github.com/meta | grep -o '"actions":\[[^]]*\]' | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+\/[0-9]\+'

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    FTP IP RESTRIKSJON ANALYSE FULLFØRT              ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo -e "${GREEN}Neste steg:${NC}"
echo -e "1. Sjekk de oppførte stedene i cPanel for IP-restriksjoner"
echo -e "2. Logg en CIDR IP-blokk som dekker GitHub Actions"
echo -e "3. Kontakt Namecheap support for hjelp med IP-restriksjoner"
echo -e "4. Bruk cPanel API-metoden for å unngå FTP-restriksjoner"
echo
