# 🚀 Claude Desktop MCP Configuration for SnakkaZ + Supabase

## 📂 **Where to Put the Config File**

### Windows (Your System):

```
C:\Users\stian\AppData\Roaming\Claude\claude_desktop_config.json
```

### Alternative Locations:

- **Windows Alt**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

---

## 🔧 **Setup Steps**

### 1. **Copy Enhanced MCP Proxy to Your System**

```bash
# Copy enhanced-snakkaz-mcp-proxy.js to your local directory:
# From: /workspaces/snakkaz-chat/enhanced-snakkaz-mcp-proxy.js
# To:   C:\Users\stian\Projects\snakkaz-chat\enhanced-snakkaz-mcp-proxy.js
```

### 2. **Update Path in Config**

Edit the path in the config file to match your local setup:

```json
"args": ["C:\\Users\\stian\\Projects\\snakkaz-chat\\enhanced-snakkaz-mcp-proxy.js"]
```

### 3. **Install Dependencies (if needed)**

```bash
cd C:\Users\stian\Projects\snakkaz-chat
npm install @modelcontextprotocol/sdk @supabase/supabase-js node-fetch
```

---

## 🎯 **Available MCP Servers**

### **1. snakkaz-enhanced** 🌟

**Your Custom SnakkaZ + Supabase Integration**

- **Tools**: 15+ custom tools
- **Features**: Chat, database queries, design system protection
- **Database**: Direct Supabase integration
- **Status**: ✅ Ready with your credentials

### **2. supabase-official** 🔍

**Official Supabase MCP Server**

- **Tools**: Schema inspection, SQL queries
- **Access Token**: ✅ Configured with `sbp_v0_37363b1be413177758a3d9d90321f23565821eae`
- **Mode**: Read-only (safe)
- **Project**: wqpoozpbceucynsojmbk

### **3. postgres-snakkaz** 🗄️

**Direct PostgreSQL Access**

- **Connection**: Direct to your Supabase database
- **Tools**: Raw SQL execution
- **Use**: Advanced database operations

### **4. memory-persistent** 🧠

**Long-term Memory**

- **Tools**: Save/retrieve conversation context
- **Use**: Cross-session memory

### **5. github-snakkaz** 🐙

**GitHub Integration** (Optional)

- **Tools**: Repository management
- **Note**: Add your GitHub token if needed

---

## 🧪 **Test Commands**

### After setup, test these in Claude Desktop Chat:

```bash
# Test SnakkaZ connection
@mcp snakkaz_chat_status

# Test Supabase database
@mcp supabase_connection_test

# Get database tables info
@mcp supabase_table_info

# Query your messages
@mcp supabase_query "SELECT * FROM messages ORDER BY created_at DESC LIMIT 5"

# Check design system
@mcp snakkaz_design_system_status

# PostgreSQL raw query
@postgres SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

# Official Supabase tools
@supabase-official list_tables
```

---

## 🛠️ **Troubleshooting**

### **If servers don't appear:**

1. **Restart Claude Desktop** completely
2. **Check file paths** are correct for Windows
3. **Verify Node.js** is installed and accessible
4. **Check network** connection to mcp.snakkaz.com

### **If commands fail:**

- **snakkaz-enhanced**: Check if mcp.snakkaz.com is reachable
- **supabase-official**: Verify access token permissions
- **postgres-snakkaz**: Test database connection string

### **Debug Mode:**

Add to any MCP server config:

```json
"env": {
  "DEBUG": "true",
  "LOG_LEVEL": "debug"
}
```

---

## 🌟 **Benefits You Get**

- **🔍 Database Exploration**: Browse tables, run queries
- **💬 Chat Management**: Full SnakkaZ chat integration
- **🎨 Design System**: CSS conflict prevention
- **📊 Analytics**: Platform metrics and insights
- **🧠 Memory**: Persistent conversation context
- **🔄 Real-time**: Database change notifications
- **🇳🇴 AI Assistant**: Norwegian language support

---

## 🚀 **Ready to Use!**

Your configuration is **production-ready** with:

- ✅ **Your Supabase credentials** properly configured
- ✅ **Enhanced SnakkaZ integration** with custom tools
- ✅ **Multiple database access methods** for flexibility
- ✅ **Memory and GitHub integration** for complete workflow

**Copy the config, restart Claude Desktop, and enjoy the superpowers!** 🎯
