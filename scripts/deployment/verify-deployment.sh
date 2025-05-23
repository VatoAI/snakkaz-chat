#!/bin/bash
# verify-deployment.sh
#
# Dette skriptet sjekker at DNS er riktig konfigurert og at
# nettsiden er tilgjengelig etter deployment til Namecheap

# Farger for terminal-output
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}========================================${INGEN}"
echo -e "${BLA}    VERIFISER SNAKKAZ DEPLOYMENT        ${INGEN}"
echo -e "${BLA}========================================${INGEN}"
echo

# Definerte domenenavn og forventet IP
HOVED_DOMENE="snakkaz.com"
FORVENTET_IP="162.0.229.214"
UNDERDOMENER=(
  "www"
  "dash"
  "business"
  "docs"
  "analytics"
)

# 1. Sjekk DNS-oppslag for hoveddomenet
echo -e "${GUL}Sjekker DNS for $HOVED_DOMENE...${INGEN}"
IP=$(dig +short $HOVED_DOMENE A)

if [ "$IP" = "$FORVENTET_IP" ]; then
  echo -e "${GRONN}✓ DNS for $HOVED_DOMENE er korrekt konfigurert ($IP)${INGEN}"
else
  echo -e "${ROD}✗ DNS-feil for $HOVED_DOMENE. Forventet $FORVENTET_IP, fikk $IP${INGEN}"
fi
echo

# 2. Sjekk DNS-oppslag for underdomener
echo -e "${GUL}Sjekker DNS for underdomener...${INGEN}"
for SUB in "${UNDERDOMENER[@]}"; do
  FULL_DOMAIN="$SUB.$HOVED_DOMENE"
  SUB_IP=$(dig +short $FULL_DOMAIN A)
  
  if [ "$SUB_IP" = "$FORVENTET_IP" ]; then
    echo -e "${GRONN}✓ DNS for $FULL_DOMAIN er korrekt ($SUB_IP)${INGEN}"
  else
    echo -e "${ROD}✗ DNS-feil for $FULL_DOMAIN. Forventet $FORVENTET_IP, fikk $SUB_IP${INGEN}"
  fi
done
echo

# 3. Sjekk HTTP-tilgjengelighet (med og uten www)
echo -e "${GUL}Sjekker HTTP-tilgjengelighet...${INGEN}"

check_http_status() {
  local domain=$1
  local protocol=$2
  
  echo -ne "Sjekker $protocol://$domain ... "
  
  # Quiet curl med bare HTTP-statuskode
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$protocol://$domain")
  
  if [ "$STATUS" = "200" ]; then
    echo -e "${GRONN}OK (200)${INGEN}"
    return 0
  else
    echo -e "${ROD}FEIL ($STATUS)${INGEN}"
    return 1
  fi
}

# Sjekk både HTTP og HTTPS
for DOMAIN in "$HOVED_DOMENE" "www.$HOVED_DOMENE"; do
  # Sjekk HTTP
  check_http_status "$DOMAIN" "http"
  
  # Sjekk HTTPS (dette kan feile hvis SSL ikke er satt opp ennå)
  check_http_status "$DOMAIN" "https" || echo -e "  ${GUL}HTTPS feiler, SSL-sertifikater må settes opp${INGEN}"
done
echo

# 4. Sjekk vanlige filer som bør være tilgjengelige
echo -e "${GUL}Sjekker tilgang til viktige filer...${INGEN}"
FILES_TO_CHECK=(
  ""                # Rotdomenet / index.html
  "favicon.ico"     # Favicon
  "manifest.json"   # PWA manifest
  "assets/"         # Asset-katalogen
)

for FILE in "${FILES_TO_CHECK[@]}"; do
  URL="http://$HOVED_DOMENE/$FILE"
  
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "301" ]; then
    echo -e "${GRONN}✓ $URL er tilgjengelig ($STATUS)${INGEN}"
  else
    echo -e "${ROD}✗ $URL er ikke tilgjengelig ($STATUS)${INGEN}"
  fi
done
echo

# 5. Oppsummering og neste steg
echo -e "${GUL}=== OPPSUMMERING ===${INGEN}"
echo -e "1. DNS-oppslag for snakkaz.com og underdomener er verifisert"
echo -e "2. HTTP-tilgjengelighet er testet"
echo -e "3. Nøkkelfiler er sjekket"
echo
echo -e "${GUL}Neste steg:${INGEN}"
echo -e "1. Sett opp SSL-sertifikater ved å følge stegene i setup-ssl-certificates.sh"
echo -e "2. Sjekk logene i cPanel for eventuelle feilmeldinger"
echo -e "3. Test applikasjonen med en faktisk bruker"
