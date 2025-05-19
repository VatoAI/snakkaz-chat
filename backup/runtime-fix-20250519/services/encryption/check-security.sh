#!/bin/bash

# Simple Cloudflare Security Check
echo "🔒 SNAKKAZ CLOUDFLARE SECURITY CHECKER 🔒"
echo "Checking security implementation..."
echo

SECURITY_DIR="/workspaces/snakkaz-chat/src/services/encryption"
cd $SECURITY_DIR

# Check if key security files exist
files_to_check=("securityEnhancements.ts" "secureCredentials.ts" "simpleEncryption.ts" "cloudflareApi.ts")
all_files_exist=true

echo "Checking for required security files:"
for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ Found: $file"
  else
    echo "❌ Missing: $file"
    all_files_exist=false
  fi
done

if [ "$all_files_exist" = false ]; then
  echo "Some required files are missing. Security check cannot continue."
  exit 1
fi

echo
echo "Checking for security features implementation:"

# Check for session timeout implementation
if grep -q "setupSessionTimeout" securityEnhancements.ts; then
  echo "✅ Session timeout implemented"
else
  echo "❌ Session timeout NOT implemented"
fi

# Check for rate limiting implementation
if grep -q "recordFailedAuthAttempt" securityEnhancements.ts; then
  echo "✅ Authentication rate limiting implemented"
else
  echo "❌ Authentication rate limiting NOT implemented"
fi

# Check for enhanced encryption
if grep -q "enhancedEncrypt" securityEnhancements.ts; then
  echo "✅ Enhanced encryption implemented"
else
  echo "❌ Enhanced encryption NOT implemented"
fi

# Check for AES-GCM
if grep -q "AES-GCM" simpleEncryption.ts; then
  echo "✅ Using AES-GCM for authenticated encryption"
else
  echo "❌ NOT using AES-GCM for encryption"
fi

# Check for PBKDF2 iterations
if grep -q -P "iterations:\s*\d{5,}" simpleEncryption.ts; then
  iterations=$(grep -P "iterations:\s*\d+" simpleEncryption.ts | grep -o -P "\d+")
  echo "✅ Using strong PBKDF2 with $iterations iterations"
else
  echo "❌ PBKDF2 iterations may be too low"
fi

# Check for secure IV generation
if grep -q "getRandomValues" simpleEncryption.ts; then
  echo "✅ Using secure random IV generation"
else
  echo "❌ NOT using secure random IV generation"
fi

# Check for integration with secure credentials
if grep -q "setupSessionTimeout" secureCredentials.ts && grep -q "checkSessionTimeout" secureCredentials.ts; then
  echo "✅ Session timeout integrated with credential system"
else
  echo "❌ Session timeout NOT integrated with credential system"
fi

echo
echo "📋 SECURITY ANALYSIS COMPLETE 📋"
echo
echo "RECOMMENDATIONS:"
echo "1. Implement session timeout for additional security"
echo "2. Add two-factor authentication for critical operations"
echo "3. Consider using a more secure storage method than localStorage"
echo "4. Implement rate limiting to prevent brute force attacks"
echo "5. Add input validation for all API parameters"
