#!/bin/bash
# all-in-one-deploy-fix.sh
# Dette skriptet kombinerer alle trinn for å fikse deployment-problemet
# Kjør dette skriptet for en komplett løsning

# Fargedefinisjoner for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   SNAKKAZ KOMPLETT DEPLOY-FIKS                        ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Funksjon for å vente på brukerbekreftelse
wait_for_confirmation() {
    echo -e "${YELLOW}Trykk ENTER for å fortsette...${NC}"
    read
}

# Steg 1: Sjekk om applikasjonen er bygget
echo -e "\n${YELLOW}STEG 1: Sjekker applikasjonen...${NC}"
if [ ! -d "dist/assets" ]; then
    echo -e "${RED}dist/assets-mappen finnes ikke! Bygger applikasjonen...${NC}"
    npm run build
    
    if [ ! -d "dist/assets" ]; then
        echo -e "${RED}Kunne ikke bygge applikasjonen! Vennligst fiks byggfeil først.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ dist/assets-mappen finnes!${NC}"
    echo -e "${YELLOW}Antall filer i assets-mappen: $(find dist/assets -type f | wc -l)${NC}"
fi

# Steg 2: Oppdater .htaccess-filen
echo -e "\n${YELLOW}STEG 2: Oppretter oppdatert .htaccess-fil...${NC}"
cat > .htaccess << 'EOF'
# Snakkaz .htaccess - Oppdatert for å fikse MIME-type problemer
# Oppdatert: 23. mai 2025

# Enable rewriting
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Handle ping endpoints - Return 200 OK instead of 404
    RewriteRule ^(analytics|business|dash|docs)\.snakkaz\.com/ping$ - [R=200,L]
    
    # Handle direct subdomain access (without /ping path)
    RewriteRule ^(analytics|business|dash|docs)\.snakkaz\.com$ - [R=200,L]
    
    # If the requested resource exists as a file or directory, skip rewriting
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-l
    
    # Otherwise, rewrite all requests to the index.html file
    RewriteRule ^ index.html [QSA,L]
</IfModule>

# Set proper MIME types - KRITISK FOR FUNKSJONALITET
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

    # Set headers for ping endpoints to prevent 404s
    <FilesMatch "ping$|index\.json$">
        Header set Access-Control-Allow-Origin "*"
        Header set Content-Type "application/json"
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

# Disable server signature
ServerSignature Off
EOF

echo -e "${GREEN}✓ Ny .htaccess-fil opprettet${NC}"
echo -e "${YELLOW}Denne filen må lastes opp til public_html-mappen på serveren${NC}"

# Steg 3: Pakk assets-filene
echo -e "\n${YELLOW}STEG 3: Pakker assets-filer for enkel opplasting...${NC}"
cd dist
zip -r ../assets.zip assets/
cd ..

if [ -f "assets.zip" ]; then
    echo -e "${GREEN}✓ assets.zip opprettet ($(du -h assets.zip | cut -f1))${NC}"
else
    echo -e "${RED}✗ Kunne ikke opprette assets.zip${NC}"
fi

# Steg 4: Opprett en testfil
echo -e "\n${YELLOW}STEG 4: Oppretter mime-test.html for verifisering...${NC}"
cat > mime-test.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snakkaz MIME Type Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #1a73e8;
        }
        .result {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
        }
        button {
            padding: 8px 16px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Snakkaz MIME Type Test</h1>
    <p>Denne siden tester om dine JavaScript og CSS filer serveres med korrekte MIME-typer.</p>
    
    <button id="testButton">Start Test</button>
    
    <div id="results"></div>
    
    <script>
        document.getElementById('testButton').addEventListener('click', async () => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p>Tester MIME-typer...</p>';
            
            const filesToTest = [
                { url: '/assets/index-DQJNfLon.js', expectedType: 'application/javascript', description: 'JavaScript fil' },
                { url: '/assets/index-GRqizV24.css', expectedType: 'text/css', description: 'CSS fil' }
            ];
            
            let results = '';
            
            for (const file of filesToTest) {
                try {
                    const response = await fetch(file.url, { method: 'HEAD' });
                    const contentType = response.headers.get('content-type');
                    const isCorrect = contentType && contentType.includes(file.expectedType);
                    
                    results += `
                        <div class="result ${isCorrect ? 'success' : 'error'}">
                            <strong>${file.description}:</strong> ${file.url}<br>
                            <strong>Faktisk MIME-type:</strong> ${contentType || 'Ikke funnet'}<br>
                            <strong>Forventet MIME-type:</strong> ${file.expectedType}<br>
                            <strong>Status:</strong> ${isCorrect ? '✓ KORREKT' : '✗ FEIL'}
                        </div>
                    `;
                } catch (error) {
                    results += `
                        <div class="result error">
                            <strong>${file.description}:</strong> ${file.url}<br>
                            <strong>Feil:</strong> ${error.message}<br>
                            <strong>Status:</strong> ✗ KUNNE IKKE TESTE
                        </div>
                    `;
                }
            }
            
            resultsDiv.innerHTML = results;
        });
    </script>
