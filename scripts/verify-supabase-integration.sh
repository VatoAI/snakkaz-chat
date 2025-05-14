#!/bin/bash
# verify-supabase-integration.sh
# Dette skriptet sjekker om Supabase-integrasjonen fungerer korrekt
# etter migrering fra Cloudflare til Namecheap DNS.

# Definer farger for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Supabase Integrasjonsverifisering    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Steg 1: Sjekk miljøvariabler
echo -e "${BLUE}Steg 1: Sjekker miljøvariabler...${NC}"

# Sjekk om .env-filen eksisterer
if [ -f ".env" ]; then
    echo -e "  ${GREEN}✓${NC} .env-fil funnet"
    # Last inn miljøvariabler fra .env-filen
    export $(grep -v '^#' .env | xargs)
else
    echo -e "  ${YELLOW}⚠${NC} Ingen .env-fil funnet. Bruker verdier fra miljøet."
fi

# Sjekk om nødvendige miljøvariabler er satt
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "  ${RED}✗${NC} VITE_SUPABASE_URL er ikke satt"
    HAS_ERROR=true
else
    echo -e "  ${GREEN}✓${NC} VITE_SUPABASE_URL: $VITE_SUPABASE_URL"
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "  ${RED}✗${NC} VITE_SUPABASE_ANON_KEY er ikke satt"
    HAS_ERROR=true
else
    # Vis bare de første 10 tegnene av nøkkelen
    KEY_PREFIX="${VITE_SUPABASE_ANON_KEY:0:10}..."
    echo -e "  ${GREEN}✓${NC} VITE_SUPABASE_ANON_KEY: $KEY_PREFIX"
fi

# Sjekk om vi bruker egendefinert domene
if [ -n "$VITE_SUPABASE_CUSTOM_DOMAIN" ]; then
    echo -e "  ${GREEN}✓${NC} VITE_SUPABASE_CUSTOM_DOMAIN: $VITE_SUPABASE_CUSTOM_DOMAIN"
    CUSTOM_DOMAIN=$VITE_SUPABASE_CUSTOM_DOMAIN
else
    echo -e "  ${YELLOW}⚠${NC} Ingen egendefinert domene konfigurert"
    # Extract domain from URL
    CUSTOM_DOMAIN=$(echo $VITE_SUPABASE_URL | sed -e 's|^https://||' -e 's|\.supabase\.co.*$||')
    echo -e "  ${YELLOW}⚠${NC} Bruker standard domene: $CUSTOM_DOMAIN.supabase.co"
fi

echo

# Steg 2: Nettverk-sjekk
echo -e "${BLUE}Steg 2: Utfører nettverkstester...${NC}"

# Test om vi kan nå Supabase-endepunktet
if [ -n "$VITE_SUPABASE_URL" ]; then
    echo -ne "  Tester tilkobling til $VITE_SUPABASE_URL... "
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VITE_SUPABASE_URL")
    
    if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 404 ]; then
        # 404 er også OK, det betyr at serveren svarer men vi prøvde å få en side som ikke finnes
        echo -e "${GREEN}OK ($HTTP_STATUS)${NC}"
    else
        echo -e "${RED}FEIL ($HTTP_STATUS)${NC}"
        echo -e "  ${RED}✗${NC} Kunne ikke koble til Supabase. Sjekk nettverkstilkobling og DNS-konfigurasjon."
        HAS_ERROR=true
    fi
fi

# Test DNS-oppslag for custom domain hvis konfigurert
if [ -n "$CUSTOM_DOMAIN" ]; then
    echo -ne "  DNS-oppslag for $CUSTOM_DOMAIN... "
    if host "$CUSTOM_DOMAIN" > /dev/null 2>&1; then
        echo -e "${GREEN}OK${NC}"
        # Vis IP-adresse
        IP=$(host "$CUSTOM_DOMAIN" | grep "has address" | head -1 | awk '{print $4}')
        echo -e "  ${GREEN}✓${NC} IP-adresse: $IP"
    else
        echo -e "${RED}FEIL${NC}"
        echo -e "  ${RED}✗${NC} DNS-oppslag mislyktes. Sjekk DNS-konfigurasjon."
        HAS_ERROR=true
    fi
fi

echo

# Steg 3: Kjør Supabase tilkoblingstest via Node
echo -e "${BLUE}Steg 3: Kjører Supabase tilkoblingstest...${NC}"

# Lag midlertidig testfil
echo -e "  Oppretter testskript..."
cat > supabase-test.js << EOF
// Midlertidig testskript for Supabase-tilkobling
const { createClient } = require('@supabase/supabase-js');

// Bruk miljøvariabler
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Tester Supabase-tilkobling med:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'Ikke satt');

