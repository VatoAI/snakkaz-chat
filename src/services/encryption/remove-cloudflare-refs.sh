#!/bin/bash
# Script to remove Cloudflare references from systemHealthCheck.ts
# Created: May 14, 2025

echo "===== Removing Cloudflare References ====="
echo "This script will replace all Cloudflare references in systemHealthCheck.ts with Namecheap equivalent functionality."

# Create backup of original file
cp /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts.bak
echo "✅ Created backup: systemHealthCheck.ts.bak"

# Function to replace Cloudflare references
replace_cloudflare_references() {
  # Replace testCloudflareAnalytics with testAnalytics
  sed -i 's/testCloudflareAnalytics/testAnalytics/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
  
  # Replace checkCloudflareStatus with checkNamecheapStatus
  sed -i 's/checkCloudflareStatus/checkNamecheapStatus/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
  
  # Replace checkCloudflareDnsStatus with checkNamecheapDnsStatus
  sed -i 's/checkCloudflareDnsStatus/checkNamecheapDnsStatus/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
  
  # Replace runCloudflareNetworkDiagnostics with runNamecheapNetworkDiagnostics
  sed -i 's/runCloudflareNetworkDiagnostics/runNamecheapNetworkDiagnostics/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
  
  # Replace all references to cloudflareAnalytics with snakkazAnalytics
  sed -i 's/cloudflareAnalytics/snakkazAnalytics/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
  
  # Replace all references to cloudflareDns with namecheapDns
  sed -i 's/cloudflareDns/namecheapDns/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts

  # Replace all occurrences of "Cloudflare" in comments and strings with "Namecheap"
  sed -i 's/Cloudflare/Namecheap/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
  
  # Fix one occurrence we want to preserve for operational reasons
  sed -i 's/cdn.namecheapinsights.com/cdn.gpteng.co/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
}

# Execute the function
replace_cloudflare_references
echo "✅ Replaced all Cloudflare references"

# Update the implementation of key functions by copying from updatedFunctions.ts
echo "Updating implementation of key functions..."
functions_to_replace=(
  "testAnalytics"
  "checkNamecheapStatus"
  "checkDomainReachable"
  "runNamecheapNetworkDiagnostics"
  "checkNamecheapDnsStatus"
  "checkDnsHealth"
  "runComprehensiveHealthCheck"
)

for func in "${functions_to_replace[@]}"; do
  # Extract function from updatedFunctions.ts
  func_code=$(sed -n "/export function ${func}(/,/^}/p" /workspaces/snakkaz-chat/src/services/encryption/updatedFunctions.ts)
  
  # Replace function in systemHealthCheck.ts
  # This uses a temp file since direct in-place replacement with sed is complex for multi-line content
  start_line=$(grep -n "export function ${func}(" /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts | cut -d':' -f1)
  
  if [ -n "$start_line" ]; then
    end_line=$(tail -n +$start_line /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts | grep -n "^}" | head -1 | cut -d':' -f1)
    end_line=$((start_line + end_line - 1))
    
    # Create temp file with content before function
    head -n $((start_line - 1)) /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts > /tmp/systemHealthCheck_temp.ts
    
    # Append new function implementation
    echo "$func_code" >> /tmp/systemHealthCheck_temp.ts
    
    # Append content after function
    tail -n +$((end_line + 1)) /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts >> /tmp/systemHealthCheck_temp.ts
    
    # Replace original file with temp file
    cp /tmp/systemHealthCheck_temp.ts /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
    
    echo "  - Updated function: $func"
  else
    echo "  - Warning: Function $func not found in systemHealthCheck.ts"
  fi
done

# Replace references to cloudflareApiToken
sed -i 's/cloudflareApiToken?: string;//g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
sed -i 's/cloudflareApiToken?: string//g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
sed -i 's/namecheapApiKey, cloudflareApiToken/namecheapApiKey/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
sed -i 's/cloudflareApiToken || //g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts

# Clean up private function references that have been renamed
sed -i 's/cloudflare:/namecheap:/g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
sed -i 's/cloudflare\./namecheap\./g' /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts

# Check if any Cloudflare references remain
remaining=$(grep -i "cloudflare" /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts | wc -l)
if [ "$remaining" -gt 0 ]; then
  echo "⚠️ Warning: $remaining Cloudflare references still remain"
  echo "  Please check these references manually:"
  grep -n -i "cloudflare" /workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
else
  echo "✅ All Cloudflare references have been removed!"
fi

echo "===== Cloudflare Reference Removal Complete ====="
