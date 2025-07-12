#!/bin/bash

# Snakkaz Chat - Memory System Integration Test
# Tests the connection between frontend and Python MCP server

echo "🧠 SNAKKAZ MEMORY SYSTEM CHECK"
echo "============================"
echo "Date: $(date)"
echo ""

# Check Python MCP Server status
echo "🐍 Python MCP Server Status:"

# Check if the Python server directory exists
if [ -d "/workspaces/snakkaz-chat/src/services/mcp" ]; then
    echo "   ✅ MCP server directory found"
    
    # Check for the main server file
    if [ -f "/workspaces/snakkaz-chat/src/services/mcp/memoryServer.py" ]; then
        echo "   ✅ memoryServer.py found"
        
        # Check if the server can be started (without actually starting it)
        if command -v python3 &>/dev/null; then
            echo "   ✅ Python3 is available"
            # Check for requirements file
            if [ -f "/workspaces/snakkaz-chat/src/services/mcp/requirements.txt" ]; then
                echo "   ✅ requirements.txt found"
                echo "   💡 Run: cd /workspaces/snakkaz-chat/src/services/mcp && python3 memoryServer.py"
            else
                echo "   ⚠️  requirements.txt not found"
                echo "   💡 Create a requirements.txt file with necessary dependencies"
            fi
        else
            echo "   ❌ Python3 not found - please install it"
        fi
    else
        echo "   ❌ memoryServer.py not found"
    fi
else
    echo "   ❌ MCP server directory not found"
fi

echo ""

# Check TypeScript integration
echo "🔄 TypeScript Integration Status:"
if [ -f "/workspaces/snakkaz-chat/src/services/ai/memoryService.ts" ]; then
    echo "   ✅ memoryService.ts found"
    
    # Check for environment configuration
    if grep -q "MCP_SERVER_URL\|MEMORY_API_URL" "/workspaces/snakkaz-chat/.env"; then
        echo "   ✅ MCP server environment variables configured"
    else
        echo "   ⚠️  MCP server environment variables not found in .env"
        echo "   💡 Add MCP_SERVER_URL to .env file"
    fi
else
    echo "   ❌ memoryService.ts not found"
fi

echo ""

# Check React Component Integration
echo "🖥️  React Integration Status:"
if [ -f "/workspaces/snakkaz-chat/src/pages/MemoryDashboard.tsx" ]; then
    echo "   ✅ MemoryDashboard.tsx found"
    
    # Check for memory navigation
    if grep -q "Brain\|memory" "/workspaces/snakkaz-chat/src/components/navigation/UnifiedNavigation.tsx"; then
        echo "   ✅ Memory navigation integration found"
    else
        echo "   ❌ Memory navigation integration not found in UnifiedNavigation.tsx"
    fi
else
    echo "   ❌ MemoryDashboard.tsx not found"
fi

echo ""

echo "🧪 Memory System Test Steps:"
echo "   1. Start MCP server: cd src/services/mcp && python3 memoryServer.py"
echo "   2. Start frontend: npm run dev"
echo "   3. Login to application"
echo "   4. Navigate to Memory dashboard using Brain icon"
echo "   5. Verify data loading from backend"

echo ""
echo "Memory system check completed at $(date)"
