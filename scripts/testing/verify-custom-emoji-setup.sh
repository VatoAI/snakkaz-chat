#!/bin/bash

# Custom Emoji Database Verification Script
echo "🔍 Testing Custom Emoji Database Migration..."

# Test if we can reach localhost dev server
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Development server is running"
else 
    echo "❌ Development server is not running. Please start with: npm run dev"
    exit 1
fi

echo ""
echo "📋 Next Steps:"
echo "1. Apply database migration manually in Supabase SQL Editor"
echo "2. Check the debug panel in the top-right corner of the app at http://localhost:5173"
echo "3. Look for 'Custom Emoji Debug' panel to see connection status"
echo ""
echo "🔗 Open the app to test: http://localhost:5173"
echo ""

# Try to open the browser automatically if possible
if command -v open >/dev/null 2>&1; then
    echo "🌐 Opening browser..."
    open http://localhost:5173
elif command -v xdg-open >/dev/null 2>&1; then
    echo "🌐 Opening browser..."
    xdg-open http://localhost:5173
else
    echo "Please manually open: http://localhost:5173"
fi
