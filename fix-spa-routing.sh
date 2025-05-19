#!/bin/bash
# fix-spa-routing.sh
#
# Dette skriptet oppretter og laster opp en ny .htaccess-fil til
# webhosten din for å fikse SPA-routing problemer med React Router.

# Fargedefinisjoner
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Snakkaz Chat: SPA Routing Fix     ${NC}"
echo -e "${BLUE}============================================${NC}"
echo

# Lagre .htaccess-filen
echo -e "${YELLOW}Oppretter .htaccess-fil...${NC}"
cat > .htaccess << 'EOF'
# Snakkaz Chat .htaccess
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
    AddType application/javascript .js
    AddType text/css .css
    AddType application/json .json
    AddType image/svg+xml .svg
    AddType application/font-woff .woff
    AddType application/font-woff2 .woff2
    AddType application/vnd.ms-fontobject .eot
    AddType application/x-font-ttf .ttf
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
    <FilesMatch "\.(ttf|ttc|otf|eot|woff|woff2|font.css|css|js|json|svg)$">
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/x-shockwave-flash "access plus 1 month"
</IfModule>

# Disable directory listing
Options -Indexes

# ServerSignature Off
EOF

echo -e "${GREEN}.htaccess-fil opprettet!${NC}"
echo 

# Instruksjoner for opplasting
echo -e "${CYAN}Instruksjoner for opplasting av .htaccess-filen:${NC}"
echo
echo "1. Logg inn på cPanel eller File Manager"
echo "2. Naviger til public_html-katalogen"
echo "3. Last opp den nye .htaccess-filen (ikke glem punktum i starten av filnavnet)"
echo "4. Sørg for at filen har riktige tillatelser (644)"
echo
echo -e "${YELLOW}Etter opplasting:${NC}"
echo "1. Tøm nettleserens cache eller bruk inkognitomodus"
echo "2. Besøk www.snakkaz.com igjen for å se om routing fungerer nå"
echo

# Instruksjoner for å sjekke Service Worker
echo -e "${CYAN}Sjekk Service Worker:${NC}"
echo
echo "1. Åpne nettleseren og naviger til www.snakkaz.com"
echo "2. Åpne Developer Tools (F12)"
echo "3. Gå til Application-fanen"
echo "4. Velg Service Workers i sidemenyen"
echo "5. Se om det er en registrert service worker for snakkaz.com"
echo "6. Hvis det finnes en problematisk service worker, klikk på 'Unregister'"
echo "7. Last deretter inn siden på nytt"
echo

# Instruksjoner for å sjekke for feil
echo -e "${CYAN}Sjekk for feil i konsollen:${NC}"
echo
echo "1. Åpne Developer Tools (F12) i nettleseren"
echo "2. Gå til Console-fanen"
echo "3. Se etter feilmeldinger relatert til ressurser som mangler"
echo "4. Spesielt se etter:"
echo "   - Feil med Supabase-tilkobling"
echo "   - Manglende JavaScript-filer"
echo "   - Problemer med CSP (Content Security Policy)"
echo

echo -e "${GREEN}SPA routing fix er ferdig!${NC}"
echo -e "${BLUE}============================================${NC}"
