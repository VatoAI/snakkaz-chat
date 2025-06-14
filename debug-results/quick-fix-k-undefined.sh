#!/bin/bash
echo "🔧 Quick fix for 'K is undefined' error"

# 1. Clean rebuild with better source maps
echo "1. Cleaning and rebuilding..."
rm -rf dist/
npm run build:analyze

# 2. Update source map handling in Vite config
echo "2. Checking Vite config..."
if grep -q "sourcemap: true" vite.config.ts; then
    echo "✅ Source maps enabled"
else
    echo "❌ Source maps might need enabling"
fi

# 3. Check if rebuild fixed the issue
if [ -f "dist/assets/js/vendor-misc-*.js" ]; then
    echo "3. Checking new build for K undefined..."
    VENDOR_FILE=$(ls dist/assets/js/vendor-misc-*.js | head -1)
    if grep -q "K is undefined" "$VENDOR_FILE"; then
        echo "❌ K undefined still present"
    else
        echo "✅ K undefined issue might be resolved"
    fi
fi

echo "4. Ready to deploy with: npm run deploy"
