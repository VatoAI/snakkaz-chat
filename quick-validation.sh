#!/bin/bash
# Quick SnakkaZ Validation - 2 minute test
echo "🚀 QUICK SNAKKAZ VALIDATION"
echo "=========================="

# Start server
cd snakkaz-complete-deployment
python3 -m http.server 8081 &
SERVER_PID=$!
cd ..

sleep 3

echo "✅ Server: $(curl -s -I http://localhost:8081 | head -1)"
echo "✅ App loads: $(curl -s http://localhost:8081 | grep -o '<title>[^<]*' | sed 's/<title>//')"
echo "✅ PWA manifest: $(curl -s -I http://localhost:8081/manifest.json | head -1)"
echo "✅ Service Worker: $(curl -s -I http://localhost:8081/service-worker.js | head -1)"

echo ""
echo "🌐 Open browser to: http://localhost:8081"
echo "📝 Quick checklist:"
echo "   □ No console errors"
echo "   □ Liquid glass design visible"
echo "   □ PWA install prompt"

read -p "Press Enter when done testing..."
kill $SERVER_PID
echo "✅ Quick test complete!"
