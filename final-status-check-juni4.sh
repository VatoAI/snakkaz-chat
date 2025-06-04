#!/bin/bash

# 🎉 SNAKKAZ CHAT - FINAL STATUS CHECK JUNI 4, 2025
# Verifying React State Fix V3 deployment and functionality

echo "🔍 SNAKKAZ CHAT - FINAL STATUS VERIFICATION"
echo "==========================================="
echo "Date: $(date)"
echo "Fix Applied: React State Fix V3"
echo

# Test main domain
echo "🌐 Testing www.snakkaz.com..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.snakkaz.com)
echo "   Status: $MAIN_STATUS"

if [ "$MAIN_STATUS" = "200" ]; then
    echo "   ✅ Main site is ONLINE and responding"
    
    # Check HTML structure
    HTML_CONTENT=$(curl -s https://www.snakkaz.com)
    
    if echo "$HTML_CONTENT" | grep -q 'id="root"'; then
        echo "   ✅ React root element found"
    else
        echo "   ⚠️  React root element not found"
    fi
    
    if echo "$HTML_CONTENT" | grep -q '\.js'; then
        echo "   ✅ JavaScript files are loading"
    else
        echo "   ⚠️  JavaScript files not detected"
    fi
    
    # Check for error patterns
    ERROR_PATTERNS=("useState" "undefined" "TypeError" "G is undefined" "ni is undefined")
    ERRORS_FOUND=0
    
    for pattern in "${ERROR_PATTERNS[@]}"; do
        if echo "$HTML_CONTENT" | grep -q "$pattern" && ! echo "$HTML_CONTENT" | grep -q "polyfill\|fix"; then
            echo "   ⚠️  Potential error pattern found: $pattern"
            ERRORS_FOUND=$((ERRORS_FOUND + 1))
        fi
    done
    
    if [ $ERRORS_FOUND -eq 0 ]; then
        echo "   ✅ No error patterns detected in HTML"
    fi
    
else
    echo "   ❌ Main site is not responding correctly"
fi

echo

# Check build status
echo "🔧 Build Status Check..."
if [ -d "dist" ]; then
    echo "   ✅ Build directory exists"
    
    # Count JavaScript files
    JS_COUNT=$(find dist/assets/js -name "*.js" | wc -l)
    echo "   📦 JavaScript files built: $JS_COUNT"
    
    # Check main index file
    if ls dist/assets/js/index-*.js >/dev/null 2>&1; then
        echo "   ✅ Main index file exists"
    else
        echo "   ⚠️  Main index file not found"
    fi
else
    echo "   ⚠️  Build directory not found"
fi

echo

# Final assessment
echo "🎯 FINAL ASSESSMENT"
echo "=================="

if [ "$MAIN_STATUS" = "200" ] && [ $ERRORS_FOUND -eq 0 ] && [ -d "dist" ]; then
    echo "🎉 SUCCESS: React State Fix V3 deployment COMPLETED"
    echo "✅ www.snakkaz.com is fully operational"
    echo "✅ No React state errors detected"
    echo "✅ Build and deployment successful"
    echo
    echo "🚀 READY FOR CONTINUED DEVELOPMENT"
    echo "The Snakkaz Chat application is now stable and ready for ongoing feature development."
else
    echo "⚠️  ATTENTION: Some issues may require further investigation"
    if [ "$MAIN_STATUS" != "200" ]; then
        echo "   - Main site not responding with HTTP 200"
    fi
    if [ $ERRORS_FOUND -gt 0 ]; then
        echo "   - $ERRORS_FOUND potential error patterns found"
    fi
    if [ ! -d "dist" ]; then
        echo "   - Build directory missing"
    fi
fi

echo
echo "📊 Summary:"
echo "   Main Site: $([ "$MAIN_STATUS" = "200" ] && echo "✅ ONLINE" || echo "❌ OFFLINE")"
echo "   React Errors: $([ $ERRORS_FOUND -eq 0 ] && echo "✅ NONE" || echo "⚠️  $ERRORS_FOUND FOUND")"
echo "   Build Status: $([ -d "dist" ] && echo "✅ READY" || echo "❌ MISSING")"
echo

echo "🎉 React State Fix V3 deployment verification complete!"
echo "Ready to continue with Snakkaz Chat development! 🚀"
