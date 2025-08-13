#!/bin/bash
echo "🛑 Stopping SnakkaZ MCP Server..."
if [ -n "34515" ]; then
    kill 34515 2>/dev/null
    echo "✅ MCP Server stopped (PID: 34515)"
else
    pkill -f "python3 -m http.server 8080"
    echo "✅ MCP Server processes killed"
fi
