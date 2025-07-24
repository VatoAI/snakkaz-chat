# 🚨 QUICK FIX - cPanel Startup Issue
*Server trying to run wrong file*

## 🔍 **PROBLEM IDENTIFIED**

Error shows:
```
Error: Cannot find module '/home/snakqsqe/mcp-snakkaz/build/index.js'
```

**Root Cause**: cPanel is using old `package.json` that points to `build/index.js` instead of our `server-production.cjs`

## ⚡ **IMMEDIATE FIX** (5 minutes)

### **Option 1: Update package.json in cPanel**

1. **Go to cPanel File Manager**
   - Navigate to `/home/snakqsqe/mcp-snakkaz/`
   - Find `package.json` file
   - Edit it and change:

```json
{
  "scripts": {
    "start": "node server-production.cjs"
  }
}
```

### **Option 2: Quick File Rename** 
1. **In cPanel File Manager**:
   - Rename `server-production.cjs` → `index.js`
   - Create folder: `build/`
   - Move `index.js` to `build/index.js`

### **Option 3: Re-upload Correct Package**

1. **Upload fresh package**:
   - Delete all files in `/home/snakqsqe/mcp-snakkaz/`
   - Upload `snakkaz-mcp-production.zip`
   - Extract zip file
   - Verify `package-production.json` is used

## 🎯 **RECOMMENDED: OPTION 1** (Fastest)

**Edit package.json in cPanel**:
```json
{
  "name": "snakkaz-mcp-production",
  "version": "1.0.0",
  "main": "server-production.cjs",
  "scripts": {
    "start": "node server-production.cjs"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  }
}
```

## 🔄 **AFTER FIX**

1. **Save package.json**
2. **Restart Node.js app in cPanel**
3. **Test**: `https://mcp.snakkaz.com`

## ✅ **EXPECTED RESULT**

Server should start successfully and show:
```
🚀 SnakkaZ MCP Server - Production
✅ Server Status: ONLINE
```

**This is just a configuration issue - easy fix!** 🛠️

Ready to apply the fix? 🚀
