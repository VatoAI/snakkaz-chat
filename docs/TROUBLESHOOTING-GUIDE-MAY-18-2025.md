# Feilsøkingsguide for Snakkaz Chat Etter Migrering til Namecheap

## Vanlige Feil og Løsninger

### 1. "Multiple GoTrueClient instances detected"

**Problem:** Flere instanser av Supabase-klienten blir opprettet.

**Feilmelding:**
```
Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.
```

**Løsning:**
1. Verifiser at singleton-implementasjonen er distribuert til serveren
2. Sjekk at alle filer som tidligere opprettet Supabase-klienter nå bruker singleton
3. Kjør `grep -r "createClient(" --include="*.ts" --include="*.tsx" --include="*.js" src` for å finne gjenværende direkte klientinitialiseringer
4. Verifiser at `src/lib/supabaseClient.ts` brukes alle steder der du trenger Supabase-klienten

### 2. MIME Type Feil

**Problem:** Serveren sender JavaScript-filer med feil MIME-type.

**Feilmelding:**
```
Loading module from "http://snakkaz.com/assets/cspFixes-CCeitK04.js" was blocked because of a disallowed MIME type ("text/html").
```

**Løsning:**
1. Verifiser at `.htaccess`-filen er lastet opp til serveren
2. Sjekk at `.htaccess` inneholder riktige MIME-type-konfigurasjoner
3. Verifiser at serveren støtter `.htaccess` (Apache)
4. Sjekk at modulene `mod_mime` og `mod_headers` er aktivert på serveren
5. Kontakt Namecheap-support for å verifisere serveroppsett hvis problemet vedvarer

### 3. HTTP vs. HTTPS

**Problem:** Siden lastes over HTTP i stedet for HTTPS.

**Feilmelding:**
```
Application is not running in a secure context. Some security features may be unavailable.
```

**Løsning:**
1. Verifiser at SSL-sertifikatene er installert korrekt på serveren
2. Sjekk `.htaccess`-filen for HTTPS-omdirigeringskonfigurasjonen
3. Kjør AutoSSL fra Namecheap cPanel som beskrevet i dokumentasjonen
4. Verifiser DNS-konfigurasjonen og at den peker til riktig server

### 4. Fallback- eller Lokale Ressurser Lastes Ikke

**Problem:** Applikasjonen prøver å laste lokale fallback-ressurser, men mislykkes.

**Feilmelding:**
```
The resource from "http://snakkaz.com/assets/vendor/supabase-client.js" was blocked due to MIME type ("text/html") mismatch
```

**Løsning:**
1. Verifiser at fallback-ressursene er lastet opp til serveren
2. Sjekk mappestrukturen på serveren
3. Verifiser MIME-type-konfigurasjonen (se punkt 2)
4. Oppdater ressursstier i koden hvis nødvendig

### 5. CORS-relaterte Feil

**Problem:** Forespørsler til subdomener eller andre ressurser blir blokkert.

**Feilmelding:**
```
Intercepted potentially blocked request to: https://dash.snakkaz.com/ping
```

**Løsning:**
1. Verifiser CORS-konfigurasjon i `.htaccess`
2. Sjekk om subdomener er riktig konfigurert
3. Oppdater Content Security Policy (CSP) for å tillate riktige domener
4. Legg til riktige CORS-headere på serveren

## Prosess for Systematisk Feilsøking

1. **Verifiser SSL-konfigurasjon**
   ```bash
   curl -I https://snakkaz.com
   ```
   Sjekk at responsen viser statuscode 200 og at serveren returnerer riktige SSL-headere.

2. **Sjekk MIME-type-konfigurasjon**
   ```bash
   curl -I https://snakkaz.com/assets/index-iEerSh2Y.js
   ```
   Content-Type bør være `application/javascript` eller `text/javascript`.

3. **Verifiser at singleton-klienten er distribuert**
   Sjekk at filen `supabaseClient.ts` finnes i bygget og at koden bruker den.

4. **Test applikasjonsfunksjonalitet**
   - Test innlogging/utlogging
   - Test meldingsfunksjonalitet
   - Verifiser at all funksjonalitet som er avhengig av Supabase fungerer

## Verktøy og Kommandoer for Feilsøking

### SSL-verifikasjon
```bash
openssl s_client -connect snakkaz.com:443 -servername snakkaz.com
```

### MIME-type-testing
Opprett en testfil `test-mime.js` og last den opp, deretter:
```bash
curl -I https://snakkaz.com/test-mime.js
```

### Verifisere distribusjon av filer
```bash
# Teste om en fil eksisterer
curl -s -I https://snakkaz.com/assets/index-iEerSh2Y.js | head -1
```

## Kontaktinformasjon for Support

Hvis problemene vedvarer etter forsøk på feilsøking:

- **Namecheap Support:** https://www.namecheap.com/support/
- **Supabase Support:** https://supabase.com/support

## Nyttige Diagnostiske Kommandoer

```bash
# Sjekk DNS-innstillinger
dig snakkaz.com

# Sjekk SSL-sertifikat
echo | openssl s_client -servername snakkaz.com -connect snakkaz.com:443 2>/dev/null | openssl x509 -noout -dates

# Test HTTP-omdirigering
curl -I http://snakkaz.com
```
