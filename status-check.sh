#!/bin/bash

echo "🧪 Snakkaz Chat Subdomain Status Check"
echo "====================================="
echo ""

# Test main domain
echo "🏠 Main Domain:"
main_status=$(curl -s -w "%{http_code}" -o /tmp/main.html https://www.snakkaz.com --max-time 5)
if [ "$main_status" = "200" ]; then
    if grep -q -i "snakkaz" /tmp/main.html; then
        echo "   ✅ www.snakkaz.com: $main_status - Snakkaz app detected"
    else
        echo "   ✅ www.snakkaz.com: $main_status - Generic content"
    fi
else
    echo "   ❌ www.snakkaz.com: $main_status"
fi
echo ""

# Test subdomains
echo "🌐 Subdomains:"
subdomains=("dash" "business" "docs" "analytics" "mcp" "help")
working=0
with_snakkaz=0

for subdomain in "${subdomains[@]}"; do
    url="https://${subdomain}.snakkaz.com"
    status=$(curl -s -w "%{http_code}" -o "/tmp/${subdomain}.html" "$url" --max-time 5)
    
    if [ "$status" = "200" ]; then
        working=$((working + 1))
        if grep -q -i "snakkaz" "/tmp/${subdomain}.html"; then
            with_snakkaz=$((with_snakkaz + 1))
            echo "   ✅ $subdomain: Snakkaz app running - PERFECT!"
        elif grep -q "Index of" "/tmp/${subdomain}.html" || grep -q "LiteSpeed" "/tmp/${subdomain}.html"; then
            echo "   📁 $subdomain: Directory listing - needs hosting config"
        else
            echo "   📄 $subdomain: Generic HTML content"
        fi
    else
        echo "   ❌ $subdomain: $status"
    fi
done

echo ""
echo "📊 Summary:"
echo "   Responding: $working/6"
echo "   With Snakkaz app: $with_snakkaz/6"

if [ "$with_snakkaz" -eq 6 ]; then
    echo ""
    echo "🎉 ALL PERFECT! All subdomains serving Snakkaz app!"
elif [ "$working" -eq 6 ]; then
    echo ""
    echo "🔧 NEXT STEP: Configure hosting provider to serve apps instead of directory listings"
    echo ""
    echo "📋 Required hosting configuration:"
    echo "   dash.snakkaz.com → /public_html/dash/"
    echo "   business.snakkaz.com → /public_html/business/"
    echo "   docs.snakkaz.com → /public_html/docs/"
    echo "   analytics.snakkaz.com → /public_html/analytics/"
    echo "   mcp.snakkaz.com → /public_html/mcp/"
    echo "   help.snakkaz.com → /public_html/help/"
fi

# Cleanup
rm -f /tmp/*.html
