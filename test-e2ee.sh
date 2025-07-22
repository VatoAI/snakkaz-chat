#!/bin/bash
# E2EE Testing Script for SnakkaZ Chat
# Dette skriptet kjører ende-til-ende-krypteringstester for SnakkaZ chat

# Farger for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== SnakkaZ Ende-til-Ende-Kryptering (E2EE) Test ====${NC}"
echo "Testkjøring starter $(date)"
echo ""

# Sjekk om nettlesermiljø er tilgjengelig
if [ "$CI" = "true" ]; then
  echo -e "${BLUE}CI-miljø oppdaget. Bruker headless testing...${NC}"
  TEST_ENV="CI"
else
  TEST_ENV="local"
fi

# Opprett en midlertidig testfil som importerer testene
TMP_TEST_FILE=$(mktemp)
cat > $TMP_TEST_FILE << 'EOL'
import { runAllE2EETests } from './src/tests/e2ee-test';

async function runTests() {
  try {
    console.log('Starting E2EE tests...');
    const result = await runAllE2EETests();
    console.log(`Tests completed with ${result ? 'SUCCESS' : 'FAILURE'}`);
    process.exit(result ? 0 : 1);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

runTests();
EOL

echo -e "${BLUE}Forbereder testmiljø...${NC}"

# Kjør testene med Node.js hvis vi er i CI, ellers åpne testside
if [ "$TEST_ENV" = "CI" ]; then
  echo -e "${BLUE}Kjører tester i Node.js...${NC}"
  node -r esbuild-register $TMP_TEST_FILE
  TEST_RESULT=$?
else
  echo -e "${BLUE}Åpner testside i nettleser...${NC}"
  echo -e "${BLUE}Gå til følgende URL for å kjøre testene:${NC}"
  echo -e "${GREEN}http://localhost:5173/e2ee-test${NC}"
  echo ""
  echo -e "Trykk på 'Kjør E2EE-tester' knappen på siden"
  echo -e "${BLUE}Trykk [Enter] etter at testene er fullført i nettleseren...${NC}"
  read
  
  echo -e "${BLUE}Verifiser at testene var vellykket (j/n):${NC}"
  read TEST_CONFIRMATION
  
  if [[ "$TEST_CONFIRMATION" == "j" ]]; then
    TEST_RESULT=0
  else
    TEST_RESULT=1
  fi
fi

# Rydd opp
rm $TMP_TEST_FILE

# Rapporter resultat
echo ""
if [ $TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}====== ALLE E2EE-TESTER BESTÅTT! ======${NC}"
else
  echo -e "${RED}====== NOEN E2EE-TESTER FEILET! ======${NC}"
fi

echo ""
echo "Testkjøring fullført $(date)"
exit $TEST_RESULT
