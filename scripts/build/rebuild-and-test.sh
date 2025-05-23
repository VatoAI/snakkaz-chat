#!/bin/bash

# Rebuild Snakkaz Chat application after fixing issues
echo "Rebuilding Snakkaz Chat application..."

# Navigate to the workspace directory
cd /workspaces/snakkaz-chat

# Install dependencies if needed
echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the application
echo "Building the application..."
npm run build

# Check for TypeScript errors
echo "Checking for TypeScript errors..."
npx tsc --noEmit

# Start the development server for testing
echo "Starting development server for testing..."
echo "Use Ctrl+C to stop the server when done testing"
npm run dev