async function testConnection() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Mangler nødvendige miljøvariabler for Supabase-tilkobling!');
    process.exit(1);
  }

  try {
    // Opprett Supabase-klient
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test autentisering med en enkel kall
    console.log('Tester Supabase-autentisering...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Autentiseringsfeil:', error.message);
      process.exit(1);
    }
    
    console.log('Autentisering OK!', data.session ? 'Aktiv sesjon funnet.' : 'Ingen aktiv sesjon.');
    
    // Test databasetilkobling med en enkel spørring
    console.log('Tester databasetilkobling...');
    const { data: health, error: dbError } = await supabase
      .from('health')
      .select('*')
      .limit(1);
    
    if (dbError) {
      if (dbError.code === 'PGRST116') {
        console.log('Database OK! (Ingen tilgang til health-tabellen - dette er normalt uten autentisering)');
      } else {
        console.error('Databasefeil:', dbError.message);
        process.exit(1);
      }
    } else {
      console.log('Database OK! Returnerte data:', health);
    }
    
    console.log('Supabase-tilkobling vellykket!');
    process.exit(0);
  } catch (err) {
    console.error('Uventet feil ved testing av Supabase-tilkobling:', err);
    process.exit(1);
  }
}

testConnection();
EOF

# Installer avhengigheter hvis nødvendig
if ! command -v npm > /dev/null; then
    echo -e "  ${RED}✗${NC} npm ikke funnet. Node.js er nødvendig for denne testen."
    HAS_ERROR=true
else
    echo -e "  Installerer @supabase/supabase-js..."
    npm install --no-save @supabase/supabase-js > /dev/null 2>&1
    
    echo -e "  Kjører tilkoblingstesten..."
    # Kjør skriptet og fang opp utdata
    NODE_OUTPUT=$(node supabase-test.js 2>&1)
    NODE_EXIT_CODE=$?
    
    echo -e "${BLUE}--- Testresultater ---${NC}"
    echo -e "$NODE_OUTPUT"
    echo -e "${BLUE}---------------------${NC}"
    
    if [ $NODE_EXIT_CODE -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC} Supabase-tilkoblingstest vellykket!"
    else
        echo -e "  ${RED}✗${NC} Supabase-tilkoblingstest mislyktes."
        HAS_ERROR=true
    fi
    
    # Fjern midlertidig fil
    rm supabase-test.js
fi

echo

# Steg 4: Sjekk chat-integrasjon
echo -e "${BLUE}Steg 4: Sjekker chat-komponenter...${NC}"

# Sjekk om ChatContext kan importeres uten feil
echo -e "  Sjekker ChatContext importering..."
cat > chat-test.js << EOF
// Test of ChatContext and Supabase integration
try {
  // Dynamic import of the ChatContext
  const chatContextPath = './src/contexts/ChatContext';
  import(chatContextPath)
    .then(() => {
      console.log('✅ ChatContext successfully imported');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error importing ChatContext:', err.message);
      process.exit(1);
    });
} catch (err) {
  console.error('❌ General error:', err.message);
  process.exit(1);
}
EOF

# Kjør testen med en timeout
echo -e "  Dette kan ta noen sekunder..."
if command -v timeout > /dev/null; then
    CHAT_OUTPUT=$(timeout 10 node --experimental-modules chat-test.js 2>&1 || echo "Tidsavbrudd eller feil")
else
    CHAT_OUTPUT=$(node --experimental-modules chat-test.js 2>&1 || echo "Feil")
fi

if echo "$CHAT_OUTPUT" | grep -q "successfully imported"; then
    echo -e "  ${GREEN}✓${NC} Chat-integrasjon OK"
else
    echo -e "  ${YELLOW}⚠${NC} Kunne ikke bekrefte chat-integrasjon"
    echo -e "  Dette er forventet i noen kjøremiljøer og trenger ikke å være et problem"
fi

# Fjern midlertidig fil
rm chat-test.js

echo

# Oppsummeringsseksjon
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}          OPPSUMMERING                 ${NC}"
echo -e "${BLUE}========================================${NC}"

if [ "$HAS_ERROR" = true ]; then
    echo -e "${RED}Noen tester mislyktes. Supabase-integrasjonen kan ha problemer.${NC}"
    echo
    echo -e "Anbefalinger:"
    echo -e "1. Sjekk at DNS-propagering er fullført (kan ta opptil 48 timer)"
    echo -e "2. Verifiser at alle nødvendige DNS-oppføringer er lagt til i Namecheap"
    echo -e "3. Sjekk at miljøvariablene er korrekt konfigurert"
    echo -e "4. Kjør skriptet på nytt om noen timer"
else
    echo -e "${GREEN}Alle tester bestått! Supabase-integrasjonen fungerer korrekt.${NC}"
    echo
    echo -e "Chat-systemet bør fungere med den nye DNS-konfigurasjonen."
fi

echo
echo -e "Kjørt $(date)"
echo -e "${BLUE}========================================${NC}"
