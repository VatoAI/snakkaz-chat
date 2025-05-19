#!/bin/bash
#
# Snakkaz Chat Ytelsesanalyse
# Dette skriptet analyserer Snakkaz Chat-applikasjonen for ytelsesoptimaliseringer
#

echo "🔍 Snakkaz Chat - Ytelsesanalyse 🔍"
echo "===================================="
echo

# Sjekk at vi er i riktig katalog
if [ ! -f "package.json" ]; then
  echo "❌ Feil: Dette skriptet må kjøres fra prosjektets rotkatalog!"
  exit 1
fi

echo "1️⃣ Analyserer bundelstørrelse..."
# Sjekk om vite-bundle-analyzer er installert
if ! npm list --depth=0 | grep -q "vite-bundle-analyzer"; then
  echo "Installerer vite-bundle-analyzer..."
  npm install --save-dev vite-bundle-analyzer
fi

# Lag en midlertidig vite-konfigurasjon for analyse
cat > vite.analyze.config.ts << 'EOF'
import { defineConfig } from 'vite';
import { visualizer } from 'vite-bundle-analyzer';
import { configDefaults } from './vite.config';

export default defineConfig({
  ...configDefaults,
  plugins: [
    ...(configDefaults.plugins || []),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    ...configDefaults.build,
    sourcemap: true,
    outDir: 'dist-analyze',
  },
});
EOF

echo "Bygger applikasjonen med bundle-analyse..."
npm run build -- --config vite.analyze.config.ts

echo
echo "2️⃣ Identifiserer store filer og ubrukte ressurser..."
find src -type f -name "*.{png,jpg,jpeg,gif,svg,webp}" -size +500k | sort -n -r > large-images.txt

if [ -s large-images.txt ]; then
  echo "Store bildefiler funnet som kan trenge optimalisering:"
  cat large-images.txt
else
  echo "Ingen store bildefiler funnet."
fi

echo
echo "3️⃣ Analyserer importutsagn for unødvendige avhengigheter..."
find src -type f -name "*.{ts,tsx,js,jsx}" -exec grep -l "import " {} \; | xargs grep "import " | sort | uniq -c | sort -nr > import-analysis.txt
echo "Topp 10 mest importerte moduler:"
head -n 10 import-analysis.txt

echo
echo "4️⃣ Sjekker efter ubrukte avhengigheter..."
npx depcheck > unused-dependencies.txt
echo "Potensielt ubrukte avhengigheter:"
grep -A 10 "Unused dependencies" unused-dependencies.txt

echo
echo "5️⃣ Analyserer komponentrendering..."
# Opprett en midlertidig fil for analysesporing
cat > src/utils/performance-analysis.ts << 'EOF'
// Midlertidig ytelsesanalyse
export function startPerformanceTracking() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔍 Ytelsesanalyse startet');
    
    // Spore komponentrenderinger
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('was not wrapped in act')) {
        // Ignorer React testing warnings
        return;
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Observer for å spore DOM-endringer
    const observer = new MutationObserver((mutations) => {
      console.log(`🔄 DOM-oppdatering: ${mutations.length} endringer`);
    });
    
    setTimeout(() => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }, 1000);
    
    // Spor nettverkskall
    if (window.fetch) {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const startTime = performance.now();
        console.log(`🌐 Fetch-kall startet: ${args[0]}`);
        
        return originalFetch.apply(window, args).then(response => {
          const endTime = performance.now();
          console.log(`✅ Fetch-kall fullført: ${args[0]} (${(endTime - startTime).toFixed(2)}ms)`);
          return response;
        }).catch(error => {
          const endTime = performance.now();
          console.log(`❌ Fetch-kall feilet: ${args[0]} (${(endTime - startTime).toFixed(2)}ms)`);
          throw error;
        });
      };
    }
    
    // Spor sideytelse
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domComplete - perfData.domLoading;
        
        console.log(`📊 Sideytelse:
- Total lastetid: ${pageLoadTime}ms
- DOM-byggetid: ${domReadyTime}ms
- Backend (server respons): ${perfData.responseEnd - perfData.requestStart}ms
- Frontendparsing: ${perfData.domInteractive - perfData.responseEnd}ms`);
      }, 0);
    });
  }
}
EOF

echo "Ytelsessporing opprettet for utviklingsmodus."

echo
echo "6️⃣ Genererer ytelsesrapport..."
cat > performance-report.md << 'EOF'
# Snakkaz Chat - Ytelsesanalyse

## Analyseverktøy

Denne analysen ble utført med følgende verktøy:
- vite-bundle-analyzer for bundelanalyse
- depcheck for ubrukte avhengigheter
- custom scripts for importanalyse
- Innebygd ytelsesporing for frontendanalyse

## Områder for optimalisering

### 1. Bundelstørrelse
Se `dist-analyze/stats.html` for en visuell representasjon av applikasjonens bundelstørrelse.

### 2. Bildestørrelser
Se `large-images.txt` for en liste over store bildefiler som kan optimaliseres.

### 3. Importmønster
Se `import-analysis.txt` for en analyse av importmønstre i kodebasen.

### 4. Ubrukte avhengigheter
Se `unused-dependencies.txt` for en liste over potensielt ubrukte avhengigheter.

## Anbefalinger

1. **Optimalisere store bildefiler**
   - Bruk moderne bildeformater som WebP
   - Implementer responsive bilder med srcset
   - Vurder lazy loading for bilder under the fold

2. **Redusere bundelstørrelse**
   - Fjern ubrukte avhengigheter
   - Implementer code splitting på rutenivå
   - Vurder lazy loading av tunge komponenter

3. **Forbedre rendereringsytelse**
   - Vurder memoization for tunge komponenter
   - Implementer virtualisering for lange lister
   - Optimaliser re-renderinger med useMemo og useCallback

4. **Optimaliser nettverkskall**
   - Implementer caching av API-kall
   - Vurder å bruke SWR eller React Query for datahåndtering
   - Implementer hensiktsmessig prefetching av data

5. **Forbedre service worker**
   - Optimaliser caching-strategier
   - Implementer bedre offline-støtte
   - Forbedre behandling av nettverksfeil

## Neste steg

1. Implementer anbefalte optimaliseringer
2. Mål ytelse før og etter hver optimalisering
3. Dokumenter forbedringer i ytelseslogg
4. Etabler ytelsesbudsjett for fremtidig utvikling
EOF

echo
echo "✅ Ytelsesanalyse fullført! ✅"
echo
echo "Følgende filer ble generert:"
echo "- vite.analyze.config.ts - Konfigurering for bundelanalyse"
echo "- dist-analyze/stats.html - Visuell bundelanalyse (etter bygg)"
echo "- large-images.txt - Liste over store bildefiler"
echo "- import-analysis.txt - Analyse av importmønster"
echo "- unused-dependencies.txt - Potensielt ubrukte avhengigheter"
echo "- src/utils/performance-analysis.ts - Kode for ytelsesporing"
echo "- performance-report.md - Ytelsesanalyse og anbefalinger"
echo
echo "For å se bundelanalysen, kjør:"
echo "npm run build -- --config vite.analyze.config.ts"
echo "og åpne dist-analyze/stats.html i en nettleser."
