
#!/bin/bash
# Enkel CSP-tester for lokal utvikling
# Denne testen er mindre omfattende og raskere å kjøre under utvikling

echo "🔒 Enkel CSP-test for lokal miljø"
echo "--------------------------------"

# URL til lokal utviklingsserver
LOCAL_URL="http://localhost:5173"

# Farger for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Tester CSP meta tag i HTML...${NC}"

# Hent HTML og sjekk for CSP meta tag
HTML=$(curl -s $LOCAL_URL)

if echo "$HTML" | grep -q 'http-equiv="Content-Security-Policy"'; then
  echo -e "${GREEN}✅ CSP meta tag funnet i HTML${NC}"
  
  # Hent ut CSP-innholdet
  CSP_CONTENT=$(echo "$HTML" | grep -o 'http-equiv="Content-Security-Policy" content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/')
  
  echo -e "CSP Policy funnet:"
  echo "$CSP_CONTENT"
  
  # Sjekk kritiske direktiver
  if echo "$CSP_CONTENT" | grep -q "default-src"; then
    echo -e "${GREEN}✅ default-src direktiv funnet${NC}"
  else
    echo -e "${RED}❌ default-src direktiv mangler${NC}"
  fi
  
  if echo "$CSP_CONTENT" | grep -q "connect-src"; then
    echo -e "${GREEN}✅ connect-src direktiv funnet${NC}"
    
    # Sjekk Supabase og Cloudflare domener
    if echo "$CSP_CONTENT" | grep -q "supabase"; then
      echo -e "${GREEN}✅ Supabase domener inkludert i connect-src${NC}"
    else
      echo -e "${RED}❌ Supabase domener mangler i connect-src${NC}"
    fi
    
    if echo "$CSP_CONTENT" | grep -q "cloudflareinsights.com"; then
      echo -e "${GREEN}✅ Cloudflare domener inkludert i connect-src${NC}"
    else
      echo -e "${RED}❌ Cloudflare domener mangler i connect-src${NC}"
    fi
  else
    echo -e "${RED}❌ connect-src direktiv mangler${NC}"
  fi
else
  echo -e "${RED}❌ Ingen CSP meta tag funnet i HTML${NC}"
  echo -e "${YELLOW}Tips: Legg til CSP meta tag i index.html eller bruk inject-csp.sh etter bygging${NC}"
fi

echo -e "\n${YELLOW}CSP test fullført.${NC}"
