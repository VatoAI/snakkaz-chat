#!/bin/bash
# 🚀 SNAKKAZ CRITICAL FIXES - Action Plan
# Prioriterte fixes for produksjon og cleanup

echo "🚀 SNAKKAZ CRITICAL FIXES STARTER..."
echo "=================================="

cd /workspaces/snakkaz-chat

# 1. CHECK CURRENT PRODUCTION ISSUE
echo ""
echo "🔍 FASE 1: Analyse av produksjons MIME issue..."

echo "Sjekker dist/ build status:"
if [ -d "dist" ]; then
    echo "✅ dist/ folder exists"
    echo "📊 Antall JS bundles: $(find dist -name "*.js" | wc -l)"
    echo "📊 Main bundles:"
    ls -la dist/*.js 2>/dev/null | head -5
else
    echo "❌ dist/ folder mangler - må bygge først!"
fi

echo ""
echo "Sjekker .htaccess konfigurasjon:"
if [ -f ".htaccess" ]; then
    echo "✅ .htaccess exists"
    echo "📋 Content-Type regler:"
    grep -i "content-type\|addtype\|mime" .htaccess 2>/dev/null || echo "⚠️ Ingen MIME regler funnet"
else
    echo "❌ .htaccess mangler"
fi

# 2. KODE ANALYSE
echo ""
echo "🔍 FASE 2: Kode duplikat analyse..."

echo "🔍 Søker etter duplicate komponenter:"
echo "ChatInterface varianter:"
find src -name "*ChatInterface*" -type f
echo ""
echo "ChatPage varianter:"
find src -name "*ChatPage*" -type f
echo ""
echo "Message komponenter:"
find src -name "*Message*" -type f | head -10

# 3. MCP STATUS  
echo ""
echo "🔍 FASE 3: MCP integrasjon status..."

echo "MCP filer som skal uploades:"
if [ -f "mcp-integration-simple.js" ]; then
    echo "✅ mcp-integration-simple.js ($(wc -c < mcp-integration-simple.js) bytes)"
else
    echo "❌ mcp-integration-simple.js mangler"
fi

if [ -d "MCP SnakkaZ" ]; then
    echo "✅ MCP SnakkaZ server directory exists"
    if [ -f "MCP SnakkaZ/dist/server.js" ]; then
        echo "✅ Compiled MCP server ready"
    else
        echo "⚠️ MCP server needs compilation"
    fi
else
    echo "❌ MCP SnakkaZ directory mangler"
fi

echo ""
echo "VS Code MCP konfigurasjon:"
if [ -f ".vscode/settings.json" ]; then
    echo "✅ VS Code settings.json exists"
    grep -q "mcp.servers" .vscode/settings.json && echo "✅ MCP server configured" || echo "⚠️ MCP not configured"
else
    echo "❌ VS Code settings mangler"
fi

# 4. BUNDLE OPTIMALISERING
echo ""
echo "🔍 FASE 4: Bundle analyse..."

if [ -d "dist" ]; then
    echo "📊 Bundle størrelse (top 10):"
    find dist -name "*.js" -exec ls -lh {} \; | sort -hr -k5 | head -10
    
    echo ""
    echo "📊 Total bundle størrelse:"
    du -sh dist/ 2>/dev/null || echo "Kunne ikke beregne størrelse"
fi

# 5. RECOMMENDATIONS
echo ""
echo "🎯 RECOMMENDATIONS:"
echo "==================="
echo ""
echo "🔴 KRITISK (må fixes først):"
echo "1. Fix .htaccess for proper MIME types"
echo "2. Test production module loading"
echo "3. Upload MCP files til mcp.snakkaz.com/integration/"
echo ""
echo "🟡 VIKTIG (bør fixes snart):"
echo "1. Konsolider ChatInterface variants"
echo "2. Fjern unused ChatPage files"
echo "3. Optimaliser bundle størrelse"
echo ""
echo "🟢 OPTIMALISERING (når tid):"
echo "1. Code cleanup & linting"
echo "2. Performance monitoring"
echo "3. Test coverage"

echo ""
echo "✅ CRITICAL FIXES ANALYSE FULLFØRT!"
echo "=================================="
