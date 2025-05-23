#!/bin/bash
# upload-spa-fix-direct.sh
#
# Dette skriptet laster opp SPA routing fix direkte til webserveren
# enten via FTP eller cPanel API token

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: DIREKTE OPPLASTING AV SPA FIX      ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Sjekk om vi har nødvendige filer
echo -e "${YELLOW}Sjekker om SPA fix filer finnes...${NC}"
if [ ! -f ".htaccess" ] || [ ! -f "fix-service-worker.html" ]; then
    echo -e "${RED}Feil: Kan ikke finne alle nødvendige filer!${NC}"
    echo "Vennligst kjør fix-snakkaz-spa-routing.sh først for å generere filene."
    exit 1
fi

# Lag temp-mappe og kopier filer
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}Kopierer SPA fix filer til midlertidig mappe...${NC}"
cp .htaccess fix-service-worker.html "$TEMP_DIR"
cp unregister-sw.js "$TEMP_DIR" 2>/dev/null || echo -e "${YELLOW}Advarsel: Kan ikke finne unregister-sw.js${NC}"

# Automatisk opprette unregister-sw.js hvis den mangler
if [ ! -f "$TEMP_DIR/unregister-sw.js" ]; then
    echo -e "${YELLOW}Oppretter unregister-sw.js...${NC}"
    cat > "$TEMP_DIR/unregister-sw.js" << 'EOF'
// Service Worker Unregistration Script
// Run this in the browser console to unregister problematic service workers

// Function to unregister all service workers
async function unregisterAllServiceWorkers() {
  try {
    console.log('[SW Fix] Starting service worker unregistration...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      console.log('[SW Fix] No service workers found to unregister.');
      return false;
    }
    
    let unregisteredCount = 0;
    for (const registration of registrations) {
      const scope = registration.scope;
      const success = await registration.unregister();
      
      if (success) {
        console.log(`[SW Fix] Successfully unregistered service worker with scope: ${scope}`);
        unregisteredCount++;
      } else {
        console.warn(`[SW Fix] Failed to unregister service worker with scope: ${scope}`);
      }
    }
    
    console.log(`[SW Fix] Unregistered ${unregisteredCount} of ${registrations.length} service workers.`);
    return unregisteredCount > 0;
  } catch (error) {
    console.error('[SW Fix] Error unregistering service workers:', error);
    return false;
  }
}

// Function to clear all caches
async function clearAllCaches() {
  try {
    console.log('[SW Fix] Starting cache clearing...');
    const cacheNames = await caches.keys();
    
    if (cacheNames.length === 0) {
      console.log('[SW Fix] No caches found to clear.');
      return false;
    }
    
    let clearedCount = 0;
    for (const cacheName of cacheNames) {
      const success = await caches.delete(cacheName);
      
      if (success) {
        console.log(`[SW Fix] Successfully cleared cache: ${cacheName}`);
        clearedCount++;
      } else {
        console.warn(`[SW Fix] Failed to clear cache: ${cacheName}`);
      }
    }
    
    console.log(`[SW Fix] Cleared ${clearedCount} of ${cacheNames.length} caches.`);
    return clearedCount > 0;
  } catch (error) {
    console.error('[SW Fix] Error clearing caches:', error);
    return false;
  }
}

// Execute both functions and reload if successful
async function fixServiceWorkerIssues() {
  console.log('======================================');
  console.log('  Snakkaz Chat: Service Worker Fix');
  console.log('======================================');
  
  const swUnregistered = await unregisterAllServiceWorkers();
  const cachesCleared = await clearAllCaches();
  
  if (swUnregistered || cachesCleared) {
    console.log('[SW Fix] Fixed service worker issues! Reloading page in 3 seconds...');
    setTimeout(() => {
      console.log('[SW Fix] Reloading now!');
      window.location.reload(true);
    }, 3000);
  } else {
    console.log('[SW Fix] No service worker issues found to fix.');
  }
}

// Run the fix function
fixServiceWorkerIssues();
EOF
fi

echo -e "${GREEN}✓ Forberedt filer for opplasting${NC}"
echo

