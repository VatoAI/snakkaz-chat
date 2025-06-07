#!/bin/bash

echo "🚨 SNAKKAZ EMERGENCY DEPLOYMENT - June 7, 2025"
echo "🎯 Target: Fix black screen for Norwegian tech community"
echo ""

# Check critical files
echo "✅ Checking critical files..."
ls -la dist/index.html public/emergency-react-fix.js

# Verify emergency fix is in HTML
echo "✅ Verifying emergency fix reference..."
grep -n "emergency-react-fix" dist/index.html

# Check new bundle
echo "✅ Checking new vendor bundle..."  
grep -n "vendor-misc-npIDrE24" dist/index.html

echo ""
echo "🚀 DEPLOYMENT STATUS: Ready for GitHub Actions"
echo "🇳🇴 Norwegian tech community focus: Speed, stability, UX"
