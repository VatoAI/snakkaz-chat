#!/bin/bash
echo "🧪 Testing SnakkaZ Beta Live..."
echo "🌐 Checking www.snakkaz.com..."

# Test if site is reachable
if curl -s -o /dev/null -w "%{http_code}" "https://www.snakkaz.com" | grep -q "200"; then
    echo "✅ Site is online!"
    echo "🎉 SnakkaZ Beta launch successful!"
else
    echo "❌ Site is not reachable or returning errors"
    echo "🔧 Check deployment and try again"
fi