</body>
</html>
EOF
echo -e "${GREEN}✓ mime-test.html opprettet${NC}"

# Steg 5: Opprett sjekkliste for verifisering
echo -e "\n${YELLOW}STEG 5: Oppretter sjekkliste for verifisering...${NC}"
cat > DEPLOYMENT-VERIFICATION.md << 'EOF'
# Sjekkliste for verifisering av Snakkaz-deployment

## Filer å verifisere

- [ ] .htaccess er lastet opp til public_html/
- [ ] assets/ mappen er opprettet under public_html/
- [ ] Alle JavaScript- og CSS-filer er tilgjengelige under assets/

## Verifiser med curl

```bash
# Sjekk om filer er tilgjengelige og har riktig MIME-type
curl -I https://www.snakkaz.com/assets/index-DQJNfLon.js
curl -I https://www.snakkaz.com/assets/index-GRqizV24.css
curl -I https://www.snakkaz.com/assets/Subscription-DWohK-WG.js
```

## Verifiser i nettleseren

1. Besøk https://www.snakkaz.com/mime-test.html
2. Klikk på "Start Test"-knappen
3. Bekreft at begge testene viser "KORREKT"
4. Besøk deretter https://www.snakkaz.com
5. Trykk CTRL+F5 for å tømme buffer
6. Åpne utviklerverktøy (F12)
7. Sjekk at det ikke er noen 404-feil under "Network"-fanen
8. Test at abonnementsfunksjonalitet og andre nye funksjoner fungerer

## Hvis problemer vedvarer

1. Sjekk mappetillatelser på serveren (assets/ skal være 755)
2. Verifiser at alle filer har blitt korrekt ekstrahert fra ZIP-filen
3. Kontakt Namecheap support hvis problemet vedvarer
EOF
echo -e "${GREEN}✓ DEPLOYMENT-VERIFICATION.md opprettet${NC}"

# Oppsummering og neste steg
echo -e "\n${BLUE}======================================================${NC}"
echo -e "${GREEN}Alt er klart for opplasting!${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}NESTE STEG FOR Å FIKSE DEPLOYMENT:${NC}"
echo -e "1. Last opp .htaccess-filen til public_html/ på serveren"
echo -e "2. Last opp assets.zip til public_html/ og ekstraher der"
echo -e "3. Last opp mime-test.html til public_html/ for testing"
echo -e "4. Følg instruksjonene i DEPLOYMENT-VERIFICATION.md\n"

echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}Vil du også prøve FTP-opplasting med curl? (y/n)${NC}"
read try_ftp

if [[ $try_ftp == "y" ]]; then
    echo -e "${YELLOW}Skriv inn FTP-passord:${NC}"
    read -s FTP_PASS
    
    echo -e "${YELLOW}Tester FTP-tilkobling...${NC}"
    FTP_HOST="ftp.snakkaz.com"
    FTP_USER="SnakkaZ@snakkaz.com"
    FTP_DIR="public_html"
    
    # Test om vi kan laste opp .htaccess
    echo -e "${YELLOW}Prøver å laste opp .htaccess...${NC}"
    curl -v -T ".htaccess" "ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/.htaccess"
    
    echo -e "\n${YELLOW}Se resultatet over for å sjekke om FTP fungerer.${NC}"
    echo -e "${YELLOW}Hvis det fungerte, kan du også prøve å laste opp mime-test.html:${NC}"
    echo -e "curl -v -T \"mime-test.html\" \"ftp://${FTP_USER}:${FTP_PASS}@${FTP_HOST}/${FTP_DIR}/mime-test.html\"\n"
fi

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}Ferdig! Følg instruksjonene ovenfor for å fullføre fiksingen.${NC}"
echo -e "${BLUE}======================================================${NC}"
