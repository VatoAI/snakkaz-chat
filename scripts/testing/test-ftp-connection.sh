#!/bin/bash

echo "🧪 Quick Subdomain Deployment Test"
echo "================================="
echo ""

# Test if we can connect and check directories
echo "📂 Checking current subdomain directories..."

# Create a simple test script
cat > /tmp/ftp_test.txt << 'EOF'
open ftp.snakkaz.com
user @snakkaz.com Snakkaz$09102024
binary
pwd
ls
cd public_html
ls
cd dash
ls
cd ..
cd business
ls
quit
EOF

echo "🔗 Connecting to FTP server..."
if timeout 30 ftp -n < /tmp/ftp_test.txt > /tmp/ftp_test_output.txt 2>&1; then
    echo "✅ FTP connection successful"
    echo ""
    echo "📋 Directory contents:"
    cat /tmp/ftp_test_output.txt | grep -E "(dash|business|docs|analytics|mcp|help|index\.html)"
else
    echo "❌ FTP connection failed or timed out"
    echo ""
    echo "📄 Connection log:"
    cat /tmp/ftp_test_output.txt 2>/dev/null || echo "No log available"
fi

rm -f /tmp/ftp_test.txt /tmp/ftp_test_output.txt

echo ""
echo "💡 If FTP is working, we can proceed with full deployment"
echo "💡 If FTP fails, we may need alternative deployment method"
