#!/bin/bash
# Script to verify CSP fixes after Namecheap migration
# Created: May 14, 2025

echo "===== Verifying CSP Fixes for Snakkaz Chat ====="
echo "* Migration from Cloudflare to Namecheap DNS"
echo "* Checking if Cloudflare dependencies removed"
echo "* Verifying MCP and Help subdomain support"
echo ""

# Check CSP configuration
echo "Checking for Cloudflare references in cspConfig.ts..."
if grep -q "cloudflare" /workspaces/snakkaz-chat/src/services/encryption/cspConfig.ts; then
    echo "❌ Found Cloudflare references in cspConfig.ts"
    grep -n "cloudflare" /workspaces/snakkaz-chat/src/services/encryption/cspConfig.ts
else
    echo "✅ No Cloudflare references found in cspConfig.ts"
fi

echo ""
echo "Checking for MCP and Help subdomains in cspConfig.ts..."
if grep -q "mcp.snakkaz.com" /workspaces/snakkaz-chat/src/services/encryption/cspConfig.ts && 
   grep -q "help.snakkaz.com" /workspaces/snakkaz-chat/src/services/encryption/cspConfig.ts; then
    echo "✅ MCP and Help subdomains found in cspConfig.ts"
else
    echo "❌ Missing MCP or Help subdomains in cspConfig.ts"
fi

echo ""
echo "Checking for gtag references in cspReporting.ts..."
if grep -q "window.gtag" /workspaces/snakkaz-chat/src/services/encryption/cspReporting.ts; then
    echo "❌ Found window.gtag references in cspReporting.ts"
else
    echo "✅ No window.gtag references found in cspReporting.ts"
fi

echo ""
echo "Checking for Cloudflare references in systemHealthCheck.ts..."
if grep -q "cloudflareinsights" /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts; then
    echo "❌ Found Cloudflare Insights references in systemHealthCheck.ts"
else
    echo "✅ No Cloudflare Insights references found in systemHealthCheck.ts"
fi

echo ""
echo "Checking for mobile-web-app-capable meta tag in metaTagFixes.ts..."
if grep -q "mobile-web-app-capable" /workspaces/snakkaz-chat/src/services/encryption/metaTagFixes.ts; then
    echo "✅ mobile-web-app-capable meta tag implementation found"
else
    echo "❌ mobile-web-app-capable meta tag implementation missing"
fi

echo ""
echo "Checking for correct import paths in initialize.ts..."
if grep -q "./encryption/" /workspaces/snakkaz-chat/src/services/initialize.ts; then
    echo "✅ Correct import paths found in initialize.ts"
else
    echo "❌ Incorrect import paths in initialize.ts"
fi

echo ""
echo "===== Verification Complete ====="
