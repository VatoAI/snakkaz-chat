#!/bin/bash

echo "🔍 VENDOR FILES VALIDATION SCRIPT"
echo "================================="
echo ""

cd /workspaces/snakkaz-chat/snakkaz-complete-deployment

echo "📊 FILE SIZES CHECK:"
echo "==================="
echo ""
echo "📄 Root files:"
ls -lh *.html *.json *.ico *.js 2>/dev/null | awk '{print $9 ": " $5}'
echo ""

echo "📄 JavaScript files:"
ls -lh assets/js/*.js | awk '{print $9 ": " $5}' | sort
echo ""

echo "📄 CSS files:"
ls -lh assets/css/*.css | awk '{print $9 ": " $5}'
echo ""

echo "🧪 SYNTAX VALIDATION:"
echo "===================="
echo ""

# Check critical vendor files for syntax errors
echo "✅ Testing vendor-animation-BRHAymv3.js..."
if node -c assets/js/vendor-animation-BRHAymv3.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo "✅ Testing vendor-react-core-Cd05VJ5Y.js..."
if node -c assets/js/vendor-react-core-Cd05VJ5Y.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo "✅ Testing vendor-react-dom-DmiX1e6y.js..."
if node -c assets/js/vendor-react-dom-DmiX1e6y.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo "✅ Testing vendor-router-DRYHFKTT.js..."
if node -c assets/js/vendor-router-DRYHFKTT.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo "✅ Testing app-services-Cf0jkxe3.js..."
if node -c assets/js/app-services-Cf0jkxe3.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo "✅ Testing service-worker.js..."
if node -c service-worker.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo "✅ Testing components-ui-CoK5VGD0.js..."
if node -c assets/js/components-ui-CoK5VGD0.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo "✅ Testing app-utils-CvwRV1zG.js..."
if node -c assets/js/app-utils-CvwRV1zG.js 2>/dev/null; then
    echo "   ✅ SYNTAX OK"
else
    echo "   ❌ SYNTAX ERROR"
fi

echo ""
echo "🔍 CONTENT VALIDATION:"
echo "====================="
echo ""

echo "✅ Checking for createContext usage in vendor-router..."
if grep -q "createSafeContext" assets/js/vendor-router-DRYHFKTT.js; then
    echo "   ✅ SAFE createContext implementation found"
else
    echo "   ❌ Safe createContext NOT found"
fi

echo "✅ Checking for createContext usage in vendor-animation..."
if grep -q "createSafeContext" assets/js/vendor-animation-BRHAymv3.js; then
    echo "   ✅ SAFE createContext implementation found"
else
    echo "   ❌ Safe createContext NOT found"
fi

echo "✅ Checking liquid glass CSS..."
if grep -q "glass-morphism" assets/css/pages-main-mrR2Awbu.css; then
    echo "   ✅ Liquid glass design CSS found"
else
    echo "   ❌ Liquid glass CSS NOT found"
fi

echo "✅ Checking service worker configuration..."
if grep -q "STATIC_FILES" service-worker.js; then
    echo "   ✅ Service worker properly configured"
else
    echo "   ❌ Service worker configuration incomplete"
fi

echo ""
echo "📊 SUMMARY:"
echo "==========="
echo "🎯 Ready for local testing!"
echo "💡 Run: ./test-snakkaz-local.sh"
echo "🌐 Then open: http://localhost:8080"
