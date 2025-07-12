# Snakkaz MCP Server Production Setup Guide
## Hosting: Namecheap | Domain: snakkaz.com | Subdomain: mcp.snakkaz.com

## 📋 OVERVIEW
This guide covers deploying the Snakkaz Memory System (MCP Server) to production:
- **Subdomain:** mcp.snakkaz.com  
- **Server:** FastAPI with Supabase PostgreSQL
- **Hosting:** Namecheap cPanel/VPS
- **Database:** Supabase (already configured)

---

## 🌐 DNS CONFIGURATION (Namecheap)

### Step 1: Access Namecheap DNS Settings
1. Login to [Namecheap Account](https://ap.www.namecheap.com/login)
2. Go to "Domain List" → Click "Manage" next to snakkaz.com
3. Click "Advanced DNS" tab

### Step 2: Add Subdomain Record
Add one of these DNS records:

**Option A: A Record (Direct IP)**
```
Type: A Record
Host: mcp
Value: [Your server IP - same as snakkaz.com]
TTL: Automatic
```

**Option B: CNAME Record (Alias)**
```
Type: CNAME Record  
Host: mcp
Value: snakkaz.com
TTL: Automatic
```

**Recommended:** Use CNAME if your main site works, otherwise use A record.

### Step 3: Verify DNS Propagation
```bash
# Check if DNS is working (may take 5-30 minutes)
nslookup mcp.snakkaz.com
dig mcp.snakkaz.com
```

---

## 🚀 SERVER DEPLOYMENT

### Option 1: cPanel Hosting (Shared/VPS)
If you're using Namecheap's cPanel hosting:

1. **Upload MCP Server Files:**
   ```bash
   # Run this on your local machine
   ./scripts/deploy-mcp-server.sh
   
   # Then upload the deployment package via cPanel File Manager:
   # Upload to: /home/[username]/mcp.snakkaz.com/
   ```

2. **Setup Python Environment (if available):**
   ```bash
   # In cPanel Terminal or SSH:
   cd /home/[username]/mcp.snakkaz.com
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure as CGI/WSGI Application:**
   - Use cPanel "Python App" feature if available
   - Or configure as CGI script

### Option 2: VPS/Dedicated Server
If you have VPS access:

1. **Run Deployment Script:**
   ```bash
   # Local machine:
   ./scripts/deploy-mcp-server.sh
   
   # Follow the SCP upload instructions
   scp -r /tmp/mcp-deploy/* user@snakkaz.com:/home/user/mcp.snakkaz.com/
   
   # SSH to server:
   ssh user@snakkaz.com
   cd /home/user/mcp.snakkaz.com
   ./deploy_on_server.sh
   ```

2. **Configure Reverse Proxy:**
   The script automatically configures Nginx to proxy mcp.snakkaz.com → localhost:3001

---

## 🗄️ DATABASE CONNECTION (Supabase)

### Current Configuration
The MCP server is already configured to connect to your Supabase database:

```env
DATABASE_URL=postgresql://postgres.wqpoozpbceucynsojmbk:Rompetroll123!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
```

### Database Schema Setup
The server automatically creates the required tables, but you can also run manually:

1. **Go to Supabase Dashboard:** https://supabase.com/dashboard
2. **SQL Editor** → Run the schema from `init_schema.sql`
3. **Or let the server auto-create** on first startup

### Verify Database Connection
```bash
# Test the connection after deployment:
curl https://mcp.snakkaz.com/health

# Should return:
# {"status":"healthy","database":"connected","timestamp":"..."}
```

---

## 🔒 SECURITY & SSL

### SSL Certificate Setup
```bash
# On your server (if you have shell access):
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mcp.snakkaz.com

# This will:
# 1. Get SSL certificate from Let's Encrypt
# 2. Auto-configure HTTPS redirect
# 3. Update Nginx config
```

### Firewall Configuration
```bash
# Allow HTTP and HTTPS:
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001  # For direct access if needed
```

### Environment Variables Security
The production server uses these secure environment variables:
- `DATABASE_URL` - Supabase connection (already configured)
- `DEBUG=false` - Hides API docs in production
- `PORT=3001` - Server port

---

## 🧪 TESTING & VERIFICATION

### Health Check
```bash
# Basic connectivity:
curl http://mcp.snakkaz.com/health
curl https://mcp.snakkaz.com/health  # If SSL configured

# Expected response:
{
  "status": "healthy",
  "database": "connected", 
  "timestamp": "2025-06-29T..."
}
```

### Memory API Testing
```bash
# Store a test memory:
curl -X POST https://mcp.snakkaz.com/memories \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "memory_type": "user_preference", 
    "key": "test_key",
    "value": "test_value"
  }'

# Retrieve memories:
curl https://mcp.snakkaz.com/memories/test_user

# Get stats:
curl https://mcp.snakkaz.com/stats/test_user
```

### Frontend Integration Test
Update your frontend to use the production server and test the Memory Dashboard at `/memory`.

---

## 🔧 TROUBLESHOOTING

### Common Issues:

**1. DNS not resolving:**
```bash
# Check DNS propagation:
nslookup mcp.snakkaz.com 8.8.8.8
# Wait 5-30 minutes for propagation
```

**2. Server not responding:**
```bash
# Check if server is running:
sudo systemctl status mcp-memory-server
sudo journalctl -u mcp-memory-server -f

# Restart if needed:
sudo systemctl restart mcp-memory-server
```

**3. Database connection failed:**
```bash
# Check environment variables:
env | grep DATABASE_URL
# Verify Supabase credentials in dashboard
```

**4. SSL certificate issues:**
```bash
# Check certificate status:
sudo certbot certificates
# Renew if needed:
sudo certbot renew
```

### Log Monitoring
```bash
# Server logs:
sudo journalctl -u mcp-memory-server -f

# Nginx logs:
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 SUPPORT CHECKLIST

Before deployment, ensure you have:
- [ ] Namecheap account access
- [ ] DNS management permissions  
- [ ] Server/hosting access (cPanel or SSH)
- [ ] Supabase project access
- [ ] SSL certificate plan (Let's Encrypt recommended)

After deployment, verify:
- [ ] DNS resolves: `nslookup mcp.snakkaz.com`
- [ ] Health endpoint: `curl https://mcp.snakkaz.com/health`
- [ ] Database connectivity (status: "connected")
- [ ] SSL certificate (https:// works)
- [ ] Frontend integration (Memory Dashboard loads)

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Update Frontend Configuration:**
   - Ensure `MEMORY_SERVER_URL` points to `https://mcp.snakkaz.com`
   - Rebuild and deploy frontend

2. **Test Memory System:**
   - Login to Snakkaz Chat
   - Visit `/memory` dashboard
   - Test storing and retrieving memories

3. **Monitor Performance:**
   - Set up uptime monitoring
   - Monitor database usage in Supabase
   - Check server resource usage

4. **Scale if Needed:**
   - Monitor response times
   - Consider adding Redis cache for high traffic
   - Scale Supabase plan if needed

---

**Deployment Status:** Ready for production  
**Estimated Setup Time:** 30-60 minutes  
**Required Skills:** Basic server administration, DNS management
