#!/bin/bash

# ==============================================
# 🎯 SNAKKAZ SUBDOMAIN STATUS VERIFICATION
# ==============================================
# Date: May 28, 2025
# Purpose: Check current subdomain configuration

echo "🔍 SNAKKAZ SUBDOMAIN STATUS CHECK - $(date)"
echo "============================================="

# Test main domain first
echo ""
echo "📍 TESTING MAIN DOMAIN:"
echo "------------------------"
echo "🌐 www.snakkaz.com:"
timeout 10 curl -I https://www.snakkaz.com 2>/dev/null | head -3 || echo "❌ Failed to connect"

echo ""
echo "🌐 snakkaz.com:"
timeout 10 curl -I https://snakkaz.com 2>/dev/null | head -3 || echo "❌ Failed to connect"

# Test all subdomains
echo ""
echo "📍 TESTING SUBDOMAINS:"
echo "----------------------"

SUBDOMAINS=("dash" "business" "docs" "analytics" "mcp" "help")

for subdomain in "${SUBDOMAINS[@]}"; do
    echo "🌐 $subdomain.snakkaz.com:"
    timeout 10 curl -I https://$subdomain.snakkaz.com 2>/dev/null | head -3 || echo "❌ Failed to connect"
    echo ""
done

# DNS Resolution Check
echo "📍 DNS RESOLUTION:"
echo "------------------"
for subdomain in "${SUBDOMAINS[@]}"; do
    echo "🔍 $subdomain.snakkaz.com:"
    nslookup $subdomain.snakkaz.com 2>/dev/null | grep "Address:" | tail -1 || echo "❌ DNS not resolved"
done

echo ""
echo "📍 MAIN DOMAIN DNS:"
echo "-------------------"
nslookup www.snakkaz.com 2>/dev/null | grep "Address:" | tail -1 || echo "❌ DNS not resolved"
nslookup snakkaz.com 2>/dev/null | grep "Address:" | tail -1 || echo "❌ DNS not resolved"

echo ""
echo "============================================="
echo "✅ Verification complete - $(date)"
