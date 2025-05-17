#!/bin/bash
# quick-fix-snakkaz-v2.sh
#
# Dette skriptet implementerer flere feilrettinger for Snakkaz Chat
# som hjelper med feil etter migrering fra Cloudflare til Namecheap

# Definer farger for terminal-output
GRØNN='\033[0;32m'
GUL='\033[1;33m'
RØD='\033[0;31m'
BLÅ='\033[0;34m'
INGEN='\033[0m' # Ingen farge

# Vis header
echo -e "${BLÅ}========================================${INGEN}"
echo -e "${BLÅ}    Snakkaz Chat: Forbedret Feilretting    ${INGEN}"
echo -e "${BLÅ}========================================${INGEN}"
echo

# 1. Lag en .env fil med riktige Supabase-variabler
echo -e "${GUL}Steg 1: Lager .env fil med Supabase-variabler...${INGEN}"

# Sjekk om .env-filen allerede eksisterer
if [ -f ".env" ]; then
  echo -e "${GUL}En .env-fil finnes allerede. Vil du overskrive den? (j/n)${INGEN}"
  read svar
  if [[ "$svar" != "j" && "$svar" != "J" ]]; then
    echo -e "${GRØNN}Beholder eksisterende .env-fil.${INGEN}"
  else
    # Opprett en ny .env-fil
    cat > .env << EOF
# Supabase-variabler for Snakkaz Chat applikasjonen
VITE_SUPABASE_URL=https://supabase-url-her.supabase.co
VITE_SUPABASE_ANON_KEY=din-supabase-anon-key-her

# FTP-variabler for Namecheap-opplasting
FTP_HOST=ftp.snakkaz.com
FTP_USER=brukernavn
FTP_PASS=passord
FTP_REMOTE_DIR=public_html
EOF
    echo -e "${GRØNN}.env-mal opprettet. VIKTIGT: Rediger filen og legg inn riktige verdier!${INGEN}"
  fi
else
  # Opprett en ny .env-fil
  cat > .env << EOF
# Supabase-variabler for Snakkaz Chat applikasjonen
VITE_SUPABASE_URL=https://supabase-url-her.supabase.co
VITE_SUPABASE_ANON_KEY=din-supabase-anon-key-her

# FTP-variabler for Namecheap-opplasting
FTP_HOST=ftp.snakkaz.com
FTP_USER=brukernavn
FTP_PASS=passord
FTP_REMOTE_DIR=public_html
EOF
  echo -e "${GRØNN}.env-mal opprettet. VIKTIGT: Rediger filen og legg inn riktige verdier!${INGEN}"
fi
echo

# 2. Utfør en dybdefiks i envirnomentFix.ts (nyopprettet fil for å fikse process.env i alle filer)
echo -e "${GUL}Steg 2: Oppretter environment fiks for alle filer...${INGEN}"

mkdir -p src/utils/env
cat > src/utils/env/environmentFix.ts << EOF
/**
 * Environment Variable Patch for Browser Compatibility
 * 
 * Dette skriptet sørger for at alle miljøvariabler fungerer korrekt
 * både i utviklingsmiljøet og i produksjon, uavhengig av om
 * koden kjører på server eller i nettleser.
 */

// Global shim for process.env for å hindre feil i nettleser
// Dette vil erstatte alle process.env kall med import.meta.env
if (typeof window !== 'undefined') {
  // @ts-ignore - Vi ignorerer TypeScript-advarsler her
  window.process = window.process || {
    env: {
      NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
      // Map alle VITE_ miljøvariabler til process.env.*
      ...Object.fromEntries(
        Object.entries(import.meta.env)
          .filter(([key]) => key.startsWith('VITE_'))
          .map(([key, value]) => [key.replace('VITE_', ''), value])
      )
    }
  };
  
  // Logg at patcher er aktivert i utviklingsmiljø
  if (import.meta.env.DEV) {
    console.log('Environment compatibility patch applied: process.env is now available');
  }
}

// Eksporter en utility funksjon for å få miljøvariabler
export function getEnvironmentVariable(name: string, fallback: string = ''): string {
  if (typeof window !== 'undefined' && 'process' in window) {
    // @ts-ignore - Vi ignorerer TypeScript-advarsler her
    return window.process.env[name] || import.meta.env['VITE_' + name] || fallback;
  }
  
  // Fallback til Vite's import.meta.env
  return import.meta.env['VITE_' + name] || fallback;
}

