#!/bin/bash
# Test DNS-oppsett for snakkaz.com
# Kjør dette skriptet etter å ha oppdatert DNS-innstillingene i Namecheap

# Farger for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====== Snakkaz DNS-test ======${NC}"
echo "Tester DNS-oppføringer for snakkaz.com og subdomener..."
echo ""

# Funksjon for å teste oppslag av domener
test_domain() {
    local domain=$1
    local expected_type=$2
    local expected_result=$3
    
    echo -e "${YELLOW}Testing $domain (forventet: $expected_type oppføring)${NC}"
    
    # Sjekk om dig er installert
    if ! command -v dig &> /dev/null; then
        echo -e "${RED}✗ Feil: 'dig' kommando ikke funnet. Installerer...${NC}"
        apt-get update -qq && apt-get install -y dnsutils > /dev/null
    fi
    
    # Utfør DNS-oppslag
    if [ "$expected_type" == "A" ]; then
        result=$(dig +short A $domain)
    elif [ "$expected_type" == "CNAME" ]; then
        result=$(dig +short CNAME $domain)
    else
        result=$(dig +short $domain)
    fi
    
    # Sjekk resultat
    if [ -z "$result" ]; then
        echo -e "${RED}✗ Feil: Ingen DNS-oppføring funnet for $domain${NC}"
        return 1
    fi
    
    # Hvis vi har forventet resultat, verifiser det
    if [ ! -z "$expected_result" ]; then
        if [[ "$result" == *"$expected_result"* ]]; then
            echo -e "${GREEN}✓ OK: $domain peker til $result${NC}"
            return 0
        else
            echo -e "${RED}✗ Feil: $domain peker til $result (forventet: $expected_result)${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✓ OK: $domain peker til $result${NC}"
        return 0
    fi
}

# Test hoveddomenet
test_domain "snakkaz.com" "A" "185.158.133.1"

echo ""
# Test subdomener
test_domain "www.snakkaz.com" "CNAME" "supabase"
test_domain "dash.snakkaz.com" "CNAME" "snakkaz.com"
test_domain "business.snakkaz.com" "CNAME" "snakkaz.com"
test_domain "docs.snakkaz.com" "CNAME" "snakkaz.com"
test_domain "analytics.snakkaz.com" "CNAME" "snakkaz.com"
test_domain "mcp.snakkaz.com" "A" "185.158.133.1"

echo ""
echo -e "${YELLOW}====== Tilgjengelighetstest ======${NC}"
echo "Sjekker om domenene er tilgjengelige..."

# Funksjon for å teste tilgjengelighet av nettsteder
test_website() {
    local domain=$1
    
    echo -e "${YELLOW}Testing tilgjengelighet av $domain${NC}"
    
    # Sjekk om curl er installert
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}✗ Feil: 'curl' kommando ikke funnet. Installerer...${NC}"
        apt-get update -qq && apt-get install -y curl > /dev/null
    fi
    
    # Bruk curl for å sjekke om nettstedet svarer
    # Legg til --insecure for å unngå SSL-sertifikatproblemer og timeout på 5 sekunder
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --insecure --max-time 5 https://$domain)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 400 ]; then
        echo -e "${GREEN}✓ OK: $domain er tilgjengelig (statuskode: $status_code)${NC}"
    else
        echo -e "${RED}✗ Feil: $domain er ikke tilgjengelig (statuskode: $status_code)${NC}"
    fi
}

# Test tilgjengelighet av nettsteder
test_website "snakkaz.com"
test_website "www.snakkaz.com"
test_website "dash.snakkaz.com"
test_website "business.snakkaz.com"
test_website "docs.snakkaz.com"
test_website "analytics.snakkaz.com"

echo ""
echo -e "${YELLOW}====== Supabase-tilkobling ======${NC}"
echo "Sjekker Supabase-tilkobling (må ha nettleser)..."
echo -e "${YELLOW}Åpne https://snakkaz.com i nettleseren og sjekk at applikasjonen laster${NC}"
echo -e "${YELLOW}Verifiser at Supabase-tilkoblingen fungerer ved å logge inn${NC}"

echo ""
echo -e "${YELLOW}====== Test fullført ======${NC}"
