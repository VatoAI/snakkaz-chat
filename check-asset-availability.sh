#!/bin/bash
# check-asset-availability.sh
# Sjekker om viktige assets-filer er tilgjengelige på serveren etter opplasting

# Fargedefinisjoner for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   SJEKKER SNAKKAZ ASSETS-TILGJENGELIGHET             ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Base URL
WEBSITE_URL="https://www.snakkaz.com"

# Lag en liste over de viktigste filene å sjekke
# Disse er basert på loggene der opplastingene feilet
ASSETS_TO_CHECK=(
    "index-GRqizV24.css"
    "index-DQJNfLon.js"
    "vendor-react-CkjGjP8g.js"
    "vendor-supabase-0rZ8WFOd.js"
    "Login-Do2Yvsdq.js"
    "Register-OK5fBqtw.js"
)

# Sjekk hovedsiden først
echo -e "${YELLOW}Sjekker hovedsiden (${WEBSITE_URL})...${NC}"
MAIN_PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${WEBSITE_URL})

if [ "$MAIN_PAGE_STATUS" == "200" ]; then
    echo -e "${GREEN}✓ Hovedsiden er tilgjengelig (HTTP ${MAIN_PAGE_STATUS})${NC}"
else
    echo -e "${RED}✗ Hovedsiden er IKKE tilgjengelig (HTTP ${MAIN_PAGE_STATUS})${NC}"
fi

echo -e "${YELLOW}Sjekker om viktige assets-filer er tilgjengelige...${NC}"

ASSETS_FOUND=0
ASSETS_MISSING=0

for asset in "${ASSETS_TO_CHECK[@]}"; do
    ASSET_URL="${WEBSITE_URL}/assets/${asset}"
    echo -ne "${YELLOW}Sjekker ${asset}...${NC}"
    
    ASSET_STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${ASSET_URL})
    
    if [ "$ASSET_STATUS" == "200" ]; then
        echo -e "${GREEN} ✓ Funnet (HTTP ${ASSET_STATUS})${NC}"
        ((ASSETS_FOUND++))
    else
        echo -e "${RED} ✗ Mangler (HTTP ${ASSET_STATUS})${NC}"
        ((ASSETS_MISSING++))
    fi
done

echo
echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}OPPSUMMERING:${NC}"
echo -e "${GREEN}${ASSETS_FOUND} filer funnet${NC}"
echo -e "${RED}${ASSETS_MISSING} filer mangler${NC}"
echo -e "${BLUE}======================================================${NC}"

if [ $ASSETS_MISSING -gt 0 ]; then
    echo -e "${YELLOW}Det ser ut til at noen assets-filer fortsatt mangler.${NC}"
    echo -e "${YELLOW}Prøv å kjøre enhanced-assets-upload.sh for å laste dem opp.${NC}"
else
    echo -e "${GREEN}Alle sjekket assets ser ut til å være tilgjengelige!${NC}"
    echo -e "${YELLOW}Hvis du fortsatt har problemer, prøv å tømme nettleserens buffer med CTRL+F5${NC}"
fi

echo -e "${BLUE}======================================================${NC}"
