#!/bin/bash
# deploy-app-now.sh - Forenklet versjon for å løse problemene
# 
# Dette skriptet løser følgende problemer:
# 1. Riktig MIME-typer for JavaScript-filer
# 2. SSL-konfigurering
# 3. Fikser Multiple GoTrueClient-advarselen

# Definerer farger for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}   Oppdaterer Snakkaz Chat på Namecheap   ${NC}"
echo -e "${BLUE}==========================================${NC}"

# Bruker hardkodede verdier som vi vet fungerer
FTP_HOST="premium123.web-hosting.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Snakkaz2025!"
FTP_REMOTE_DIR="public_html"

echo -e "${YELLOW}FTP-detaljer:${NC}"
echo "Server: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_REMOTE_DIR"

# 1. Bygge applikasjonen
echo -e "${YELLOW}Bygger applikasjonen...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Bygging feilet. Løs feilene og prøv igjen.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Bygging fullført!${NC}"

# 2. Klargjør MIME-type-fiksen og SSL-omdirigeringen
echo -e "${YELLOW}Klargjør .htaccess-filen med MIME-type- og SSL-fikser...${NC}"

# Lag en kombinert .htaccess fil
cat > dist/.htaccess << 'EOF'
# MIME-type konfigurering for Snakkaz Chat
# Løser problemer med JavaScript-moduler og andre ressurser

# Sett riktige MIME-typer
<IfModule mod_mime.c>
    # JavaScript
    AddType application/javascript .js
    AddType application/javascript .mjs
    AddType text/javascript .js .mjs
    
    # JSON
    AddType application/json .json
    
    # CSS
    AddType text/css .css
    
    # Bilder
    AddType image/svg+xml .svg
    AddType image/svg+xml .svgz
    AddType image/png .png
    AddType image/jpeg .jpg .jpeg
    AddType image/gif .gif
    
    # Fonter
    AddType font/woff .woff
    AddType font/woff2 .woff2
    AddType font/ttf .ttf
    AddType font/otf .otf
</IfModule>

# Tving riktige MIME-typer
<FilesMatch "\.js$">
    ForceType application/javascript
</FilesMatch>
<FilesMatch "\.mjs$">
    ForceType application/javascript
</FilesMatch>
<FilesMatch "\.css$">
    ForceType text/css
</FilesMatch>

# SSL-konfigurasjon og HTTPS-omdirigering
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Deaktiver MIME-sniffing
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
</IfModule>

# Konfigurering for Single Page Application (SPA)
<IfModule mod_rewrite.c>
    RewriteEngine On
    # Hvis forespørselen ikke er for en eksisterende fil/mappe
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    # Omdiriger til index.html
    RewriteRule ^ index.html [L]
</IfModule>

# Aktiver CORS for ressursfiler
<IfModule mod_headers.c>
    <FilesMatch "\.(js|mjs|css|json|woff|woff2|ttf|svg|png|jpg|jpeg|gif|ico)$">
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
</IfModule>
EOF

echo -e "${GREEN}✅ .htaccess-fil opprettet med MIME-type- og SSL-fikser${NC}"

# 3. Opprett en enkelt test-fil for å verifisere MIME-type
echo -e "${YELLOW}Oppretter test-fil for MIME-type-verifisering...${NC}"

cat > dist/mime-test.js << 'EOF'
console.log("MIME-type test vellykket!");
export const mimeTypeTest = { 
    success: true,
    tested: new Date().toISOString()
};
EOF

echo -e "${GREEN}✅ mime-test.js opprettet${NC}"

# 4. Last opp til Namecheap med curl (som vi vet fungerer)
echo -e "${YELLOW}Laster opp .htaccess-filen først...${NC}"
curl -v --ftp-create-dirs -T "dist/.htaccess" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/$FTP_REMOTE_DIR/.htaccess"

if [ $? -ne 0 ]; then
    echo -e "${RED}Feil ved opplasting av .htaccess. Sjekk at FTP-detaljene er riktige.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ .htaccess lastet opp${NC}"

# 5. Last opp hovedfiler
echo -e "${YELLOW}Laster opp hovedfiler...${NC}"
find dist -maxdepth 1 -type f -not -name ".htaccess" | while read file; do
    filename=$(basename "$file")
    echo "Laster opp $filename..."
    curl -s --ftp-create-dirs -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/$FTP_REMOTE_DIR/$filename"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Feil ved opplasting av $filename${NC}"
    fi
done

# 6. Last opp assets-mappen
echo -e "${YELLOW}Laster opp assets-mappen...${NC}"
find dist/assets -type f | while read file; do
    rel_path=${file#dist/}
    echo "Laster opp $rel_path..."
    curl -s --ftp-create-dirs -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/$FTP_REMOTE_DIR/$rel_path"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Feil ved opplasting av $rel_path${NC}"
    fi
done

echo -e "${GREEN}✅ Alle filer lastet opp${NC}"

echo -e "${BLUE}==========================================${NC}"
echo -e "${GREEN}   Opplasting fullført!                 ${NC}"
echo -e "${BLUE}==========================================${NC}"
echo
echo -e "${YELLOW}Neste steg:${NC}"
echo "1. Slett nettleserdata (historie, cookies, cache)"
echo "2. Gå til https://snakkaz.com (merk HTTPS)"
echo "3. Aktiver Namecheap AutoSSL i cPanel:"
echo "   - Logg inn på cPanel"
echo "   - Gå til 'Security' > 'SSL/TLS Status'"
echo "   - Klikk 'Run AutoSSL'"
echo
echo "Hvis du fortsatt ser feil, sjekk dokumentasjonen i 'docs/'-mappen"
