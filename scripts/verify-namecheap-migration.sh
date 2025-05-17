#!/bin/bash

# Test script to verify Namecheap migration and CSP fixes
# Created: May 17, 2025

echo "=== SNAKKAZ CHAT NAMECHEAP MIGRATION VERIFICATION TEST ==="
echo "Testing all aspects of the Cloudflare to Namecheap migration..."
echo ""

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "Checking required tools..."
MISSING_DEPS=0

for cmd in curl node npm; do
  if ! command_exists "$cmd"; then
    echo "❌ Missing dependency: $cmd"
    MISSING_DEPS=1
  else
    echo "✅ Found dependency: $cmd"
  fi
done

if [ $MISSING_DEPS -eq 1 ]; then
  echo "Please install the missing dependencies and try again."
  exit 1
fi

echo ""
echo "=== Checking DNS Configuration ==="

# Array of domains to check
DOMAINS=(
  "snakkaz.com"
  "www.snakkaz.com"
  "dash.snakkaz.com"
  "business.snakkaz.com"
  "docs.snakkaz.com"
  "analytics.snakkaz.com"
  "mcp.snakkaz.com"
  "help.snakkaz.com"
)

# Check DNS records
for domain in "${DOMAINS[@]}"; do
  echo "Testing DNS for $domain..."
  
  # Try to reach the domain with curl
  if curl -s --max-time 5 -I "https://$domain" | grep -q "HTTP/"; then
    echo "✅ HTTPS accessible for $domain"
  else
    echo "❌ HTTPS not accessible for $domain"
  fi
  echo ""
done

echo "=== Testing Application Build ==="
# Try to build the application
echo "Building the application to verify all errors are fixed..."
if npm run build; then
  echo "✅ Application builds successfully"
else
  echo "❌ Application build failed"
  exit 1
fi

echo ""
echo "=== Testing CSP Configuration ==="
# Check for the existence of CSP configuration files
echo "Checking for CSP configuration files..."
if [ -f "./src/services/security/cspConfig.ts" ]; then
  echo "✅ CSP configuration file exists in security service"
else
  echo "❌ Missing CSP configuration file in security service"
fi

if [ -f "./src/services/encryption/cspConfig.ts" ]; then
  echo "✅ CSP configuration file exists in encryption service"
else
  echo "❌ Missing CSP configuration file in encryption service"
fi

# Check for testCsp function in files
echo "Checking for testCsp function..."
if grep -q "export function testCsp" ./src/services/security/cspConfig.ts; then
  echo "✅ testCsp function found in security CSP config"
else
  echo "❌ testCsp function not found in security CSP config"
fi

if grep -q "export function testCsp" ./src/services/encryption/cspConfig.ts; then
  echo "✅ testCsp function found in encryption CSP config"
else
  echo "❌ testCsp function not found in encryption CSP config"
fi

echo ""
echo "=== Checking Import References ==="
# Test for import reference errors by using grep
echo "Checking import references in initialize.ts..."
if grep -q "unblockPingRequests" ./src/services/initialize.ts; then
  echo "✅ Found correct import for unblockPingRequests"
else
  echo "❌ Missing correct import for unblockPingRequests"
fi

if grep -q "security/corsConfig" ./src/services/initialize.ts; then
  echo "✅ Found correct import path for corsConfig"
else
  echo "❌ Missing correct import path for corsConfig"
fi

if grep -q "security/securityEnhancements" ./src/services/initialize.ts; then
  echo "✅ Found correct import path for securityEnhancements"
else
  echo "❌ Missing correct import path for securityEnhancements"
fi

echo ""
echo "=== Test Summary ==="
echo "All tests have been completed."
echo "Please review the results above to ensure the migration was successful."
echo "If any tests failed, please address the issues before deploying to production."
echo ""
echo "To deploy the application, run: npm run deploy"
echo "=== End of Migration Verification Tests ==="
