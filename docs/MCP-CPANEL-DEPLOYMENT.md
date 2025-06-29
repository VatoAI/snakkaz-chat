# 🚀 SNAKKAZ MCP SERVER DEPLOYMENT GUIDE
## Complete Setup for mcp.snakkaz.com in cPanel

---

## ✅ **CURRENT STATUS**
- **DNS:** ✅ mcp.snakkaz.com → 162.0.229.214 (WORKING)
- **Files:** ✅ Deployment package ready in `/tmp/mcp-cpanel-deploy/`
- **Database:** ✅ Supabase connection configured
- **Domain:** ✅ Already configured in your cPanel DNS

---

## 🗂️ **DEPLOYMENT FILES READY**

All files are prepared in `/tmp/mcp-cpanel-deploy/`:

| File | Purpose |
|------|---------|
| `app.py` | Main FastAPI server (production-ready) |
| `passenger_wsgi.py` | cPanel/Passenger WSGI interface |
| `requirements.txt` | Python dependencies |
| `init_schema.sql` | Database schema for Supabase |
| `.htaccess` | URL rewriting for API endpoints |
| `startup.txt` | Setup instructions |
| `upload_to_cpanel.sh` | Automated upload script |

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Upload Files to cPanel**

**Option A: cPanel File Manager (Recommended)**
1. Login to cPanel: https://premium123.web-hosting.com:2083/
2. Open **File Manager**
3. Navigate to `public_html`
4. Create new folder: `mcp.snakkaz.com`
5. Enter the folder
6. Upload all files from `/tmp/mcp-cpanel-deploy/`

**Option B: Automated FTP Upload**
```bash
cd /tmp/mcp-cpanel-deploy
./upload_to_cpanel.sh
```

### **Step 2: Set Up Python Application**

1. **Go to cPanel → Software → Python Selector**
2. **Click "Create Application"**
3. **Configure:**
   - **Python version:** 3.8 or higher
   - **Application domain:** mcp.snakkaz.com
   - **Application URI:** (leave empty)
   - **Application directory:** mcp.snakkaz.com
   - **Application startup file:** passenger_wsgi.py
   - **Application Entry point:** application

4. **Click "Create"**

### **Step 3: Install Dependencies**

1. **In cPanel Python app, click "Open Terminal"** or use SSH:
   ```bash
   ssh snaksqse@snakkaz.com
   cd ~/public_html/mcp.snakkaz.com
   ```

2. **Install Python packages:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables** (if needed via cPanel interface):
   - `DATABASE_URL=postgresql://postgres.wqpoozpbceucynsojmbk:Rompetroll123!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
   - `DEBUG=false`

### **Step 4: Initialize Database**

1. **Run the schema setup** (optional - auto-creates on first request):
   ```bash
   # Connect to Supabase and run init_schema.sql if needed
   # The app will auto-create tables on startup
   ```

### **Step 5: Test Deployment**

**Health Check:**
```bash
curl https://mcp.snakkaz.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-06-29T..."
}
```

**Test Memory Storage:**
```bash
curl -X POST https://mcp.snakkaz.com/memories \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "memory_type": "user_preference",
    "key": "test_deployment",
    "value": "MCP server successfully deployed!"
  }'
```

**Test Memory Retrieval:**
```bash
curl https://mcp.snakkaz.com/memories/test_user
```

---

## 🔧 **TROUBLESHOOTING**

### **If mcp.snakkaz.com shows 404:**
- Check that files are in the correct directory: `~/public_html/mcp.snakkaz.com/`
- Verify Python app is created and started in cPanel
- Check .htaccess file is uploaded

### **If database connection fails:**
- Verify environment variables are set
- Check Supabase credentials in passenger_wsgi.py
- Monitor app logs in cPanel

### **If Python errors occur:**
- Check Python version (needs 3.8+)
- Verify all requirements are installed
- Check cPanel Python app logs

### **Common Commands:**
```bash
# Check app status
cd ~/public_html/mcp.snakkaz.com
python passenger_wsgi.py  # Test locally

# Restart Python app
# Use cPanel Python Selector → Restart

# View logs
tail -f ~/logs/access_log
tail -f ~/logs/error_log
```

---

## 🌐 **FRONTEND INTEGRATION**

Once the MCP server is deployed, your Snakkaz Chat frontend will automatically use it:

- **Development:** `http://localhost:3001` (local testing)
- **Production:** `https://mcp.snakkaz.com` (live deployment)

The `memoryService.ts` is already configured to switch automatically based on `NODE_ENV`.

### **Test Frontend Integration:**
1. Deploy your latest frontend build to snakkaz.com
2. Login to Snakkaz Chat
3. Visit `/memory` dashboard
4. Verify memory storage and retrieval works

---

## 📊 **MONITORING & MAINTENANCE**

### **Health Monitoring:**
```bash
# Set up a simple health check
curl -s https://mcp.snakkaz.com/health | grep "healthy"
```

### **Database Monitoring:**
- Monitor Supabase usage in dashboard
- Check memory table growth
- Review API response times

### **Log Monitoring:**
- cPanel → Logs → Raw Access Logs
- cPanel → Logs → Error Logs
- Python app error logs

---

## 🎯 **SUCCESS CRITERIA**

✅ **Deployment is successful when:**
- [ ] `https://mcp.snakkaz.com/health` returns `{"status":"healthy"}`
- [ ] Memory storage API works: `POST /memories`
- [ ] Memory retrieval API works: `GET /memories/{user_id}`
- [ ] Database connection shows "connected"
- [ ] Frontend Memory Dashboard loads at `/memory`
- [ ] No errors in cPanel logs

---

## 📞 **SUPPORT**

**If you encounter issues:**

1. **Check cPanel Python App status**
2. **Review error logs in cPanel**
3. **Verify Supabase connection**
4. **Test endpoints manually with curl**

**Next Steps After Deployment:**
1. Test all memory API endpoints
2. Verify frontend integration
3. Monitor performance and logs
4. Set up automated backups (optional)

---

**Deployment Package Location:** `/tmp/mcp-cpanel-deploy/`  
**Target URL:** https://mcp.snakkaz.com  
**Database:** Supabase PostgreSQL (auto-configured)  
**Estimated Setup Time:** 15-30 minutes  

🚀 **Ready to deploy!** All files are prepared and DNS is configured.
