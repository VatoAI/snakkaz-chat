#!/bin/bash
# deploy-with-cpanel-api-token.sh
#
# Dette skriptet bruker cPanel API tokens for å deploye Snakkaz Chat
# uten å være avhengig av FTP-protokollen og IP-restriksjoner

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}    SNAKKAZ CHAT: CPANEL API TOKEN DEPLOYMENT        ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Leser inn miljøvariabler fra .env hvis den eksisterer
if [ -f ".env" ]; then
    echo -e "${YELLOW}Leser inn variabler fra .env fil...${NC}"
    source .env
fi

# Sjekk om ENABLE_PREMIUM_EMAIL er satt
if [ -z "$ENABLE_PREMIUM_EMAIL" ]; then
    read -p "Vil du aktivere premium e-postfunksjonen? (ja/nei): " ENABLE_EMAIL
    if [[ "$ENABLE_EMAIL" =~ ^[Jj][Aa]$ ]]; then
        ENABLE_PREMIUM_EMAIL="true"
        echo "ENABLE_PREMIUM_EMAIL=true" >> .env
    else
        ENABLE_PREMIUM_EMAIL="false"
        echo "ENABLE_PREMIUM_EMAIL=false" >> .env
    fi
fi

# Sett opp cPanel API token detaljer
if [ -z "$CPANEL_USERNAME" ] || [ -z "$CPANEL_API_TOKEN" ] || [ -z "$CPANEL_DOMAIN" ]; then
    echo -e "${YELLOW}Trenger cPanel API token detaljer:${NC}"
    read -p "cPanel brukernavn (f.eks. SnakkaZ): " CPANEL_USERNAME
    read -s -p "cPanel API token: " CPANEL_API_TOKEN
    echo
    read -p "cPanel domene (f.eks. premium123.web-hosting.com): " CPANEL_DOMAIN
    read -p "Remote directory (f.eks. public_html): " REMOTE_DIR

    # Lagre til .env for fremtidig bruk
    if [ -f ".env" ]; then
        echo "CPANEL_USERNAME=$CPANEL_USERNAME" >> .env
        echo "CPANEL_API_TOKEN=$CPANEL_API_TOKEN" >> .env
        echo "CPANEL_DOMAIN=$CPANEL_DOMAIN" >> .env
        echo "REMOTE_DIR=$REMOTE_DIR" >> .env
    else
        echo "CPANEL_USERNAME=$CPANEL_USERNAME" > .env
        echo "CPANEL_API_TOKEN=$CPANEL_API_TOKEN" >> .env
        echo "CPANEL_DOMAIN=$CPANEL_DOMAIN" >> .env
        echo "REMOTE_DIR=$REMOTE_DIR" >> .env
    fi
fi

# Verifiser sikkerhetssjiktet for e-post API hvis premium e-post er aktivert
if [ "$ENABLE_PREMIUM_EMAIL" = "true" ]; then
    echo -e "${YELLOW}Verifiserer e-post API sikkerhetssjikt...${NC}"
    
    if [ ! -f "src/middleware/apiSecurityMiddleware.js" ]; then
        echo -e "${RED}ADVARSEL: API sikkerhetssjikt mangler!${NC}"
        echo -e "src/middleware/apiSecurityMiddleware.js ble ikke funnet."
        echo -e "Dette er påkrevd for sikker bruk av cPanel API token."
        read -p "Vil du fortsette likevel? Dette anbefales ikke. (ja/nei): " CONTINUE_UNSECURE
        
        if [[ ! "$CONTINUE_UNSECURE" =~ ^[Jj][Aa]$ ]]; then
            echo -e "${RED}Deployment avbrutt av sikkerhetshensyn.${NC}"
            exit 1
        fi
        
        echo -e "${RED}Fortsetter uten sikkerhetssjikt - IKKE ANBEFALT!${NC}"
    else
        echo -e "${GREEN}✓ API sikkerhetssjikt funnet${NC}"
    fi
    
    # Teste cPanel API token tilgang
    echo -e "${YELLOW}Tester cPanel API token tilgang...${NC}"
    ./test-cpanel-email-api.sh
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}cPanel API token test mislyktes!${NC}"
        read -p "Vil du fortsette likevel? (ja/nei): " CONTINUE_API_ISSUE
        
        if [[ ! "$CONTINUE_API_ISSUE" =~ ^[Jj][Aa]$ ]]; then
            echo -e "${RED}Deployment avbrutt på grunn av API tilgangsproblemer.${NC}"
            exit 1
        fi
    fi
fi

# Sjekk om dist-mappen finnes
if [ ! -d "dist" ]; then
    echo -e "${RED}Feil: dist-mappen mangler! Bygger prosjektet først...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}Bygging feilet. Avbryter.${NC}"
        exit 1
    fi
fi

# Test API token tilkobling
echo -e "${YELLOW}Tester cPanel API token tilkobling...${NC}"

# Test API token ved å liste filer i hjemmekatalogen
TEST_RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
                 "https://$CPANEL_DOMAIN:2083/execute/Fileman/list_files?dir=%2Fhome")

if echo "$TEST_RESPONSE" | grep -q "error"; then
    echo -e "${RED}✗ API token test feilet!${NC}"
    echo "Feilmelding: $(echo "$TEST_RESPONSE" | grep -o '"error":"[^"]*"')"
    echo -e "${YELLOW}Sjekk at API token er gyldig og har riktige tilganger.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ API token test vellykket!${NC}"
fi

# Opprett midlertidig mappe for ZIP-filarbeid
mkdir -p .tmp-deploy

# Lag ZIP fil av dist-innholdet
echo -e "${YELLOW}Pakker dist-mappen til ZIP fil...${NC}"
cd dist
zip -r ../.tmp-deploy/dist.zip .
cd ..

# Last opp ZIP fil via cPanel API
echo -e "${YELLOW}Laster opp ZIP fil via cPanel API...${NC}"

# Steg 1: Last opp ZIP-fil
UPLOAD_RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
                 -F "dir=/$REMOTE_DIR" \
                 -F "file=@.tmp-deploy/dist.zip" \
                 "https://$CPANEL_DOMAIN:2083/execute/Fileman/upload_files")

