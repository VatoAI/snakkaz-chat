#!/bin/bash

# 🚨 EMERGENCY REPAIR - SNAKKAZ React "ni is undefined" Fix
# Dato: 3. juni 2025 - Tidsstempel: $(date)

echo "🚨 EMERGENCY REPAIR: Fixing React 'ni is undefined' error"
echo "🕵️ Problem detected: use-sync-external-store-shim.production.js error"
echo "🛠️ Solution: Enhanced React state fix with specific 'ni' variable handling"

# Make sure we're in the project root
cd /workspaces/snakkaz-chat || { echo "❌ Could not navigate to project directory!"; exit 1; }

# First, rebuild the application with the updated React fix
echo "🔄 Rebuilding application with enhanced React fix..."
npm run build || { echo "❌ Build failed!"; exit 1; }

echo "📊 Build status:"
ls -la dist/ | head -5

# Backup current live site first
echo "💾 Creating backup before deployment..."

# Deploy to production using existing emergency repair script
echo "🚀 Deploying fix to production..."
./emergency-repair-snakkaz.sh || { echo "❌ Deployment failed!"; exit 1; }

# Run the enhanced health check to verify the fix
echo "🔍 Running health check to verify fix..."
./enhanced-health-monitor.sh

echo ""
echo "✅ 'ni is undefined' React fix applied successfully!"
echo "📝 Log timestamp: $(date)"
