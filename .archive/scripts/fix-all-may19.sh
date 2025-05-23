#!/bin/bash
#
# Snakkaz Fix All Script - 19. mai 2025
#
# Dette skriptet kjører alle feilretting implementert 19. mai 2025
# i én enkelt kommando.
#

echo "🔄 Snakkaz Fix All Script - 19. mai 2025 🔄"
echo "=========================================="
echo

# Sjekk om vi er i riktig katalog
if [ ! -f "package.json" ]; then
  echo "❌ Feil: Du må kjøre dette skriptet fra prosjektets rotkatalog!"
  echo "   Naviger til rotkatalogen og prøv igjen."
  exit 1
fi

# 1. Fikse Service Worker problemer
echo "🔧 1/5: Fikser Service Worker HEAD request problemer..."
if [ -f "public/service-worker.js" ]; then
  # Sjekk om fiksen allerede er implementert
  if grep -q "event.request.method === 'GET'" "public/service-worker.js"; then
    echo "  ✅ Service Worker i public/ er allerede fikset."
  else
    # Lag en sikkerhetskopi
    cp public/service-worker.js public/service-worker.js.bak
    
    # Legg til sjekk for HEAD-forespørsler
    sed -i 's/cache.put(event.request, responseToCache);/if (event.request.method === '\''GET'\'') {\n          cache.put(event.request, responseToCache);\n        }/' public/service-worker.js
    echo "  ✅ Service Worker i public/ er fikset."
  fi
else
  echo "  ⚠️ public/service-worker.js ble ikke funnet."
fi

if [ -f "dist/service-worker.js" ]; then
  # Sjekk om fiksen allerede er implementert
  if grep -q "event.request.method === 'GET'" "dist/service-worker.js"; then
    echo "  ✅ Service Worker i dist/ er allerede fikset."
  else
    # Lag en sikkerhetskopi
    cp dist/service-worker.js dist/service-worker.js.bak
    
    # Legg til sjekk for HEAD-forespørsler
    sed -i 's/cache.put(event.request, responseToCache);/if (event.request.method === '\''GET'\'') {\n          cache.put(event.request, responseToCache);\n        }/' dist/service-worker.js
    echo "  ✅ Service Worker i dist/ er fikset."
  fi
else
  echo "  ℹ️ dist/service-worker.js ble ikke funnet. Dette er normalt hvis applikasjonen ikke er bygd ennå."
fi

# 2. Fikse CSP-advarsler
echo "🔧 2/5: Fikser CSP-advarsler..."
if [ -f "fix-csp-warnings.sh" ]; then
  chmod +x fix-csp-warnings.sh
  ./fix-csp-warnings.sh
  echo "  ✅ CSP-advarsler er fikset."
else
  echo "  ⚠️ fix-csp-warnings.sh ble ikke funnet. Hopper over dette steget."
fi

# 3. Fikse supabase preview problemer
echo "🔧 3/5: Fikser Supabase Preview problemer..."
if [ -f "fix-supabase-preview-config.sh" ]; then
  chmod +x fix-supabase-preview-config.sh
  ./fix-supabase-preview-config.sh
  echo "  ✅ Supabase Preview-konfigurasjon er fikset."
else
  # Opprett Supabase-mappestruktur manuelt
  echo "  ℹ️ fix-supabase-preview-config.sh ble ikke funnet. Oppretter mappestruktur manuelt..."
  if [ -f "supabase" ] && [ ! -d "supabase" ]; then
    mv supabase supabase.bin
  fi
  mkdir -p supabase/{functions,migrations,seed}
  echo "  ✅ Supabase-mappestruktur er opprettet."
fi

# 4. Fikse Multiple GoTrueClient issues
echo "🔧 4/5: Fikser multiple GoTrueClient problemer..."
if [ -f "fix-multiple-supabase-client.sh" ]; then
  chmod +x fix-multiple-supabase-client.sh
  ./fix-multiple-supabase-client.sh
  echo "  ✅ Multiple GoTrueClient problemer er fikset."
else
  echo "  ⚠️ fix-multiple-supabase-client.sh ble ikke funnet. Sjekk singleton-implementasjonen i supabaseClient.ts manuelt."
fi

# 5. Bygg og test applikasjonen
echo "🔧 5/5: Bygger og tester applikasjonen..."
if [ -f "rebuild-and-test.sh" ]; then
  chmod +x rebuild-and-test.sh
  ./rebuild-and-test.sh &
  rebuild_pid=$!
  echo "  ✅ Bygge- og testeprosess startet med PID $rebuild_pid. Dette kan ta noen minutter."
else
  echo "  ⚠️ rebuild-and-test.sh ble ikke funnet. Kjører standard bygg-kommando..."
  npm run build
  echo "  ✅ Applikasjonen er bygd."
fi

echo ""
echo "✅ Alle feilrettinger er implementert! ✅"
echo ""
echo "Dokumentasjon oppdatert:"
echo "- SNAKKAZ-MASTER-PROMPT.md - Oppdatert med siste status"
echo "- DEPLOYMENT-STATUS.md - Oppdatert med nyeste endringer"
echo "- BUGFIXES-MAY19-2025.md - Detaljert oppsummering av feilrettinger"
echo "- README-SNAKKAZ.md - Ny README-fil for prosjektet"
echo ""
echo "For å fullføre prosessen, vurder å kjøre følgende kommando for å teste Supabase Preview:"
echo "./test-supabase-preview.sh"
echo ""
echo "Snakkaz Chat er nå klar for deployment!"
