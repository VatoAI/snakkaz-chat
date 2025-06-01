#!/bin/bash

echo "🌐 Snakkaz Chat Subdomain Functionality Verification"
echo "=================================================="
echo ""

# Test URLs
MAIN_URL="https://www.snakkaz.com"
DASH_URL="https://dash.snakkaz.com"
BUSINESS_URL="https://business.snakkaz.com"
DOCS_URL="https://docs.snakkaz.com"
ANALYTICS_URL="https://analytics.snakkaz.com"
MCP_URL="https://mcp.snakkaz.com"
HELP_URL="https://help.snakkaz.com"

# Function to test a URL and check for specific content
test_subdomain() {
    local name="$1"
    local url="$2"
    local expected_title="$3"
    
    echo "🔍 Testing $name ($url)..."
    
    # Get the response with timeout
    response=$(curl -s -L --max-time 10 --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "$url")
    status_code=$(curl -s -L -o /dev/null -w "%{http_code}" --max-time 10 "$url")
    
    if [ "$status_code" = "200" ]; then
        echo "   ✅ HTTP Status: 200 OK"
        
        # Check if it contains React app indicators
        if echo "$response" | grep -q "id=\"root\"" || echo "$response" | grep -q "Snakkaz" || echo "$response" | grep -q "React"; then
            echo "   ✅ React App: Detected"
            
            # Check for specific title in the HTML
            if echo "$response" | grep -q "<title>$expected_title</title>" || echo "$response" | grep -q "Snakkaz Chat"; then
                echo "   ✅ App Content: Snakkaz Chat detected"
            else
                echo "   ⚠️ App Content: Generic content (title not yet set)"
            fi
            
            # Check for subdomain detection code
            if echo "$response" | grep -q "detectSubdomain" || echo "$response" | grep -q "snakkaz_subdomain"; then
                echo "   ✅ Subdomain Code: Detection logic found in bundle"
            else
                echo "   ⚠️ Subdomain Code: Not found in response"
            fi
            
        else
            echo "   ❌ React App: Not detected (showing directory listing or error)"
        fi
    else
        echo "   ❌ HTTP Status: $status_code"
    fi
    echo ""
}

# Test all subdomains
echo "📊 Testing Main Domain:"
test_subdomain "Main Domain" "$MAIN_URL" "Snakkaz Chat"

echo "🌐 Testing Subdomains:"
test_subdomain "Dashboard" "$DASH_URL" "Snakkaz Chat - Dashboard"
test_subdomain "Business" "$BUSINESS_URL" "Snakkaz Chat - Business"
test_subdomain "Documentation" "$DOCS_URL" "Snakkaz Chat - Documentation"
test_subdomain "Analytics" "$ANALYTICS_URL" "Snakkaz Chat - Analytics"
test_subdomain "MCP" "$MCP_URL" "Snakkaz Chat - MCP"
test_subdomain "Help" "$HELP_URL" "Snakkaz Chat - Help"

echo "📋 Manual Testing Instructions:"
echo "=============================="
echo ""
echo "To verify JavaScript subdomain detection is working:"
echo ""
echo "1. Open browser developer tools (F12)"
echo "2. Go to Console tab"
echo "3. Visit each subdomain and look for these console messages:"
echo ""
echo "   Main Domain (www.snakkaz.com):"
echo "   🏠 Snakkaz Chat: Running on main domain"
echo "   🏠 Main app mode activated"
echo ""
echo "   Dashboard (dash.snakkaz.com):"
echo "   🌐 Snakkaz Chat: Detected subdomain \"dash\" - configuring app..."
echo "   📊 Dashboard mode activated"
echo ""
echo "   Business (business.snakkaz.com):"
echo "   🌐 Snakkaz Chat: Detected subdomain \"business\" - configuring app..."
echo "   💼 Business mode activated"
echo ""
echo "4. Check sessionStorage in Application tab:"
echo "   - snakkaz_subdomain should contain the subdomain name"
echo "   - snakkaz_app_mode should match the subdomain"
echo "   - snakkaz_subdomain_timestamp should show when it was set"
echo ""
echo "5. Verify document title changes based on subdomain"
echo ""
echo "🎉 If all tests pass and console logs appear, subdomain functionality is PERFECT!"
