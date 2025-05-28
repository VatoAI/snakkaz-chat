#!/bin/bash

# ===============================================
# 🎯 POST-CPANEL FIX VERIFICATION SCRIPT
# ===============================================
# Run this AFTER making cPanel subdomain changes

echo "🔍 VERIFYING CPANEL SUBDOMAIN FIX - $(date)"
echo "=============================================="

# Test function
test_subdomain() {
    local subdomain=$1
    echo "🌐 Testing $subdomain.snakkaz.com..."
    
    # Get HTTP status
    status=$(curl -s -I https://$subdomain.snakkaz.com --connect-timeout 10 | head -1)
    
    # Get first few lines of content
    content=$(curl -s https://$subdomain.snakkaz.com --connect-timeout 10 | head -3)
    
    echo "   Status: $status"
    
    # Check if it's showing Snakkaz app or autoindex
    if echo "$content" | grep -q "snakkaz-icon"; then
        echo "   ✅ SUCCESS: Shows Snakkaz application"
    elif echo "$content" | grep -q "Index of"; then
        echo "   ❌ FAIL: Still showing autoindex"
    else
        echo "   ⚠️  UNKNOWN: Unexpected content"
        echo "   Content preview: $(echo "$content" | head -1)"
    fi
    echo ""
}

# Test main domain for reference
echo "📍 REFERENCE - MAIN DOMAIN:"
echo "----------------------------"
test_subdomain "www"

echo "📍 TESTING ALL SUBDOMAINS:"
echo "----------------------------"

# Test all subdomains
SUBDOMAINS=("dash" "business" "docs" "analytics" "mcp" "help")

success_count=0
total_count=${#SUBDOMAINS[@]}

for subdomain in "${SUBDOMAINS[@]}"; do
    test_subdomain "$subdomain"
    
    # Check if successful
    content=$(curl -s https://$subdomain.snakkaz.com --connect-timeout 10 | head -3)
    if echo "$content" | grep -q "snakkaz-icon"; then
        ((success_count++))
    fi
done

# Summary
echo "=============================================="
echo "📊 SUMMARY:"
echo "   ✅ Success: $success_count/$total_count subdomains"
echo "   ❌ Failed: $((total_count - success_count))/$total_count subdomains"

if [ $success_count -eq $total_count ]; then
    echo ""
    echo "🎉 ALL SUBDOMAINS WORKING! 🎉"
    echo "✅ Production deployment successful!"
    echo "✅ Ready to proceed with database optimization"
else
    echo ""
    echo "⚠️  Some subdomains still need configuration"
    echo "📋 Check the failed subdomains in cPanel"
fi

echo "=============================================="
