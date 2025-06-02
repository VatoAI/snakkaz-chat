// Script for å fikse service-worker.js for å unngå caching av HEAD-forespørsler

const fs = require('fs');
const path = require('path');

// Finn service-worker.js filene
const publicPath = path.join(__dirname, 'public', 'service-worker.js');
const distPath = path.join(__dirname, 'dist', 'service-worker.js');

/**
 * Funksjon for å oppdatere service-worker.js fil
 */
function fixServiceWorker(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Service worker fil ikke funnet: ${filePath}`);
    return false;
  }
  
  console.log(`Fikser service worker på: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fikser caching logikk for å unngå HEAD requests
  const fixedContent = content.replace(
    /caches\.open\(CACHE_NAME\)\.then\(cache => {\s*cache\.put\(event\.request, responseToCache\);/g,
    `caches.open(CACHE_NAME).then(cache => {
        // Skip caching for HEAD requests
        if (event.request.method === 'GET') {
          cache.put(event.request, responseToCache);
        }`
  );
  
  // Lagre den oppdaterte filen
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  console.log(`Service worker oppdatert: ${filePath}`);
  return true;
}

// Oppdater service worker filer
let publicUpdated = fixServiceWorker(publicPath);
let distUpdated = fixServiceWorker(distPath);

if (publicUpdated || distUpdated) {
  console.log('✅ Service worker oppdateringer fullført.');
} else {
  console.log('⚠️ Ingen service worker filer ble oppdatert.');
}

// Sjekk også eventuelle andre kopier av service-worker.js
const potentialOtherLocations = [
  path.join(__dirname, 'dist-analyze', 'service-worker.js')
];

potentialOtherLocations.forEach(location => {
  if (fs.existsSync(location)) {
    fixServiceWorker(location);
  }
});
