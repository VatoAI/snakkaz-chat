#!/bin/bash

echo "🚨 SNAKKAZ EMERGENCY FIX - SYSTEMATISK CLEANUP"
echo "=============================================="

# STEG 1: STOPP ALLE KONFLIKTER (UNNTATT VS CODE/MCP)
echo "🛑 Stopper problemområder..."

# Stopp Next.js (den som bruker 1.6GB RAM!)
if pgrep -f "next-server" > /dev/null; then
    echo "  → Stopper Next.js server..."
    pkill -f "next-server"
    sleep 2
fi

# Stopp Vite (forsiktig)
if pgrep -f "vite" > /dev/null; then
    echo "  → Stopper Vite..."
    pkill -f "vite"
    sleep 2
fi

# STEG 2: ANALYSER STRUKTUR
echo ""
echo "📁 MAPPESTRUKTUR ANALYSE:"
echo "========================"

echo "Hovedmappen inneholder:"
ls -la /workspaces/snakkaz-chat/ | grep "^d" | wc -l
echo " → $(ls -la /workspaces/snakkaz-chat/ | grep "^d" | wc -l) mapper"

echo "TestSprite-new mappen:"
if [ -d "/workspaces/snakkaz-chat/testsprite-new" ]; then
    echo " → ✅ TestSprite-new eksisterer"
    ls -la /workspaces/snakkaz-chat/testsprite-new/src/
else
    echo " → ❌ TestSprite-new mangler!"
fi

echo "Snakkaz-live mappen:"
if [ -d "/workspaces/snakkaz-chat/snakkaz-live" ]; then
    echo " → ✅ Snakkaz-live eksisterer"
else
    echo " → ❌ Snakkaz-live mangler!"
fi

# STEG 3: FINN API ENDPOINTS
echo ""
echo "🔍 SØKER ETTER API ENDPOINTS:"
echo "============================="

echo "Supabase config:"
find /workspaces/snakkaz-chat -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs grep -l "supabase" 2>/dev/null | head -5

echo ""
echo "TestSprite config:"
find /workspaces/snakkaz-chat -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs grep -l "testsprite\|TestSprite" 2>/dev/null | head -5

# STEG 4: PORTER I BRUK
echo ""
echo "🌐 PORTER I BRUK:"
echo "=================="
netstat -tlnp 2>/dev/null | grep LISTEN | grep -E ":(3000|4000|5000|8080|8000)" || echo "Ingen konflikter funnet"

echo ""
echo "✅ Diagnose ferdig!"
echo "💡 Kjør fix-snakkaz-structure.sh for å fikse struktur"
