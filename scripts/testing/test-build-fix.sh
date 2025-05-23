#!/bin/bash

# Script to test the build process to verify our fixes

echo "===== Testing Build Process ====="
echo "Building Snakkaz Chat application..."

# Run the build command
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build successful! All import fixes worked."
  echo "Fixed issues:"
  echo "  - encryptionService import in SecureMessageViewer.tsx"
  echo "  - Import paths in groupChatService.ts"
  echo "Build errors resolved successfully."
else
  echo "❌ Build failed. More investigation needed."
  echo "Check the error messages above for details."
fi

echo "===== Build Test Complete ====="
