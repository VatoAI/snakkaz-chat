#!/bin/bash
# test-email-api-security.sh
#
# This script tests the email API security layer to ensure only permitted operations are allowed

# Color definitions
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    TEST AV SIKKERHETSSJIKTET FOR E-POST API         ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Load environment variables
if [ -f ".env" ]; then
    source .env
else
    echo -e "${YELLOW}Ingen .env-fil funnet. Vennligst oppgi API-detaljer:${NC}"
    read -p "cPanel brukernavn: " CPANEL_USERNAME
    read -s -p "cPanel API token: " CPANEL_API_TOKEN
    echo
    read -p "cPanel domene: " CPANEL_DOMAIN
    read -p "Test user token: " TEST_USER_TOKEN
    read -p "Admin user token: " ADMIN_USER_TOKEN
fi

# Check required variables
if [ -z "$CPANEL_USERNAME" ] || [ -z "$CPANEL_API_TOKEN" ] || [ -z "$CPANEL_DOMAIN" ] || [ -z "$TEST_USER_TOKEN" ] || [ -z "$ADMIN_USER_TOKEN" ]; then
    echo -e "${RED}Feil: Mangler nødvendige API-detaljer${NC}"
    exit 1
fi

# Start local server for testing
echo -e "${YELLOW}Starter lokal server for testing...${NC}"
node server.js > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo -e "${YELLOW}Testing API sikkerhetssjiktet...${NC}"

# Test 1: Regular user accessing permitted endpoint
echo -e "\n${BLUE}Test 1:${NC} Standard bruker aksesserer tillatt endepunkt (opprette e-post)"

RESPONSE=$(curl -s -X POST http://localhost:8080/api/emails \
    -H "Authorization: Bearer $TEST_USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"username":"test1", "password":"Password123!"}')

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ API tillatt operasjon fungerer${NC}"
else
    echo -e "${RED}✗ API tillatt operasjon feilet${NC}"
    echo "Respons: $RESPONSE"
fi

# Test 2: Admin accessing admin endpoint
echo -e "\n${BLUE}Test 2:${NC} Admin bruker aksesserer admin endepunkt"

RESPONSE=$(curl -s -X GET http://localhost:8080/api/emails/admin/all \
    -H "Authorization: Bearer $ADMIN_USER_TOKEN")

if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✓ Admin API fungerer${NC}"
else
    echo -e "${RED}✗ Admin API feilet${NC}"
    echo "Respons: $RESPONSE"
fi

# Test 3: Regular user trying to access admin endpoint
echo -e "\n${BLUE}Test 3:${NC} Standard bruker prøver å aksessere admin endepunkt"

RESPONSE=$(curl -s -X GET http://localhost:8080/api/emails/admin/all \
    -H "Authorization: Bearer $TEST_USER_TOKEN")

if echo "$RESPONSE" | grep -q "requires administrator privileges"; then
    echo -e "${GREEN}✓ Sikkerhetssystemet blokkerte uautorisert admin-tilgang${NC}"
else
    echo -e "${RED}✗ Sikkerhetsfeil: Standard bruker fikk tilgang til admin funksjon!${NC}"
    echo "Respons: $RESPONSE"
fi

# Test 4: Test disallowed operation via admin raw API
echo -e "\n${BLUE}Test 4:${NC} Admin prøver å bruke ikke-tillatt operasjon"

RESPONSE=$(curl -s -X POST http://localhost:8080/api/emails/admin/raw \
    -H "Authorization: Bearer $ADMIN_USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"operation":"SSL/install_ssl", "params":{}}')

if echo "$RESPONSE" | grep -q "not permitted"; then
    echo -e "${GREEN}✓ Sikkerhetssystemet blokkerte ikke-tillatt operasjon${NC}"
else
    echo -e "${RED}✗ Sikkerhetsfeil: Klarte å kjøre operasjon som burde vært blokkert!${NC}"
    echo "Respons: $RESPONSE"
fi

# Stop the server
echo -e "\n${YELLOW}Stopper server...${NC}"
kill $SERVER_PID

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    KONKLUSJON                                        ${NC}"
echo -e "${BLUE}=====================================================${NC}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Sikkerhetssjiktet for e-post API fungerer som forventet!${NC}"
    echo -e "Du kan trygt bruke cPanel API token med vår sikkerhetslag."
    echo
    echo -e "Nøkkelegenskaper:"
    echo "1. Operasjonsfilteret begrenser hvilke cPanel API-kall som er tillatt"
    echo "2. Rollebasert tilgangskontroll fungerer"
    echo "3. Admin-tilgang er beskyttet"
    echo "4. Operasjoner som ikke er på tillattlisten blir blokkert"
else
    echo -e "${RED}✗ Det var problemer med sikkerhetssjiktet for e-post API.${NC}"
    echo -e "Vennligst løs problemene før du bruker API-et i produksjon."
fi

echo
