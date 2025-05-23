#!/bin/bash
# check-mime-types.sh
# Dette skriptet sjekker og fikser MIME-type problemer på serveren

# Fargedefinisjoner
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Ingen farge

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   SJEKK OG FIKS MIME-TYPE PROBLEMER                   ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Sjekk om .htaccess finnes i workspace
echo -e "${YELLOW}Sjekker om .htaccess-fil finnes i workspace...${NC}"
if [ -f ".htaccess" ]; then
    echo -e "${GREEN}✓ .htaccess funnet lokalt${NC}"
    echo -e "${YELLOW}Innhold av .htaccess:${NC}"
    cat .htaccess
else
    echo -e "${YELLOW}Ingen lokal .htaccess funnet. Genererer ny fil med MIME-type definisjoner...${NC}"
    
    # Lag en .htaccess-fil med riktige MIME-typer
    cat > .htaccess << 'EOF'
# Snakkaz .htaccess
# MIME-type konfigurasjoner for korrekt serving av filer

# Aktiver rewriting
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Hvis forespørselen ikke er en fil eller mappe, send til index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Korrekte MIME-typer for JavaScript og CSS
<IfModule mod_mime.c>
  # JavaScript
  AddType application/javascript .js
  AddType application/json .json
  
  # CSS
  AddType text/css .css
  
  # Fonts
  AddType font/ttf .ttf
  AddType font/otf .otf
  AddType font/woff .woff
  AddType font/woff2 .woff2
</IfModule>

# Caching regler
<IfModule mod_expires.c>
  ExpiresActive On
  
  # CSS, JavaScript, og JSON
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/json "access plus 1 year"
  
  # Bilder
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  
  # Fonter
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/otf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Enable CORS for assets
<IfModule mod_headers.c>
  <FilesMatch "\.(js|css|json|ttf|otf|woff|woff2)$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>
EOF
    
    echo -e "${GREEN}✓ Ny .htaccess fil generert${NC}"
fi

echo -e "${YELLOW}Vil du teste eksisterende MIME-type konfigurasjon på serveren? (y/n)${NC}"
read test_mime

if [[ $test_mime == "y" ]]; then
    echo -e "${YELLOW}Sjekker MIME-type konfigurasjon på serveren...${NC}"
    echo -e "${YELLOW}Tester JavaScript MIME-type...${NC}"
    MIME_JS=$(curl -s -I https://www.snakkaz.com/assets/index-DQJNfLon.js | grep -i "content-type")
    echo -e "JavaScript MIME: ${BLUE}$MIME_JS${NC}"
    
    echo -e "${YELLOW}Tester CSS MIME-type...${NC}"
    MIME_CSS=$(curl -s -I https://www.snakkaz.com/assets/index-GRqizV24.css | grep -i "content-type")
    echo -e "CSS MIME: ${BLUE}$MIME_CSS${NC}"
    
    if [[ "$MIME_JS" == *"application/javascript"* || "$MIME_JS" == *"text/javascript"* ]]; then
        echo -e "${GREEN}✓ JavaScript MIME-type er korrekt!${NC}"
    else
        echo -e "${RED}✗ JavaScript MIME-type er feil. Bør være application/javascript eller text/javascript.${NC}"
    fi
    
    if [[ "$MIME_CSS" == *"text/css"* ]]; then
        echo -e "${GREEN}✓ CSS MIME-type er korrekt!${NC}"
    else
        echo -e "${RED}✗ CSS MIME-type er feil. Bør være text/css.${NC}"
    fi
fi

echo -e "${BLUE}======================================================${NC}"
echo -e "${YELLOW}INSTRUKSJONER FOR OPPLASTING AV .HTACCESS:${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "1. Last opp den genererte .htaccess-filen til root av public_html"
echo -e "2. Dette kan gjøres via cPanel File Manager"
echo -e "3. Sørg for at filen har rettigheter 644 (rw-r--r--)"
echo -e "4. Test nettsiden igjen etter opplasting"
echo -e "${BLUE}======================================================${NC}"

echo -e "${YELLOW}Vil du opprette en enkel testfil for å verifisere MIME-typer? (y/n)${NC}"
read create_test

if [[ $create_test == "y" ]]; then
    echo -e "${YELLOW}Oppretter mime-test.html...${NC}"
    
    # Lag en HTML-testside
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
    
    echo -e "${GREEN}✓ mime-test.html opprettet!${NC}"
    echo -e "${YELLOW}Last opp denne filen til public_html og besøk https://www.snakkaz.com/mime-test.html for å teste MIME-typer i nettleseren.${NC}"
fi

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}Ferdig! Følg instruksjonene ovenfor for å fikse MIME-type problemer.${NC}"
echo -e "${BLUE}======================================================${NC}"
