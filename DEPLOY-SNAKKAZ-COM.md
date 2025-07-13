# 🚀 SNAKKAZ BETA - DEPLOY TIL www.snakkaz.com
## Status: KLART FOR LIVE DEPLOYMENT!

---

## 📋 DEPLOYMENT OVERVIEW

**Target Domain:** www.snakkaz.com  
**Server IP:** 162.0.229.214  
**Document Root:** /public_html  
**DNS Provider:** Namecheap  
**Hosting:** cPanel  

---

## ✅ STEG 1: SUPABASE ENVIRONMENT KEYS

Du trenger disse verdiene fra Supabase Dashboard:

1. **Gå til:** https://supabase.com/dashboard/project/[ditt-projekt]
2. **Settings → API**
3. **Kopier:**
   - Project URL
   - anon public key

---

## ✅ STEG 2: UPDATE ENVIRONMENT FOR PRODUCTION

### Environment Variables som trengs:
```env
VITE_SUPABASE_URL=https://wqp0ozrbxcucynsojmbk.supabase.co
VITE_SUPABASE_ANON_KEY=[finn i supabase dashboard]
VITE_SITE_URL=https://www.snakkaz.com
```

### Update .env.production file:
```bash
# Oppdater environment variables
VITE_SUPABASE_URL=https://wqp0ozrbxcucynsojmbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... [din anon key]
VITE_SITE_URL=https://www.snakkaz.com
VITE_APP_TITLE=SnakkaZ Beta
VITE_APP_DESCRIPTION=Norsk Chat Platform
```

---

## ✅ STEG 3: BUILD FOR PRODUCTION

```bash
# Clean build med production environment
npm run build:prod
```

**Expected output:** dist/ folder with optimized files

---

## ✅ STEG 4: UPLOAD TIL www.snakkaz.com

### Option A: cPanel File Manager
1. **Login:** https://cpanel.snakkaz.com
2. **File Manager → public_html**
3. **Upload alle filer fra `/dist` mappen**
4. **Extract files hvis nødvendig**

### Option B: FTP Upload
```bash
# Using FTP (hvis du har FTP tilgang)
Server: ftp.snakkaz.com
Username: [ditt cpanel username]
Password: [ditt cpanel password]
Directory: /public_html
```

### Option C: SSH/Terminal (hvis tilgjengelig)
```bash
# Hvis du har SSH tilgang
scp -r dist/* user@162.0.229.214:/public_html/
```

---

## ✅ STEG 5: .htaccess CONFIGURATION

**Opprett denne .htaccess fil i /public_html:**

```apache
# SnakkaZ Beta - Production .htaccess
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle SPA routing - redirect all to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wqp0ozrbxcucynsojmbk.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://wqp0ozrbxcucynsojmbk.supabase.co wss://wqp0ozrbxcucynsojmbk.supabase.co"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

---

## ✅ STEG 6: SSL CERTIFICATE

### Enable HTTPS på cPanel:
1. **cPanel → SSL/TLS**
2. **Let's Encrypt SSL** (gratis)
3. **Enable for:** www.snakkaz.com & snakkaz.com
4. **Force HTTPS Redirect:** ON

---

## ✅ STEG 7: TESTING & VERIFICATION

### Test URLs:
- https://www.snakkaz.com
- https://snakkaz.com (should redirect to www)

### Test Checklist:
- [ ] **Site loads:** Homepage visible
- [ ] **HTTPS:** Green lock icon
- [ ] **Registration:** Create test user
- [ ] **Chat:** Send test message
- [ ] **Mobile:** Responsive design
- [ ] **PWA:** Install prompt works
- [ ] **Supabase:** Database connection works

---

## ✅ STEG 8: SUBDOMAIN SETUP (OPTIONAL)

Du kan også sette opp subdomains:

### For Chat Beta:
- **chat.snakkaz.com** → /public_html (main app)
- **beta.snakkaz.com** → /public_html (beta version)

### For Services:
- **analytics.snakkaz.com** → /public_html/analytics
- **docs.snakkaz.com** → /public_html/docs
- **dash.snakkaz.com** → /public_html/dashboard

---

## 🔧 TROUBLESHOOTING

### Common Issues:

**1. Site not loading:**
- Check DNS propagation (24-48 hours)
- Verify files uploaded to /public_html
- Check .htaccess syntax

**2. Database connection failed:**
- Verify Supabase URL/key in environment
- Check CORS settings in Supabase
- Test API endpoint directly

**3. HTTPS issues:**
- Enable SSL certificate in cPanel
- Force HTTPS redirect
- Check mixed content warnings

**4. SPA routing issues:**
- Verify .htaccess RewriteRules
- Test direct URL access
- Check 404 handling

---

## 📊 POST-DEPLOYMENT MONITORING

### Check these URLs:
- **Main Site:** https://www.snakkaz.com
- **API Health:** https://wqp0ozrbxcucynsojmbk.supabase.co/rest/v1/
- **cPanel:** https://cpanel.snakkaz.com
- **Analytics:** cPanel → Metrics

### Performance Monitoring:
- **PageSpeed:** https://pagespeed.web.dev/
- **SSL Test:** https://www.ssllabs.com/ssltest/
- **DNS Check:** https://dnschecker.org/

---

## 🚀 LAUNCH COMMAND SEQUENCE

```bash
# 1. Update environment
echo "VITE_SITE_URL=https://www.snakkaz.com" >> .env.production

# 2. Build production
npm run build:prod

# 3. Verify build
ls -la dist/

# 4. Upload to cPanel (manual via File Manager)
# 5. Create .htaccess
# 6. Enable SSL
# 7. Test site
```

---

## ✅ SUCCESS METRICS

**Technical:**
- [ ] Site loads in <3 seconds
- [ ] SSL A+ rating
- [ ] Mobile responsive
- [ ] PWA installable

**Functional:**
- [ ] User registration works
- [ ] Chat messaging works
- [ ] Invite system works
- [ ] Database reads/writes

**Business:**
- [ ] www.snakkaz.com resolves
- [ ] Production ready
- [ ] Beta users can access
- [ ] Analytics tracking

---

**🎯 STATUS: READY FOR www.snakkaz.com DEPLOYMENT!**

**⏰ DEPLOYMENT TIME: 15-30 MINUTTER!**
