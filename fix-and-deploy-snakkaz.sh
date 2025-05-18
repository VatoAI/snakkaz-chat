#!/bin/bash
# fix-and-deploy-snakkaz.sh
#
# Dette skriptet fikser kjente problemer og deployer Snakkaz Chat til Namecheap
# Alt i én enkelt operasjon for å gjøre det enkelt og effektivt

set -e # Avslutt skriptet hvis en kommando feiler

# Fargedefinisjoner
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}======================================================${INGEN}"
echo -e "${BLA}    SNAKKAZ CHAT FIKS & DEPLOY TIL NAMECHEAP         ${INGEN}"
echo -e "${BLA}======================================================${INGEN}"
echo

# 1. Stoppe eventuelle kjørende prosesser
echo -e "${GUL}Stopper eventuelle kjørende servere...${INGEN}"
pkill -f "http.server" 2>/dev/null || true
kill $(lsof -t -i:8080) 2>/dev/null || true
echo -e "${GRONN}✓ Servere stoppet${INGEN}"
echo

# 2. Sett opp korrekte miljøvariabler
echo -e "${GUL}Setter opp korrekte miljøvariabler...${INGEN}"

cat > .env << 'EOF'
# Supabase-variabler for Snakkaz Chat applikasjonen
VITE_SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8

# FTP-variabler for Namecheap-opplasting - oppdater med dine faktiske verdier
FTP_HOST=ftp.snakkaz.com
FTP_USER=brukernavn@snakkaz.com
FTP_PASS=passordet_ditt_her
FTP_REMOTE_DIR=public_html
EOF

cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8
EOF

echo -e "${GRONN}✓ Miljøvariabler satt opp${INGEN}"
echo

# 3. Installer manglende avhengigheter (om nødvendig)
echo -e "${GUL}Installerer eller oppdaterer avhengigheter...${INGEN}"
npm install --quiet
echo -e "${GRONN}✓ Avhengigheter oppdatert${INGEN}"
echo

# 4. Opprett server.mjs som vil håndtere alle forespørsler riktig
echo -e "${GUL}Oppretter en robust Node.js-server for produksjon...${INGEN}"

cat > server.mjs << 'EOF'
/**
 * Snakkaz Chat Server
 * 
 * En enkel, men robust Node.js-server for å betjene Snakkaz Chat-appen
 * med riktig mime-type støtte og SPA-routing
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 8080;
const DIST_FOLDER = path.join(__dirname, 'dist');

// MIME types map
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
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
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

/**
 * Determines the MIME type for a given file path
 */
function getMimeType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  return MIME_TYPES[extname] || 'application/octet-stream';
}

/**
 * Create a simple HTTP server
 */
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Parse the URL
  let filePath = req.url;
  
  // Remove query string
  if (filePath.includes('?')) {
    filePath = filePath.split('?')[0];
  }
  
  // Set default file for root requests
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Construct the full file path
  filePath = path.join(DIST_FOLDER, filePath);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // For SPA, serve index.html for routes that don't exist
      if (filePath.endsWith('.html') || 
          !path.extname(filePath) || 
          !MIME_TYPES[path.extname(filePath).toLowerCase()]) {
        filePath = path.join(DIST_FOLDER, 'index.html');
        serveFile(filePath, req, res);
      } else {
        // Send 404 for missing assets
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    } else {
      serveFile(filePath, req, res);
    }
  });
});

/**
 * Serves a file with proper headers
 */
