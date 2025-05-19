#!/bin/bash
# generate-github-api-token-secrets.sh
#
# Dette skriptet hjelper med å sette opp GitHub Secrets fra kommandolinjen
# ved hjelp av GitHub CLI (gh)

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: GITHUB SECRETS OPPSETT              ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Sjekk om GitHub CLI er installert
if ! command -v gh &> /dev/null; then
    echo -e "${RED}GitHub CLI (gh) er ikke installert. Dette skriptet krever GitHub CLI.${NC}"
    echo -e "${YELLOW}Du kan installere det fra: https://cli.github.com/${NC}"
    exit 1
fi

# Sjekk om brukeren er logget inn på GitHub CLI
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Du er ikke logget inn på GitHub CLI. Logger inn nå...${NC}"
    gh auth login
fi

# Hent GitHub repository
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null)

if [ -z "$REPO" ]; then
    echo -e "${YELLOW}Kunne ikke automatisk finne GitHub repository.${NC}"
    read -p "Vennligst oppgi repository i format brukernavn/repo-navn: " REPO
fi

echo -e "${GREEN}Setter opp hemmeligheter for repository: ${REPO}${NC}"
echo

# Innsamling av informasjon
echo -e "${YELLOW}Vennligst oppgi følgende informasjon for cPanel API token:${NC}"
read -p "cPanel brukernavn (f.eks. SnakkaZ): " CPANEL_USERNAME
read -s -p "cPanel API token (opprettet via Manage API Tokens i cPanel): " CPANEL_API_TOKEN
echo
read -p "cPanel domene (f.eks. premium123.web-hosting.com): " CPANEL_DOMAIN

# Legg til GitHub Secrets
echo
echo -e "${YELLOW}Legger til CPANEL_USERNAME hemmelig...${NC}"
echo -n "$CPANEL_USERNAME" | gh secret set CPANEL_USERNAME -R "$REPO"

echo -e "${YELLOW}Legger til CPANEL_API_TOKEN hemmelig...${NC}"
echo -n "$CPANEL_API_TOKEN" | gh secret set CPANEL_API_TOKEN -R "$REPO"

echo -e "${YELLOW}Legger til CPANEL_DOMAIN hemmelig...${NC}"
echo -n "$CPANEL_DOMAIN" | gh secret set CPANEL_DOMAIN -R "$REPO"

echo
echo -e "${GREEN}✅ GitHub Secrets er lagt til!${NC}"
echo

# List alle hemmeligheter for å bekrefte
echo -e "${YELLOW}Liste over konfigurerte hemmeligheter:${NC}"
gh secret list -R "$REPO"

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    NESTE STEG                                       ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo "1. Bruk GitHub Actions workflow i .github/workflows/deploy-cpanel-token.yml"
echo "2. Push kode til main-grenen eller kjør workflow manuelt for å teste deployment"
echo
echo -e "${YELLOW}Se docs/CPANEL-API-TOKEN-DEPLOYMENT.md for mer detaljert veiledning.${NC}"
echo
