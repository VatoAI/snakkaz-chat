# 🚀 SNAKKAZ PRODUCTION DEPLOYMENT INSTRUCTIONS

## NAMECHEAP CPANEL DEPLOYMENT

### 1. UPLOAD FILES
1. Extract `snakkaz-main-YYYYMMDD-HHMMSS.zip`
2. Upload ALL files to `public_html/` directory
3. Ensure `.htaccess` is uploaded (show hidden files)

### 2. DOMAIN CONFIGURATION
- **Main Domain**: www.snakkaz.com → `/public_html/`
- **MCP Subdomain**: mcp.snakkaz.com → `/public_html/mcp/` (API routing)

### 3. SSL CERTIFICATE
1. Enable SSL in cPanel
2. Force HTTPS redirect (already in .htaccess)
3. Verify PWA works over HTTPS

### 4. PWA VERIFICATION
Test these URLs after deployment:
- https://www.snakkaz.com (main app)
- https://www.snakkaz.com/sw.js (service worker)
- https://www.snakkaz.com/manifest.json (PWA manifest)

### 5. PUSH NOTIFICATIONS
VAPID keys are configured in production build:
- Public Key: Already embedded in service worker
- Private Key: Use for server-side push API

## VERIFICATION CHECKLIST
- [ ] HTTPS working
- [ ] PWA installable
- [ ] Service Worker active  
- [ ] Offline mode working
- [ ] Push notifications ready
- [ ] All routes working (SPA)
- [ ] Assets loading correctly
- [ ] Glass Liquid UI rendering
- [ ] Digital Vokter active