function serveFile(filePath, req, res) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p>The requested resource could not be found.</p>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success - return the file
      res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
      res.end(content);
    }
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving content from: ${DIST_FOLDER}`);
});
EOF

echo -e "${GRONN}✓ Server.mjs opprettet${INGEN}"
echo

# 5. Bygg applikasjonen for produksjon
echo -e "${GUL}Bygger Snakkaz Chat for produksjon...${INGEN}"
npm run build
echo -e "${GRONN}✓ Bygg fullført${INGEN}"
echo

# 6. Oppretter index.php for Namecheap hosting
echo -e "${GUL}Oppretter index.php for Namecheap hosting...${INGEN}"

cat > dist/index.php << 'EOF'
<?php
// PHP-fil for Namecheap-hosting som vil sende alle forespørsler til index.html
include_once('index.html');
EOF

echo -e "${GRONN}✓ PHP-inngang opprettet${INGEN}"
echo

# 7. Oppretter .htaccess for riktig SPA-routing
echo -e "${GUL}Oppretter .htaccess for SPA-routing...${INGEN}"

cat > dist/.htaccess << 'EOF'
# Snakkaz Chat .htaccess
# Konfigurerer SPA-routing og sikkerhet

# Aktiver rewrite-motor
RewriteEngine On

# Omdirigere alle forespørsler til https
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Ikke omdiriger hvis filen eller mappen faktisk eksisterer
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Send alle andre forespørsler til index.html for SPA-routing
RewriteRule ^ index.html [L]

# Aktiver CORS 
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
</IfModule>

# Sikkerhetskonfigurasjoner
<IfModule mod_headers.c>
    # Beskytter mot clickjacking
    Header set X-Frame-Options "SAMEORIGIN"
    
    # Beskytter mot MIME-sniffing
    Header set X-Content-Type-Options "nosniff"
    
    # Beskytter mot XSS
    Header set X-XSS-Protection "1; mode=block"
    
    # Streng transportssikkerhet
    Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Deaktiver directory listing
Options -Indexes

# Ekspirer regler for statiske ressurser
<IfModule mod_expires.c>
  ExpiresActive On
  
  # CSS, JavaScript, bilder og fonter
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  
  # HTML og data-filer
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
</IfModule>
EOF

echo -e "${GRONN}✓ .htaccess opprettet${INGEN}"
echo

# 8. Pakk applikasjonen for enkel opplasting
echo -e "${GUL}Pakker applikasjonen for opplasting...${INGEN}"
cd dist
zip -r ../snakkaz-dist.zip *
cd ..
echo -e "${GRONN}✓ Pakket applikasjonen til snakkaz-dist.zip${INGEN}"
echo

# 9. Opprett en FTP-skript for opplasting til Namecheap
echo -e "${GUL}Oppretter FTP-skript for opplasting...${INGEN}"

cat > upload-to-namecheap.sh << 'EOF'
#!/bin/bash
# FTP-opplasting til Namecheap

# Last inn miljøvariabler
source .env

echo "Laster opp til FTP-server: $FTP_HOST"
echo "Bruker: $FTP_USER"
echo "Mappe: $FTP_REMOTE_DIR"

# Bruk lftp for mer robust FTP-opplasting
if command -v lftp &> /dev/null; then
    lftp -c "
    set ftp:ssl-allow true;
    set ssl:verify-certificate no;
    open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
    mirror -R dist/ $FTP_REMOTE_DIR;
    bye
    "
    echo "Opplasting fullført med lftp!"
else
    # Fallback til ftp-kommandoen
    cd dist
    ftp -n $FTP_HOST << END_FTP
    user $FTP_USER $FTP_PASS
    binary
    prompt off
    cd $FTP_REMOTE_DIR
    mput *
    bye
END_FTP
    echo "Opplasting fullført med standard ftp."
    cd ..
fi
EOF

chmod +x upload-to-namecheap.sh
echo -e "${GRONN}✓ FTP-skript opprettet og gjort kjørbart${INGEN}"
echo

# 10. Informasjon om neste steg
echo -e "${GUL}=== OPPSUMMERING ===${INGEN}"
echo -e "Applikasjonen er nå bygget og klar for opplasting til Namecheap."
echo -e "For å fullføre deploymentet, utfør følgende:"
echo
echo -e "${BLA}1. Oppdater FTP-detaljer i .env-filen med faktiske verdier${INGEN}"
echo -e "${BLA}2. Kjør opplastingsskriptet:${INGEN}"
echo -e "   ${GUL}./upload-to-namecheap.sh${INGEN}"
echo -e "${BLA}3. Sett opp SSL-sertifikater med:${INGEN}"
echo -e "   ${GUL}./setup-ssl-certificates.sh${INGEN}"
echo
echo -e "${GUL}For å teste lokalt før opplasting, kjør:${INGEN}"
echo -e "   ${GUL}node server.mjs${INGEN}"
echo -e "   Åpne deretter http://localhost:8080 i nettleseren"
echo
echo -e "${GRONN}Dine filer er også tilgjengelige i:${INGEN}"
echo -e "1. ${GUL}./dist/${INGEN} - Bygde filer"
echo -e "2. ${GUL}./snakkaz-dist.zip${INGEN} - Komprimert versjon for manuell opplasting via cPanel"
echo
echo -e "${ROD}VIKTIG:${INGEN} Du må sette opp SSL-sertifikater på Namecheap for at appen skal fungere"
echo -e "Se ./setup-ssl-certificates.sh for veiledning om oppsett av SSL-sertifikater"
echo

# Spør om brukeren vil kjøre serveren lokalt
read -p "Vil du kjøre serveren lokalt for testing? (j/n): " run_locally
if [[ $run_locally == "j" || $run_locally == "J" ]]; then
  echo -e "${GUL}Starter lokal server...${INGEN}"
  node server.mjs
else
  echo -e "${GUL}For å kjøre serveren senere, bruk:${INGEN} node server.mjs"
fi
