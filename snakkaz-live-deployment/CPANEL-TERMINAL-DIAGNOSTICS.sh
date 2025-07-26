#!/bin/bash

# 🇳🇴 SNAKKAZ CPANEL TERMINAL DIAGNOSTIC COMMANDS
echo "🔍 SNAKKAZ MCP SERVER DIAGNOSTICS"
echo "================================="

echo ""
echo "📋 RUN THESE COMMANDS IN CPANEL TERMINAL:"
echo ""

echo "1️⃣ CHECK CURRENT DIRECTORY AND FILES:"
echo "pwd"
echo "ls -la"
echo "ls -la /home/snakqsqe/mcp.snakkaz.com/"
echo ""

echo "2️⃣ CHECK NODE.JS PROCESSES:"
echo "ps aux | grep node"
echo "ps aux | grep simplified-server"
echo ""

echo "3️⃣ CHECK IF MCP SERVER IS RUNNING:"
echo "curl -I http://localhost:3000/api/health"
echo "curl -I https://mcp.snakkaz.com/api/health"
echo ""

echo "4️⃣ CHECK SERVER FILES EXIST:"
echo "ls -la /home/snakqsqe/mcp.snakkaz.com/simplified-server.js"
echo "ls -la /home/snakqsqe/mcp.snakkaz.com/package.json"
echo "ls -la /home/snakqsqe/mcp.snakkaz.com/start-mcp.sh"
echo ""

echo "5️⃣ CHECK ENVIRONMENT AND NODE VERSION:"
echo "node --version"
echo "npm --version"
echo "which node"
echo "echo \$PORT"
echo ""

echo "6️⃣ MANUAL START SERVER (IF NOT RUNNING):"
echo "cd /home/snakqsqe/mcp.snakkaz.com/"
echo "node simplified-server.js"
echo ""

echo "7️⃣ CHECK SERVER LOGS/ERRORS:"
echo "cd /home/snakqsqe/mcp.snakkaz.com/"
echo "cat simplified-server.js | head -20"
echo ""

echo "8️⃣ EMERGENCY RESTART COMMANDS:"
echo "cd /home/snakqsqe/mcp.snakkaz.com/"
echo "killall node"
echo "nohup node simplified-server.js &"
echo ""

echo "🚨 MOST LIKELY ISSUES:"
echo "   → Application startup file not set to 'simplified-server.js'"
echo "   → Node.js app not restarted after ZIP upload"
echo "   → PORT environment variable not set to 3000"
echo "   → File permissions incorrect"
echo ""

echo "💡 QUICK FIX SEQUENCE:"
echo "1. Go to cPanel → Node.js → mcp.snakkaz.com app"
echo "2. Set 'Application startup file' to: simplified-server.js"
echo "3. Click 'SAVE'"
echo "4. Click 'RESTART'"
echo "5. Test: https://mcp.snakkaz.com/api/health"
echo ""

echo "🇳🇴 Norwegian Tech Excellence - SnakkaZ Diagnostics!"
