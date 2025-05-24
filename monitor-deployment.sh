#!/bin/bash

# Monitor deployment status for Snakkaz Chat
# This script checks if the latest fixes are working

echo "🔍 Monitoring Snakkaz Chat Deployment Status"
echo "============================================="
echo ""

# Check if the site is accessible
echo "1. Testing site accessibility..."
if curl -s --head https://www.snakkaz.com | head -n 1 | grep -q "200 OK"; then
    echo "✅ Site is accessible"
else
    echo "❌ Site is not accessible"
fi
echo ""

# Check if the extraction script fix is working
echo "2. Testing extraction script..."
EXTRACT_RESULT=$(curl -s "https://www.snakkaz.com/extract.php" 2>/dev/null || echo "Script not found")
echo "Extraction script output:"
echo "$EXTRACT_RESULT"
echo ""

# Check for success patterns
if [[ "$EXTRACT_RESULT" == *"✅ Extraction successful"* || "$EXTRACT_RESULT" == *"DEPLOYMENT COMPLETE"* ]]; then
    echo "✅ Extraction script is working correctly!"
else
    echo "❌ Extraction script issue detected"
fi
echo ""

# Check if Lovable references are gone
echo "3. Checking for Lovable dependencies in deployed site..."
HOMEPAGE_CONTENT=$(curl -s https://www.snakkaz.com/ 2>/dev/null)

if echo "$HOMEPAGE_CONTENT" | grep -q "gpteng\|lovable"; then
    echo "❌ Lovable references still found in deployed site"
    echo "Found references:"
    echo "$HOMEPAGE_CONTENT" | grep -o ".*gpteng.*\|.*lovable.*" | head -3
else
    echo "✅ No Lovable references found in deployed site"
fi
echo ""

# Check build hash
echo "4. Checking build version..."
BUILD_HASH=$(echo "$HOMEPAGE_CONTENT" | grep -o 'assets/index-[a-zA-Z0-9]*\.js' | head -1)
if [ -n "$BUILD_HASH" ]; then
    echo "Current build: $BUILD_HASH"
else
    echo "⚠️ Could not detect build version"
fi
echo ""

# Summary
echo "📊 DEPLOYMENT MONITORING SUMMARY"
echo "================================"
echo "- Site Accessibility: $(curl -s --head https://www.snakkaz.com | head -n 1 | grep -q "200 OK" && echo "✅ OK" || echo "❌ FAIL")"
echo "- Extraction Script: $(if [[ "$EXTRACT_RESULT" == *"✅ Extraction successful"* || "$EXTRACT_RESULT" == *"DEPLOYMENT COMPLETE"* ]]; then echo "✅ OK"; else echo "❌ FAIL"; fi)"
echo "- Lovable Cleanup: $(if echo "$HOMEPAGE_CONTENT" | grep -q "gpteng\|lovable"; then echo "❌ FAIL"; else echo "✅ OK"; fi)"
echo ""

if [[ "$EXTRACT_RESULT" == *"✅ Extraction successful"* || "$EXTRACT_RESULT" == *"DEPLOYMENT COMPLETE"* ]] && ! echo "$HOMEPAGE_CONTENT" | grep -q "gpteng\|lovable"; then
    echo "🎉 ALL FIXES SUCCESSFUL! Deployment is working correctly."
else
    echo "⚠️ Some issues detected. Check the details above."
fi
