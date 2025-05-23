#!/bin/bash
set -e

echo "Fixing import errors in the codebase..."

# Rebuild TypeScript type definitions
echo "Clearing TypeScript cache..."
rm -rf node_modules/.vite
find . -name "*.tsbuildinfo" -delete

# Fix the UserStatus import
echo "Fixing UserStatus import in DirectMessageList.tsx..."
sed -i 's/import { UserStatus } from "@\/types\/presence";/import type { UserStatus } from "@\/types\/presence";/' src/components/chat/friends/DirectMessageList.tsx

echo "Running build to validate fixes..."
npm run build

echo "Import errors fixed successfully!"
