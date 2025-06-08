#!/bin/bash

# SNAKKAZ DEPLOYMENT CHECKER - June 7, 2025
# Norwegian Tech Community Focus: Iterative Development

echo "🚀 SNAKKAZ DEPLOYMENT STATUS"
echo "🇳🇴 Norwegian Tech Community Focus" 
echo "========================="
echo ""

# Check if site is accessible
echo "🔍 Checking site accessibility..."
if curl -s --connect-timeout 10 https://www.snakkaz.com > /dev/null; then
    echo "✅ Site is accessible"
else
    echo "❌ Site not accessible"
    exit 1
fi

# Check for bundle status
echo ""
echo "📦 Checking bundle deployment..."
SITE_CONTENT=$(curl -s https://www.snakkaz.com)

if echo "$SITE_CONTENT" | grep -q "index-CEa86-6h.js"; then
    echo "✅ NEW BUNDLE DEPLOYED: index-CEa86-6h.js"
    NEW_BUNDLE=true
else
    echo "❌ New bundle not found"
    NEW_BUNDLE=false
fi

if echo "$SITE_CONTENT" | grep -q "index-DqQAMTdx.js"; then
    echo "⚠️  OLD BUNDLE STILL PRESENT: index-DqQAMTdx.js"
    OLD_BUNDLE=true
else
    echo "✅ Old bundle removed"
    OLD_BUNDLE=false
fi

if echo "$SITE_CONTENT" | grep -q "/emergency-react-fix.js"; then
    echo "✅ Emergency script reference found"
    EMERGENCY_REF=true
else
    echo "❌ Emergency script reference missing"
    EMERGENCY_REF=false
fi

# Check emergency script accessibility
echo ""
echo "🚨 Testing emergency script..."
if curl -s https://www.snakkaz.com/emergency-react-fix.js | grep -q "createEmergencyUseState"; then
    echo "✅ Emergency script accessible and contains fixes"
    EMERGENCY_SCRIPT=true
else
    echo "❌ Emergency script not accessible or incomplete"
    EMERGENCY_SCRIPT=false
fi

# Overall status
echo ""
echo "📊 DEPLOYMENT SUMMARY:"
echo "======================"
if [ "$NEW_BUNDLE" = true ] && [ "$OLD_BUNDLE" = false ] && [ "$EMERGENCY_SCRIPT" = true ]; then
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "🇳🇴 Ready for Norwegian tech community!"
    echo ""
    echo "🔄 NEXT ITERATION STEPS:"
    echo "   1. Monitor site performance"
    echo "   2. Engage Norwegian tech community"  
    echo "   3. Collect user feedback"
    echo "   4. Plan next improvements"
elif [ "$NEW_BUNDLE" = true ] && [ "$EMERGENCY_SCRIPT" = true ]; then
    echo "⚠️  PARTIAL SUCCESS - New fixes deployed but old bundle still cached"
    echo "🔄 Wait 5-10 minutes for full propagation"
else
    echo "⏳ DEPLOYMENT IN PROGRESS"
    echo "🔄 GitHub Actions may still be running"
    echo "💡 Check again in 2-3 minutes"
fi

echo ""
echo "🎯 ITERATIVE DEVELOPMENT: Quick fixes, community feedback, continuous improvement"
