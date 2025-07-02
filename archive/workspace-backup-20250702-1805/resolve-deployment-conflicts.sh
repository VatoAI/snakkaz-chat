#!/bin/bash

# ================================================
# SNAKKAZ DEPLOYMENT CONFLICT RESOLVER
# Juni 14, 2025 - VatoAI
# ================================================

echo "🔧 LØSER DEPLOYMENT-KONFLIKTER"
echo "================================"

# 1. Stopp alle lokale Supabase preview-systemer
echo "🛑 Stopper Supabase preview-systemer..."
if pgrep -f "supabase" > /dev/null; then
    echo "  - Stopper aktive Supabase prosesser..."
    pkill -f "supabase" 2>/dev/null || true
    sleep 2
fi

# 2. Deaktiver lokale dev-servere som kan konflikte
echo "🛑 Stopper konfliktskapende dev-servere..."
if pgrep -f "vite.*dev\|vite.*preview" > /dev/null; then
    echo "  - Stopper Vite dev/preview servere..."
    pkill -f "vite.*dev\|vite.*preview" 2>/dev/null || true
fi

# 3. Rens deployment-cacher
echo "🧹 Renser deployment-cacher..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .vite 2>/dev/null || true

# 4. Sikre at riktig miljøvariabler er satt
echo "🔧 Setter produksjonsmiljø..."
export NODE_ENV=production
export VITE_SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
export VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8

# 5. Stopp gamle deployment-prosesser
echo "🛑 Stopper gamle FTP deployment-prosesser..."
if pgrep -f "lftp" > /dev/null; then
    echo "  - Stopper aktive LFTP-prosesser..."
    pkill -f "lftp" 2>/dev/null || true
    sleep 2
fi

# 6. Rens dist-mappen helt
echo "🧹 Renser dist-mappen..."
rm -rf dist

# 7. Lag ny byggeprosess med riktig konfigurasjon
echo "🏗️ Bygger med korrigert konfigurasjon..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Bygget vellykket!"
    
    # 8. Verifiser at React-bundles er riktig
    echo "🔍 Verifiserer React-bundle konfigurasjon..."
    
    REACT_CORE=$(ls dist/assets/js/vendor-react-core-*.js 2>/dev/null | head -1)
    VENDOR_MISC=$(ls dist/assets/js/vendor-misc-*.js 2>/dev/null | head -1)
    
    if [ -f "$REACT_CORE" ] && [ -f "$VENDOR_MISC" ]; then
        echo "✅ React bundles funnet"
        
        # Sjekk at use-sync-external-store er i riktig bundle
        if grep -q "useSyncExternalStore\|use.*external.*store" "$REACT_CORE"; then
            echo "✅ use-sync-external-store i React core bundle"
        else
            echo "❌ use-sync-external-store mangler i React core"
            exit 1
        fi
        
        if grep -q "useSyncExternalStore\|use.*external.*store" "$VENDOR_MISC"; then
            echo "❌ use-sync-external-store feil i vendor-misc"
            exit 1
        else
            echo "✅ use-sync-external-store ikke i vendor-misc"
        fi
    else
        echo "❌ React bundles mangler"
        exit 1
    fi
    
    echo ""
    echo "🎉 KONFLIKTER LØST - KLAR FOR DEPLOYMENT!"
    echo "========================================"
    echo "✅ Alle preview-systemer stoppet"
    echo "✅ Cacher renset"
    echo "✅ Produksjonsmiljø satt"
    echo "✅ React dependencies korrekt bundlet"
    echo "✅ Klar for deployment via GitHub Actions"
    echo ""
    echo "🚀 Neste steg: git push til main for automatisk deployment"
    
else
    echo "❌ Bygget feilet!"
    exit 1
fi