if echo "$UPLOAD_RESPONSE" | grep -q "errors"; then
    echo -e "${RED}✗ ZIP fil opplastning feilet!${NC}"
    echo "Feilmelding: $(echo "$UPLOAD_RESPONSE" | grep -o '"errors":\[[^]]*\]')"
    rm -rf .tmp-deploy
    exit 1
else
    echo -e "${GREEN}✓ ZIP fil opplastet!${NC}"
fi

# Last opp .htaccess fil separat (viktig for MIME typer)
echo -e "${YELLOW}Laster opp .htaccess fil...${NC}"

# Kontroller at fix-mime-types.htaccess finnes
if [ ! -f "fix-mime-types.htaccess" ]; then
    echo -e "${RED}Feil: fix-mime-types.htaccess fil mangler.${NC}"
    echo -e "${YELLOW}Oppretter standard .htaccess fil...${NC}"
    
    cat > .tmp-deploy/.htaccess << EOF
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Handle SPA routing by redirecting to index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Set correct MIME types
<IfModule mod_mime.c>
  AddType text/css .css
  AddType text/javascript .js
  AddType application/javascript .mjs
  AddType application/json .json
  AddType image/svg+xml .svg
  AddType image/x-icon .ico
  AddType application/font-woff .woff
  AddType application/font-woff2 .woff2
  AddType application/vnd.ms-fontobject .eot
  AddType application/x-font-ttf .ttf
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>
EOF
    
    HTACCESS_FILE=".tmp-deploy/.htaccess"
else
    cp fix-mime-types.htaccess .tmp-deploy/.htaccess
    HTACCESS_FILE=".tmp-deploy/.htaccess"
fi

# Last opp .htaccess fil
HTACCESS_RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
                 -F "dir=/$REMOTE_DIR" \
                 -F "file=@$HTACCESS_FILE" \
                 -F "overwrite=1" \
                 "https://$CPANEL_DOMAIN:2083/execute/Fileman/upload_files")

if echo "$HTACCESS_RESPONSE" | grep -q "errors"; then
    echo -e "${RED}✗ .htaccess fil opplastning feilet!${NC}"
    echo "Feilmelding: $(echo "$HTACCESS_RESPONSE" | grep -o '"errors":\[[^]]*\]')"
else
    echo -e "${GREEN}✓ .htaccess fil opplastet!${NC}"
fi

# Opprette og laste opp extract.php for å pakke ut ZIP filen
echo -e "${YELLOW}Oppretter og laster opp extract.php fil...${NC}"

cat > .tmp-deploy/extract.php << EOF
<?php
// Extraction script for Snakkaz Chat deployment
\$zip = new ZipArchive;
\$res = \$zip->open('dist.zip');
if (\$res === TRUE) {
  echo "Extracting ZIP file...\n";
  // Extract to current directory
  \$zip->extractTo('.');
  \$zip->close();
  echo "✅ Extraction successful! Closing...\n";
  unlink('dist.zip'); // Remove ZIP file after extraction
  unlink('extract.php'); // Self-delete this script for security
} else {
  echo "❌ Failed to extract ZIP file! Error code: \$res\n";
}
?>
EOF

# Last opp extract.php
EXTRACT_RESPONSE=$(curl -s -H "Authorization: cpanel $CPANEL_USERNAME:$CPANEL_API_TOKEN" \
                 -F "dir=/$REMOTE_DIR" \
                 -F "file=@.tmp-deploy/extract.php" \
                 -F "overwrite=1" \
                 "https://$CPANEL_DOMAIN:2083/execute/Fileman/upload_files")

if echo "$EXTRACT_RESPONSE" | grep -q "errors"; then
    echo -e "${RED}✗ extract.php opplastning feilet!${NC}"
    echo "Feilmelding: $(echo "$EXTRACT_RESPONSE" | grep -o '"errors":\[[^]]*\]')"
else
    echo -e "${GREEN}✓ extract.php opplastet!${NC}"
fi

# Kjør extract.php via HTTP
echo -e "${YELLOW}Kjører extract.php for å pakke ut filen på serveren...${NC}"
EXTRACT_RESULT=$(curl -s "https://www.snakkaz.com/extract.php")

echo "$EXTRACT_RESULT"

if echo "$EXTRACT_RESULT" | grep -q "successful"; then
    echo -e "${GREEN}✓ Utpakking vellykket!${NC}"
else
    echo -e "${YELLOW}⚠ Automatisk utpakking kan ha feilet.${NC}"
    echo -e "${YELLOW}Du må kanskje pakke ut ZIP-filen manuelt via cPanel File Manager:${NC}"
    echo "1. Logg inn på cPanel"
    echo "2. Gå til File Manager"
    echo "3. Naviger til $REMOTE_DIR"
    echo "4. Finn 'dist.zip' og velg 'Extract'"
fi

# Rydd opp
rm -rf .tmp-deploy

echo
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}    DEPLOYMENT MED CPANEL API TOKEN FULLFØRT        ${NC}"
echo -e "${GREEN}=====================================================${NC}"

echo
echo -e "${YELLOW}Neste steg:${NC}"
echo "1. Verifiser at nettstedet fungerer på https://www.snakkaz.com"
echo "2. Sjekk at MIME-typene er riktig konfigurert"
echo "3. Test SPA-ruting og at HTTPS-omdirigering fungerer"
echo
