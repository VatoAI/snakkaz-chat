@echo off
echo 🚀 Starting SnakkaZ MCP Server...
echo Domain: mcp.snakkaz.com
echo Port: 3000
echo Time: %date% %time%
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install --production
)

REM Start the server
echo 🌟 Starting HTTP server...
node server.js
