#!/bin/bash

echo "=== FINAL REACT ERROR VERIFICATION ==="
echo "$(date): Starting comprehensive verification of React error fixes"

# Check current bundle state
echo -e "\n🔍 Checking current bundle structure..."
ls -la dist/assets/js/ | grep vendor | head -10

# Verify loading order in HTML
echo -e "\n📄 Checking HTML modulepreload order..."
grep -n "modulepreload" dist/index.html | head -5

# Check if React is in vendor-react-core
echo -e "\n🧪 Verifying React is in vendor-react-core..."
if head -20 dist/assets/js/vendor-react-core-*.js | grep -q "function.*React\|var.*React"; then
    echo "✅ React found in vendor-react-core bundle"
else
    echo "❌ React NOT found in vendor-react-core bundle"
fi

# Check if vendor-misc correctly imports React
echo -e "\n🔗 Checking vendor-misc React import..."
if head -20 dist/assets/js/vendor-misc-*.js | grep -q "import.*r.*from.*vendor-react-core"; then
    echo "✅ vendor-misc correctly imports React from vendor-react-core"
else
    echo "❌ vendor-misc does NOT import React correctly"
fi

# Verify reactStateFixV5 exists
echo -e "\n🛠️ Checking React state fix..."
if [ -f "src/utils/reactStateFixV5.ts" ]; then
    echo "✅ reactStateFixV5.ts exists"
    if grep -q "useMergeRef" src/utils/reactStateFixV5.ts; then
        echo "✅ useMergeRef polyfill found in state fix"
    else
        echo "⚠️ useMergeRef polyfill not found"
    fi
else
    echo "❌ reactStateFixV5.ts not found"
fi

# Check main.tsx imports reactStateFixV5 first
echo -e "\n🚀 Checking main.tsx import order..."
if head -10 src/main.tsx | grep -q "reactStateFixV5"; then
    echo "✅ reactStateFixV5 imported first in main.tsx"
else
    echo "❌ reactStateFixV5 NOT imported first in main.tsx"
fi

# Verify vite.config.ts has correct chunking
echo -e "\n⚙️ Checking Vite config chunking..."
if grep -q "vendor-react-core.*react.*react-dom" vite.config.ts; then
    echo "✅ React chunking configured correctly"
else
    echo "❌ React chunking not configured correctly"
fi

if grep -q "@radix-ui.*vendor-react-core" vite.config.ts; then
    echo "✅ Radix UI bundled with React core"
else
    echo "❌ Radix UI not bundled with React core"
fi

# Check bundle sizes
echo -e "\n📊 Bundle sizes:"
ls -lh dist/assets/js/vendor-react-core-*.js | awk '{print "React Core: " $5}'
ls -lh dist/assets/js/vendor-misc-*.js | awk '{print "Misc: " $5}'
ls -lh dist/assets/js/index-*.js | awk '{print "Main: " $5}'

# Deploy and check status
echo -e "\n🚀 Deploying with emergency FTP..."
if lftp -f emergency-react-bundle-deploy.lftp; then
    echo "✅ Deployment successful"
else
    echo "❌ Deployment failed"
fi

# Wait a moment for deployment
sleep 3

# Check production
echo -e "\n🌐 Checking live site..."
if curl -s "https://snakkaz.com" | grep -q "vendor-react-core.*\.js"; then
    echo "✅ React core bundle is live"
else
    echo "❌ React core bundle not detected on live site"
fi

echo -e "\n=== VERIFICATION COMPLETE ==="
echo "Please check https://snakkaz.com in your browser to verify the fixes."
echo "Look for React errors in the browser console."
