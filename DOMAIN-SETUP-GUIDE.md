# 🎯 SNAKKAZ.COM vs MCP.SNAKKAZ.COM - DOMAIN SETUP GUIDE

## 🌐 **DOMAIN STRUKTUR:**

### **SNAKKAZ.COM** (Hoveddomene)
- **Lokasjon:** `public_html/`
- **Type:** Statisk website
- **Brukes for:** Hovedside, marketing, dokumentasjon
- **URL:** `https://snakkaz.com`

### **MCP.SNAKKAZ.COM** (Subdomene - Node.js App)
- **Lokasjon:** `mcp-snakkaz/` (som vist i cPanel)
- **Type:** Node.js applikasjon
- **Brukes for:** MCP Chat Server
- **URL:** `https://mcp.snakkaz.com`

---

## 🔧 **BASERT PÅ DINE SCREENSHOTS:**

Du har allerede satt opp MCP.SNAKKAZ.COM som Node.js app! ✅

### **HVA DU MÅ ENDRE:**

#### 1. **Endre Application Startup File:**
```
Fra: server-enhanced.js
Til:  server-production.cjs
```

#### 2. **Upload filene til riktig mappe:**
```
IKKE: public_html/snakkaz-production-deploy/
MEN:  mcp-snakkaz/
```

#### 3. **Flytt filene:**
I cPanel File Manager:
- Gå til `public_html/snakkaz-production-deploy/`
- Velg ALLE filer
- Cut/Copy
- Gå til `mcp-snakkaz/`
- Paste

---

## ⚡ **QUICK FIX STEPS:**

### **STEG 1: Endre Startup File**
I Node.js App i cPanel:
- Application startup file: `server-production.cjs`
- Klikk **SAVE**

### **STEG 2: Flytt Filer**
I File Manager:
```
Fra: public_html/snakkaz-production-deploy/*
Til:  mcp-snakkaz/
```

### **STEG 3: Start App**
I Node.js App panel:
- Klikk **RESTART**
- Status skal vise "Running"

### **STEG 4: Test**
```
✅ https://mcp.snakkaz.com/health
✅ https://mcp.snakkaz.com/
```

---

## 🎯 **HVIS DU VIL BRUKE HOVEDDOMENET:**

Hvis du vil ha appen på `snakkaz.com` isteden:

### **Alternativ 1: Redirect**
Lag `.htaccess` i `public_html/`:
```apache
RewriteEngine On
RewriteRule ^(.*)$ https://mcp.snakkaz.com/$1 [R=301,L]
```

### **Alternativ 2: Flytt Alt**
- Flytt alle filer fra `mcp-snakkaz/` til `public_html/`
- Slett Node.js appen
- Kjør som statisk site (men mister server-side features)

---

## 🚀 **MIN ANBEFALING - UPDATED:**

### **FASE 1: REDIRECT LØSNING (NÅ - 5 MINUTTER)**
```apache
# Lag .htaccess i public_html/
RewriteEngine On
RewriteRule ^(.*)$ https://mcp.snakkaz.com/$1 [R=301,L]
```

**Resultat:**
- ✅ `www.snakkaz.com` → `mcp.snakkaz.com` 
- ✅ `snakkaz.com` → `mcp.snakkaz.com`
- ✅ Alle URLs fungerer med en gang!
- ✅ EN server å vedlikeholde

### **FASE 2: STATISK FRONTEND (SENERE)**
Når du vil ha clean URLs:
- Frontend på `www.snakkaz.com` 
- API calls til `mcp.snakkaz.com`
- Best av begge verdener!

### **HVORFOR DENNE STRATEGIEN:**
1. 🚀 **Instant go-live** - fungerer med en gang
2. 🔧 **Lett å endre** - kan oppgradere senere  
3. 🎯 **En kodebase** - enklere vedlikehold
4. 📊 **SEO-vennlig** - 301 redirects er bra for SEO

**READY FOR WORLD DOMINATION! 🌍�**
