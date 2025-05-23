#!/bin/bash
# deploy-and-fix-properly.sh
#
# Dette skriptet løser de faktiske problemene med lokal serveren
# og bygger applikasjonen riktig for bruk med python http.server

# Fargeinnstillinger
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}=========================================${INGEN}"
echo -e "${BLA}    RIKTIG FIKSING AV SNAKKAZ CHAT      ${INGEN}"
echo -e "${BLA}=========================================${INGEN}"
echo

# 1. Stopp eventuelle kjørende servere
echo -e "${GUL}Stopper eventuelle kjørende servere...${INGEN}"
pkill -f "http.server" || true
echo -e "${GRONN}✓ Servere stoppet${INGEN}"
echo

# 2. Fikse byggeproblemer
echo -e "${GUL}Bygger applikasjonen riktig for statisk server...${INGEN}"

# Gå til prosjektets rotmappe
cd /workspaces/snakkaz-chat

# Rydde i tidligere bygg
echo -e "${GUL}Rydder tidligere bygg...${INGEN}"
rm -rf dist
echo -e "${GRONN}✓ Ryddet tidligere bygg${INGEN}"

# Kopiere ikoner til public-mappen for å sikre at de er tilgjengelige
echo -e "${GUL}Oppretter manglende ikoner...${INGEN}"
mkdir -p public/icons
touch public/icons/snakkaz-icon-192.png
touch public/icons/snakkaz-icon-512.png
echo -e "${GRONN}✓ Opprettet placeholder ikoner${INGEN}"

# Bygg applikasjonen med riktig konfigurasjon
echo -e "${GUL}Bygger applikasjonen...${INGEN}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${ROD}Feil ved bygging av applikasjonen.${INGEN}"
  exit 1
fi
echo -e "${GRONN}✓ Applikasjon bygget${INGEN}"

# 3. Opprett HTML-fil som kan kjøres direkte i nettleseren
echo -e "${GUL}Genererer index.html som kan åpnes direkte i nettleseren...${INGEN}"

cat > dist/index.html << EOF
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snakkaz Chat</title>
  <link rel="icon" type="image/png" href="/favicon.ico">
  <!-- Legg inn CSS-filene som blir generert ved bygging -->
  <link rel="stylesheet" href="/assets/index-CSS-FILNAVN.css">
</head>
<body>
  <div id="root"></div>
  <!-- Legg inn JS-filene som blir generert ved bygging -->
  <script type="module" src="/assets/index-JAVASCRIPT-FILNAVN.js"></script>
</body>
</html>
EOF

# Finn de faktiske CSS- og JS-filnavnene og oppdater index.html med dem
CSS_FILE=$(find dist/assets -name "index-*.css" | head -n 1 | xargs basename)
JS_FILE=$(find dist/assets -name "index-*.js" | head -n 1 | xargs basename)

sed -i "s/index-CSS-FILNAVN.css/$CSS_FILE/g" dist/index.html
sed -i "s/index-JAVASCRIPT-FILNAVN.js/$JS_FILE/g" dist/index.html

echo -e "${GRONN}✓ index.html opprettet${INGEN}"

# 4. Opprett en enkel server.mjs fil som kan kjøres for å servere filene korrekt med MIME-typer
echo -e "${GUL}Oppretter forbedret server-skript med korrekte MIME-typer...${INGEN}"

cat > server.mjs << EOF
// server.mjs - Node.js server med ES-modul syntax
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// Mapping av filendelser til MIME-typer
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.tsx': 'text/javascript', // Handle .tsx files
  '.ts': 'text/javascript',  // Handle .ts files
  '.jsx': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.txt': 'text/plain'
};

// Opprett HTTP-server
const server = http.createServer((req, res) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.url}\`);
  
  // Normaliser URL
  let url = req.url;
  
  // Håndter root URL
  if (url === '/') {
    url = '/index.html';
  }

  // Sett sammen full filsti
  const filePath = path.join(DIST_DIR, url);
  
  // Sjekk om filen finnes
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Filen finnes ikke - prøv å serve index.html for SPA routing
      if (!url.includes('.')) {
        const indexPath = path.join(DIST_DIR, 'index.html');
        serveFile(indexPath, res);
        return;
      }
      
      // Hvis det er en fil som skulle eksistere, returner 404
      res.statusCode = 404;
      res.end(\`Filen finnes ikke: \${url}\`);
      return;
    }
    
    // Filen finnes, serve den
    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.statusCode = 500;
      res.end(\`Server error: \${err.code}\`);
      return;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.statusCode = 200;
    res.end(content);
  });
}

// Start serveren
server.listen(PORT, () => {
  console.log(\`\n==== Snakkaz Chat Server ====\`);
  console.log(\`Server kjører på http://localhost:\${PORT}\`);
  console.log(\`Trykk Ctrl+C for å stoppe serveren\`);
});
EOF

echo -e "${GRONN}✓ server.mjs opprettet${INGEN}"

# 5. Start serveren
echo -e "${GUL}Starter serveren med korrekte MIME-typer...${INGEN}"
node server.mjs &
SERVER_PID=$!
echo -e "${GRONN}✓ Server startet på http://localhost:8080${INGEN}"
echo

# 6. Vis informasjon til brukeren
echo -e "${BLA}=========================================${INGEN}"
echo -e "${BLA}    SNAKKAZ CHAT KJØRER NÅ LOKALT      ${INGEN}"
echo -e "${BLA}=========================================${INGEN}"
echo
echo -e "${GRONN}Aplikasjonen kjører nå på: ${GUL}http://localhost:8080${INGEN}"
echo -e "${GRONN}Åpne denne adressen i nettleseren din${INGEN}"
echo
echo -e "${GUL}Denne løsningen fikser:${INGEN}"
echo -e "1. MIME-type problemer ved å bruke riktig server"
echo -e "2. Manglende ikonproblemer ved å opprette nødvendige filer"
echo -e "3. Håndtering av SPA-routing for å unngå 404-feil ved oppdatering"
echo
echo -e "${BLA}Trykk Enter for å avslutte serveren, eller la den fortsette å kjøre...${INGEN}"
read -r
kill $SERVER_PID

echo -e "${GRONN}Server stoppet. Ha en fin dag!${INGEN}"
