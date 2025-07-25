# 🛑 cPanel Terminal Commands - Stop Old Node.js App

## Step 1: Check what's running
```bash
ps aux | grep node
ps aux | grep server-production-complete
```

## Step 2: Stop all Node.js processes
```bash
# Kill all node processes
pkill -f node

# Or kill specific processes
pkill -f "server-production-complete"

# Force kill if needed
pkill -9 -f node
```

## Step 3: Check PM2 (if installed)
```bash
pm2 status
pm2 stop all
pm2 delete all
```

## Step 4: Clean up old files
```bash
cd /home/snakkaze/public_html/mcp.snakkaz.com
ls -la
rm -rf node_modules
rm server-production-complete.js
```

## Step 5: Upload and extract new package
```bash
cd /home/snakkaze/public_html/mcp.snakkaz.com
# Upload snakkaz-mcp-cpanel.tar.gz via File Manager first
tar -xzf snakkaz-mcp-cpanel.tar.gz
mv dist/* .
rm -rf dist
```

## Step 6: Install dependencies
```bash
npm install --production
```

## Step 7: Test manual start
```bash
NODE_ENV=production PORT=3000 node snakkaz-mcp-server.js
# Press Ctrl+C to stop, then use cPanel Node.js interface
```

---

**Copy these commands one by one into cPanel Terminal! 🚀**
