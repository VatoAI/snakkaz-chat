#!/bin/bash

# Script to test the build process to verify our fixes

echo "===== Testing Build Process ====="
echo "Building Snakkaz Chat application..."

# Run the build command
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build successful! The encryptionService fix worked."
  echo "The build error has been resolved."
else
  echo "❌ Build failed. More investigation needed."
  echo "Check the error messages above for details."
fi

echo "===== Build Test Complete ====="
