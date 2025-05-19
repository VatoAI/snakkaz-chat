
#!/bin/bash
# CSP-tester: En omfattende test av Content Security Policy for snakkaz.com
# Kjører tester mot produksjonsmiljøet for å validere at CSP er implementert korrekt

echo "🔒 Tester Content Security Policy for snakkaz.com"
echo "------------------------------------------------"

# Farger for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domener som skal testes
DOMAINS=(
  "www.snakkaz.com"
  "dash.snakkaz.com"
  "business.snakkaz.com"
  "docs.snakkaz.com"
  "analytics.snakkaz.com"
)

# Forventede CSP-direktiver
EXPECTED_DIRECTIVES=(
  "default-src"
  "script-src"
  "style-src"
  "img-src"
  "connect-src"
  "font-src"
  "media-src"
  "object-src"
  "frame-src"
  "worker-src"
)

# Forventede domener som bør være tillatt
EXPECTED_ALLOWED_DOMAINS=(
  "'self'"
  "*.supabase.co"
  "*.supabase.in"
  "*.amazonaws.com"
  "*.googleapis.com"
  "*.cloudflareinsights.com"
  "cdn.gpteng.co"
)

# Funksjon for å teste CSP for et domene
test_csp_for_domain() {
  local domain=$1
  echo -e "\n${YELLOW}Testing CSP for $domain...${NC}"
  
  # Hent CSP-headeren
  local csp_header=$(curl -sI https://$domain | grep -i "content-security-policy")
  
  if [ -z "$csp_header" ]; then
    echo -e "${RED}❌ Ingen Content-Security-Policy header funnet for $domain${NC}"
    return 1
  else
    echo -e "${GREEN}✅ CSP header funnet for $domain${NC}"
    
    # Sjekk forventede direktiver
    for directive in "${EXPECTED_DIRECTIVES[@]}"; do
      if echo "$csp_header" | grep -q "$directive"; then
        echo -e "${GREEN}✅ Direktiv '$directive' funnet${NC}"
      else
        echo -e "${RED}❌ Direktiv '$directive' mangler${NC}"
      fi
    done
    
    # Sjekk forventede domener
    for domain in "${EXPECTED_ALLOWED_DOMAINS[@]}"; do
      if echo "$csp_header" | grep -q "$domain"; then
        echo -e "${GREEN}✅ Domene '$domain' er tillatt${NC}"
      else
        echo -e "${RED}❌ Domene '$domain' mangler i CSP${NC}"
      fi
    done
  fi
}

# Kjør test for hvert domene
for domain in "${DOMAINS[@]}"; do
  test_csp_for_domain $domain
done

echo -e "\n${YELLOW}CSP Testing komplett.${NC}"

# Test for Cloudflare Analytics
echo -e "\n${YELLOW}Tester Cloudflare Analytics integrasjon...${NC}"

# Sjekk om beacon.min.js lastes
for domain in "${DOMAINS[@]}"; do
  echo -e "\nTester Cloudflare Analytics for $domain..."
  if curl -s https://$domain | grep -q "cloudflareinsights.com/beacon.min.js"; then
    echo -e "${GREEN}✅ Cloudflare Analytics funnet for $domain${NC}"
  else
    echo -e "${RED}❌ Cloudflare Analytics ikke funnet for $domain${NC}"
  fi
done

echo -e "\n${YELLOW}Alle tester fullført.${NC}"
