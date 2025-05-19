#!/bin/bash
#
# Fix script to rebuild and deploy Snakkaz Chat with runtime error fixes
# May 19, 2025
#

echo "🚀 Snakkaz Chat Rebuild and Deploy Script"
echo "========================================"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: This script must be run from the project root directory!"
  exit 1
fi

echo "1️⃣ Clearing previous build artifacts..."
rm -rf dist/
npm cache clean --force

echo "2️⃣ Installing dependencies..."
npm install

echo "3️⃣ Building the application with fixes..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please check the errors above."
  exit 1
fi

echo "4️⃣ Creating a deployable zip file..."
cd dist/
zip -r ../snakkaz-chat-fixed.zip ./*
cd ..

echo "5️⃣ Validating the build..."

# Check for critical files
if [ ! -f "dist/index.html" ]; then
  echo "❌ Error: index.html is missing from the build!"
  exit 1
fi

if [ ! -f "dist/service-worker.js" ]; then
  echo "❌ Error: service-worker.js is missing from the build!"
  exit 1
fi

echo "✅ Build validated successfully!"
echo
echo "🎯 Next steps:"
echo "1. Upload snakkaz-chat-fixed.zip to your hosting provider"
echo "2. Extract the files to your web root directory"
echo "3. Verify that the application works correctly"
echo
echo "The fixed application is now ready for deployment."
