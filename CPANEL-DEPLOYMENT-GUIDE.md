# 🚀 SnakkaZ MCP - cPanel Live Deployment Guide

## 🎯 DNS Status: ✅ LIVE!
- **mcp.snakkaz.com** → 162.0.229.214
- **Document Root**: `/public_html/mcp.snakkaz.com`
- **Node.js App**: Configured in cPanel

## 🛑 Step 1: Stop Current Node.js App
**Via cPanel Terminal:**
```bash
# Check what's running
ps aux | grep node
pkill -f "node"
pkill -f "server-production-complete.js"

# Or use PM2 if installed
pm2 stop all
pm2 delete all
```

## 📦 Step 2: Upload New Deployment Package
**Via cPanel File Manager:**
1. Navigate to `/public_html/mcp.snakkaz.com/`
2. Upload `snakkaz-mcp-live.tar.gz` (11.3MB)
3. Extract the package
4. Move frontend files to document root

**Via Terminal:**
```bash
cd /home/snakkaze/public_html/mcp.snakkaz.com
rm -rf * .*
tar -xzf snakkaz-mcp-live.tar.gz
mv dist/* .
rm -rf dist
```

## 🔧 Step 3: Install Dependencies
**In cPanel Terminal:**
```bash
cd /home/snakkaze/public_html/mcp.snakkaz.com
npm install --production
```

## ⚡ Step 4: Update cPanel Node.js App
**In cPanel Node.js Selector:**
1. **Application root**: `mcp.snakkaz.com`
2. **Application URL**: `snakkaz.com` (update to subdomain)
3. **Application startup file**: `snakkaz-mcp-server.js`
4. **Environment variables**:
   - `DOMAIN`: `mcp.snakkaz.com`
   - `NODE_ENV`: `production`
   - `PORT`: `3000`

## 🔄 Step 5: Restart Node.js Application
**Via cPanel Interface:**
- Click "STOP APP" 
- Click "RESTART"

**Via Terminal (alternative):**
```bash
cd /home/snakkaze/public_html/mcp.snakkaz.com
node snakkaz-mcp-server.js &
```

## 🧪 Step 6: Test Deployment
1. **Frontend**: https://mcp.snakkaz.com
2. **Health**: https://mcp.snakkaz.com/api/health
3. **Chat**: https://mcp.snakkaz.com/api/chat

## 🐛 Troubleshooting
**If Node.js won't stop:**
```bash
# Force kill all node processes
sudo pkill -9 node
# Or find specific PID
ps aux | grep node
kill -9 [PID]
```

**Check logs:**
```bash
tail -f /home/snakkaze/logs/mcp_error.log
tail -f /home/snakkaze/logs/mcp_access.log
```

## 📋 Quick Commands for cPanel Terminal

### Stop everything:
```bash
pkill -f node; pm2 stop all; pm2 delete all
```

### Clean install:
```bash
cd /home/snakkaze/public_html/mcp.snakkaz.com
rm -rf node_modules package-lock.json
npm install --production
```

### Start manually:
```bash
cd /home/snakkaze/public_html/mcp.snakkaz.com
NODE_ENV=production PORT=3000 node snakkaz-mcp-server.js
```

---

**🎯 Ready for Live Deployment via cPanel! 🇳🇴**
