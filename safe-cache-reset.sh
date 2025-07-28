#!/bin/bash

# 🔒 SNAKKAZ SAFE CACHE RESET SCRIPT
# This script safely stops development servers without affecting VS Code

echo "🔍 Checking for development servers..."

# Find Next.js servers
NEXT_PIDS=$(ps aux | grep "next-server" | grep -v grep | awk '{print $2}')
if [ ! -z "$NEXT_PIDS" ]; then
    echo "🔄 Stopping Next.js servers: $NEXT_PIDS"
    echo $NEXT_PIDS | xargs kill 2>/dev/null
else
    echo "✅ No Next.js servers running"
fi

# Find Vite development servers (specific patterns)
VITE_PIDS=$(ps aux | grep -E "vite.*dev|vite.*build|vite.*preview" | grep -v grep | awk '{print $2}')
if [ ! -z "$VITE_PIDS" ]; then
    echo "🔄 Stopping Vite servers: $VITE_PIDS"
    echo $VITE_PIDS | xargs kill 2>/dev/null
else
    echo "✅ No Vite servers running"
fi

# Find npm/yarn dev processes (avoid VS Code ones)
DEV_PIDS=$(ps aux | grep -E "npm.*dev|yarn.*dev" | grep -v grep | grep -v vscode | awk '{print $2}')
if [ ! -z "$DEV_PIDS" ]; then
    echo "🔄 Stopping npm/yarn dev processes: $DEV_PIDS"
    echo $DEV_PIDS | xargs kill 2>/dev/null
else
    echo "✅ No npm/yarn dev processes running"
fi

echo "🧹 Cleaning cache directories..."

# Remove cache directories safely
cd /workspaces/snakkaz-chat
rm -rf node_modules 2>/dev/null && echo "  ✅ node_modules removed"
rm -rf .vite 2>/dev/null && echo "  ✅ .vite cache removed"  
rm -rf dist 2>/dev/null && echo "  ✅ dist folder removed"
rm -rf .next 2>/dev/null && echo "  ✅ .next cache removed"
rm -rf .turbo 2>/dev/null && echo "  ✅ .turbo cache removed"

# Clean npm cache
npm cache clean --force 2>/dev/null && echo "  ✅ npm cache cleared"

echo "🎉 Safe cache reset complete! VS Code and MCP remain intact."
echo "🚀 Ready for fresh installation!"
