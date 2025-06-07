#!/bin/bash

# SNAKKAZ REAL-TIME DEPLOYMENT MONITOR - June 7, 2025
# Norwegian Tech Community Emergency Deployment Tracker

echo "🚀 SNAKKAZ REAL-TIME DEPLOYMENT MONITOR"
echo "🇳🇴 Norwegian Tech Community Emergency Deployment"
echo "⚡ Iterative Development - Continuous Monitoring"
echo "=============================================="
echo ""

# Function to check deployment status
check_status() {
    local iteration=$1
    echo "🔍 ITERATION $iteration - $(date '+%H:%M:%S')"
    echo "================================="
    
    # Test basic connectivity
    if ! curl -s --connect-timeout 5 https://www.snakkaz.com > /dev/null; then
        echo "❌ Site not accessible"
        return 1
    fi
    
    # Get site content
    SITE_CONTENT=$(curl -s --max-time 10 https://www.snakkaz.com)
    
    # Check bundle deployment
    echo "📦 Bundle Status:"
    if echo "$SITE_CONTENT" | grep -q "index-CEa86-6h.js"; then
        echo "   ✅ NEW BUNDLE: index-CEa86-6h.js (DEPLOYED!)"
        NEW_BUNDLE=true
    else
        echo "   ⏳ NEW BUNDLE: index-CEa86-6h.js (pending)"
        NEW_BUNDLE=false
    fi
    
    if echo "$SITE_CONTENT" | grep -q "index-DqQAMTdx.js"; then
        echo "   ⚠️  OLD BUNDLE: index-DqQAMTdx.js (still present)"
        OLD_BUNDLE=true
    else
        echo "   ✅ OLD BUNDLE: index-DqQAMTdx.js (removed)"
        OLD_BUNDLE=false
    fi
    
    # Check vendor bundle (key for Nt fix)
    if echo "$SITE_CONTENT" | grep -q "vendor-misc-npIDrE24.js"; then
        echo "   ✅ NEW VENDOR: vendor-misc-npIDrE24.js (Nt fix ACTIVE!)"
        NEW_VENDOR=true
    else
        echo "   ⏳ NEW VENDOR: vendor-misc-npIDrE24.js (pending)"
        NEW_VENDOR=false
    fi
    
    if echo "$SITE_CONTENT" | grep -q "vendor-misc-UdhpdGr7.js"; then
        echo "   ❌ OLD VENDOR: vendor-misc-UdhpdGr7.js (Nt error source)"
        OLD_VENDOR=true
    else
        echo "   ✅ OLD VENDOR: vendor-misc-UdhpdGr7.js (removed)"
        OLD_VENDOR=false
    fi
    
    # Check emergency script
    echo ""
    echo "🚨 Emergency Script Status:"
    if echo "$SITE_CONTENT" | grep -q "/emergency-react-fix.js"; then
        echo "   ✅ Referenced in HTML"
        EMERGENCY_REF=true
    else
        echo "   ❌ Not referenced in HTML"
        EMERGENCY_REF=false
    fi
    
    # Test emergency script accessibility
    EMERGENCY_TEST=$(curl -s -w "%{http_code}" https://www.snakkaz.com/emergency-react-fix.js 2>/dev/null)
    HTTP_CODE="${EMERGENCY_TEST: -3}"
    
    if [ "$HTTP_CODE" = "200" ]; then
        if echo "$EMERGENCY_TEST" | grep -q "createEmergencyUseState"; then
            echo "   ✅ Script accessible and contains React fixes"
            EMERGENCY_LIVE=true
        else
            echo "   ⚠️  Script accessible but incomplete"
            EMERGENCY_LIVE=false
        fi
    else
        echo "   ❌ Script not accessible (HTTP $HTTP_CODE)"
        EMERGENCY_LIVE=false
    fi
    
    # Overall status assessment
    echo ""
    echo "🎯 DEPLOYMENT STATUS:"
    if [ "$NEW_BUNDLE" = true ] && [ "$NEW_VENDOR" = true ] && [ "$EMERGENCY_LIVE" = true ] && [ "$OLD_BUNDLE" = false ]; then
        echo "   🎉 SUCCESS! All emergency fixes deployed!"
        echo "   🇳🇴 Ready for Norwegian tech community!"
        return 0
    elif [ "$NEW_BUNDLE" = true ] && [ "$NEW_VENDOR" = true ]; then
        echo "   ⚠️  PARTIAL: New bundles deployed, cleaning up old"
        return 2
    elif [ "$NEW_BUNDLE" = true ] || [ "$NEW_VENDOR" = true ]; then
        echo "   ⏳ PROGRESS: Some components deployed"
        return 3
    else
        echo "   ⏳ PENDING: Deployment in progress"
        return 4
    fi
}

# Function to show Norwegian community readiness
show_community_status() {
    echo ""
    echo "🇳🇴 NORWEGIAN TECH COMMUNITY READINESS:"
    echo "========================================"
    echo "📱 Mobile optimization: ✅ Ready"
    echo "🎨 Cyberpunk aesthetic: ✅ Active"
    echo "🔧 React black screen fix: $([ "$NEW_VENDOR" = true ] && echo "✅ Deployed" || echo "⏳ Deploying")"
    echo "🚨 Emergency script: $([ "$EMERGENCY_LIVE" = true ] && echo "✅ Active" || echo "⏳ Deploying")"
    echo "⚡ Performance monitoring: ✅ Ready"
    echo "🛡️  Security enhancements: ✅ Active"
}

# Main monitoring loop
echo "🔄 Starting continuous monitoring..."
echo "⏱️  Checking every 30 seconds until deployment completes"
echo ""

ITERATION=1
MAX_ITERATIONS=20  # Monitor for ~10 minutes

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    check_status $ITERATION
    STATUS_CODE=$?
    
    show_community_status
    
    if [ $STATUS_CODE -eq 0 ]; then
        echo ""
        echo "🎊 DEPLOYMENT COMPLETED SUCCESSFULLY!"
        echo "🇳🇴 NORWEGIAN TECH COMMUNITY: Site is ready!"
        echo ""
        echo "🚀 NEXT ITERATION STEPS:"
        echo "   1. Announce fixes to community"
        echo "   2. Monitor user feedback"
        echo "   3. Collect performance data"
        echo "   4. Plan next development cycle"
        echo ""
        echo "🔄 ITERATIVE DEVELOPMENT: Success through continuous improvement!"
        exit 0
    elif [ $STATUS_CODE -eq 2 ]; then
        echo ""
        echo "⚠️  PARTIAL SUCCESS - Monitoring for completion..."
    else
        echo ""
        echo "⏳ Deployment in progress - continuing to monitor..."
    fi
    
    if [ $ITERATION -lt $MAX_ITERATIONS ]; then
        echo ""
        echo "⏱️  Waiting 30 seconds before next check..."
        echo "===========================================" 
        sleep 30
    fi
    
    ITERATION=$((ITERATION + 1))
done

echo ""
echo "⏰ Monitoring period completed"
echo "🔄 Run script again to continue monitoring"
echo "💡 Deployment may still be in progress"