# Leser inn variabler fra .env hvis den eksisterer
if [ -f ".env" ]; then
    echo -e "${YELLOW}Leser inn variabler fra .env fil...${NC}"
    source .env
fi

# Velg opplastingsmetode
echo -e "${YELLOW}Velg opplastingsmetode:${NC}"
echo "1) FTP (standard)"
echo "2) cPanel API Token"
read -p "Velg metode (1-2): " upload_method

case $upload_method in
    2)
        # cPanel API Token metode
        echo -e "${BLUE}cPanel API Token opplasting valgt${NC}"
        
        # Sett opp cPanel API token detaljer hvis ikke allerede definert
        if [ -z "$CPANEL_USERNAME" ] || [ -z "$CPANEL_API_TOKEN" ] || [ -z "$CPANEL_DOMAIN" ]; then
            echo -e "${YELLOW}Trenger cPanel API token detaljer:${NC}"
            read -p "cPanel brukernavn (f.eks. SnakkaZ): " CPANEL_USERNAME
            read -s -p "cPanel API token: " CPANEL_API_TOKEN
            echo
            read -p "cPanel domene (f.eks. premium123.web-hosting.com): " CPANEL_DOMAIN
            read -p "Remote directory (standard er public_html): " REMOTE_DIR
            
            # Standard verdi for remote directory
            REMOTE_DIR=${REMOTE_DIR:-public_html}
            
            # Lagre til .env for fremtidig bruk
            if [ -f ".env" ]; then
                echo "CPANEL_USERNAME=$CPANEL_USERNAME" >> .env
                echo "CPANEL_API_TOKEN=$CPANEL_API_TOKEN" >> .env
                echo "CPANEL_DOMAIN=$CPANEL_DOMAIN" >> .env
                echo "REMOTE_DIR=$REMOTE_DIR" >> .env
            fi
        else
            # Standard verdi for remote directory
            REMOTE_DIR=${REMOTE_DIR:-public_html}
        fi
        
        echo -e "${YELLOW}Laster opp filer via cPanel API...${NC}"
        
        # Lag en tarball av filene
        TARBALL="$TEMP_DIR/snakkaz-spa-fix.tar.gz"
        tar -czf "$TARBALL" -C "$TEMP_DIR" .
        
        # Last opp med cURL
        echo -e "${YELLOW}Starter opplasting til $CPANEL_DOMAIN...${NC}"
        UPLOAD_RESULT=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
            "https://$CPANEL_DOMAIN:2083/execute/Fileman/upload_files" \
            -F "file=@$TARBALL" \
            -F "dir=/$REMOTE_DIR" \
            -F "extract=1" \
            -F "overwrite=1")
        
        # Sjekk resultat
        if [[ $UPLOAD_RESULT == *"errors\":[]"* ]]; then
            echo -e "${GREEN}✓ Filene ble lastet opp og ekstrahert vellykket!${NC}"
        else
            echo -e "${RED}✗ Kunne ikke laste opp filer via cPanel API:${NC}"
            echo "$UPLOAD_RESULT"
        fi
        ;;
        
    *)
        # FTP metode (standard)
        echo -e "${BLUE}FTP opplasting valgt${NC}"
        
        # Sjekk om lftp er installert
        if ! command -v lftp &> /dev/null; then
            echo -e "${YELLOW}lftp er ikke installert. Installerer...${NC}"
            sudo apt-get update && sudo apt-get install -y lftp
            if [ $? -ne 0 ]; then
                echo -e "${RED}Kunne ikke installere lftp. Prøver standard ftp...${NC}"
                FTP_CMD="ftp"
            else
                echo -e "${GREEN}lftp er nå installert.${NC}"
                FTP_CMD="lftp"
            fi
        else
            FTP_CMD="lftp"
        fi
        
        # Sett opp FTP-detaljer hvis ikke allerede definert
        if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
            echo -e "${YELLOW}Trenger FTP-detaljer:${NC}"
            read -p "FTP Host (f.eks. ftp.snakkaz.com): " FTP_HOST
            read -p "FTP Brukernavn: " FTP_USER
            read -s -p "FTP Passord: " FTP_PASS
            echo
            read -p "Ekstern mappe (standard er public_html): " FTP_REMOTE_DIR
            
            # Standard verdi for remote directory
            FTP_REMOTE_DIR=${FTP_REMOTE_DIR:-public_html}
            
            # Lagre til .env for fremtidig bruk
            if [ -f ".env" ]; then
                echo "FTP_HOST=$FTP_HOST" >> .env
                echo "FTP_USER=$FTP_USER" >> .env
                echo "FTP_PASS=$FTP_PASS" >> .env
                echo "FTP_REMOTE_DIR=$FTP_REMOTE_DIR" >> .env
            fi
        else
            # Standard verdi for remote directory
            FTP_REMOTE_DIR=${FTP_REMOTE_DIR:-public_html}
        fi
        
        echo -e "${YELLOW}FTP-innstillinger:${NC}"
        echo "Host: $FTP_HOST"
        echo "Bruker: $FTP_USER"
        echo "Mappe: $FTP_REMOTE_DIR"
        echo
        
        # Last opp filer med lftp (mer robust)
        if [ "$FTP_CMD" == "lftp" ]; then
            echo -e "${YELLOW}Laster opp filer via lftp...${NC}"
            
            # Lag lftp-skript
            LFTP_SCRIPT=$(mktemp)
            cat > "$LFTP_SCRIPT" << EOF
