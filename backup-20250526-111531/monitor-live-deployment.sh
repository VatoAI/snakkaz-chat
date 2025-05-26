#!/bin/bash

# Snakkaz Live Deployment Monitor
# Monitors the live site for deployment completion

# Handle interruption gracefully
cleanup() {
    echo
    echo "🛑 Monitoring stopped by user"
    exit 130
}
trap cleanup SIGINT SIGTERM

echo "🚀 SNAKKAZ DEPLOYMENT MONITOR"
echo "==============================="
echo "Started: $(date)"
echo "Press Ctrl+C to stop monitoring"
echo

EXPECTED_HASH="index-BThXBval.js"
CURRENT_HASH=""
MAX_CHECKS=20
CHECK_INTERVAL=30
CHECK_COUNT=0

# Function to perform the site check with timeout
check_site() {
    timeout 15 curl -s --max-time 10 https://snakkaz.com 2>/dev/null | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1
}

# Quick connectivity test
echo "🔗 Testing site connectivity..."
if timeout 10 curl -s --max-time 5 https://snakkaz.com > /dev/null 2>&1; then
    echo "✅ Site is reachable"
else
    echo "❌ Site appears unreachable - monitoring may not work properly"
    echo "   Continuing anyway..."
fi
echo

while [ $CHECK_COUNT -lt $MAX_CHECKS ]; do
    CHECK_COUNT=$((CHECK_COUNT + 1))
    echo "Check #$CHECK_COUNT of $MAX_CHECKS ($(date))"
    
    # Get current build hash from live site with timeout
    CURRENT_HASH=$(check_site)
    
    if [ -z "$CURRENT_HASH" ]; then
        echo "❌ Could not retrieve build hash from live site"
        echo "   Site may be down or unreachable"
    else
        echo "📦 Current live hash: $CURRENT_HASH"
        echo "🎯 Expected hash:    $EXPECTED_HASH"
        
        if [ "$CURRENT_HASH" = "$EXPECTED_HASH" ]; then
            echo "🎉 SUCCESS! Deployment completed!"
            echo "✅ Live site now shows clean build: $EXPECTED_HASH"
            echo
            echo "Verifying Lovable cleanup..."
            
            # Check for Lovable references with timeout
            LOVABLE_CHECK=$(timeout 15 curl -s --max-time 10 https://snakkaz.com 2>/dev/null | grep -c "gpteng.co\|lovable" || echo "0")
            if [ "$LOVABLE_CHECK" -eq 0 ]; then
                echo "✅ No Lovable references found - cleanup successful!"
            else
                echo "⚠️  Found $LOVABLE_CHECK Lovable references - cleanup incomplete"
            fi
            
            echo
            echo "🔄 Deployment Status: COMPLETED"
            echo "📊 Final Status: CLEAN BUILD DEPLOYED"
            exit 0
        else
            echo "⏳ Deployment still in progress..."
        fi
    fi
    
    echo "   Waiting $CHECK_INTERVAL seconds for next check..."
    echo
    
    if [ $CHECK_COUNT -lt $MAX_CHECKS ]; then
        # Use a shorter sleep for better responsiveness and allow Ctrl+C
        for i in $(seq 1 $CHECK_INTERVAL); do
            sleep 1
            # Check if script was interrupted
            if [ $? -ne 0 ]; then
                echo "🛑 Monitoring interrupted by user"
                exit 130
            fi
        done
    fi
done

echo "⏰ Maximum checks reached ($MAX_CHECKS)"
echo "🔄 Deployment Status: TIMEOUT"
if [ -n "$CURRENT_HASH" ]; then
    echo "📦 Final hash observed: $CURRENT_HASH"
else
    echo "❌ Could not retrieve any build hash"
fi
echo "💡 Consider manual verification or extended monitoring"
