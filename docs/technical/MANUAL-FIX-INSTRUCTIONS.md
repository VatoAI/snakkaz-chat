# SNAKKAZ.COM EMERGENCY FIX - MANUAL INSTRUCTIONS

## Problemet:
JavaScript-filer på serveren har feil navn/hash-verdier og returnerer 404-feil.

## Løsningen:
Upload disse 2 kritiske filene:

### 1. LAST OPP index.html
Fra: `/workspaces/snakkaz-chat/dist/index.html`
Til: `snakkaz.com/index.html` (root directory)

### 2. LAST OPP JavaScript-fil  
Fra: `/workspaces/snakkaz-chat/dist/assets/js/index-BqZ1ZR0w.js`
Til: `snakkaz.com/assets/js/index-BqZ1ZR0w.js`

## FTP Detaljer:
- Server: ftp.domeneshop.no
- Brukernavn: snakkaz.com  
- Passord: B48@.m*VhQUF
- Port: 21 (standard FTP) eller 22 (SFTP)

## Alternative metoder:

### 1. Web File Manager (Anbefalt)
- Gå til domeneshop.no kontrollpanel
- Finn "File Manager" eller "Filbehandling"
- Upload filene direkte

### 2. FileZilla FTP Client
- Last ned FileZilla
- Connect med FTP-detaljene over
- Drag & drop filene

### 3. Kommandolinje (hvis FTP virker):
```bash
cd /workspaces/snakkaz-chat
ftp ftp.domeneshop.no
# Login med snakkaz.com / B48@.m*VhQUF
put dist/index.html index.html
mkdir assets
mkdir assets/js  
put dist/assets/js/index-BqZ1ZR0w.js assets/js/index-BqZ1ZR0w.js
quit
```

## Test etter upload:
1. Gå til https://snakkaz.com
2. Trykk F12 → Console
3. Sjekk om JavaScript-feilene er borte
4. Refresh med Ctrl+F5 for å tømme cache

## Status før fix:
- Index.html på server refererer til: index-CEa86-6h.js (finnes ikke)
- Vår nye fil heter: index-BqZ1ZR0w.js

## Dette vil fikse:
✅ MIME type feil ("text/html" → "application/javascript")
✅ 404-feil på JavaScript-filer
✅ App starter riktig
