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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
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
      res.end(`Filen finnes ikke: ${url}`);
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
      res.end(`Server error: ${err.code}`);
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
  console.log(`\n==== Snakkaz Chat Server ====`);
  console.log(`Server kjører på http://localhost:${PORT}`);
  console.log(`Trykk Ctrl+C for å stoppe serveren`);
});
