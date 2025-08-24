#!/bin/bash
# Start SnakkaZ Enhanced MCP API Server

cd /var/www/mcp-api/
echo "Starting SnakkaZ Enhanced MCP API Server..."

# Install dependencies
npm install --production

# Start with PM2 (recommended) or fallback to node
if command -v pm2 &> /dev/null; then
    echo "Starting with PM2..."
    pm2 delete snakkaz-mcp-enhanced 2>/dev/null
    pm2 start server.js --name snakkaz-mcp-enhanced --env production
    pm2 save
    echo "✅ Started with PM2"
else
    echo "Starting with Node.js..."
    nohup node server.js > logs/server.log 2>&1 &
    echo $! > server.pid
    echo "✅ Started with Node.js (PID: $(cat server.pid))"
fi

echo "🎉 SnakkaZ Enhanced MCP API Server is running!"
echo "🌐 Access: https://mcp.snakkaz.com/api/health"
