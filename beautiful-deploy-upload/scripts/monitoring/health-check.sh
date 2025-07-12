#!/bin/bash
# SNAKKAZ SYSTEM HEALTH CHECK
echo "🏥 Starting system health check..."
echo "Build status: $([ -d dist ] && echo "✅ Ready" || echo "❌ Missing")"
echo "FTP status: $(timeout 5 lftp -e "open ftp://ftp.snakkaz.com; quit" 2>/dev/null && echo "✅ Connected" || echo "❌ Failed")"
echo "Website status: $(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com)"
echo "✅ Health check completed"
