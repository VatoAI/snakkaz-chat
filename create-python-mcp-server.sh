#!/bin/bash

# Deploy Python MCP Memory Server to mcp.snakkaz.com
echo "🧠 Deploying Python MCP Memory Server..."

# Create Python server package
mkdir -p python-mcp-server
cp src/services/mcp/memoryServer.py python-mcp-server/
cp requirements.txt python-mcp-server/ 2>/dev/null || echo "# MCP Memory Server Dependencies
asyncpg==0.30.0
pgvector==0.2.0
openai==1.58.0
redis==5.1.1
mcp==1.0.0
python-dotenv==1.0.1" > python-mcp-server/requirements.txt

# Create server entry point
cat > python-mcp-server/server.py << 'EOF'
#!/usr/bin/env python3
"""
Snakkaz MCP Memory Server
Production deployment for mcp.snakkaz.com
"""

import os
import sys
import asyncio
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from memoryServer import MemoryMCPServer

async def main():
    """Main server entry point"""
    print("🧠 Starting Snakkaz MCP Memory Server...")
    
    # Initialize server
    server = MemoryMCPServer()
    await server.setup()
    
    # Start cleanup process
    asyncio.create_task(server.cleanup_expired_memories())
    
    print("✅ MCP Memory Server ready")
    print("🌐 Available at: mcp.snakkaz.com")
    
    # Keep server running
    try:
        await asyncio.Event().wait()
    except KeyboardInterrupt:
        print("🛑 Server shutdown requested")

if __name__ == "__main__":
    asyncio.run(main())
EOF

# Create deployment configuration
cat > python-mcp-server/.env.production << 'EOF'
# Production configuration for MCP Memory Server
ENVIRONMENT=production
VITE_SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MDM1MzcsImV4cCI6MjA0ODQ3OTUzN30.mM1DBkZsJHiRjyQ6hUrVJT1n4fAI7Eo6SkAJMTNB7G0
OPENAI_API_KEY=${VITE_ANTHROPIC_API_KEY}
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://postgres:${SUPABASE_DB_PASSWORD}@wqpoozpbceucynsojmbk.supabase.co:5432/postgres
EOF

# Create startup script
cat > python-mcp-server/start.sh << 'EOF'
#!/bin/bash
echo "🧠 Starting MCP Memory Server..."

# Load environment
source .env.production

# Install dependencies
pip3 install -r requirements.txt --user

# Start server
python3 server.py
EOF

chmod +x python-mcp-server/start.sh

echo "✅ Python MCP Memory Server package ready"
echo "📁 Location: python-mcp-server/"
echo "🚀 To deploy: Upload python-mcp-server/ to mcp.snakkaz.com"
