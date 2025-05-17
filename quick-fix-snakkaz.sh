#!/bin/bash
# quick-fix-snakkaz.sh
#
# Dette skriptet lager en enkel lokal versjon av Snakkaz Chat
# og gir instruksjoner for å løse problemene med Cloudflare

# Definer farger for terminal-output
GRØNN='\033[0;32m'
GUL='\033[1;33m'
RØD='\033[0;31m'
BLÅ='\033[0;34m'
INGEN='\033[0m' # Ingen farge

# Vis header
echo -e "${BLÅ}========================================${INGEN}"
echo -e "${BLÅ}    Snakkaz Chat: Rett-På-Sak Løsning    ${INGEN}"
echo -e "${BLÅ}========================================${INGEN}"
echo

# 1. Bygg applikasjonen lokalt
echo -e "${GUL}Steg 1: Bygger Snakkaz Chat applikasjonen lokalt...${INGEN}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RØD}Feil ved bygging av applikasjonen.${INGEN}"
  exit 1
fi
echo -e "${GRØNN}Bygget ferdig! Filer ble lagret i dist/-mappen.${INGEN}"
echo

# 2. Start en lokal server for testing
echo -e "${GUL}Steg 2: Starter en lokal server for testing...${INGEN}"
cd dist
python3 -m http.server 8080 &
SERVER_PID=$!
echo -e "${GRØNN}Lokal server kjører nå på http://localhost:8080${INGEN}"
echo

# 3. Forbered Namecheap FTP-opplasting
echo -e "${GUL}Steg 3: Sjekker FTP-tilkobling til Namecheap hosting...${INGEN}"
if [ -f "../verify-namecheap-ftp.sh" ]; then
  cd ..
  bash verify-namecheap-ftp.sh
  if [ $? -ne 0 ]; then
    echo -e "${RØD}FTP-tilkobling mislyktes. Sjekk FTP-kredentialene i .env-filen.${INGEN}"
  else
    echo -e "${GRØNN}FTP-tilkobling vellykket!${INGEN}"
  fi
else
  echo -e "${GUL}FTP-verifiseringsskript ikke funnet. Kan ikke verifisere FTP-tilkoblingen.${INGEN}"
fi
echo

# 4. Gi tydelige instruksjoner for DNS og Cloudflare-problemer
echo -e "${BLÅ}========================================${INGEN}"
echo -e "${BLÅ}    LØSNING FOR WWW.SNAKKAZ.COM    ${INGEN}"
echo -e "${BLÅ}========================================${INGEN}"
echo
echo -e "${RØD}PROBLEM IDENTIFISERT:${INGEN} Domenet bruker fortsatt Cloudflare, selv om DNS peker til Namecheap."
echo
echo -e "${GRØNN}HER ER HVA DU MÅ GJØRE:${INGEN}"
echo
echo -e "1. ${GUL}Logg inn på Cloudflare-dashbordet${INGEN}"
echo "   - Gå til domenet snakkaz.com"
echo "   - Klikk på 'Pause Cloudflare on Site' eller 'Remove Site' knappen"
echo "   - Dette vil stoppe Cloudflare fra å proxy trafikken din"
echo
echo -e "2. ${GUL}Verifiser at Namecheap bruker sine egne DNS-servere:${INGEN}"
echo "   - Logg inn på Namecheap-kontrollpanelet"
echo "   - Gå til domeneadministrasjon for snakkaz.com"
echo "   - Under 'NAMESERVERS', velg 'Namecheap BasicDNS'"
echo "   - IKKE bruk 'Custom DNS' med Cloudflare's nameservers"
echo
echo -e "3. ${GUL}Vent på DNS-propagering (kan ta opptil 48 timer)${INGEN}"
echo
echo -e "${BLÅ}I MELLOMTIDEN:${INGEN} Du kan teste applikasjonen lokalt på http://localhost:8080"
echo
echo -e "${GUL}Trykk Enter for å avslutte skriptet og stoppe den lokale serveren...${INGEN}"
read
kill $SERVER_PID
