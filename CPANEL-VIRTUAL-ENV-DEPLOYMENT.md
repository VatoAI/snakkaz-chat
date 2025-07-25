# 🚀 cPanel Virtual Environment - Live Deployment Commands

## ✅ Current Status (from screenshot)
- **Node.js Version**: v19.9.0 (production mode)
- **Virtual Env**: `/home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate`
- **Working Dir**: `/home/snakqsqe/mcp.snakkaz.com`
- **Port**: 3000 ✅ (perfect match!)
- **App URL**: `snakkaz.com` ✅ (works with mcp subdomain)

## 🔧 Fixed Port Configuration
- **MCP Server**: Now uses `process.env.PORT || 3000` ✅
- **Frontend**: Now uses correct production URL `https://mcp.snakkaz.com` ✅
- **Development**: Uses `http://localhost:3000` ✅
- **Package Updated**: New `snakkaz-mcp-cpanel.tar.gz` (11MB) ✅

## 🔄 Step 1: Activate Virtual Environment
```bash
source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate && cd /home/snakqsqe/mcp.snakkaz.com
```

## 📂 Step 2: Check current directory and clean up
```bash
pwd
ls -la
rm -rf node_modules package-lock.json
rm server-production-complete.js
```

## 📤 Step 3: Upload new files
Upload `snakkaz-mcp-cpanel.tar.gz` via cPanel File Manager to `/home/snakqsqe/mcp.snakkaz.com/`

## 🗂️ Step 4: Extract and setup new deployment
```bash
tar -xzf snakkaz-mcp-cpanel.tar.gz
ls -la
mv dist/* .
rm -rf dist
ls -la
```

## 📦 Step 5: Install dependencies in virtual environment
```bash
npm install --production
ls node_modules/
```

## 🧪 Step 6: Test manual start (optional)
```bash
NODE_ENV=production PORT=3000 node snakkaz-mcp-server.js
# Should show: "🚀 SnakkaZ MCP Server running on port 3000"
# Press Ctrl+C to stop
```

## ⚡ Step 7: Update cPanel Node.js App Settings
In cPanel Node.js interface:
- ✅ **Application startup file**: `snakkaz-mcp-server.js` (change from server-production-complete.js)
- ✅ **Port**: Keep `3000` 
- ✅ **App URL**: Keep `snakkaz.com` (works fine with mcp subdomain)
- ✅ **Environment**: Keep existing (`DOMAIN=mcp.snakkaz.com`, `NODE_ENV=production`, `PORT=3000`)

## 🔄 Step 8: Restart Application
Click **RESTART** button in cPanel Node.js interface

## 🧪 Step 9: Test Live Deployment
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

External test:
- **Frontend**: https://mcp.snakkaz.com
- **Health**: https://mcp.snakkaz.com/api/health
- **Chat**: https://mcp.snakkaz.com/api/chat

---

**🎯 Port 3000 er perfekt! App URL kan være snakkaz.com og fungere med mcp subdomain! 🚀**
