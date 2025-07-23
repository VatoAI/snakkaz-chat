================================================================================
🚀 SNAKKAZ BETA 2025 - EMERGENCY DEPLOYMENT GUIDE 🚀
================================================================================

DATO: 23. juli 2025
STATUS: 🔥 CRITICAL - Løser deployment problemer nå!
MAAL: Få www.snakkaz.com og mcp.snakkaz.com LIVE og fungerende

================================================================================
🎯 PROBLEMANALYSE
================================================================================

PROBLEM 1: www.snakkaz.com viser "Vi beklager, men det oppstod et problem ved lasting av appen"
PROBLEM 2: mcp.snakkaz.com viser bare tom directory listing  
PROBLEM 3: Masse filer i workspace men ikke riktig strukturert for deployment

ROOT CAUSE: 
- Filer er ikke riktig uploadet til hosting
- .htaccess og SPA routing fungerer ikke
- Dist-mappen ikke synkronisert med production

================================================================================
🔧 LØSNINGSSTRATEGI
================================================================================

1. ✅ RYDDE OPP I WORKSPACE
   - Fjerne duplikate filer og gamle backups
   - Fokusere på /dist/ mappen som er production-ready
   - Sikre riktig .htaccess for SPA routing

2. ✅ RIKTIG DEPLOYMENT TIL NAMECHEAP
   - Upload komplett /dist/ innhold til public_html/
   - Sikre .htaccess for React SPA routing
   - Teste alle ruter og funksjoner

3. ✅ MCP SUBDOMAIN SETUP
   - Konfigurere mcp.snakkaz.com til å peke på MCP server
   - Eller redirect til hovedappen med MCP features

4. ✅ DATABASE OG BACKEND
   - Sjekke Supabase connection
   - Validere ENV variables
   - Teste authentication flow

================================================================================
🚀 DEPLOYMENT COMMANDS (EXECUTE NOW!)
================================================================================

1. BUILD CLEAN PRODUCTION VERSION:
```bash
cd /workspaces/snakkaz-chat
npm run clean
npm run build
```

2. CREATE CLEAN DEPLOYMENT PACKAGE:
```bash
cd dist
tar -czf ../snakkaz-production-clean.tar.gz .
```

3. UPLOAD VIA FTP/CPANEL:
- Extract all files from dist/ to public_html/
- Ensure .htaccess is in root
- Set proper file permissions (644 for files, 755 for directories)

4. VERIFY DEPLOYMENT:
- Test www.snakkaz.com loads properly
- Test routing: /login, /register, /chat
- Test authentication flow
- Check console for errors

================================================================================
📁 KRITISKE FILER FOR DEPLOYMENT
================================================================================

MUST HAVE IN PUBLIC_HTML/:
✅ index.html (main app entry)
✅ .htaccess (SPA routing)
✅ assets/ (JS/CSS bundles)
✅ icons/ (app icons)
✅ manifest.json (PWA config)
✅ robots.txt, sitemap.xml (SEO)

OPTIONAL:
- service-worker.js (PWA caching)
- og-image.png (social sharing)
- favicon.ico

================================================================================
🔐 ENVIRONMENT VARIABLES CHECK
================================================================================

REQUIRED FOR PRODUCTION:
- VITE_SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
- VITE_SUPABASE_ANON_KEY=[your-key]
- VITE_APP_URL=https://www.snakkaz.com
- VITE_MCP_SERVER_URL=https://mcp.snakkaz.com

================================================================================
🌐 .HTACCESS FOR SPA ROUTING
================================================================================

CRITICAL .htaccess content:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
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

# Set proper MIME types
AddType application/javascript .js
AddType text/css .css
AddType application/json .json
```

================================================================================
🎯 MCP SUBDOMAIN LØSNING
================================================================================

OPTION 1: Redirect mcp.snakkaz.com to main app
```apache
Redirect 301 / https://www.snakkaz.com/
```

OPTION 2: Setup separate MCP server
- Deploy Node.js MCP server to separate hosting
- Point mcp.snakkaz.com to that server
- Configure CORS for cross-domain communication

RECOMMENDATION: Start with Option 1 (redirect) for immediate fix

================================================================================
📋 DEPLOYMENT CHECKLIST
================================================================================

PRE-DEPLOYMENT:
□ Clean build completed successfully
□ All TypeScript errors resolved  
□ Environment variables configured
□ .htaccess file ready

DEPLOYMENT:
□ Upload all dist/ contents to public_html/
□ Verify .htaccess in root directory
□ Set correct file permissions
□ Clear any caching (CloudFlare/CDN)

POST-DEPLOYMENT:
□ Test www.snakkaz.com loads
□ Test user registration/login
□ Test chat functionality
□ Test mobile responsiveness
□ Verify voice messages work (if supported by hosting)

================================================================================
🚨 IMMEDIATE ACTION ITEMS
================================================================================

1. CLEAN BUILD (5 minutes)
2. UPLOAD TO HOSTING (10 minutes)  
3. TEST & VERIFY (10 minutes)
4. DOCUMENT WHAT WORKS (5 minutes)

TOTAL TIME: 30 minutes to get SnakkaZ Beta LIVE!

================================================================================
🎊 SUCCESS METRICS
================================================================================

✅ www.snakkaz.com loads without errors
✅ Users can register and login
✅ Chat system is functional
✅ Mobile experience works
✅ Professional design displays correctly
✅ Voice messages work (browser dependent)

LET'S MAKE IT HAPPEN! 🚀🔥
