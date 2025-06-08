#!/bin/bash

echo "🚨 REAL-TIME SNAKKAZ DEPLOYMENT MONITORING"
echo "=========================================="
echo "$(date): Starting intensive monitoring of snakkaz.com deployment"

# Function to check current bundles on live site
check_live_bundles() {
    echo "📊 Checking live bundles at $(date):"
    curl -s https://www.snakkaz.com | grep -E '(index-|vendor-misc)' | head -3
    echo ""
}

# Function to test for the specific error
test_nt_error() {
    echo "🧪 Testing for Nt undefined error at $(date):"
    curl -s https://www.snakkaz.com 2>/dev/null | grep -q "Nt is undefined" && echo "❌ Nt error still present" || echo "✅ Nt error not found in HTML"
    echo ""
}

# Function to check if site loads properly
test_site_response() {
    echo "🌐 Testing site response at $(date):"
    status_code=$(curl -s -o /dev/null -w "%{http_code}" https://www.snakkaz.com)
    echo "HTTP Status: $status_code"
    
    if [ "$status_code" = "200" ]; then
        echo "✅ Site responds with 200 OK"
    else
        echo "❌ Site has issues: $status_code"
    fi
    echo ""
}

# Monitor for 5 minutes with checks every 30 seconds
echo "Starting monitoring - will check every 30 seconds for 5 minutes..."
echo "Looking for deployment of new bundles:"
echo "  CURRENT (broken): index-DqQAMTdx.js, vendor-misc-UdhpdGr7.js"
echo "  TARGET (fixed):   index-CEa86-6h.js, vendor-misc-npIDrE24.js"
echo ""

for i in {1..10}; do
    echo "=== CHECK $i/10 at $(date) ==="
    
    check_live_bundles
    test_site_response
    test_nt_error
    
    # Check if new bundles are deployed
    if curl -s https://www.snakkaz.com | grep -q "index-CEa86-6h.js"; then
        echo "🎉 NEW BUNDLES DETECTED! Emergency fix deployed successfully!"
        echo "🎯 Performing final verification..."
        sleep 5
        check_live_bundles
        break
    fi
    
    if [ $i -lt 10 ]; then
        echo "⏱️  Waiting 30 seconds before next check..."
        sleep 30
    fi
done

echo ""
echo "📊 FINAL DEPLOYMENT STATUS at $(date):"
echo "======================================"
check_live_bundles
test_site_response

echo "🏁 Monitoring complete. Check https://www.snakkaz.com manually for verification."
