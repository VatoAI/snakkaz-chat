# 🚀 SNAKKAZ CPANEL DEPLOYMENT GUIDE
**Norwegian Enterprise Excellence - LIVE DEPLOYMENT**

## 📋 DEPLOYMENT CHECKLIST

### **STEP 1: DOMAIN SETUP**
1. **Main Domain**: snakkaz.com + www.snakkaz.com
2. **MCP Subdomain**: mcp.snakkaz.com
3. **SSL Certificates**: Enable for both domains

### **STEP 2: UPLOAD MAIN SITE**
1. **File**: `snakkaz-main-site.zip`
2. **Destination**: `/public_html/` (root of snakkaz.com)
3. **Action**: Extract ZIP in public_html folder
4. **Result**: Frontend accessible at https://snakkaz.com

```
cPanel File Manager:
public_html/
├── index.html
├── assets/
├── .htaccess
└── [all frontend files]
```

### **STEP 3: SETUP MCP SUBDOMAIN**  
1. **Create Subdomain**: mcp.snakkaz.com
2. **File**: `snakkaz-mcp-subdomain.zip`
3. **Destination**: `/mcp.snakkaz.com/` (subdomain root)
4. **Extract**: ZIP in subdomain folder

```
mcp.snakkaz.com/
├── mcp-cors-server.js
├── package.json
├── start-mcp.sh
└── api/
```

### **STEP 4: CPANEL NODE.JS CONFIGURATION**
1. **Go to**: cPanel → Software → Web Applications
2. **Application URL**: mcp.snakkaz.com
3. **Application startup file**: `simplified-server.js` ✅
4. **Environment variables**:
   - `DOMAIN`: mcp.snakkaz.com
   - `NODE_ENV`: production
   - `PORT`: 3000
5. **Click SAVE** to deploy Node.js app

### **STEP 5: VERIFY MCP SERVER**
1. **Auto-start**: cPanel should auto-start the Node.js app
2. **Manual start**: If needed, use terminal: `./start-mcp.sh`
3. **Test health**: `curl https://mcp.snakkaz.com/api/health`

### **STEP 5: DOMAIN CONFIGURATION**

#### **DNS Settings:**
```
A Record: snakkaz.com → [Server IP]
A Record: www.snakkaz.com → [Server IP]  
A Record: mcp.snakkaz.com → [Server IP]
```

#### **SSL/HTTPS:**
- Enable SSL for snakkaz.com
- Enable SSL for www.snakkaz.com
- Enable SSL for mcp.snakkaz.com

### **STEP 6: VERIFY DEPLOYMENT**

#### **Main Site Test:**
```bash
curl https://snakkaz.com
curl https://www.snakkaz.com
```

#### **MCP Server Test:**
```bash
curl https://mcp.snakkaz.com/api/health
curl https://mcp.snakkaz.com/api/mcp/status
```

#### **Full Integration Test:**
```bash
curl -X POST https://mcp.snakkaz.com/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://snakkaz.com" \
  -d '{"message":"Live test from snakkaz.com"}'
```

## 🎯 **EXPECTED RESULTS**

### **https://snakkaz.com**
- ✅ Frontend loads perfectly
- ✅ React app routing works
- ✅ All assets load (CSS, JS, images)
- ✅ Performance: Grade A metrics

### **https://mcp.snakkaz.com**  
- ✅ MCP server responds to /api/health
- ✅ CORS configured for snakkaz.com
- ✅ Chat API processes messages
- ✅ Full MCP integration active

## 🛠️ **TROUBLESHOOTING**

### **If Main Site Not Loading:**
1. Check .htaccess syntax
2. Verify file permissions (755 for folders, 644 for files)
3. Check SSL certificate status
4. Verify domain DNS propagation

### **If MCP Server Not Starting:**
1. Check Node.js version: `node --version`
2. Install dependencies: `npm install`
3. Check port availability: `netstat -tulpn | grep 3000`
4. View logs: `cat mcp-server.log`

### **If CORS Errors:**
1. Verify domain in mcp-cors-server.js
2. Check SSL on both domains
3. Test with curl first
4. Check browser console for errors

## 🎉 **SUCCESS VERIFICATION**

When everything works:
- ✅ https://snakkaz.com loads the chat interface
- ✅ https://mcp.snakkaz.com/api/health returns healthy status
- ✅ Chat messages send successfully through MCP
- ✅ No CORS errors in browser console
- ✅ SSL certificates active on both domains

## 🇳🇴 **SNAKKAZ LIVE - NORWEGIAN TECH EXCELLENCE!**

**Gratulerer! SnakkaZ er nå live på internett! 🚀**
