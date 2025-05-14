#!/bin/bash
# test-chat-system.sh
# Dette skriptet sjekker om chat-systemet fungerer etter Cloudflare til Namecheap migrering
# Kjør dette skriptet når du har verifisert at DNS-oppsettet er korrekt

# Definer farger for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Chat System Testing   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Steg 1: Sjekk DNS-konfigurasjon
echo -e "${BLUE}Steg 1: Sjekker DNS-konfigurasjon...${NC}"
echo -e "  Kjører DNS-test script..."
if [ -f "./scripts/test-dns-setup.sh" ]; then
  chmod +x ./scripts/test-dns-setup.sh
  ./scripts/test-dns-setup.sh
  DNS_EXIT_CODE=$?
  
  if [ $DNS_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}DNS-konfigurasjonen ser bra ut!${NC}"
  else
    echo -e "${YELLOW}Det er problemer med DNS-konfigurasjonen. Se utdata ovenfor for detaljer.${NC}"
    echo -e "${YELLOW}Dette kan påvirke chat-systemet.${NC}"
  fi
else
  echo -e "${YELLOW}DNS-testskriptet ble ikke funnet. Hopper over denne testen.${NC}"
fi

echo

# Steg 2: Sjekk Supabase-integrasjonen
echo -e "${BLUE}Steg 2: Sjekker Supabase-integrasjon...${NC}"
echo -e "  Kjører Supabase integrasjonstest..."
if [ -f "./scripts/verify-supabase-integration.sh" ]; then
  chmod +x ./scripts/verify-supabase-integration.sh
  ./scripts/verify-supabase-integration.sh
  SUPABASE_EXIT_CODE=$?
  
  if [ $SUPABASE_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Supabase-integrasjonen fungerer!${NC}"
  else
    echo -e "${YELLOW}Det er problemer med Supabase-integrasjonen. Se utdata ovenfor for detaljer.${NC}"
    echo -e "${YELLOW}Dette vil påvirke chat-systemet.${NC}"
  fi
else
  echo -e "${YELLOW}Supabase-testskriptet ble ikke funnet. Hopper over denne testen.${NC}"
fi

echo

# Steg 3: Test av chat-komponenter
echo -e "${BLUE}Steg 3: Tester chat-komponenter...${NC}"

# Lag midlertidig testfil
echo -e "  Oppretter test-skript for chat-komponenter..."
cat > chat-component-test.js << EOF
// Test script for chat components
const fs = require('fs');
const path = require('path');

// List of expected chat component files
const expectedComponents = [
  'src/components/chat/ChatInterface.tsx',
  'src/components/chat/ChatMessageList.tsx',
  'src/components/chat/MessageInput.tsx',
  'src/contexts/ChatContext.tsx',
  // Add more critical chat components as needed
];

// Check if each component exists
let missingComponents = [];
expectedComponents.forEach(componentPath => {
  if (!fs.existsSync(path.join(process.cwd(), componentPath))) {
    missingComponents.push(componentPath);
  }
});

if (missingComponents.length > 0) {
  console.error('MISSING COMPONENTS:');
  missingComponents.forEach(comp => console.error(`- ${comp}`));
  process.exit(1);
} else {
  console.log('All chat components are present.');
  
  // Do a quick check of ChatContext to see if it's properly importing Supabase
  const chatContextPath = path.join(process.cwd(), 'src/contexts/ChatContext.tsx');
  const content = fs.readFileSync(chatContextPath, 'utf8');
  
  if (!content.includes('supabase')) {
    console.error('WARNING: ChatContext.tsx does not reference supabase!');
    process.exit(2);
  }
  
  // All checks passed
  console.log('ChatContext properly references Supabase.');
  process.exit(0);
}
EOF

# Kjør testskriptet
echo -e "  Kjører komponent-test..."
node chat-component-test.js
COMPONENT_EXIT_CODE=$?

if [ $COMPONENT_EXIT_CODE -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Alle chat-komponenter funnet og ser bra ut!"
elif [ $COMPONENT_EXIT_CODE -eq 2 ]; then
  echo -e "  ${YELLOW}⚠${NC} Chat-komponenter funnet, men det kan være problemer med Supabase-integrasjonen."
else
  echo -e "  ${RED}✗${NC} Noen chat-komponenter mangler!"
  echo -e "  Se utdata ovenfor for detaljer."
fi

# Fjern midlertidig fil
rm chat-component-test.js

echo

# Steg 4: Sjekk CSP-konfigurasjon
echo -e "${BLUE}Steg 4: Sjekker CSP-konfigurasjon...${NC}"

# Lag midlertidig testfil
echo -e "  Oppretter CSP test-skript..."
cat > csp-test.js << EOF
// CSP test script
const fs = require('fs');
const path = require('path');

try {
  // Look for cspConfig.ts
  const cspConfigPath = path.join(process.cwd(), 'src/services/encryption/cspConfig.ts');
  
  if (!fs.existsSync(cspConfigPath)) {
    console.error('CSP config file not found!');
    process.exit(1);
  }
  
  const content = fs.readFileSync(cspConfigPath, 'utf8');
  
  // Check for Supabase domains in connect-src
  if (!content.includes('supabase.co') && !content.includes('supabase')) {
    console.error('WARNING: CSP config might not include Supabase domains!');
    process.exit(2);
  }
  
  // Check if Cloudflare references have been removed
  if (content.includes('cloudflare.com') || content.includes('cloudflareinsights.com')) {
    console.error('WARNING: CSP config still contains Cloudflare references!');
    process.exit(3);
  }
  
  console.log('CSP config looks good!');
  process.exit(0);
} catch (err) {
  console.error('Error checking CSP config:', err);
  process.exit(1);
}
EOF

# Kjør CSP-testskriptet
echo -e "  Kjører CSP-test..."
node csp-test.js
CSP_EXIT_CODE=$?

if [ $CSP_EXIT_CODE -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} CSP-konfigurasjonen ser bra ut!"
elif [ $CSP_EXIT_CODE -eq 2 ]; then
  echo -e "  ${YELLOW}⚠${NC} CSP-konfigurasjonen mangler muligens Supabase-domener!"
elif [ $CSP_EXIT_CODE -eq 3 ]; then
  echo -e "  ${YELLOW}⚠${NC} CSP-konfigurasjonen inneholder fortsatt Cloudflare-referanser!"
else
  echo -e "  ${RED}✗${NC} Kunne ikke verifisere CSP-konfigurasjonen!"
fi

# Fjern midlertidig fil
rm csp-test.js

echo

# Steg 5: Bygg applikasjonen for å sjekke om alt kompilerer
echo -e "${BLUE}Steg 5: Forsøker å bygge applikasjonen...${NC}"
echo -e "  Dette kan ta litt tid..."

if npm run build > build-output.log 2>&1; then
  echo -e "  ${GREEN}✓${NC} Applikasjonen bygget uten feil!"
else
  echo -e "  ${RED}✗${NC} Applikasjonen kunne ikke bygges! Sjekk build-output.log for detaljer."
fi

echo

# Oppsummering
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}            OPPSUMMERING               ${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $DNS_EXIT_CODE -eq 0 ] && [ $SUPABASE_EXIT_CODE -eq 0 ] && [ $COMPONENT_EXIT_CODE -eq 0 ] && [ $CSP_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}Alle tester bestått! Chat-systemet bør fungere normalt.${NC}"
else
  echo -e "${YELLOW}Noen tester feilet. Chat-systemet kan ha problemer.${NC}"
  echo -e "Se ${BLUE}docs/CHAT-FEILSØKINGSGUIDE.md${NC} for hjelp med feilsøking."
fi

echo
echo -e "Test fullført: $(date)"
echo -e "${BLUE}========================================${NC}"
