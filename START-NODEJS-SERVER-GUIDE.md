# 🚀 START NODE.JS SERVEREN PÅ NAMECHEAP/CPANEL

## 🎯 **DU ER HER:** Filer uploadet ✅ → **NÅ: Start serveren!**

### 🔧 **HVORDAN STARTE NODE.JS SERVEREN:**

#### **METODE 1: SSH TERMINAL (ANBEFALT)**

1. **Koble til via SSH:**
   ```bash
   # Fra din lokale maskin
   ssh dittbrukernavn@snakkaz.com
   # ELLER bruk cPanel Terminal
   ```

2. **Naviger til riktig mappe:**
   ```bash
   cd public_html/snakkaz-production-deploy/
   # ELLER hvis du flyttet filene til root:
   cd public_html/
   ```

3. **Start serveren:**
   ```bash
   node server-production.cjs
   ```

4. **Du skal se:**
   ```
   🚀 SnakkaZ Production Server starting...
   🔒 Security systems activated
   📊 Analytics initialized
   ✅ Server running on port 3001
   🌍 Ready to dominate the world!
   ```

---

#### **METODE 2: CPANEL TERMINAL**

1. **Åpne cPanel → Terminal**
2. **Kjør kommandoene:**
   ```bash
   cd public_html/snakkaz-production-deploy/
   node server-production.cjs
   ```

---

#### **METODE 3: BACKGROUND PROSESS (FOR PERMANENT KJØRING)**

```bash
# Start i bakgrunn (så serveren kjører selv om du logger ut)
cd public_html/snakkaz-production-deploy/
nohup node server-production.cjs > server.log 2>&1 &

# Sjekk at den kjører
ps aux | grep node
```

---

## 🔍 **DEBUGGING JAVASCRIPT-FEILENE:**

Feilene du ser kommer fordi:

### **1. Service Worker laster OK:** ✅
```
sw.js:249 [SW] SnakkaZ Beta Service Worker loaded successfully
```

### **2. React Router feil:** ❌
```
vendor-router-C9rTtA6X.js:1 Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')
```

**LØSNING:** Dette fikses når Node.js serveren starter og serverer React-filene riktig!

### **3. Manifest feil:** ⚠️
```
Manifest: Enctype should be set to either application/x-www-form-urlencoded or multipart/form-data
```

**LØSNING:** Også fikses av serveren som serverer riktig MIME-typer.

---

## 🎯 **ETTER DU STARTER SERVEREN:**

### **Test disse URL-ene:**
```
✅ Health check: https://mcp.snakkaz.com:3001/health
✅ Main app: https://mcp.snakkaz.com:3001/
✅ API: https://mcp.snakkaz.com:3001/api/status
```

**ELLER hvis du ikke har port 3001 åpen:**
```
Serveren kan kjøre på port 80/443 ved å endre i server-production.cjs
```

---

## ⚡ **QUICK FIX - ENDRE PORT TIL 80:**

Hvis port 3001 ikke er tilgjengelig:

1. **Rediger server-production.cjs:**
   ```javascript
   // Finn denne linja:
   const PORT = process.env.PORT || 3001;
   
   // Endre til:
   const PORT = process.env.PORT || 80;
   ```

2. **Start serveren igjen:**
   ```bash
   node server-production.cjs
   ```

3. **Test uten port i URL:**
   ```
   https://mcp.snakkaz.com/health
   https://mcp.snakkaz.com/
   ```

---

## 🚨 **HVIS SERVEREN IKKE STARTER:**

### **Sjekk Node.js installasjon:**
```bash
node --version
npm --version
```

### **Installer avhengigheter:**
```bash
cd public_html/snakkaz-production-deploy/
npm install
```

### **Sjekk filer er på plass:**
```bash
ls -la server-production.cjs
ls -la package.json
```

---

## 📞 **TRENGER DU HJELP?**

**Tell meg:**
1. Hvilken metode brukte du for å koble til serveren?
2. Hva skjer når du kjører `node server-production.cjs`?
3. Får du noen feilmeldinger?

**LA OSS FÅ SERVEREN I GANG! 🚀**