open -u "$FTP_USER","$FTP_PASS" $FTP_HOST
cd $FTP_REMOTE_DIR
set ssl:verify-certificate no
put -O . "$TEMP_DIR/.htaccess"
put -O . "$TEMP_DIR/fix-service-worker.html"
put -O . "$TEMP_DIR/unregister-sw.js"
chmod 644 .htaccess
chmod 644 fix-service-worker.html
chmod 644 unregister-sw.js
bye
EOF

            # Kjør lftp
            lftp -f "$LFTP_SCRIPT"
            FTP_RESULT=$?
            rm -f "$LFTP_SCRIPT"
            
            if [ $FTP_RESULT -eq 0 ]; then
                echo -e "${GREEN}✓ Filene ble lastet opp vellykket!${NC}"
            else
                echo -e "${RED}✗ Kunne ikke laste opp filer via lftp (feilkode: $FTP_RESULT)${NC}"
            fi
        else
            # Fallback til standard ftp
            echo -e "${YELLOW}Laster opp filer via standard ftp...${NC}"
            
            # Lag ftp-skript
            FTP_SCRIPT=$(mktemp)
            cat > "$FTP_SCRIPT" << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
cd $FTP_REMOTE_DIR
binary
put "$TEMP_DIR/.htaccess"
put "$TEMP_DIR/fix-service-worker.html"
put "$TEMP_DIR/unregister-sw.js"
quit
EOF

            # Kjør ftp
            ftp -n < "$FTP_SCRIPT"
            FTP_RESULT=$?
            rm -f "$FTP_SCRIPT"
            
            if [ $FTP_RESULT -eq 0 ]; then
                echo -e "${GREEN}✓ Filene ble lastet opp vellykket!${NC}"
            else
                echo -e "${RED}✗ Kunne ikke laste opp filer via ftp (feilkode: $FTP_RESULT)${NC}"
            fi
        fi
        ;;
esac

# Rydd opp
rm -rf "$TEMP_DIR"

echo
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    NESTE STEG    ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
echo -e "${YELLOW}1. Åpne en ny inkognitofane i nettleseren${NC}"
echo -e "${YELLOW}2. Besøk https://www.snakkaz.com${NC}"
echo -e "${YELLOW}3. Hvis påloggingsgrensesnittet vises, er SPA-ruting fikset!${NC}"
echo
echo -e "${YELLOW}Hvis problemet fortsatt oppstår:${NC}"
echo "1. Besøk https://www.snakkaz.com/fix-service-worker.html"
echo "2. Klikk på 'Fix Service Worker Issues' knappen"
echo "3. Gå tilbake til https://www.snakkaz.com etter at fiksen er ferdig"
echo
echo -e "${GREEN}Opplasting av SPA routing fix er fullført!${NC}"
