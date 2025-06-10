#!/bin/bash
# MIME Type Fix Verification Script
# Tests if JavaScript files are now served with correct MIME types

echo "🔍 MIME TYPE FIX VERIFICATION - $(date)"
echo "======================================="

# List of critical JavaScript files to test
JS_FILES=(
    "assets/js/vendor-react-core-C-rztcK2.js"
    "assets/js/vendor-react-dom-Bnx5qrcL.js"
    "assets/js/index-Cu5v56qg.js"
    "assets/js/app-services-DrdKc7vf.js"
    "assets/js/components-ui-76coOORt.js"
)

echo "📋 Testing MIME types for critical JavaScript files..."
echo ""

SUCCESS_COUNT=0
TOTAL_COUNT=${#JS_FILES[@]}

for js_file in "${JS_FILES[@]}"; do
    echo "🧪 Testing: $js_file"
    
    # Get HTTP headers for the file
    RESPONSE=$(curl -s -I "https://snakkaz.com/$js_file")
    CONTENT_TYPE=$(echo "$RESPONSE" | grep -i "content-type" | cut -d: -f2 | tr -d ' \r\n')
    HTTP_STATUS=$(echo "$RESPONSE" | head -1 | cut -d' ' -f2)
    
    echo "   Status: $HTTP_STATUS"
    echo "   Content-Type: $CONTENT_TYPE"
    
    if [[ "$CONTENT_TYPE" == *"application/javascript"* ]]; then
        echo "   ✅ CORRECT MIME TYPE"
        ((SUCCESS_COUNT++))
    elif [[ "$CONTENT_TYPE" == *"text/javascript"* ]]; then
        echo "   ⚠️  ACCEPTABLE MIME TYPE (text/javascript)"
        ((SUCCESS_COUNT++))
    else
        echo "   ❌ WRONG MIME TYPE: $CONTENT_TYPE"
    fi
    echo ""
done

echo "📊 RESULTS SUMMARY:"
echo "==================="
echo "✅ Correct MIME types: $SUCCESS_COUNT/$TOTAL_COUNT"

if [ $SUCCESS_COUNT -eq $TOTAL_COUNT ]; then
    echo "🎉 ALL JAVASCRIPT FILES HAVE CORRECT MIME TYPES!"
    echo "✅ Emergency fix successful"
    
    # Test actual module loading
    echo ""
    echo "🔄 Testing actual module loading..."
    curl -s "https://snakkaz.com" | grep -o "import.*\.js" | head -5
    
else
    echo "⚠️  SOME FILES STILL HAVE WRONG MIME TYPES"
    echo "🔧 Additional fixes may be needed"
fi

echo ""
echo "🌐 Full site test:"
echo "Visit: https://snakkaz.com"
echo "Check browser console for module loading errors"
echo ""
echo "Verification completed at $(date)"
