# 🌐 SNAKKAZ BETA PÅ WWW.SNAKKAZ.COM - DEPLOYMENT GUIDE

## 🎯 **SITUASJON:**
- ✅ MCP.SNAKKAZ.COM fungerer (Node.js app)
- ❓ WWW.SNAKKAZ.COM trenger SnakkaZ Beta

## 🚀 **ALTERNATIVER FOR WWW.SNAKKAZ.COM:**

### **ALTERNATIV 1: REDIRECT TIL MCP (ANBEFALT)**
Enklest løsning - redirect fra hoveddomenet til MCP:

**Lag `.htaccess` i `public_html/`:**
```apache
RewriteEngine On
RewriteRule ^(.*)$ https://mcp.snakkaz.com/$1 [R=301,L]
```

**Resultat:** 
- `www.snakkaz.com` → `mcp.snakkaz.com`
- Alle fungerer på samme Node.js server

---

### **ALTERNATIV 2: STATISK VERSJON PÅ HOVEDDOMENE**
Deploy statisk versjon til `public_html/`:

**Steg:**
1. Kopier BARE frontend-filene til `public_html/`
2. Sett opp API calls til `mcp.snakkaz.com`
3. Statisk HTML/CSS/JS på `www.snakkaz.com`

**Filer å kopiere:**
```
Fra mcp-snakkaz/ til public_html/:
✅ index.html
✅ assets/ (CSS, JS)
✅ manifest.json
✅ robots.txt
✅ icons/
✅ images/
```

**API konfigurering:**
Oppdater JavaScript til å kalle:
```javascript
// Istedenfor relative URLs
fetch('/api/messages')

// Bruk full URL til MCP server
fetch('https://mcp.snakkaz.com/api/messages')
```

---

### **ALTERNATIV 3: DUPLIKAT NODE.JS APP**
Lag identisk Node.js app for hoveddomene:

**Steg:**
1. Opprett ny Node.js app for `snakkaz.com`
2. Kopier alle filer dit også
3. Ha to identiske servere kjørende

**Fordeler:** Full redundans
**Ulemper:** Dobbelt vedlikehold

---

### **ALTERNATIV 4: REVERSE PROXY**
Avansert løsning med `.htaccess` proxy:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/proxy/
RewriteRule ^(.*)$ /proxy/$1 [L]

# Proxy to Node.js app
RewriteRule ^proxy/(.*)$ http://localhost:PORT/$1 [P,L]
```

---

## 🎯 **MIN ANBEFALING:**

### **START MED ALTERNATIV 1 (REDIRECT):**
Raskest og enklest å implementere:

1. **Lag `.htaccess` i `public_html/`:**
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ https://mcp.snakkaz.com/$1 [R=301,L]
   ```

2. **Test:**
   - `www.snakkaz.com` → redirecter til `mcp.snakkaz.com`
   - `snakkaz.com` → redirecter til `mcp.snakkaz.com`

3. **Alle brukere ender opp på samme app!**

### **SENERE: OPPGRADER TIL ALTERNATIV 2:**
Når du vil ha clean URLs uten "mcp.":

1. Kopier frontend-filer til `public_html/`
2. Oppdater API calls til `mcp.snakkaz.com`
3. Statisk frontend + Node.js backend

---

## 🚀 **QUICK START - REDIRECT LØSNING:**

### **STEG 1: Opprett .htaccess**
I cPanel File Manager:
1. Gå til `public_html/`
2. Opprett ny fil: `.htaccess`
3. Legg inn:
   ```apache
   RewriteEngine On
   RewriteRule ^(.*)$ https://mcp.snakkaz.com/$1 [R=301,L]
   ```

### **STEG 2: Test**
- `www.snakkaz.com` → automatisk redirect til `mcp.snakkaz.com`
- `snakkaz.com/health` → redirect til `mcp.snakkaz.com/health`

---

## 📊 **FORDELER MED HVER LØSNING:**

| Løsning | Implementering | Vedlikehold | SEO | Performance |
|---------|---------------|-------------|-----|-------------|
| Redirect | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Statisk Frontend | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Duplikat App | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Reverse Proxy | ⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎉 **HVILKEN LØSNING VIL DU PRØVE?**

1. **Quick redirect** (5 minutter)
2. **Statisk frontend** (30 minutter) 
3. **Duplikat Node.js** (1 time)
4. **Noe annet?**

**LA OSS FÅ SNAKKAZ BETA LIVE PÅ HOVEDDOMENET! 🌍🚀**
