#!/bin/bash

# Manual deployment script for React State Fix V4
echo "🚀 Manual deployment of React State Fix V4"
echo "============================================"

# Check if dist folder exists and has recent build
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found. Building first..."
    npm run build
fi

# Check if the new JavaScript file exists
NEW_JS_FILE=$(find dist/assets/js -name "index-*.js" | head -1)
if [ -z "$NEW_JS_FILE" ]; then
    echo "❌ No JavaScript file found in dist/assets/js/"
    exit 1
fi

echo "✅ Found built JavaScript file: $NEW_JS_FILE"

# Check if React State Fix V4 is in the built file
if grep -q "emergencyReactStateFixV4" "$NEW_JS_FILE"; then
    echo "✅ React State Fix V4 detected in built file"
else
    echo "❌ React State Fix V4 NOT found in built file"
    echo "Checking for any react state fix..."
    if grep -q "reactStateFix" "$NEW_JS_FILE"; then
        echo "⚠️  Found some react state fix, but not V4"
    else
        echo "❌ No react state fix found at all"
    fi
fi

# Test the current live site
echo ""
echo "📡 Testing current live site..."
CURRENT_JS=$(curl -s "https://www.snakkaz.com" | grep -o 'src="/assets/js/index-[^"]*\.js"' | sed 's/src="//; s/"//')

if [ -n "$CURRENT_JS" ]; then
    echo "🌐 Current live JavaScript file: $CURRENT_JS"
    
    # Download and check current live file
    echo "🔍 Checking current live file for React State Fix V4..."
    curl -s "https://www.snakkaz.com$CURRENT_JS" | head -1000 | grep -q "emergencyReactStateFixV4" && \
        echo "✅ V4 fix found on live site!" || \
        echo "❌ V4 fix NOT found on live site"
else
    echo "❌ Could not detect current JavaScript file"
fi

echo ""
echo "📊 Summary:"
echo "- Local build file: $(basename "$NEW_JS_FILE")"
echo "- Live site file: $(basename "$CURRENT_JS" 2>/dev/null || echo "unknown")"
echo "- V4 fix in local: $(grep -q "emergencyReactStateFixV4" "$NEW_JS_FILE" && echo "YES" || echo "NO")"
echo "- V4 fix on live: $(curl -s "https://www.snakkaz.com$CURRENT_JS" 2>/dev/null | head -1000 | grep -q "emergencyReactStateFixV4" && echo "YES" || echo "NO")"
