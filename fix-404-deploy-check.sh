#!/bin/bash
# fix-404-deploy-check.sh
#
# Dette skriptet verifiserer tilstanden på serveren, diagnostiserer 404-problemer,
# og gjenoppretter nettstedet om nødvendig.

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: 404 DIAGNOSE & FIX       ${NC}"
echo -e "${BLUE}============================================${NC}"
echo

# Leser inn FTP-variabler fra .env
if [ -f ".env" ]; then
    echo -e "${YELLOW}Leser inn FTP-variabler fra .env fil...${NC}"
    source .env
else
    echo -e "${RED}Finner ikke .env fil. Vennligst oppgi FTP-detaljer:${NC}"
    read -p "FTP Host (f.eks. premium123.web-hosting.com): " FTP_HOST
    read -p "FTP Brukernavn: " FTP_USER
    read -s -p "FTP Passord: " FTP_PASS
    echo
    read -p "Ekstern mappe (f.eks. public_html): " FTP_REMOTE_DIR
fi

echo -e "${YELLOW}FTP-innstillinger:${NC}"
echo "Host: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_REMOTE_DIR"
echo

# STEG 1: Diagnostiser tilstanden på nettsiden
echo -e "${YELLOW}STEG 1: Diagnostiserer nettsiden www.snakkaz.com...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://www.snakkaz.com)
echo -e "HTTP-statuskode: ${CYAN}$HTTP_CODE${NC}"

if [ "$HTTP_CODE" == "404" ]; then
    echo -e "${RED}Bekreftet 404-feil.${NC}"
else
    echo -e "${GREEN}Nettsiden returnerer $HTTP_CODE-statuskode.${NC}"
fi

# STEG 2: Sjekk mappestruktur og filene på serveren
echo
echo -e "${YELLOW}STEG 2: Sjekker mappestruktur på serveren...${NC}"

# Opprett midlertidig fil for å utforske strukturen
cat > check-server.lftp << EOF
# Start med å åpne tilkoblingen
open -u $FTP_USER,$FTP_PASS $FTP_HOST

# Debug-modus for å se alle kommandoer
debug 3

# SSL/TLS-innstillinger
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-force no
set ftp:passive-mode yes

# Nettverkstilkoblingsinnstillinger
set net:timeout 30
set net:max-retries 5

# Liste root-katalog struktur
ls -la
find public_html -maxdepth 1 -type f > serverfiles.txt
ls -la public_html > public_html_ls.txt

# Sjekk om critical files finnes
cat public_html/index.html > index_content.txt
cat public_html/.htaccess > htaccess_content.txt 2>/dev/null

# Avslutt
bye
EOF

echo -e "${YELLOW}Utfører serversjekk...${NC}"
lftp -f check-server.lftp

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Serversjekk fullført!${NC}"
    
    # Analyser filene
    if [ -f "serverfiles.txt" ]; then
        if grep -q "index.html" serverfiles.txt; then
            echo -e "${GREEN}✓ index.html finnes i public_html.${NC}"
        else
            echo -e "${RED}✗ index.html mangler i public_html!${NC}"
            MISSING_INDEX=true
        fi
        
        if [ -f "htaccess_content.txt" ] && [ -s "htaccess_content.txt" ]; then
            echo -e "${GREEN}✓ .htaccess finnes og har innhold.${NC}"
        else
            echo -e "${RED}✗ .htaccess mangler eller er tom!${NC}"
            MISSING_HTACCESS=true
        fi
        
        echo -e "${YELLOW}Filer funnet i public_html:${NC}"
        cat serverfiles.txt
    else
        echo -e "${RED}Kunne ikke liste filer i public_html-mappen.${NC}"
    fi
else
    echo -e "${RED}✗ Kunne ikke fullføre serversjekk.${NC}"
fi

echo
echo -e "${YELLOW}STEG 3: Sjekk om de siste endringene ble bygget...${NC}"

# Sjekk om dist-mappen finnes og har oppdatert innhold
if [ ! -d "dist" ]; then
    echo -e "${RED}dist-mappen mangler! Vi må bygge prosjektet på nytt.${NC}"
    NEED_BUILD=true
