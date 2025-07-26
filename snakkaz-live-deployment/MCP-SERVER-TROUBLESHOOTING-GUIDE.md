# 🚨 CPANEL MCP SERVER TROUBLESHOOTING GUIDE

## Problem: MCP Server Not Responding (Failed to fetch)

### Status from Live Monitor:
- ✅ Frontend (snakkaz.com) - WORKING
- ❌ MCP Server (mcp.snakkaz.com) - OFFLINE
- ❌ CORS Policy - FAILING (server not running)
- ❌ Chat API - FAILING (server not running)

---

## 🔍 IMMEDIATE DIAGNOSTIC STEPS

### 1. Check cPanel Node.js App Settings
1. Go to cPanel → Software → Node.js
2. Find: `mcp.snakkaz.com` application
3. Click the ✏️ Edit icon
4. **VERIFY THESE CRITICAL SETTINGS:**
   - **Application startup file:** `simplified-server.js`
   - **Node Environment:** `production`
   - **Domain:** `mcp.snakkaz.com`
   - **Application URL:** `mcp.snakkaz.com`

### 2. Check Application Status
- Status should show: 🟢 **started (v19.9.0)**
- If showing stopped: Click **RESTART**
- If showing error: Check startup file setting

---

## 🔧 CPANEL TERMINAL COMMANDS

Open cPanel → Terminal and run these commands:

```bash
# 1. Check current location and files
pwd
ls -la

# 2. Navigate to MCP directory
cd /home/snakqsqe/mcp.snakkaz.com/
ls -la

# 3. Check if simplified-server.js exists
cat simplified-server.js | head -10

# 4. Check running processes
ps aux | grep node
ps aux | grep simplified-server

# 5. Test server locally
curl -I http://localhost:3000/api/health

# 6. Check Node.js version
node --version
which node

# 7. Manual server start (if needed)
node simplified-server.js
```

---

## 🚨 MOST LIKELY ISSUES & FIXES

### Issue 1: Wrong Startup File
**Problem:** Application startup file not set to `simplified-server.js`
**Fix:** 
1. cPanel → Node.js → mcp.snakkaz.com → Edit
2. Set "Application startup file" to: `simplified-server.js`
3. Click SAVE
4. Click RESTART

### Issue 2: App Not Restarted After Upload
**Problem:** New files uploaded but app still running old version
**Fix:**
1. cPanel → Node.js → mcp.snakkaz.com
2. Click RESTART
3. Wait 30 seconds
4. Test: https://mcp.snakkaz.com/api/health

### Issue 3: Missing Files
**Problem:** ZIP not extracted properly
**Fix:**
1. cPanel → File Manager → /mcp.snakkaz.com/
2. Delete all old files
3. Upload fresh `snakkaz-mcp-subdomain-CORS-FIX.zip`
4. Extract ZIP
5. Set startup file to `simplified-server.js`
6. RESTART app

### Issue 4: Port Configuration
**Problem:** Wrong port environment variable
**Fix:**
1. cPanel → Node.js → mcp.snakkaz.com → Edit
2. Environment Variables section
3. Add: `PORT` = `3000`
4. Click SAVE
5. RESTART

---

## ✅ SUCCESS VERIFICATION

Once fixed, you should see:
1. **Live Status Monitor:** All 4 services showing ✅ Online
2. **Direct API Test:** https://mcp.snakkaz.com/api/health returns JSON
3. **CORS Test:** No "Failed to fetch" errors
4. **Full Integration:** Chat API responding

---

## 🆘 EMERGENCY NUCLEAR OPTION

If nothing works, run in cPanel Terminal:

```bash
cd /home/snakqsqe/mcp.snakkaz.com/
killall node
nohup node simplified-server.js > server.log 2>&1 &
```

Then check: `tail -f server.log` for any error messages.

---

**🇳🇴 Norwegian Tech Excellence - SnakkaZ Live Troubleshooting!**
