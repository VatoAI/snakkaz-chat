# 🚀 SnakkaZ MCP Server - Namecheap Deployment Guide

*Komplett guide for deployment til `mcp.snakkaz.com`*

## 📋 Namecheap Requirements & Info Needed

### 🔑 **Access Information Needed:**
```bash
1. Namecheap Account Login
   - Username/Email
   - Password
   - Two-factor authentication (hvis aktivt)

2. Domain Management Access
   - snakkaz.com domain control panel
   - DNS management tilgang

3. Hosting Plan Details
   - Hvilken hosting plan har du? (Shared/VPS/Dedicated)
   - Server location/datacenter
```

## 🎯 **PERFEKT! Du har Stellar Plus - Ideell for MCP Server! ✅**

### **Din Stellar Plus Plan - MCP Deployment Ready:**
```bash
🎉 Namecheap Stellar Plus - DIN PLAN
- Unlimited websites & Unmetered SSD storage
- Node.js support via cPanel ✅
- SSL certificates inkludert ✅
- AutoBackup inkludert ✅
- $2.38/måned (excellent value!)
- PERFEKT for MCP server deployment!

✅ Stellar Plus Fordeler for MCP:
+ Node.js fully supported
+ cPanel med Jailshell SSH access
+ Kan kjøre Node.js applikasjoner
+ SSL certificates automatic
+ Unlimited mailboxes
+ AutoBackup protection
+ Unmetered disk space
```

### **Alternative løsninger (ikke nødvendig med din plan):**
```bash
💡 VPS Upgrade (kun hvis du trenger mer kontroll)
- Namecheap VPS - Quasar Plan
- $15.88/måned (men ikke nødvendig!)
- Stellar Plus er helt tilstrekkelig for MCP
- Begrenset server configuration
- cPanel interface required
```

## 🔧 **DNS & Subdomain Setup:**

### **Step 1: DNS Configuration i Namecheap**
```dns
# I Namecheap DNS Management for snakkaz.com:
Type: A Record
Host: mcp
Value: [VPS IP Address eller Shared Hosting IP]
TTL: 300 (eller Automatic)

# Result: mcp.snakkaz.com -> Server IP
```

### **Step 2: SSL Certificate**
```bash
# Namecheap tilbyr gratis SSL via:
- Let's Encrypt (automatisk)
- Eller premium SSL certificates
- Wildcard SSL for *.snakkaz.com (anbefalt)
```

## 📦 **Deployment Methods:**

### **Method 1: VPS Deployment (BEST)**
```bash
# 1. Purchase Namecheap VPS (Quasar plan)
# 2. Get SSH access credentials
# 3. Deploy MCP server:

# Connect to VPS:
ssh root@[VPS_IP]

# Install Node.js 22.x:
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt-get install -y nodejs

# Upload MCP server files:
scp -r "/workspaces/snakkaz-chat/MCP SnakkaZ/" root@[VPS_IP]:/var/www/mcp-server/

# Install dependencies:
cd /var/www/mcp-server/
npm install --production

# Start with PM2 (process manager):
npm install -g pm2
pm2 start server.js --name "snakkaz-mcp"
pm2 startup
pm2 save

# Configure Nginx reverse proxy:
server {
    listen 80;
    listen 443 ssl;
    server_name mcp.snakkaz.com;
    
    ssl_certificate /etc/letsencrypt/live/mcp.snakkaz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mcp.snakkaz.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **Method 2: Shared Hosting Deployment**
```bash
# 1. Access cPanel for your hosting account
# 2. Go to "Setup Node.js App"
# 3. Create new application:

Application Settings:
- Node.js version: 22.x (latest available)
- Application mode: Production
- Application root: /public_html/mcp
- Application URL: mcp.snakkaz.com
- Application startup file: server.js
- Environment variables:
  * NODE_ENV=production
  * PORT=3000 (eller assigned port)
  
# 4. Upload files via File Manager or FTP
# 5. Install dependencies via cPanel NPM install
```

## 🌐 **Current MCP Server Status Check:**
```bash
# Din MCP server er allerede production-ready:
✅ Version: 2.1.0
✅ Health endpoint: /health
✅ Production optimized
✅ Supabase integration
✅ Error handling
✅ Logging system
✅ Security headers

# Ready for immediate deployment!
```

## 🔒 **Environment Variables & Security:**
```bash
# Sett opp environment variables i production:
NODE_ENV=production
PORT=3000
SUPABASE_URL=wqpoozpbceucynsojmbk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DOMAIN=mcp.snakkaz.com
SSL_ENABLED=true
```

## 💰 **Kostnader & Pricing:**

### **VPS Option (Anbefalt):**
```bash
Namecheap VPS Quasar:
- $15.88/måned (first year)
- $19.88/måned (renewal)
- Inkluderer: Full server, SSL, backups
```

### **Shared Hosting Option:**
```bash
Namecheap Stellar Business:
- $4.98/måned (first year)  
- $9.48/måned (renewal)
- Inkluderer: Node.js support, SSL
```

## 🛠️ **Deployment Steps Summary:**

### **Quick Start (VPS):**
1. **Purchase Namecheap VPS Quasar plan**
2. **Set up DNS A-record: mcp.snakkaz.com -> VPS IP**
3. **SSH into VPS og install Node.js**
4. **Upload MCP server files**
5. **Configure Nginx + SSL**
6. **Start server med PM2**
7. **Test: https://mcp.snakkaz.com/health**

### **Alternative (Shared Hosting):**
1. **Access existing hosting cPanel**
2. **Create Node.js app i cPanel**
3. **Set up subdomain DNS record**
4. **Upload files og configure**
5. **Test application**

## 📞 **Support & Assistance:**

```bash
# Namecheap Support:
- 24/7 Live Chat support
- Free migration assistance
- Technical support for VPS
- DNS configuration help

# What I need from you:
1. Current hosting plan details
2. Namecheap account access level
3. Budget preference (VPS vs Shared)
4. Timeline for deployment
```

## 🚀 **Next Steps:**

**Tell me:**
1. Hvilken hosting plan har du allerede med Namecheap?
2. Har du tilgang til DNS management for snakkaz.com?
3. Vil du gå for VPS ($15.88/måned) eller teste shared hosting først?
4. Skal vi begynne deployment nå?

---

*MCP serveren din er production-ready og kan deployes umiddelbart! 🎯*
