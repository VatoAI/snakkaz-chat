# Feilsøkingsguide for Snakkaz.com

## Slik løser du FTP-opplastingsproblemer

Loggene viser at det er problemer med å laste opp assets-filene til Namecheap-serveren. Dette er den vanligste årsaken til at endringer ikke vises på nettsiden. Følg disse trinnene for å løse problemet:

### 1. Kjør det forbedrede assets-opplastingsskriptet

```bash
./enhanced-assets-upload.sh
```

Dette skriptet fokuserer spesifikt på å laste opp JavaScript- og CSS-filene som er nødvendige for at applikasjonen skal fungere riktig.

### 2. Sjekk mappetillatelser på serveren

Hvis opplastingen fortsatt feiler, kan det være et problem med mappetillatelser på serveren:

1. Logg inn på cPanel på Namecheap
2. Gå til "File Manager"
3. Naviger til `public_html`
4. Sjekk om det finnes en assets-mappe. Hvis den ikke finnes, opprett den.
5. Høyreklikk på assets-mappen og velg "Permissions"
6. Sett tillatelser til 755 (drwxr-xr-x) for mappen

### 3. Last opp manuelt via cPanel

Hvis FTP fortsatt ikke fungerer:

1. Logg inn på cPanel på Namecheap
2. Gå til "File Manager"
3. Naviger til `public_html`
4. Opprett en assets-mappe hvis den ikke finnes
5. Klikk på "Upload" og last opp filene fra din lokale `dist/assets`-mappe

### 4. Sjekk om opplastingen fungerte

Etter opplastingen, sjekk om filene er tilgjengelige:

```bash
curl -I https://www.snakkaz.com/assets/index-GRqizV24.css
```

Du bør se en HTTP 200 OK respons. Hvis du får en 404, er filene ikke korrekt lastet opp.

### 5. Tøm nettleserens buffer

Selv om filene er korrekt lastet opp, kan nettleseren ha en gammel versjon i buffer:

1. Trykk Ctrl+F5 (Windows/Linux) eller Cmd+Shift+R (Mac) for å tvinge en full oppdatering
2. Eller test i inkognitomodus i nettleseren din
3. Prøv en annen nettleser for å bekrefte

### 6. DNS- og CDN-problemer

Hvis du nylig har endret DNS-innstillinger:

1. DNS-endringer kan ta opptil 48 timer å bli fullt propagert
2. Sjekk om www.snakkaz.com peker til riktig IP-adresse med `nslookup www.snakkaz.com`
3. Hvis du bruker Cloudflare, sjekk om cache-innstillingene er riktige

## Vanlige feil og løsninger

### 1. MIME-type problemer

Hvis filer lastes, men JavaScript-filer ikke kjører:

```bash
# Sjekk om .htaccess-filen er riktig lastet opp
curl -s https://www.snakkaz.com/.htaccess | head -10
```

### 2. Multiple GoTrueClient-advarselen

Hvis du fortsatt ser denne advarselen:

1. Sørg for at fix-and-rebuild.sh er kjørt lokalt
2. Kjør deploy-fixed-app-to-namecheap.sh igjen
3. Verifiser at Supabase-klienten bruker singleton-mønsteret

### 3. CORS-feil

Hvis du ser CORS-feil i nettleserkonsollen:

1. Sjekk at Supabase er konfigurert med riktig origin
2. Sjekk at CSP (Content Security Policy) i .htaccess er korrekt

## Kontakter for support

Hvis du fortsatt opplever problemer etter å ha fulgt disse trinnene, kontakt:

- Namecheap support for FTP/webhosting-problemer
- Supabase support for database-relaterte problemer

Husk å inkludere relevante feilmeldinger og loggfiler når du kontakter support.
