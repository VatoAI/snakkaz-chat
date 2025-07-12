#!/bin/bash

echo "🔍 SNAKKAZ LOCAL TESTING SETUP - REACT COMPONENT FIX"
echo "==================================================="
echo ""

echo "🔧 Latest fix applied: React.Component class added to vendor-animation"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found - using Python HTTP server"
    SERVER_CMD="python3 -m http.server 8080"
elif command -v python &> /dev/null; then
    echo "✅ Python found - using Python HTTP server"
    SERVER_CMD="python -m http.server 8080"
elif command -v node &> /dev/null && command -v npx &> /dev/null; then
    echo "✅ Node.js found - using serve package"
    npx --yes serve@latest snakkaz-complete-deployment -p 8080 &
    SERVER_PID=$!
    echo "🚀 Server started with PID: $SERVER_PID"
    echo ""
    echo "📱 SNAKKAZ BETA CHAT - LOCAL ACCESS:"
    echo "=================================="
    echo "🌐 Local: http://localhost:8080"
    echo "🌐 Network: http://$(hostname -I | awk '{print $1}'):8080"
    echo ""
    echo "🔧 TESTING CHECKLIST:"
    echo "===================="
    echo "1. ✅ Check console for JavaScript errors"
    echo "2. ✅ Verify liquid glass design loads"
    echo "3. ✅ Test React Router navigation"
    echo "4. ✅ Check vendor file loading"
    echo "5. ✅ Test service worker registration"
    echo "6. ✅ Verify Supabase connection"
    echo ""
    echo "⚠️  PRESS CTRL+C TO STOP SERVER"
    echo ""
    
    # Wait for server to stop
    wait $SERVER_PID
    exit 0
else
    echo "❌ Neither Python nor Node.js found"
    echo "Please install one of them to run local server"
    exit 1
fi

echo ""
echo "📱 SNAKKAZ BETA CHAT - LOCAL ACCESS:"
echo "=================================="
echo "🌐 Local: http://localhost:8080"
echo "🌐 Network: http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo "🔧 TESTING CHECKLIST:"
echo "===================="
echo "1. ✅ Check console for JavaScript errors"
echo "2. ✅ Verify liquid glass design loads"  
echo "3. ✅ Test React Router navigation"
echo "4. ✅ Check vendor file loading"
echo "5. ✅ Test service worker registration"
echo "6. ✅ Verify Supabase connection"
echo ""

# Start server
cd snakkaz-complete-deployment
echo "🚀 Starting local server..."
echo "⚠️  PRESS CTRL+C TO STOP SERVER"
echo ""

exec $SERVER_CMD
