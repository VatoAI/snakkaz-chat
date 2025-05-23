#!/bin/bash
# setup-github-secrets-for-email.sh
#
# Dette skriptet hjelper med å opprette GitHub Actions secrets for
# Snakkaz Chat premium e-post funksjonen

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}     OPPSETT AV GITHUB SECRETS FOR PREMIUM E-POST    ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Sjekk om GitHub CLI er installert
if ! command -v gh &> /dev/null; then
    echo -e "${RED}GitHub CLI (gh) er ikke installert.${NC}"
    echo "Du kan installere det fra: https://cli.github.com/"
    echo "Eller kjør: "
    echo "  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
    echo "  echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null"
    echo "  sudo apt update"
    echo "  sudo apt install gh"
    exit 1
fi

# Sjekk om bruker er logget inn på GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Du er ikke logget inn på GitHub CLI.${NC}"
    echo "Vennligst logg inn:"
    gh auth login
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Kunne ikke logge inn på GitHub. Avbryter.${NC}"
        exit 1
    fi
fi

# Finn nåværende repository
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)

if [ -z "$REPO" ]; then
    echo -e "${YELLOW}Kunne ikke automatisk finne repository. Vennligst oppgi:${NC}"
    read -p "GitHub repository (format: brukernavn/repo-navn): " REPO
fi

echo -e "${GREEN}Oppretter secrets for repository: ${REPO}${NC}"
echo

# Leser inn miljøvariabler fra .env hvis den eksisterer
if [ -f ".env" ]; then
    echo -e "${YELLOW}Leser inn variabler fra .env fil...${NC}"
    source .env
fi

# Hent cPanel API token detaljer
if [ -z "$CPANEL_USERNAME" ]; then
    read -p "cPanel brukernavn (f.eks. SnakkaZ): " CPANEL_USERNAME
fi

if [ -z "$CPANEL_API_TOKEN" ]; then
    read -s -p "cPanel API token: " CPANEL_API_TOKEN
    echo
fi

if [ -z "$CPANEL_DOMAIN" ]; then
    read -p "cPanel domene (f.eks. premium123.web-hosting.com): " CPANEL_DOMAIN
fi

if [ -z "$ENABLE_PREMIUM_EMAIL" ]; then
    read -p "Aktiver premium e-post? (true/false): " ENABLE_PREMIUM_EMAIL
fi

# Oppretter secrets
echo -e "\n${YELLOW}Oppretter GitHub secrets...${NC}"

# Funksjon for å opprette eller oppdatere en secret
create_secret() {
    local name=$1
    local value=$2
    local desc=$3

    echo -n "Oppretter secret $name... "
    
    if echo "$value" | gh secret set "$name" -R "$REPO"; then
        echo -e "${GREEN}✓${NC} $desc"
    else
        echo -e "${RED}✗${NC} Kunne ikke opprette secret $name"
        return 1
    fi
}

# Opprett alle nødvendige secrets
create_secret "CPANEL_USERNAME" "$CPANEL_USERNAME" "cPanel brukernavn for API-tilgang"
create_secret "CPANEL_API_TOKEN" "$CPANEL_API_TOKEN" "cPanel API token for sikker autentisering"
create_secret "CPANEL_DOMAIN" "$CPANEL_DOMAIN" "cPanel domenenavn for API-endepunkt"
create_secret "ENABLE_PREMIUM_EMAIL" "$ENABLE_PREMIUM_EMAIL" "Flag for å aktivere premium e-postfunksjon"

# Verifiser at oppsett av e-post API sikkerhetssjikt er ferdig
if [ "$ENABLE_PREMIUM_EMAIL" = "true" ]; then
    if [ ! -f "src/middleware/apiSecurityMiddleware.js" ]; then
        echo -e "${RED}ADVARSEL: E-post API sikkerhetssjikt mangler!${NC}"
        echo "For å sikre cPanel API token, må du implementere sikkerhetssjiktet."
        echo "Kjør følgende kommando for å teste sikkerhetssjiktet:"
        echo "  ./test-email-api-security.sh"
    else
        echo -e "${GREEN}✓ API sikkerhetssjikt er implementert${NC}"
    fi
fi

echo
echo -e "${GREEN}GitHub secrets oppsett fullført!${NC}"
echo -e "Du kan nå kjøre GitHub Actions workflow for å deploye med cPanel API token."
echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${YELLOW}NESTE STEG:${NC}"
echo "1. Sjekk at din GitHub Actions workflow bruker disse secrets"
echo "2. Verifiser at API sikkerhetssjiktet er implementert"
echo "3. Kjør en test-deployment for å verifisere at alt fungerer"
echo -e "${BLUE}=====================================================${NC}"
