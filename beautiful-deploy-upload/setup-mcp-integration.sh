#!/bin/bash

# SnakkaZ MCP Quick Setup
# Automatisk installation av de viktigste MCP serverne for SnakkaZ

echo "🚀 SnakkaZ MCP Integration Setup"
echo "================================"

# Sjekk at vi er i riktig directory
if [ ! -f "package.json" ]; then
    echo "❌ Må kjøres fra SnakkaZ root directory"
    exit 1
fi

echo "📦 Installing essential MCP servers for SnakkaZ..."

# 1. Memory MCP Server - For chat context/history
echo "🧠 Installing Memory MCP Server..."
npm install -g @modelcontextprotocol/server-memory

# 2. Sequential Thinking - For complex AI tasks
echo "🤔 Installing Sequential Thinking MCP Server..."
npm install -g @modelcontextprotocol/server-sequential-thinking

# 3. PostgreSQL/Database integration
echo "🗄️ Installing PostgreSQL MCP Server..."
npm install -g @modelcontextprotocol/server-postgres

# 4. Web Search capabilities
echo "🔍 Installing Web Search MCP Server..."
npm install -g @modelcontextprotocol/server-brave-search

# 5. GitHub integration
echo "🐙 Installing GitHub MCP Server..."
npm install -g @modelcontextprotocol/server-github

# Opprett .env fil hvis den ikke finnes
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file with MCP configuration..."
    cat > .env << 'EOF'
# SnakkaZ MCP Configuration
GITHUB_PERSONAL_ACCESS_TOKEN=your-github-token-here
BRAVE_API_KEY=your-brave-search-key-here
POSTGRES_CONNECTION_STRING=postgresql://postgres.qltlpexhqmqrohzmnqkx:rompetroll123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
EOF
fi

# Opprett MCP konfiguration
echo "⚙️ Configuring MCP servers in VS Code..."

mkdir -p .vscode

cat > .vscode/mcp-config.json << 'EOF'
{
  "mcpServers": {
    "memory": {
      "command": "mcp-server-memory",
      "args": [],
      "env": {}
    },
    "sequential-thinking": {
      "command": "mcp-server-sequential-thinking", 
      "args": [],
      "env": {}
    },
    "postgres": {
      "command": "mcp-server-postgres",
      "args": [],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres.qltlpexhqmqrohzmnqkx:rompetroll123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
      }
    },
    "brave-search": {
      "command": "mcp-server-brave-search",
      "args": [],
      "env": {
        "BRAVE_API_KEY": "your-brave-search-key-here"
      }
    },
    "github": {
      "command": "mcp-server-github",
      "args": [],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token-here"
      }
    },
    "snakkaz-custom": {
      "command": "node",
      "args": ["./MCP SnakkaZ/build/server.js"],
      "env": {
        "SNAKKAZ_API_URL": "https://mcp.snakkaz.com/api",
        "SNAKKAZ_DB_URL": "postgresql://postgres.qltlpexhqmqrohzmnqkx:rompetroll123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
        "NODE_ENV": "production"
      }
    }
  }
}
EOF

echo ""
echo "✅ MCP Setup Complete!"
echo ""
echo "🎯 Neste steg:"
echo "1. Åpne VS Code Command Palette (Ctrl+Shift+P)"
echo "2. Søk etter 'MCP: Reload Servers'"
echo "3. Start en GitHub Copilot Chat session"
echo "4. Test med: @memory, @sequential-thinking, @postgres, @snakkaz-custom"
echo ""
echo "📋 Tilgjengelige MCP tools:"
echo "  🧠 @memory - Chat context og brukerpreferanser"
echo "  🤔 @sequential-thinking - Komplekse oppgaver steg-for-steg"
echo "  🗄️ @postgres - Database queries"
echo "  🔍 @brave-search - Web search"
echo "  🐙 @github - GitHub operasjoner"
echo "  🔧 @snakkaz-custom - SnakkaZ spesifikke tools"
echo ""
echo "⚠️ Husk å oppdatere API nøkler i .env filen!"
echo ""
echo "📖 Mer info: https://github.com/modelcontextprotocol/servers"
