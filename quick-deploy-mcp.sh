#!/bin/bash

echo "🚀 SnakkaZ MCP CORS Server - Quick Deploy Script"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Starting MCP CORS Server deployment...${NC}"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Installing...${NC}"
    # Add Node.js installation commands here if needed
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm not found. Please install Node.js first.${NC}"
    exit 1
fi

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
else
    echo -e "${BLUE}📦 Creating package.json and installing dependencies...${NC}"
    cat > package.json << EOF
{
  "name": "snakkaz-mcp-cors-server",
  "version": "1.0.0",
  "description": "CORS Server for SnakkaZ MCP Integration",
  "main": "mcp-cors-server.cjs",
  "scripts": {
    "start": "node mcp-cors-server.cjs",
    "dev": "nodemon mcp-cors-server.cjs"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF
    npm install
fi

# Start the server
echo -e "${GREEN}🚀 Starting MCP CORS Server...${NC}"
echo -e "${BLUE}📍 Server will run on http://localhost:3000${NC}"
echo -e "${BLUE}🌐 Available endpoints:${NC}"
echo -e "   • GET  /api/health - Health check"
echo -e "   • POST /api/chat   - Chat messages"
echo -e "   • GET  /api/mcp/status - MCP status"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop the server${NC}"
echo ""

# Run the server
node mcp-cors-server.cjs
