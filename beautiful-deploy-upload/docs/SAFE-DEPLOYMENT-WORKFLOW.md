# 🎯 TRYGG DEPLOYMENT WORKFLOW - Unngå feil før publisering

## 📋 ANBEFALT WORKFLOW

### 1. **LOKAL TESTING FØRST** (Unngår feil på live site)
```bash
# Test lokalt før deployment
./scripts/local-production-test.sh
```
Dette:
- Bygger applikasjonen 
- Verifiserer at alle assets finnes
- Starter lokal server på http://localhost:3000
- Lar deg teste alt lokalt først

### 2. **KOMPLETT VERIFIKASJON & DEPLOYMENT**
```bash
# Når lokal testing er OK, deploy alt
./scripts/complete-deployment-verification.sh
```
Dette:
- Sjekker at alle refererte filer finnes
- Laster opp HTML, CSS, JS og ikoner
- Verifiserer deployment
- Gir testing-instruksjoner

## 🔧 ALTERNATIVE TESTING METODER

### A. **Manuell lokal testing:**
```bash
npm run build
npx serve dist
# Åpne http://localhost:3000
# Sjekk Developer Console (F12)
```

### B. **Asset verifikasjon script:**
```bash
# Sjekk at alle assets HTML refererer til faktisk finnes
grep -oP '/assets/[^"]+' dist/index.html | while read asset; do
  [ -f "dist$asset" ] && echo "✅ $asset" || echo "❌ MANGLER: $asset"
done
```

### C. **GitHub Actions Preview:**
- Bruk Vercel/Netlify for preview deploys
- Test på midlertidig URL før main deployment

## ⚠️ VANLIGE FALLGRUVER

### 1. **Incomplete FTP Upload**
- **Problem**: Bare noen filer lastes opp
- **Løsning**: Last opp ALL dist/ innhold

### 2. **Cache Issues**  
- **Problem**: Gamle filer cached
- **Løsning**: Hard refresh (Ctrl+Shift+R)

### 3. **Asset Hash Mismatch**
- **Problem**: HTML refererer til filer som ikke finnes
- **Løsning**: Rebuild & upload alt samtidig

## 🎯 BEST PRACTICES

1. **Test alltid lokalt først**
2. **Verifiser assets før upload**
3. **Upload hele dist/ på en gang**
4. **Test med hard refresh etter deployment**
5. **Bruk scripts for consistency**

---

**RESULTAT**: Unngår 404-feil og andre problemer på live site!
