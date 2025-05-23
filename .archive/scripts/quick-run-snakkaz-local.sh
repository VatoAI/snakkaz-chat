#!/bin/bash

# Quick script to run Snakkaz Chat locally
echo "🚀 Setting up local Snakkaz Chat environment..."

# Check if Bun is installed (Snakkaz seems to use Bun)
if ! command -v bun &> /dev/null; then
  echo "Installing Bun runtime..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  bun install
fi

# Run the development server
echo "Starting Snakkaz Chat locally..."
echo "Once started, open: http://localhost:5173 in your browser"
echo "-----------------------------------------------------"
bun run dev