// Eksporter et objekt med alle miljøvariabler for enklere bruk
export const ENV = {
  NODE_ENV: import.meta.env.MODE === 'production' ? 'production' : 'development',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  // Legg til flere miljøvariabler her ved behov
};
EOF
echo -e "${GRØNN}Environment fix-fil opprettet: src/utils/env/environmentFix.ts${INGEN}"
echo

# 3. Oppdater main.ts eller index.ts for å inkludere environment fix
echo -e "${GUL}Steg 3: Oppdaterer hovedfilen med environment import...${INGEN}"

# Finn hovedfilen (main.ts eller index.ts)
MAIN_FILE=""
if [ -f "src/main.ts" ]; then
    MAIN_FILE="src/main.ts"
elif [ -f "src/index.ts" ]; then
    MAIN_FILE="src/index.ts" 
else
    echo -e "${RØD}Kunne ikke finne hovedfilen (main.ts eller index.ts). Sjekk filstrukturen.${INGEN}"
    exit 1
fi

# Legg til import for environment fix øverst i filen
if grep -q "environmentFix" "$MAIN_FILE"; then
    echo -e "${GUL}Environment fix er allerede importert i $MAIN_FILE.${INGEN}"
else
    # Lag en sikkerhetskopi av filen
    cp "$MAIN_FILE" "${MAIN_FILE}.bak"
    
    # Legg til import på toppen av filen
    sed -i '1s/^/import "\.\/utils\/env\/environmentFix";\n/' "$MAIN_FILE"
    echo -e "${GRØNN}La til environment fix import i $MAIN_FILE.${INGEN}"
fi
echo

# 4. Forbered og bygg applikasjonen
echo -e "${GUL}Steg 4: Forbereder og bygger applikasjonen...${INGEN}"
echo -e "${GUL}Oppdaterer avhengigheter...${INGEN}"
npm install
echo -e "${GUL}Renser tidligere bygg...${INGEN}"
npm run clean
echo -e "${GUL}Bygger applikasjonen på nytt...${INGEN}"
npm run build:nocf
if [ $? -ne 0 ]; then
  echo -e "${RØD}Feil ved bygging av applikasjonen.${INGEN}"
  exit 1
fi
echo -e "${GRØNN}Bygget ferdig! Filer ble lagret i dist/-mappen.${INGEN}"
echo

# 5. Start en lokal server for testing
echo -e "${GUL}Steg 5: Starter en lokal server for testing...${INGEN}"
cd dist
python3 -m http.server 8080 &
SERVER_PID=$!
echo -e "${GRØNN}Lokal server kjører nå på http://localhost:8080${INGEN}"
echo

# 6. Gi råd om feilsøking
echo -e "${BLÅ}========================================${INGEN}"
echo -e "${BLÅ}    FEILSØKINGSTIPS FOR SNAKKAZ CHAT    ${INGEN}"
echo -e "${BLÅ}========================================${INGEN}"
echo
echo -e "${GRØNN}VANLIGE FEIL OG LØSNINGER:${INGEN}"
echo
echo -e "1. ${GUL}\"process is not defined\" feil:${INGEN}"
echo "   - Vi har nå lagt til en global fix for dette problemet"
echo "   - Hvis feilen fortsatt oppstår, sjekk konsollen for mer informasjon"
echo "   - Vurder å søke etter andre filer som bruker process.env direkte"
echo
echo -e "2. ${GUL}CSP-feil (Content Security Policy):${INGEN}"
echo "   - Alle Cloudflare-referanser er fjernet"
echo "   - Sjekk at snakkazCspPlugin.ts har riktige domener for din konfigurasjon"
echo
echo -e "3. ${GUL}Supabase tilkoblingsproblemer:${INGEN}"
echo "   - Sjekk at .env-filen har riktige Supabase-URL og anonym nøkkel"
echo "   - Verifiser at Supabase-prosjektet er aktivt og tilgjengelig"
echo "   - Sjekk CORS-innstillingene i Supabase-dashbordet"
echo
echo -e "4. ${GUL}DNS-problemer:${INGEN}"
echo "   - Sjekk at Namecheap BasicDNS er aktivert"
echo "   - Verifiser at DNS-innstillingene peker til Namecheap-hosting"
echo "   - Sjekk at subdomener er riktig konfigurert"
echo
echo -e "${BLÅ}NESTE STEG:${INGEN} Test applikasjonen i nettleseren på http://localhost:8080"
echo "Hvis det fortsatt oppstår feil, send konsollloggene for videre analyse."
echo
echo -e "${GUL}Trykk Enter for å avslutte skriptet og stoppe den lokale serveren...${INGEN}"
read
kill $SERVER_PID
