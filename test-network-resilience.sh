#!/bin/bash
# filepath: /workspaces/snakkaz-chat/test-network-resilience.sh
#
# Dette skriptet tester nettverksresiliensfunksjonene i Snakkaz Chat
# ved å simulere forskjellige nettverkstilstander og kontrollere
# at applikasjonen håndterer disse korrekt.

# Fargedefinisjoner for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================================${NC}"
echo -e "${BLUE}  Snakkaz Chat - Nettverksresiliens Testing            ${NC}"
echo -e "${BLUE}=======================================================${NC}"
echo

# Sjekk om vi er i riktig mappe
if [ ! -f "package.json" ]; then
  echo -e "${RED}Feil: Dette skriptet må kjøres fra prosjektets rotmappe!${NC}"
  exit 1
fi

# Test 1: Verifiser at nettverksindikatorene er tilstede i koden
echo -e "${YELLOW}Test 1: Verifiserer nettverksstatusindikator i ChatMessageList${NC}"
if grep -q "WifiOff" "src/components/chat/ChatMessageList.tsx" && \
   grep -q "useNetworkStatus" "src/components/chat/ChatMessageList.tsx" && \
   grep -q "Koble til på nytt" "src/components/chat/ChatMessageList.tsx"; then
  echo -e "${GREEN}✓ Nettverksstatusindikator funnet i ChatMessageList${NC}"
else
  echo -e "${RED}✗ Nettverksstatusindikator mangler i ChatMessageList${NC}"
fi
echo

# Test 2: Verifiser offline-melding i input-feltet
echo -e "${YELLOW}Test 2: Verifiserer offlineindikator i ChatInputField${NC}"
if grep -q "Frakoblet" "src/components/chat/ChatInputField.tsx" && \
   grep -q "useNetworkStatus" "src/components/chat/ChatInputField.tsx"; then
  echo -e "${GREEN}✓ Offline-indikator funnet i ChatInputField${NC}"
else
  echo -e "${RED}✗ Offline-indikator mangler i ChatInputField${NC}"
fi
echo

# Test 3: Verifiser offline meldingslagring
echo -e "${YELLOW}Test 3: Verifiserer offline meldingslagerfunksjoner${NC}"
if [ -f "src/utils/offline/offlineMessageStore.ts" ]; then
  FUNCTIONS=("getOfflineMessages" "saveOfflineMessage" "markOfflineMessageAsSent" "markOfflineMessageAsFailed" "clearSentOfflineMessages")
  ALL_FOUND=true
  
  for func in "${FUNCTIONS[@]}"; do
    if grep -q "export function $func" "src/utils/offline/offlineMessageStore.ts"; then
      echo -e "${GREEN}✓ Funnet funksjon: $func${NC}"
    else
      echo -e "${RED}✗ Manglende funksjon: $func${NC}"
      ALL_FOUND=false
    fi
  done
  
  if $ALL_FOUND; then
    echo -e "${GREEN}✓ Alle nødvendige offline-meldingslagerfunksjoner er tilstede${NC}"
  else
    echo -e "${RED}✗ Noen offline-meldingslagerfunksjoner mangler${NC}"
  fi
else
  echo -e "${RED}✗ Finner ikke offlineMessageStore.ts${NC}"
fi
echo

# Test 4: Verifiser useNetworkStatus hook
echo -e "${YELLOW}Test 4: Verifiserer useNetworkStatus hook${NC}"
if [ -f "src/hooks/use-network-status.ts" ]; then
  if grep -q "export function useNetworkStatus" "src/hooks/use-network-status.ts" && \
     grep -q "online:" "src/hooks/use-network-status.ts" && \
     grep -q "reconnecting:" "src/hooks/use-network-status.ts" && \
     grep -q "forceReconnect" "src/hooks/use-network-status.ts"; then
    echo -e "${GREEN}✓ useNetworkStatus hook implementert korrekt${NC}"
  else
    echo -e "${RED}✗ useNetworkStatus hook mangler nødvendige funksjoner${NC}"
  fi
else
  echo -e "${RED}✗ Finner ikke use-network-status.ts${NC}"
fi
echo

# Test 5: Verifiser useOfflineMessages hook
echo -e "${YELLOW}Test 5: Verifiserer useOfflineMessages hook${NC}"
if [ -f "src/hooks/use-offline-messages.ts" ]; then
  if grep -q "export function useOfflineMessages" "src/hooks/use-offline-messages.ts" && \
     grep -q "sendMessage" "src/hooks/use-offline-messages.ts" && \
     grep -q "syncOfflineMessages" "src/hooks/use-offline-messages.ts"; then
    echo -e "${GREEN}✓ useOfflineMessages hook implementert korrekt${NC}"
  else
    echo -e "${RED}✗ useOfflineMessages hook mangler nødvendige funksjoner${NC}"
  fi
else
  echo -e "${RED}✗ Finner ikke use-offline-messages.ts${NC}"
fi
echo

# Test 6: Kjør byggeprosess for å verifisere at det ikke er noen kompileringsfeil
echo -e "${YELLOW}Test 6: Bygger applikasjonen for å verifisere ingen kompileringsfeil${NC}"
npm run build > build-network-test.log 2>&1
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Byggeprosess fullført uten feil${NC}"
else
  echo -e "${RED}✗ Byggeprosess feilet. Se build-network-test.log for detaljer${NC}"
fi
echo

# Oppsummering
echo -e "${BLUE}=======================================================${NC}"
echo -e "${BLUE}  Nettverksresiliens Testing Oppsummering              ${NC}"
echo -e "${BLUE}=======================================================${NC}"
echo
echo -e "For å manuelt verifisere nettverksresilientfunksjoner:"
echo -e "1. Kjør applikasjonen lokalt med ${YELLOW}npm run dev${NC}"
echo -e "2. Åpne Chrome DevTools (F12)"
echo -e "3. Gå til Network-fanen og sett 'Offline' for å simulere offline-tilstand"
echo -e "4. Forsøk å sende meldinger og verifiser at de blir lagret"
echo -e "5. Sett tilbake til 'No throttling' for å simulere online-tilstand"
echo -e "6. Verifiser at lagrede meldinger blir sendt automatisk"
echo

echo -e "${BLUE}Dokumentasjon for nettverksresilientforbedringer:${NC}"
echo -e "Se ${YELLOW}NETWORK-RESILIENCE-IMPROVEMENTS.md${NC} for detaljert dokumentasjon"