else
    DIST_INDEX_TIME=$(stat -c %Y dist/index.html 2>/dev/null || echo 0)
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - DIST_INDEX_TIME))
    
    if [ $TIME_DIFF -gt 86400 ]; then # Eldre enn en dag
        echo -e "${YELLOW}dist-mappen finnes, men kan være utdatert (${TIME_DIFF} sekunder gammel).${NC}"
        echo -e "${YELLOW}Anbefaler å bygge på nytt.${NC}"
        echo -e "${YELLOW}Vil du bygge prosjektet på nytt? (y/n)${NC}"
        read -r rebuild_prompt
        if [[ $rebuild_prompt == "y" ]]; then
            NEED_BUILD=true
        fi
    else
        echo -e "${GREEN}dist-mappen finnes og ser oppdatert ut.${NC}"
    fi
fi

# STEG 4: Bygg prosjektet hvis nødvendig
if [ "$NEED_BUILD" = true ]; then
    echo
    echo -e "${YELLOW}STEG 4: Bygger prosjektet på nytt...${NC}"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Bygging feilet! Sjekk feilmeldingene ovenfor.${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ Bygging vellykket!${NC}"
    fi
else
    echo -e "${GREEN}✓ Hopper over bygging siden dist-mappen ser oppdatert ut.${NC}"
fi

# STEG 5: Sikre at .htaccess-filen er korrekt
echo
echo -e "${YELLOW}STEG 5: Forbereder .htaccess-fil...${NC}"

cat > fixed_htaccess.txt << 'EOF'
# Snakkaz Chat .htaccess - Fix for 404 errors
# For SPA-applikasjoner og React Router

# Enable rewriting
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # If the requested resource exists as a file or directory, skip rewriting
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-l
    
    # Otherwise, rewrite all requests to the index.html file
    RewriteRule ^ index.html [QSA,L]
</IfModule>

# Set proper MIME types
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
    AddType application/x-javascript .js
    AddType text/javascript .js
    AddType application/json .json
    
    # CSS
    AddType text/css .css
    
    # Images
    AddType image/svg+xml .svg
    AddType image/svg+xml .svgz
    AddType image/png .png
    AddType image/jpeg .jpg .jpeg
    AddType image/gif .gif
    AddType image/webp .webp
    
    # Fonts
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType font/woff .woff
    AddType font/woff2 .woff2
    
    # Web App Manifest
    AddType application/manifest+json .webmanifest
    AddType application/manifest+json .manifest
</IfModule>

# Force files to be loaded as their correct MIME type regardless of server config
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>

# Handle 404 errors
ErrorDocument 404 /index.html

# Enable CORS for asset files
<IfModule mod_headers.c>
    <FilesMatch "\.(js|css|ttf|otf|woff|woff2|svg)$">
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
</IfModule>
EOF

echo -e "${GREEN}✓ .htaccess-fil opprettet.${NC}"

# STEG 6: Last opp til serveren
echo
echo -e "${YELLOW}STEG 6: Laster opp til serveren...${NC}"

echo -e "${YELLOW}Vil du laste opp alle filer på nytt (full), eller bare kritiske filer (.htaccess og index.html) (kritisk)? (full/kritisk)${NC}"
read -r upload_choice

if [[ $upload_choice == "full" ]]; then
    # Full opplasting - opprett LFTP-skript
    cat > fix-upload.lftp << EOF
# Start med å åpne tilkoblingen
open -u $FTP_USER,$FTP_PASS $FTP_HOST

# Debug-modus for å se alle kommandoer
debug 3

# SSL/TLS-innstillinger
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-force no
set ftp:passive-mode yes

# Nettverkstilkoblingsinnstillinger
set net:timeout 60
set net:max-retries 5
set net:reconnect-interval-base 5
set net:reconnect-interval-multiplier 1

# Fil overføringsinnstillinger
set ftp:use-feat yes
set ftp:use-mdtm yes
set ftp:use-size yes

# Last opp .htaccess først
put -O $FTP_REMOTE_DIR fixed_htaccess.txt -o .htaccess

# Last opp dist-mappen (med mindre parallelitet for mer pålitelighet)
mirror -R dist/ $FTP_REMOTE_DIR --parallel=3 --only-newer --no-perms

# Avslutt
bye
EOF

    echo -e "${YELLOW}Laster opp alle filer...${NC}"
    lftp -f fix-upload.lftp
else
    # Kun kritiske filer
    cat > fix-critical.lftp << EOF
# Start med å åpne tilkoblingen
open -u $FTP_USER,$FTP_PASS $FTP_HOST

# Debug-modus for å se alle kommandoer
debug 3

# SSL/TLS-innstillinger
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:ssl-force no
set ftp:passive-mode yes

# Last opp .htaccess
put -O $FTP_REMOTE_DIR fixed_htaccess.txt -o .htaccess

# Last opp index.html
put -O $FTP_REMOTE_DIR dist/index.html

# Avslutt
bye
EOF

    echo -e "${YELLOW}Laster opp kritiske filer...${NC}"
    lftp -f fix-critical.lftp
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Opplasting fullført!${NC}"
else
    echo -e "${RED}✗ Opplasting feilet.${NC}"
    
    echo -e "${YELLOW}Prøver alternativ metode med curl...${NC}"
    
    # Last opp .htaccess med curl
    echo -e "${YELLOW}Laster opp .htaccess via curl...${NC}"
    curl -v -T fixed_htaccess.txt --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/.htaccess"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ .htaccess lastet opp via curl.${NC}"
        
        # Last opp index.html med curl
        echo -e "${YELLOW}Laster opp index.html via curl...${NC}"
        curl -v -T dist/index.html --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_REMOTE_DIR/index.html"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ index.html lastet opp via curl.${NC}"
        else
            echo -e "${RED}✗ Kunne ikke laste opp index.html via curl.${NC}"
        fi
    else
        echo -e "${RED}✗ Kunne ikke laste opp .htaccess via curl.${NC}"
    fi
fi

# STEG 7: Verifiser at nettsiden fungerer
echo
echo -e "${YELLOW}STEG 7: Verifiserer at nettsiden fungerer...${NC}"
echo -e "${YELLOW}Venter 30 sekunder for at endringene skal tre i kraft...${NC}"
sleep 30

echo -e "${YELLOW}Kontrollerer nettsiden...${NC}"
HTTP_CODE_AFTER=$(curl -s -o /dev/null -w "%{http_code}" https://www.snakkaz.com)
echo -e "HTTP-statuskode etter fiksing: ${CYAN}$HTTP_CODE_AFTER${NC}"

if [ "$HTTP_CODE_AFTER" == "200" ]; then
    echo -e "${GREEN}Gratulerer! Nettsiden er nå tilgjengelig med HTTP 200 OK.${NC}"
elif [ "$HTTP_CODE_AFTER" != "$HTTP_CODE" ]; then
    echo -e "${YELLOW}Status har endret seg fra $HTTP_CODE til $HTTP_CODE_AFTER.${NC}"
    echo -e "${YELLOW}Det kan hende at endringene trenger mer tid for å tre i kraft.${NC}"
else
    echo -e "${YELLOW}Statuskoden er fortsatt $HTTP_CODE_AFTER.${NC}"
    echo -e "${YELLOW}Mulig at endringene trenger mer tid for å tre i kraft, eller at det er andre problemer.${NC}"
fi

# Oppsummering
echo
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    OPPSUMMERING                           ${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Følgende handlinger ble utført:${NC}"
echo "1. Diagnostisert nettsidetilstand (HTTP-kode: $HTTP_CODE)"
echo "2. Sjekket mappestruktur på serveren"
if [ "$NEED_BUILD" = true ]; then
    echo "3. Bygget prosjektet på nytt"
fi
echo "4. Opprettet en oppdatert .htaccess-fil"
if [[ $upload_choice == "full" ]]; then
    echo "5. Lastet opp alle filer til serveren"
else
    echo "5. Lastet opp kritiske filer (.htaccess og index.html)"
fi
echo "6. Verifisert nettsidetilstand etter fikser (HTTP-kode: $HTTP_CODE_AFTER)"

echo
echo -e "${YELLOW}NESTE STEG:${NC}"
echo "1. Åpne https://www.snakkaz.com i nettleseren og verifiser funksjonaliteten"
echo "2. Hvis nettsiden fortsatt viser 404, vent noen minutter og prøv igjen"
echo "3. Sjekk også om det er noen caching-problemer i nettleseren (prøv privat nettleservindu)"
echo "4. Hvis problemene vedvarer, kontakt Namecheap support for å verifisere webserverfunksjoner"

echo
echo -e "${GREEN}Skript fullført!${NC}"
