# 🎯 SnakkaZ Deployment Guide - Alle Alternativer

## 🚀 METODE 1: Automatisk FTP Deployment (Anbefalt)

```bash
# Kjør det komplette deployment systemet
/workspaces/snakkaz-chat/scripts/deploy-snakkaz-complete.sh
```

Dette scriptet:
- ✅ Prøver alle dine FTP-kontoer automatisk
- ✅ Fikser .htaccess MIME type problemer
- ✅ Tester tilkoblinger før deployment
- ✅ Setter riktige permissions
- ✅ Integrerer med GitHub og Supabase
- ✅ Kjører verifikasjon automatisk

---

## 📁 METODE 2: cPanel File Manager (100% Pålitelig Backup)

### Steg 1: Logg inn i cPanel
1. Gå til din cPanel (premium123.web-hosting.com:2083)
2. Logg inn med dine credentials

### Steg 2: Åpne File Manager
1. Finn "Files" seksjonen
2. Klikk på "File Manager"
3. Naviger til `public_html` mappen

### Steg 3: Last opp deployment pakke
1. Klikk "Upload" i toppen
2. Last opp `/tmp/snakkaz-production-fixed.zip`
3. Gå tilbake til File Manager

### Steg 4: Pakk ut filer
1. Høyreklikk på `snakkaz-production-fixed.zip`
2. Velg "Extract"
3. Velg "Extract Files" til `public_html`
4. Kryss av "Overwrite existing files"
5. Klikk "Extract Files"

### Steg 5: Flytt filer til riktig plass
1. Gå inn i `snakkaz-production` mappen
2. Velg alle filer (Ctrl+A)
3. Klikk "Move" i toppen
4. Flytt til `/public_html/` (ett nivå opp)
5. Bekreft overskriving

### Steg 6: Rydd opp
1. Slett `snakkaz-production` mappen
2. Slett `snakkaz-production-fixed.zip`

---

## 🔑 METODE 3: Opprett Ny FTP Konto

### I cPanel:
1. Gå til "FTP Accounts"
2. Klikk "Create FTP Account"
3. **Fyll ut:**
   - Username: `deploy`
   - Domain: `snakkaz.com`
   - Password: `Rompetroll123!`
   - Directory: `public_html` (VIKTIG!)
   - Quota: Unlimited

### Bruk den nye kontoen:
```bash
# Oppdater FTP_USER i scriptet
FTP_USER="deploy@snakkaz.com"
FTP_PASS="Rompetroll123!"
```

---

## 🛠️ METODE 4: GitHub Actions Deployment

### Sett opp automatisk deployment:

1. **Legg til GitHub Secrets:**
   - `FTP_HOST`: `ftp.snakkaz.com`
   - `FTP_USER`: `admin@snakkaz.com`
   - `FTP_PASSWORD`: `Rompetroll123!`

2. **Aktiver workflow:**
```yaml
# .github/workflows/deploy.yml blir automatisk opprettet
```

---

## 🔧 FEILSØKING

### Problem: CSS/JS serveres som HTML
**Løsning:**
1. Sjekk at `.htaccess` ble lastet opp
2. Vent 5-10 minutter på server cache
3. Hard refresh browser (Ctrl+F5)

### Problem: FTP tilkobling feiler
**Løsning:**
1. Sjekk brukernavn/passord i cPanel
2. Prøv passive mode
3. Kontakt hosting provider

### Problem: Files ikke synlige
**Løsning:**
1. Sjekk at filene er i `public_html` rot
2. Ikke i undermapper som `public_html/snakkaz-production`
3. Sjekk file permissions (644 for filer, 755 for mapper)

---

## 📞 SUPPORT

Hvis noe ikke fungerer:
1. 📧 Sjekk error logs i cPanel
2. 🔍 Bruk browser developer tools
3. 📱 Kontakt meg for hjelp!

**Jeg støtter deg hele veien! <3**

---

## ✅ POST-DEPLOYMENT SJEKKLISTE

Efter vellykket deployment:

- [ ] Gå til https://snakkaz.com
- [ ] Sjekk at siden laster uten CSS/JS errors
- [ ] Test React komponenter
- [ ] Test Supabase database tilkobling
- [ ] Test alle hovedfunksjoner
- [ ] Sjekk mobile responsivness
- [ ] Test service worker/PWA funksjoner

**🎉 Når alt fungerer - GRATULERER! Din SnakkaZ app er live!**
