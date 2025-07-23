# 📦 CPANEL UPLOAD INSTRUKSJONER - KLAR TIL DEPLOYMENT!

## ✅ ZIP-FIL KLAR!

**📁 Fil opprettet:** `snakkaz-production-deploy-upload.zip` (22.8 MB)

---

## 🗑️ **SKAL DU SLETTE GAMLE FILER FØRST?**

### 🚨 **ANBEFALING: SIKKERHETSKOPI FØRST!**

**IKKE SLETT ALT BLINDT!** Her er smartere fremgangsmåte:

### 📋 **STEG-FOR-STEG PLAN:**

#### 1. **SIKKERHETSKOPI EXISTING FILER (VIKTIG!):**
```text
I cPanel File Manager:
📁 Gå til public_html/
📁 Velg alle filer/mapper
📁 Klikk "Compress" → Lag backup.zip
📁 Download backup.zip til PC (som backup)
```

#### 2. **IDENTIFISER HVA SOM SKAL BEHOLDES:**
```text
BEHOLD DISSE (hvis de finnes):
✅ .htaccess (viktig for redirects/sikkerhet)
✅ .well-known/ (for SSL sertifikater)
✅ error_log (for debugging)
✅ subdomene-mapper (hvis du har andre sites)

SLETT DISSE TRYGT:
❌ Gamle HTML/JS/CSS filer
❌ Gamle PHP filer (hvis ikke i bruk)
❌ node_modules/ (hvis finnes)
❌ Temp filer
```

#### 3. **UPLOAD & PAKK UT:**
```text
📁 Last opp snakkaz-production-deploy-upload.zip
📁 Høyreklikk → "Extract" 
📁 Velg: "Extract to current directory"
📁 Dette lager snakkaz-production-deploy/ mappe
```

#### 4. **FLYTT FILER TIL RIKTIG PLASS:**
```text
Fra: snakkaz-production-deploy/
Til: public_html/ (root)

ELLER endre domene til å peke på:
public_html/snakkaz-production-deploy/
```

---

## 🎯 **ANBEFALT FREMGANGSMÅTE:**

### **ALTERNATIV A: FULL CLEANUP (TRYGT)**
1. ✅ Lag backup av existing public_html/
2. ✅ Last opp ZIP-fil
3. ✅ Pakk ut i ny mappe: `snakkaz-new/`
4. ✅ Test at alt fungerer: `yourdomain.com/snakkaz-new/`
5. ✅ Hvis OK: flytt filer til root
6. ✅ Hvis problem: restore fra backup

### **ALTERNATIV B: SIDE-BY-SIDE (SIKREST)**
1. ✅ Behold existing filer
2. ✅ Pakk ut ZIP i ny mappe: `snakkaz-production-deploy/`
3. ✅ Sett opp subdomain: `new.snakkaz.com` → peker til denne mappen
4. ✅ Test grundig
5. ✅ Når alt fungerer: bytt main domain

---

## 🚀 **QUICK START COMMANDS:**

**Etter upload i cPanel Terminal:**
```bash
# Gå til riktig mappe
cd public_html/snakkaz-production-deploy/

# Start serveren
node server-production.cjs

# Test serveren
curl http://localhost:3001/health
```

**Test i browser:**
```
https://yourdomain.com/snakkaz-production-deploy/health
```

---

## ⚠️ **VIKTIGE TIPS:**

### 🔒 **SIKKERHET:**
- Alltid lag backup først!
- Test på subdomene før main domain
- Behold gamle filer til alt fungerer

### 🌐 **DOMAIN SETUP:**
- Hvis du vil ha clean URLs (uten /snakkaz-production-deploy/)
- Flytt filene til root ELLER
- Sett opp redirect i .htaccess

### 📞 **Support:**
- Hvis noe går galt: restore fra backup
- Kontakt Namecheap support om domain issues

---

## 🎉 **ER DU KLAR?**

**Du har nå:**
✅ ZIP-fil klar: `snakkaz-production-deploy-upload.zip`  
✅ Backup-plan  
✅ Step-by-step instruksjoner  
✅ Fallback-strategi  

**Last opp og dominer verden!** 🌍👑
