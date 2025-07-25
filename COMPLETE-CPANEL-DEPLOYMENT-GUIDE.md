# 🚀 SnakkaZ MCP - Complete cPanel Deployment Guide

## 📍 **Current Status Analysis**
Fra cPanel screenshots:
- ✅ **App Root Directory**: `/home/snakqsqe/mcp.snakkaz.com`
- ✅ **Node.js App**: Already running (v19.9.0, production mode)
- ✅ **App URL**: `snakkaz.com/` 
- ✅ **Port**: 3000 (configured in cPanel)

## 🎯 **Deployment Strategy**

### 📦 **Package Location & Upload**
1. **Upload Location**: `/home/snakqsqe/mcp.snakkaz.com/`
2. **Package**: `snakkaz-mcp-cpanel.tar.gz` (11MB)
3. **Method**: cPanel File Manager Upload

### 🗂️ **Directory Structure Understanding**
```bash
/home/snakqsqe/mcp.snakkaz.com/          # ← Node.js App Root (dette er din working directory)
├── package.json                          # ← Existing (will be replaced)
├── server-production-complete.js         # ← Old server (will be replaced)
├── node_modules/                         # ← Will be rebuilt
└── snakkaz-mcp-cpanel.tar.gz            # ← New package (upload here)
```

## 🚨 **IMPORTANT: Backup Strategy**
Siden Node.js app kjører allerede, vi må være forsiktige:

### Option A: Safe Deployment (Recommended)
```bash
# 1. Create backup first
cd /home/snakqsqe/mcp.snakkaz.com
mkdir backup-$(date +%Y%m%d-%H%M)
cp -r * backup-$(date +%Y%m%d-%H%M)/ 2>/dev/null || true
```

### Option B: Clean Slate (Risky but Clean)
```bash
# 1. Stop application first in cPanel
# 2. Delete everything except logs
cd /home/snakqsqe/mcp.snakkaz.com
rm -rf node_modules package.json server-production-complete.js
```

## 📤 **Step-by-Step Deployment Process**

### **Step 1: Upload Package**
1. Open cPanel File Manager
2. Navigate to `/home/snakqsqe/mcp.snakkaz.com/`
3. Upload `snakkaz-mcp-cpanel.tar.gz`
4. Wait for upload to complete

### **Step 2: Activate Virtual Environment** 
```bash
source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate
cd /home/snakqsqe/mcp.snakkaz.com
```

### **Step 3: Backup Existing Files (Recommended)**
```bash
# Create backup with timestamp
mkdir backup-$(date +%Y%m%d-%H%M)
cp package.json backup-$(date +%Y%m%d-%H%M)/ 2>/dev/null || true
cp server-production-complete.js backup-$(date +%Y%m%d-%H%M)/ 2>/dev/null || true
```

### **Step 4: Extract New Package**
```bash
# Check current contents
ls -la

# Extract new package
tar -xzf snakkaz-mcp-cpanel.tar.gz

# Check what was extracted
ls -la

# Move frontend files to root (if dist folder exists)
if [ -d "dist" ]; then
    mv dist/* .
    rm -rf dist
fi

# Verify extraction
ls -la
```

### **Step 5: Clean Install Dependencies**
```bash
# Remove old node_modules
rm -rf node_modules package-lock.json

# Install fresh dependencies in virtual environment
npm install --production

# Verify installation
ls node_modules/ | head -10
```

### **Step 6: Update cPanel Node.js Configuration**
Go to cPanel → Node.js → Edit your app:

**Change these settings:**
- **Application startup file**: `snakkaz-mcp-server.js` ← (Change from `server-production-complete.js`)
- **Keep these as-is:**
  - Port: `3000` ✅
  - App URL: `snakkaz.com` ✅
  - Node.js version: v19.9.0 ✅

### **Step 7: Test Before Restart**
```bash
# Test manual startup (optional)
NODE_ENV=production PORT=3000 node snakkaz-mcp-server.js

# Should show:
# 🚀 SnakkaZ MCP Server started!
# 🌐 Server: http://localhost:3000
# 🔗 Live URL: https://mcp.snakkaz.com

# Press Ctrl+C to stop test
```

### **Step 8: Restart Application**
1. In cPanel Node.js interface, click **RESTART**
2. Wait for status to show "started"
3. Check logs if any errors

### **Step 9: Verify Live Deployment**
```bash
# Test health endpoint locally
curl http://localhost:3000/api/health

# Should return:
# {"status":"ok","timestamp":"2025-07-25T..."}
```

**External verification:**
- 🌐 **Frontend**: https://mcp.snakkaz.com
- 🏥 **Health Check**: https://mcp.snakkaz.com/api/health
- 💬 **Chat API**: https://mcp.snakkaz.com/api/chat

## 🔧 **Troubleshooting**

### If startup fails:
```bash
# Check what's in the directory
ls -la /home/snakqsqe/mcp.snakkaz.com/

# Check if snakkaz-mcp-server.js exists
file snakkaz-mcp-server.js

# Check Node.js version in virtual environment
node --version

# Check npm packages
npm list --depth=0
```

### If port conflicts:
```bash
# Check what's running on port 3000
netstat -tulpn | grep 3000

# Kill any conflicting processes
pkill -f "node.*3000"
```

## 📋 **Complete Command Sequence**

Copy and paste these commands one by one:

```bash
# 1. Activate environment and navigate
source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate && cd /home/snakqsqe/mcp.snakkaz.com

# 2. Create backup
mkdir backup-$(date +%Y%m%d-%H%M) && cp package.json server-production-complete.js backup-$(date +%Y%m%d-%H%M)/ 2>/dev/null || true

# 3. Extract new package
tar -xzf snakkaz-mcp-cpanel.tar.gz && ls -la

# 4. Move frontend files if needed
[ -d "dist" ] && mv dist/* . && rm -rf dist

# 5. Clean install
rm -rf node_modules package-lock.json && npm install --production

# 6. Verify setup
ls -la && file snakkaz-mcp-server.js
```

**Then update cPanel startup file to `snakkaz-mcp-server.js` and restart!**

---

**🎯 READY FOR DEPLOYMENT! Upload package til `/home/snakqsqe/mcp.snakkaz.com/` og følg guiden! 🚀**
