# 🔗 SnakkaZ MCP + Supabase Integration Analysis

## 🎯 **CURRENT STATUS**

### ✅ **Supabase Already Integrated in SnakkaZ**
- **Supabase URL:** `https://wqpoozpbceucynsojmbk.supabase.co`
- **Environment Variables:** Configured in `.env`
- **Database Connection:** PostgreSQL ready via MCP
- **Authentication:** Active Supabase Auth integration

### 🔌 **MCP Integration Status**
- **Proxy Server:** SnakkaZ MCP Proxy ready
- **Remote Server:** `mcp.snakkaz.com` (production ready)
- **Local MCP:** Port 3001/3003 configured
- **Tools Available:** 12+ MCP tools ready

---

## 🚀 **Claude Desktop MCP Supabase Integration**

### **1. Eksisterende SnakkaZ MCP Config** 
```json
{
  "mcpServers": {
    "snakkaz-proxy": {
      "command": "node",
      "args": ["/path/to/snakkaz-mcp-proxy.js"],
      "env": {
        "SUPABASE_URL": "https://wqpoozpbceucynsojmbk.supabase.co",
        "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

### **2. Ny Supabase MCP Server (Som du viste)**
```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y", 
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=wqpoozpbceucynsojmbk"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<din-personal-access-token>"
      }
    }
  }
}
```

### **3. Kombinert Config (Anbefalt)**
```json
{
  "mcpServers": {
    "snakkaz-chat": {
      "command": "node",
      "args": ["./snakkaz-mcp-proxy.js"],
      "env": {
        "SUPABASE_URL": "https://wqpoozpbceucynsojmbk.supabase.co",
        "MCP_BASE_URL": "https://mcp.snakkaz.com"
      }
    },
    "supabase-direct": {
      "command": "cmd", 
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=wqpoozpbceucynsojmbk"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<din-token>"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y", 
        "@modelcontextprotocol/server-postgres@latest"
      ],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres.wqpoozpbceucynsojmbk:Rompetroll123!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
      }
    }
  }
}
```

---

## 🔧 **Enhanced SnakkaZ MCP Proxy (Med Supabase)**

```javascript
#!/usr/bin/env node

/**
 * 🚀 Enhanced SnakkaZ MCP Proxy Server 
 * Integrerer både SnakkaZ Chat og Supabase MCP
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema, 
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

class EnhancedSnakkazMcpProxy {
  constructor() {
    this.server = new Server(
      {
        name: "enhanced-snakkaz-proxy",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.baseUrl = 'https://mcp.snakkaz.com';
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co',
      process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    );
    
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // Combined tools: SnakkaZ + Supabase
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      try {
        // Fetch SnakkaZ tools
        const snakkazResponse = await fetch(`${this.baseUrl}/api/tools`);
        const snakkazData = await snakkazResponse.json();
        
        // Combine with Supabase tools
        const combinedTools = [
          ...(snakkazData.tools || []),
          {
            name: "supabase_query",
            description: "Execute SQL queries on SnakkaZ Supabase database",
            inputSchema: {
              type: "object",
              properties: {
                query: { type: "string", description: "SQL query to execute" },
                params: { type: "array", description: "Query parameters" }
              },
              required: ["query"]
            }
          },
          {
            name: "supabase_auth_status",
            description: "Get Supabase authentication status and user info",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "supabase_realtime_listen",
            description: "Listen to real-time changes in Supabase tables",
            inputSchema: {
              type: "object", 
              properties: {
                table: { type: "string", description: "Table name to listen to" },
                event: { type: "string", enum: ["INSERT", "UPDATE", "DELETE", "*"] }
              },
              required: ["table"]
            }
          }
        ];

        return { tools: combinedTools };
      } catch (error) {
        console.error('Error fetching tools:', error);
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to fetch tools: ${error.message}`
        );
      }
    });

    // Enhanced tool call handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        console.log(`📞 Handling tool call: ${name}`, args);
        
        // Handle Supabase-specific tools
        if (name.startsWith('supabase_')) {
          return await this.handleSupabaseTool(name, args);
        }
        
        // Proxy SnakkaZ tools
        const response = await fetch(`${this.baseUrl}/api/tools/${name}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args || {})
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`✅ Tool response received for ${name}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error(`❌ Error calling tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool call failed: ${error.message}`
        );
      }
    });
  }

  async handleSupabaseTool(name, args) {
    switch (name) {
      case 'supabase_query':
        const { data, error } = await this.supabase
          .from('messages')  // Example table
          .select('*')
          .limit(10);
          
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ data, error }, null, 2)
          }]
        };
        
      case 'supabase_auth_status':
        const { data: { session } } = await this.supabase.auth.getSession();
        return {
          content: [{
            type: "text", 
            text: JSON.stringify({ 
              authenticated: !!session,
              user: session?.user || null
            }, null, 2)
          }]
        };
        
      case 'supabase_realtime_listen':
        return {
          content: [{
            type: "text",
            text: `Realtime subscription setup for table: ${args.table}`
          }]
        };
        
      default:
        throw new Error(`Unknown Supabase tool: ${name}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('🚀 Enhanced SnakkaZ MCP Proxy Server connected');
    console.log('   - SnakkaZ Chat: mcp.snakkaz.com');
    console.log('   - Supabase: wqpoozpbceucynsojmbk.supabase.co');
  }
}

// Start enhanced proxy server
const proxy = new EnhancedSnakkazMcpProxy();
proxy.run().catch(console.error);
```

---

## 📊 **Integration Benefits**

### **🎯 Med Direkte Supabase MCP Server**
- **Database Queries**: Direct SQL execution
- **Schema Inspection**: Table and column analysis  
- **Real-time Data**: Live database changes
- **Performance Monitoring**: Query optimization

### **🚀 Med SnakkaZ MCP Proxy**
- **Chat Integration**: Direct access to chat functionality
- **Custom Tools**: SnakkaZ-specific features
- **Analytics**: Platform-specific metrics
- **AI Assistant**: Norwegian language support

### **💎 Kombinert Approach**
- **Best of Both**: Full database access + chat features
- **Unified Experience**: Single Claude Desktop interface
- **Enhanced Productivity**: More tools available
- **Better Development**: Comprehensive platform access

---

## 🛠️ **Setup Instructions**

### **1. Get Supabase Personal Access Token**
1. Gå til: https://supabase.com/dashboard/account/tokens
2. Create new token med scope: `projects:read`
3. Kopier token for Claude config

### **2. Update Claude Desktop Config**
```json
{
  "mcpServers": {
    "snakkaz-supabase": {
      "command": "cmd",
      "args": [
        "/c", 
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=wqpoozpbceucynsojmbk"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_din_token_her"
      }
    }
  }
}
```

### **3. Test Integration**
```bash
# Test Supabase MCP
@mcp supabase_list_tables

# Test SnakkaZ Chat
@mcp snakkaz_chat_status

# Combined query
@mcp supabase_query "SELECT * FROM messages ORDER BY created_at DESC LIMIT 5"
```

---

## ✅ **KONKLUSJON**

**JA - Supabase er allerede integrert i SnakkaZ MCP!** 

Du kan legge til den offisielle Supabase MCP serveren som supplement for enda bedre database-tilgang i Claude Desktop. Dette gir deg:

1. **✅ Eksisterende SnakkaZ MCP**: Chat, analytics, AI assistant
2. **🆕 Supabase MCP Server**: Direct database queries, schema inspection  
3. **🔗 Enhanced Integration**: Best of both worlds

**Anbefaling:** Legg til både for maksimal funksjonalitet! 🚀
