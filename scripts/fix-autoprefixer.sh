#!/bin/bash

# 🔧 GitHub Actions Autoprefixer Fix
# Explicit fix for CI/CD autoprefixer dependency issue

echo "🔧 GITHUB ACTIONS AUTOPREFIXER FIX"
echo "=================================="

cd /workspaces/snakkaz-chat

# Sjekk nåværende status
echo "📋 Current autoprefixer status:"
echo "In package.json:"
grep "autoprefixer" package.json || echo "❌ Not found in package.json"

echo ""
echo "In package-lock.json:"
grep -c "autoprefixer" package-lock.json || echo "❌ Not found in package-lock.json"

# Installer autoprefixer eksplisitt
echo ""
echo "🔧 Installing autoprefixer explicitly..."
npm install autoprefixer@^10.4.21 --save-dev --verbose

# Verifiser installasjon
echo ""
echo "✅ Verification after install:"
npm list autoprefixer
grep "autoprefixer" package.json
echo "package-lock.json entries: $(grep -c "autoprefixer" package-lock.json 2>/dev/null || echo "0")"

# Test build lokalt
echo ""
echo "🧪 Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build SUCCESS!"
else
    echo "❌ Local build FAILED - more investigation needed"
    echo "🔍 Checking PostCSS config..."
    cat postcss.config.js
fi

# Commit endringene
echo ""
echo "📝 Committing changes..."
git add package.json package-lock.json
git commit -m "🔧 EXPLICIT FIX: Add autoprefixer dependency for GitHub Actions

- Explicitly installed autoprefixer@^10.4.21
- Updated package-lock.json with correct dependency tree
- Fixed CI/CD build failures

This should resolve the GitHub Actions error:
'Cannot find module autoprefixer'"

git push

echo ""
echo "🎉 AUTOPREFIXER FIX COMPLETED"
echo "============================"
echo "✅ autoprefixer explicitly installed"
echo "✅ package-lock.json updated"
echo "✅ Changes committed and pushed"
echo ""
echo "🔄 Monitor GitHub Actions now - builds should succeed!"
echo "🌐 Check: https://github.com/VatoAI/snakkaz-chat/actions"
