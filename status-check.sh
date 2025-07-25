#!/bin/bash

# SnakkaZ Beta Status Check
echo "🚀 SnakkaZ Beta Status Check"
echo "============================"

# Check Vite Dev Server (Frontend)
echo "📱 Frontend (Vite Dev Server):"
if curl -s http://localhost:5175 > /dev/null; then
    echo "  ✅ Running on http://localhost:5175"
else
    echo "  ❌ Not running - Start with: npm run dev"
fi

# Check MCP Server (Backend)
echo ""
echo "⚡ Backend (MCP Server):"
if curl -s http://localhost:3003/health > /dev/null; then
    echo "  ✅ Running on http://localhost:3003"
    echo "  📊 Health: $(curl -s http://localhost:3003/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
else
    echo "  ❌ Not running - Start with: node snakkaz-mcp-server.js"
fi

# Check Glass Liquid Design
echo ""
echo "🎨 Glass Liquid Design:"
if [ -f "src/styles/master-design-system.css" ]; then
    echo "  ✅ Design system files present"
else
    echo "  ❌ Design system files missing"
fi

# Check MCP Memory
echo ""
echo "🧠 MCP Memory:"
if curl -s http://localhost:3003/knowledge/search > /dev/null; then
    echo "  ✅ Knowledge endpoint available"
else
    echo "  ⚠️  Knowledge endpoint needs configuration"
fi

echo ""
echo "🇳🇴 Ready for Norwegian Tech Community Beta!"
echo "Visit: http://localhost:5175"
