/**
 * Script for å forberede Snakkaz chat-appen for distribusjon
 * Denne filen kopierer nødvendige filer til dist-mappen og forbereder for lovable.dev hosting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Sjekk om dist-mappen eksisterer
if (!fs.existsSync(distDir)) {
  console.error('Dist-mappen finnes ikke! Kjør "npm run build" først.');
  process.exit(1);
}

// Kopier filer fra public til dist
const publicFiles = [
  '_redirects',
  '_routes.json',
  'robots.txt',
  'sitemap.xml',
  'manifest.json',
  'offline.html'
];

try {
  console.log('Kopierer statiske filer til dist-mappen...');
  
  publicFiles.forEach(file => {
    const sourcePath = path.resolve(rootDir, 'public', file);
    const destPath = path.resolve(distDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Kopierte ${file}`);
    } else {
      console.warn(`⚠️ Fant ikke ${file} i public-mappen`);
    }
  });

  // Opprett en lovable.config.json fil for lovable.dev hosting
  const lovableConfig = {
    "name": "snakkaz-chat",
    "type": "static",
    "routes": {
      "/*": {
        "serve": "index.html",
        "statusCode": 200
      }
    },
    "headers": {
      "/*": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      },
      "/assets/*": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  };

  fs.writeFileSync(
    path.resolve(distDir, 'lovable.config.json'),
    JSON.stringify(lovableConfig, null, 2)
  );
  console.log('✅ Opprettet lovable.config.json');

  console.log('✅ Appen er klar for distribusjon!');
} catch (error) {
  console.error('❌ Feil under klargjøring av distribusjon:', error);
  process.exit(1);
}