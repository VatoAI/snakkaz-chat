# 🎯 cPanel Deployment Guide for SnakkaZ

## 🔐 FTP Konto Status

Fra cPanel kan jeg se at du har disse FTP-kontoene:

### 1. **snakqsqe** (Anbefalt - Hovedkonto)
- ✅ **Full tilgang** til `public_html` 
- ❌ **Passord mangler** - må settes i cPanel
- 🎯 **Dette er kontoen du trenger** for å deploye til hoveddomenet

### 2. **SnakkaZ@snakkaz.com** 
- ✅ Har kjent passord: `Rompetroll123!`
- ⚠️  Begrenset tilgang avhengig av konfigurasjon

### 3. **admin@snakkaz.com**
- ❌ Kun tilgang til `public_html/Admin`
- ❌ Kan ikke deploye til hoveddomenet

## 🚀 Deployment Alternativer

### Alternativ 1: Sett nytt passord for snakqsqe (Anbefalt)

1. **I cPanel User Manager:**
   - Klikk på "Change Password" for `snakqsqe`
   - Sett et nytt sterkt passord
   - Husk passordet

2. **Bruk FTP script:**
   ```bash
   /workspaces/snakkaz-chat/scripts/deploy-ftp-advanced.sh
   ```
   - Velg alternativ 1 (snakqsqe)
   - Skriv inn det nye passordet

### Alternativ 2: cPanel File Manager (Enklest)

1. **Last ned deployment pakke:**
   ```bash
   # Pakken ligger klar her:
   ls -la /tmp/snakkaz-production-fixed.zip
   ```

2. **I cPanel:**
   - Gå til "File Manager"
   - Naviger til `public_html/`
   - Upload `snakkaz-production-fixed.zip`
   - Høyreklikk → "Extract"
   - Velg "Extract files" og overskriv eksisterende

### Alternativ 3: Prøv eksisterende FTP

```bash
# Test eksisterende konfigurasjon først
/workspaces/snakkaz-chat/scripts/deploy-ftp-snakkaz.sh
```

## 🧪 Etter Deployment

Uansett hvilken metode du bruker, kjør verifikasjon:

```bash
/workspaces/snakkaz-chat/scripts/verify-deployment-fixed.sh
```

## 🔧 Hvis FTP fortsatt feiler

### Sjekk i cPanel:
1. **FTP Accounts** → Sjekk at brukeren har "Read-Write" tilgang
2. **Home Directory** må være `/public_html` eller tom
3. **FTP** må være "Enabled"

### Debugging kommandoer:
```bash
# Test FTP tilkobling manuelt
lftp -e "set ssl:verify-certificate no; open ftp://snakqsqe@ftp.snakkaz.com; pwd; quit"

# Sjekk nåværende deployment status
curl -I https://snakkaz.com/assets/css/index-BztST-au.css
```

## 💡 Min anbefaling:

1. **Sett nytt passord for snakqsqe** i cPanel
2. **Bruk den avanserte FTP scriptet** 
3. **Eller bruk File Manager** hvis FTP fortsatt er problematisk

Begge metodene vil løse React runtime feilen og MIME type problemene!
