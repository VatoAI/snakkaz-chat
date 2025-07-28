#!/bin/bash

echo "🚨 EMERGENCY REBOOT: SnakkaZ Norwegian Aurora System"
echo "=========================================="

# Kill all existing processes
echo "🔥 Stopping all Vite processes..."
pkill -f vite || true
pkill -f node || true

# Wait for processes to stop
sleep 2

# Clean all caches
echo "🧹 Nuclear cache cleanup..."
rm -rf node_modules/.vite || true
rm -rf dist || true
rm -rf .next || true
rm -rf .turbo || true

# Start with minimal config on port 3000
echo "🚀 Starting SnakkaZ on port 3000 with Norwegian Aurora..."
npm run dev -- --config vite.config.minimal.ts --port 3000 --host

echo "✅ SnakkaZ Emergency Reboot Complete!"
echo "🌊 Norwegian Aurora Design should now be visible at http://localhost:3000"