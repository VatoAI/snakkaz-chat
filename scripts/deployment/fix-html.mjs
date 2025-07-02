import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

console.log('🔧 Fixing HTML loading order...');

// Extract all modulepreload links
const modulePreloadRegex = /<link rel="modulepreload"[^>]*>/g;
const modulePreloads = html.match(modulePreloadRegex) || [];

console.log(`📦 Found ${modulePreloads.length} modulepreload links`);

// Sort in correct order: React Core -> React DOM -> Misc -> Others
const sortedPreloads = modulePreloads.sort((a, b) => {
  if (a.includes('vendor-react-core')) return -3;
  if (a.includes('vendor-react-dom')) return -2;
  if (a.includes('vendor-misc')) return -1;
  return 0;
});

// Show the order
console.log('📋 Load order:');
sortedPreloads.forEach((preload, index) => {
  const match = preload.match(/href="[^"]*\/([^"\/]+\.js)"/);
  if (match) {
    console.log(`  ${index + 1}. ${match[1]}`);
  }
});

// Remove existing modulepreloads
html = html.replace(modulePreloadRegex, '');

// Insert sorted preloads before main script
const scriptIndex = html.indexOf('<script type="module"');
if (scriptIndex !== -1) {
  const sortedPreloadsStr = sortedPreloads.join('\n    ');
  html = html.slice(0, scriptIndex) + sortedPreloadsStr + '\n    ' + html.slice(scriptIndex);
}

fs.writeFileSync(htmlPath, html);
console.log('✅ HTML loading order fixed');
