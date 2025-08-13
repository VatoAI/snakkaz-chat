#!/bin/bash

# SnakkaZ Final Design Verification Script
# Confirms spectacular login design is restored

echo "🎨 SNAKKAZ DESIGN VERIFICATION"
echo "=============================="

# Check critical files
echo "📁 Checking critical files..."

if [ -f "/workspaces/snakkaz-chat/src/pages/Login.tsx" ]; then
    echo "✅ Login.tsx - EXISTS"
else
    echo "❌ Login.tsx - MISSING"
fi

if [ -f "/workspaces/snakkaz-chat/src/components/debug/FontDebugTest.tsx" ]; then
    echo "✅ FontDebugTest.tsx - EXISTS"
else
    echo "❌ FontDebugTest.tsx - MISSING"
fi

if [ -f "/workspaces/snakkaz-chat/src/styles/design-system.css" ]; then
    echo "✅ design-system.css - EXISTS"
else
    echo "❌ design-system.css - MISSING"
fi

if [ -f "/workspaces/snakkaz-chat/index.html" ]; then
    echo "✅ index.html - EXISTS"
else
    echo "❌ index.html - MISSING"
fi

echo ""
echo "🔍 Checking Google Fonts import..."
if grep -q "Orbitron" /workspaces/snakkaz-chat/index.html; then
    echo "✅ Orbitron font imported in index.html"
else
    echo "❌ Orbitron font NOT found in index.html"
fi

if grep -q "Space Grotesk" /workspaces/snakkaz-chat/index.html; then
    echo "✅ Space Grotesk font imported in index.html"
else
    echo "❌ Space Grotesk font NOT found in index.html"
fi

echo ""
echo "💎 Checking design system variables..."
if grep -q "--font-display.*Orbitron" /workspaces/snakkaz-chat/src/styles/design-system.css; then
    echo "✅ --font-display variable set to Orbitron"
else
    echo "❌ --font-display variable NOT set correctly"
fi

if grep -q "--font-body.*Space Grotesk" /workspaces/snakkaz-chat/src/styles/design-system.css; then
    echo "✅ --font-body variable set to Space Grotesk"
else
    echo "❌ --font-body variable NOT set correctly"
fi

echo ""
echo "🛡️ Checking CSS protection classes..."
if grep -q "liquid-glass" /workspaces/snakkaz-chat/src/styles/design-system.css; then
    echo "✅ Liquid Glass protection classes present"
else
    echo "❌ Liquid Glass protection classes MISSING"
fi

if grep -q "css-protection-lock" /workspaces/snakkaz-chat/src/styles/design-system.css; then
    echo "✅ CSS protection lock classes present"
else
    echo "❌ CSS protection lock classes MISSING"
fi

echo ""
echo "🚀 Checking Login component..."
if grep -q "protected-auth-container liquid-glass css-protection-lock" /workspaces/snakkaz-chat/src/pages/Login.tsx; then
    echo "✅ Login component has all protection classes"
else
    echo "❌ Login component missing protection classes"
fi

if grep -q "FontDebugTest" /workspaces/snakkaz-chat/src/pages/Login.tsx; then
    echo "✅ FontDebugTest included for diagnostics"
else
    echo "❌ FontDebugTest NOT included"
fi

echo ""
echo "📱 Checking dev server status..."
if pgrep -f "vite.*port 3001" > /dev/null; then
    echo "✅ Dev server is running on port 3001"
else
    echo "❌ Dev server is NOT running"
fi

echo ""
echo "🎯 VERIFICATION COMPLETE!"
echo ""
echo "Navigate to: http://localhost:3001"
echo "Expected: Spectacular Liquid Glass login with Orbitron headers"
echo "Debug: FontDebugTest should show in top-left corner"
echo ""
echo "For mobile testing: Use responsive design mode"
echo "For production: Remove FontDebugTest component"
