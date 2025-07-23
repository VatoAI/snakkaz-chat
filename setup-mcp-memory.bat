@echo off
title SnakkaZ MCP Memory System Setup
color 0A

echo.
echo     🧠 SNAKKAZ MCP MEMORY SYSTEM 🧠
echo =====================================
echo      Teaching AI about SnakkaZ App!
echo.

echo 📦 Installing MCP dependencies...
cd /d C:\SnakkaZ-AI
npm init -y
npm install @qdrant/js-client-rest axios express cors

echo.
echo 🏗️  Creating SnakkaZ knowledge collection...
curl -X PUT "http://localhost:6333/collections/snakkaz_memory" ^
  -H "Content-Type: application/json" ^
  -d "{\"vectors\":{\"size\":384,\"distance\":\"Cosine\"}}"

echo.
echo 💾 Loading SnakkaZ facts into Vector Database...
node load-snakkaz-knowledge.js

echo.
echo 🔗 Starting MCP-Enhanced Chat Server...
node snakkaz-mcp-server.js

echo.
echo 🎉 MCP MEMORY SYSTEM READY!
echo ===========================
echo 🧠 AI now knows about SnakkaZ app!
echo 🌐 Enhanced chat: http://localhost:3001/ai/smart
echo 🧪 Test MCP: node test-mcp-chat.js
echo.
pause
