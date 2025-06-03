#!/bin/bash

# Snakkaz Chat Health Monitor
# Run this script periodically to check system health

echo "🔍 Snakkaz Chat Health Monitor"
echo "============================================================"
echo "Monitoring system health at $(date)"
echo ""

# Function to check URL health
check_url() {
    local url=$1
    local name=$2
    local expected_content=$3
    
    echo -n "Checking $name... "
    
    local response=$(curl -s -w "%{http_code}" "$url" -o /tmp/health_check_response.html)
    
    if [ "$response" = "200" ]; then
        if [ -n "$expected_content" ]; then
            if grep -q "$expected_content" /tmp/health_check_response.html; then
                echo "✅ Healthy (contains: $expected_content)"
                return 0
            else
                echo "⚠️  Online but missing expected content"
                return 1
            fi
        else
            echo "✅ Online"
            return 0
        fi
    else
        echo "❌ Failed (HTTP $response)"
        return 1
    fi
}

# Check main systems
echo "🌐 System Availability:"
check_url "https://www.snakkaz.com" "Main App" "SnakkaZ Chat"
MAIN_STATUS=$?

check_url "https://mcp.snakkaz.com" "MCP Dashboard"
MCP_STATUS=$?

echo ""
echo "🏗️ Local Build Status:"
if [ -f "/workspaces/snakkaz-chat/dist/index.html" ]; then
    echo "✅ Build files ready"
    BUILD_STATUS=0
else
    echo "❌ Build files missing"
    BUILD_STATUS=1
fi

echo ""
echo "🔧 React State Fix:"
if [ -f "/workspaces/snakkaz-chat/src/utils/reactStateFix.ts" ]; then
    echo "✅ React fix applied"
    FIX_STATUS=0
else
    echo "❌ React fix missing"
    FIX_STATUS=1
fi

echo ""
echo "============================================================"

# Calculate overall health
TOTAL_ISSUES=$((MAIN_STATUS + MCP_STATUS + BUILD_STATUS + FIX_STATUS))

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo "🎉 Overall Status: ALL SYSTEMS HEALTHY"
    echo "✅ No issues detected"
    echo "🚀 System ready for production use"
else
    echo "⚠️  Overall Status: $TOTAL_ISSUES issue(s) detected"
    echo "📋 Recommended actions:"
    
    if [ $MAIN_STATUS -ne 0 ]; then
        echo "  • Check main application deployment"
    fi
    if [ $MCP_STATUS -ne 0 ]; then
        echo "  • Verify MCP dashboard status"
    fi
    if [ $BUILD_STATUS -ne 0 ]; then
        echo "  • Rebuild application (npm run build)"
    fi
    if [ $FIX_STATUS -ne 0 ]; then
        echo "  • Restore React state fix"
    fi
fi

echo ""
echo "🕐 Health check completed: $(date)"
echo ""

# Quick usage tips
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "📖 Usage:"
    echo "  ./health-monitor.sh         - Run health check"
    echo "  ./health-monitor.sh --help  - Show this help"
    echo ""
    echo "💡 Tips:"
    echo "  • Run this script regularly to monitor system health"
    echo "  • Use 'watch -n 300 ./health-monitor.sh' for automatic monitoring every 5 minutes"
    echo "  • If issues are detected, check the emergency repair documentation"
fi

# Return exit code based on overall health
exit $TOTAL_ISSUES
