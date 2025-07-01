#!/bin/bash

echo "🔧 Emergency GitHub Actions Fix - Autoprefixer Dependencies"
echo "============================================================="

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Clean npm cache
echo "🧹 Cleaning npm cache..."
npm cache clean --force

# Remove node_modules to ensure fresh install
echo "🗑️ Removing node_modules for clean install..."
rm -rf node_modules

# Remove package-lock.json and regenerate
echo "🔄 Regenerating package-lock.json..."
rm -f package-lock.json

# Install dependencies fresh
echo "📦 Installing dependencies fresh..."
npm install

# Explicitly verify autoprefixer
echo "🔍 Verifying autoprefixer installation..."
npm ls autoprefixer

# Test the build
echo "🏗️ Testing build process..."
npm run build

echo "✅ Emergency fix complete!"
echo "📋 Next steps:"
echo "   1. Commit the updated package-lock.json"
echo "   2. Push to trigger GitHub Actions"
echo "   3. Verify CI/CD passes"
