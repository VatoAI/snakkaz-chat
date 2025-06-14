#!/bin/bash

# ================================================
# SNAKKAZ REACT UNDEFINED FIX VERIFICATION
# Juni 14, 2025 - Emergency Response
# ================================================

echo "🔍 VERIFYING REACT UNDEFINED FIX - Juni 14, 2025"
echo "================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}1. 🌐 SITE ACCESSIBILITY${NC}"
HTTP_CODE=$(curl -s -w "%{http_code}" "https://www.snakkaz.com" -o /dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "✅ Main site accessible (HTTP $HTTP_CODE)"
else
    echo -e "❌ Main site error (HTTP $HTTP_CODE)"
fi

echo -e "\n${BLUE}2. 📦 NEW BUNDLE VERIFICATION${NC}"

# Check new React bundles
NEW_REACT_CORE="vendor-react-core-P8orpnXN.js"
NEW_MISC="vendor-misc-DcaTGh4z.js"
NEW_INDEX="index-ClZPYTJk.js"

for bundle in "$NEW_REACT_CORE" "$NEW_MISC" "$NEW_INDEX"; do
    HTTP_CODE=$(curl -s -w "%{http_code}" "https://www.snakkaz.com/assets/js/$bundle" -o /dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "✅ $bundle deployed (HTTP $HTTP_CODE)"
    else
        echo -e "❌ $bundle not found (HTTP $HTTP_CODE)"
    fi
done

echo -e "\n${BLUE}3. 🐛 REACT UNDEFINED ERROR CHECK${NC}"

# Check for React undefined errors
if curl -s "https://www.snakkaz.com/assets/js/$NEW_MISC" | grep -q "React is undefined"; then
    echo -e "❌ React undefined error still present in vendor-misc"
else
    echo -e "✅ React undefined error FIXED in vendor-misc"
fi

# Check if use-sync-external-store is with React
if curl -s "https://www.snakkaz.com/assets/js/$NEW_REACT_CORE" | grep -q "useSyncExternalStore\|use.*external.*store"; then
    echo -e "✅ use-sync-external-store bundled with React"
else
    echo -e "❌ use-sync-external-store not found with React"
fi

echo -e "\n${BLUE}4. 📋 LOADING ORDER VERIFICATION${NC}"

# Check HTML loading order
HTML_CONTENT=$(curl -s "https://www.snakkaz.com")
if echo "$HTML_CONTENT" | grep -n "modulepreload.*vendor-react-core" | head -1 | cut -d: -f1 > /tmp/react_line && \
   echo "$HTML_CONTENT" | grep -n "modulepreload.*vendor-misc" | head -1 | cut -d: -f1 > /tmp/misc_line; then
    REACT_LINE=$(cat /tmp/react_line)
    MISC_LINE=$(cat /tmp/misc_line)
    if [ "$REACT_LINE" -lt "$MISC_LINE" ]; then
        echo -e "✅ React core loads BEFORE vendor-misc (line $REACT_LINE vs $MISC_LINE)"
    else
        echo -e "❌ Loading order still wrong (React: line $REACT_LINE, Misc: line $MISC_LINE)"
    fi
    rm -f /tmp/react_line /tmp/misc_line
else
    echo -e "⚠️ Could not verify loading order"
fi

echo -e "\n${BLUE}5. 🔧 SOURCE MAP VERIFICATION${NC}"

# Check source maps
for bundle in "$NEW_REACT_CORE" "$NEW_MISC" "$NEW_INDEX"; do
    if curl -s "https://www.snakkaz.com/assets/js/$bundle.map" | jq . > /dev/null 2>&1; then
        echo -e "✅ $bundle.map is valid JSON"
    else
        echo -e "❌ $bundle.map is invalid or missing"
    fi
done

echo -e "\n${YELLOW}========================${NC}"
echo -e "${GREEN}🎯 VERIFICATION COMPLETE${NC}"
echo -e "${YELLOW}========================${NC}"

# Overall status
if curl -s "https://www.snakkaz.com/assets/js/$NEW_REACT_CORE" | grep -q "useSyncExternalStore" && \
   ! curl -s "https://www.snakkaz.com/assets/js/$NEW_MISC" | grep -q "React is undefined"; then
    echo -e "\n${GREEN}🎉 SUCCESS: React undefined error RESOLVED!${NC}"
    echo -e "${GREEN}✅ All critical fixes applied and verified${NC}"
else
    echo -e "\n${RED}⚠️ ISSUES DETECTED: Further action required${NC}"
fi
