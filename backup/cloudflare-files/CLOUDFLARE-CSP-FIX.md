# Cloudflare CSP Fixes

Dette dokumentet beskriver hvordan du kan fikse CSP (Content Security Policy) og CORS-problemer med Snakkaz Chat og Cloudflare.

## Problemer som løses

1. **Cloudflare Analytics CORS-feil**: 
   ```
   Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015
   ```

2. **CSP blokkerer tilkobling til subdomener**:
   ```
   Content-Security-Policy: The page's settings blocked the loading of a resource (connect-src) at https://dash.snakkaz.com/ping
   ```

3. **SRI (Subresource Integrity) hash-feil**:
   ```
   None of the "sha512" hashes in the integrity attribute match the content of the subresource
   ```

## Løsning

Vi har implementert flere lag av fikser:

1. **Emergency CSP Fixes** i `cspFixes.ts`:
   - Sikrer at alle nødvendige domener er tillatt i CSP
   - Fjerner SRI integrity sjekker som forårsaker blokkering
   - Legger til riktig CORS-headers for Cloudflare Analytics

2. **Oppdatert cloudflareHelper.ts**:
   - Bruker den eksakte URL-en med versjonsnummeret for Cloudflare Analytics
   - Omdiriger automatisk alle Cloudflare-forespørsler til riktig URL

3. **Forbedret analyticsLoader.ts**:
   - Mer robust laster som håndterer feil bedre
   - Tilbyr fallback-løsninger når DNS-propagering ikke er fullført

## Hvordan implementere

Følg disse trinnene for å sikre at løsningen er korrekt implementert:

1. Importer og bruk `applyAllCspFixes()` tidlig i applikasjonen:
   ```typescript
   import { applyAllCspFixes } from './services/encryption/cspFixes';
   
   // Bruk denne før annen kode kjøres
   applyAllCspFixes();
   ```

2. Sjekk at Cloudflare Nameservere er korrekt konfigurert:
   - kyle.ns.cloudflare.com
   - vita.ns.cloudflare.com

3. Oppdater HTTP headers på serveren:
   - Legg til riktig Content-Security-Policy header
   - Legg til Access-Control-Allow-Origin header for Cloudflare domener

## Teste løsningen

For å verifisere at fiksene fungerer:

1. Åpne nettleserkonsollen og sjekk at det ikke er noen CORS eller CSP-feil
2. Sjekk at Cloudflare Analytics lastes uten feil
3. Sjekk at alle subdomener fungerer og kan nås
4. Kjør `runDiagnostics()` fra konsollen for å få en full rapport

## Vanlige feilsituasjoner

- **DNS-propagering ikke fullført**: Cloudflare nameservere trenger tid til å propagere. Dette kan ta opptil 24 timer.
- **Manglende domener i CSP**: Sjekk at alle subdomener er eksplisitt nevnt i CSP-konfigurasjonen.
- **Integrity hash mismatcher**: Dette løses ved å fjerne integrity-attributter fra script-tagger.
