#!/bin/bash

# Quick Snakkaz Deployment Status Check
echo "🔍 QUICK DEPLOYMENT STATUS CHECK"
echo "================================="
echo "Timestamp: $(date)"
echo

EXPECTED_HASH="index-BThXBval.js"

# Function to check site with timeout
check_site() {
    timeout 15 curl -s --max-time 10 https://snakkaz.com 2>/dev/null | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1
}

echo "🔗 Checking site connectivity..."
if timeout 10 curl -s --max-time 5 https://snakkaz.com > /dev/null 2>&1; then
    echo "✅ Site is reachable"
else
    echo "❌ Site appears unreachable"
    exit 1
fi

echo
echo "📦 Getting current build hash..."
CURRENT_HASH=$(check_site)

if [ -z "$CURRENT_HASH" ]; then
    echo "❌ Could not retrieve build hash from live site"
    echo "   This could mean:"
    echo "   • Site is down or slow to respond"
    echo "   • Build files have different naming pattern"
    echo "   • Content is not yet deployed"
else
    echo "✅ Current live hash: $CURRENT_HASH"
    echo "🎯 Expected hash:    $EXPECTED_HASH"
    
    if [ "$CURRENT_HASH" = "$EXPECTED_HASH" ]; then
        echo "🎉 SUCCESS! New deployment is live!"
        echo
        echo "🧹 Checking for Lovable cleanup..."
        LOVABLE_CHECK=$(timeout 15 curl -s --max-time 10 https://snakkaz.com 2>/dev/null | grep -c "gpteng.co\|lovable" || echo "0")
        if [ "$LOVABLE_CHECK" -eq 0 ]; then
            echo "✅ No Lovable references found - cleanup successful!"
        else
            echo "⚠️  Found $LOVABLE_CHECK Lovable references - cleanup incomplete"
        fi
    else
        echo "⏳ Deployment not yet complete - manual extraction needed"
        echo
        echo "📋 Next steps:"
        echo "   1. Log into cPanel File Manager"
        echo "   2. Navigate to /public_html"
        echo "   3. Extract snakkaz-dist.zip"
        echo "   4. Run this check again"
    fi
fi

echo
echo "Check completed: $(date)"
