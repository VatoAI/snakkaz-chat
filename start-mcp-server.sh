#!/bin/bash

# SnakkaZ MCP Server Starter Script
# Handles proper directory navigation and startup

echo "🚀 Starting SnakkaZ MCP Server..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "mcp-server/server.js" ]; then
    echo "❌ Error: server.js not found in mcp-server/"
    echo "📂 Current directory: $(pwd)"
    echo "💡 Run this script from the root project directory"
    exit 1
fi

# Navigate to mcp-server directory
cd mcp-server

echo "📂 Working directory: $(pwd)"
echo "📋 Checking dependencies..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔍 Testing server file..."
if [ -f "server.js" ]; then
    echo "✅ server.js found"
else
    echo "❌ server.js not found"
    exit 1
fi

echo ""
echo "🚀 Starting MCP Server..."
echo "📡 Server will be available for VS Code MCP integration"
echo "🛑 Press Ctrl+C to stop"
echo ""

# Start the server
node server.js
