#!/bin/bash

echo "🚨 URGENT: Snakkaz Chat Subdomain Configuration Status"
echo "=================================================="
echo ""
echo "📋 Current Status Analysis:"
echo ""

# Check what each subdomain is actually serving
check_subdomain_content() {
    local name="$1"
    local url="$2"
    
    echo "🔍 $name ($url):"
    
    # Get status code
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "   Status: $status"
    
    # Get content type
    content_type=$(curl -s -I "$url" | grep -i "content-type:" | cut -d' ' -f2-)
    echo "   Content-Type: $content_type"
    
    # Check what's actually being served
    content=$(curl -s "$url" | head -5)
    if echo "$content" | grep -q "LiteSpeed"; then
        echo "   ❌ PROBLEM: Serving LiteSpeed autoindex (directory listing)"
    elif echo "$content" | grep -q "<!DOCTYPE html>" && echo "$content" | grep -q "root"; then
        echo "   ✅ GOOD: Serving React app"
    else
        echo "   ⚠️ UNKNOWN: Serving other content"
    fi
    
    # Check if index.html exists
    index_check=$(curl -s "$url/index.html" | head -2)
    if echo "$index_check" | grep -q "<!DOCTYPE html>"; then
        echo "   📄 index.html: EXISTS and accessible"
    else
        echo "   ❌ index.html: NOT FOUND or not accessible"
    fi
    
    echo ""
}

echo "🌐 Main Domain:"
check_subdomain_content "www.snakkaz.com" "https://www.snakkaz.com"

echo "🌐 Subdomains:"
check_subdomain_content "Dashboard" "https://dash.snakkaz.com"
check_subdomain_content "Business" "https://business.snakkaz.com"
check_subdomain_content "Documentation" "https://docs.snakkaz.com"
check_subdomain_content "Analytics" "https://analytics.snakkaz.com"
check_subdomain_content "MCP" "https://mcp.snakkaz.com"
check_subdomain_content "Help" "https://help.snakkaz.com"

echo "🔧 REQUIRED HOSTING PROVIDER ACTIONS:"
echo "===================================="
echo ""
echo "The hosting provider MUST configure each subdomain's document root in cPanel:"
echo ""
echo "📁 Current Problem: Subdomains are showing directory listings instead of serving index.html"
echo ""
echo "📝 Required cPanel Subdomain Configuration:"
echo "   • dash.snakkaz.com → Document Root: /public_html/dash/"
echo "   • business.snakkaz.com → Document Root: /public_html/business/"
echo "   • docs.snakkaz.com → Document Root: /public_html/docs/"
echo "   • analytics.snakkaz.com → Document Root: /public_html/analytics/"
echo "   • mcp.snakkaz.com → Document Root: /public_html/mcp/"
echo "   • help.snakkaz.com → Document Root: /public_html/help/"
echo ""
echo "📌 How to fix in cPanel:"
echo "   1. Login to cPanel"
echo "   2. Go to 'Subdomains' section"
echo "   3. For each subdomain, click 'Manage' or 'Edit'"
echo "   4. Set the correct Document Root path"
echo "   5. Save changes"
echo ""
echo "🚀 ONCE FIXED: All subdomains will serve the React app with subdomain detection!"
echo ""
echo "💡 Alternative: Check if .htaccess files need DirectoryIndex index.html directive"
