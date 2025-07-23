# 🚀 SnakkaZ Beta - cPanel Deployment Guide (OPPDATERT)

## 🔧 **PROBLEMLØSNING - DNS & CSP Issues**  
Basert på feilmeldingene dine har jeg fikset:
- ✅ CSP font loading (Roboto/Noto Sans)
- ✅ Browser tracking protection issues  
- ✅ Proper .htaccess med security headers
- ✅ HTTPS redirect og SPA routing
- ⚠️ **OPPDATERING**: Du bruker IKKE Cloudflare - DNS issues kan være hosting provider relatert

## 📦 **Ny Zip-fil er klar!**
- **Filnavn**: `snakkaz-beta-deployment-fixed.zip` ⭐ NY VERSJON
- **Størrelse**: 11MB
- **Inneholder**: Alle filer + .htaccess fixes

## 🗂️ **Skal du slette alt som er der fra før?**

### ✅ **JA - ANBEFALT (Full clean deployment)**
Dette er den tryggeste måten for en helt ny beta-lansering:

1. **Backup først** (viktig!)
   - Gå til cPanel File Manager
   - Høyreklikk på `public_html` mappen
   - Velg "Create Archive" 
   - Lag en backup: `backup-snakkaz-$(date).zip`

2. **Slett gammelt innhold**
   - Gå inn i `public_html` mappen
   - Velg ALT (Ctrl+A)
   - Slett alle filer og mapper

3. **Last opp ny zip**
   - Upload `snakkaz-beta-deployment-fixed.zip` ⭐ NY VERSJON
   - Høyreklikk på zip-filen
   - Velg "Extract"
   - Flytt alt fra `dist/` til root-nivå i `public_html`
   - **VIKTIG**: Sjekk at `.htaccess` filen er med (løser CSP og DNS issues)

### ⚠️ **NEI - Delvis oppdatering**
Hvis du vil beholde noe av det gamle:

1. **Backup kun viktige filer**
   - `.htaccess` (hvis du har custom regler)
   - `robots.txt` (hvis tilpasset)
   - Email/subdomain mapper

2. **Slett kun web-filer**
   - `index.html`
   - `assets/` mappen
   - `js/` og `css/` mapper
   - Andre HTML-filer

## 📋 **Steg-for-steg cPanel opplasting:**

### 1. **Logg inn på cPanel**
   - Gå til din hosting providers cPanel
   - Bruk dine innloggingsdetaljer

### 2. **Åpne File Manager**
   - Klikk på "File Manager" ikonet
   - Naviger til `public_html` mappen

### 3. **Backup (VIKTIG!)**
   ```
   1. Høyreklikk på public_html
   2. Velg "Create Archive"
   3. Navn: backup-før-snakkaz-beta
   4. Klikk "Create Archive"
   ```

### 4. **Slett gammelt innhold** (hvis ønsket)
   ```
   1. Gå inn i public_html
   2. Velg alle filer (Ctrl+A eller Select All)
   3. Klikk "Delete" 
   4. Bekreft sletting
   ```

### 5. **Last opp zip-filen**
   ```
   1. Klikk "Upload" knappen
   2. Velg snakkaz-beta-deployment.zip
   3. Vent til opplasting er ferdig
   4. Gå tilbake til File Manager
   ```

### 6. **Pakk ut zip-filen**
   ```
   1. Høyreklikk på snakkaz-beta-deployment.zip
   2. Velg "Extract" eller "Unzip"
   3. Velg "Extract to public_html/"
   4. Klikk "Extract Files"
   ```

### 7. **Flytt filer til riktig nivå**
   ```
   Du vil se en "dist/" mappe. Flytt ALT fra dist/ til public_html/:
   
   1. Gå inn i dist/ mappen
   2. Velg alle filer og mapper (Ctrl+A)
   3. Klikk "Move" eller "Cut"
   4. Gå tilbake til public_html/
   5. Klikk "Paste" eller "Move Here"
   6. Slett den tomme dist/ mappen
   7. Slett zip-filen
   ```

### 8. **Verifiser deployment**
   ```
   Sjekk at disse filene er i public_html/:
   ✅ index.html
   ✅ manifest.json
   ✅ .htaccess (VIKTIG - løser font/CSP problemer!)
   ✅ assets/ (mappe)
   ✅ icons/ (mappe)
   ✅ service-worker.js
   ✅ robots.txt
   ```

## 🌐 **Test din nye nettside**
1. Gå til `https://snakkaz.com`
2. Sjekk at siden laster riktig
3. Test registrering
4. Test chat-funksjonalitet

## 🆘 **Hvis noe går galt**
1. Gå tilbake til File Manager
2. Slett alt i public_html
3. Pakk ut backup-filen din
4. Kontakt meg for hjelp!

## 📞 **Support**
Hvis du trenger hjelp med noen av disse stegene, bare spør!

---
**✅ Din snakkaz-beta-deployment.zip er klar for opplasting!**
