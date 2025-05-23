const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

// (Fjernet duplisert HTTP-serveropprettelse, Express brukes nedenfor)

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

// Create Express app for API routes
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize payment-subscription connector
require('./src/server/paymentSubscriptionConnector');

// API Routes
app.use('/api/premium/emails', require('./src/server/api/emailRoutes'));
app.use('/api/payments', require('./src/server/api/paymentRoutes'));

// Serve static files using existing handler
app.use(express.static(DIST_DIR));

// For any other GET request, serve index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Create server
const server = http.createServer(app);

// Start serveren
server.listen(PORT, () => {
  console.log(`\n==== Snakkaz Chat Server ====`);
  console.log(`Server kjører på http://localhost:${PORT}`);
  console.log(`API routes tilgjengelig på http://localhost:${PORT}/api/`);
  console.log(`Trykk Ctrl+C for å stoppe serveren`);
});
