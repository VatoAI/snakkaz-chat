# Snakkaz Chat - Feilsøking av SPA-routing

## Problem
Hovedsiden viser ikke autentiseringsgrensesnitt (login/registrering) etter deployering.

## Sjekkliste for feilsøking

### 1. .htaccess-konfigurering
- [ ] Riktig .htaccess-fil er på plass i public_html-katalogen
- [ ] .htaccess-filen har riktige tillatelser (644)
- [ ] RewriteEngine er aktivert
- [ ] Alle forespørsler som ikke finnes blir omdirigert til index.html

### 2. JavaScript-filer
- [ ] Sjekk at JavaScript-filer (index-*.js) lastes inn uten feil
- [ ] Kontroller at MIME-typer er korrekt for JavaScript-filer
- [ ] Sjekk at bundle-splittingen fungerer som forventet

### 3. Service Worker
- [ ] Kontroller status for service worker i Application-fanen
- [ ] Avregistrer problematiske service workers om nødvendig
- [ ] Sjekk om offline.html er på plass

### 4. Supabase-tilkobling
- [ ] Kontroller at miljøvariabler for Supabase er satt opp riktig
- [ ] Sjekk at forespørsler til Supabase API lykkes
- [ ] Verifiser at CORS-innstillinger er korrekte

### 5. CSP (Content Security Policy)
- [ ] Sjekk om det finnes CSP-feil i konsollen
- [ ] Kontroller at CSP tillater nødvendige ressurser
- [ ] Verifiser at meta-tagger for CSP er riktige

## Hvordan teste etter fikser

1. **Tøm nettleserens cache**:
   - Chrome: Hold inne Ctrl/Cmd og klikk på oppdateringsknappen
   - Firefox: Ctrl+Shift+R
   - Eller bruk inkognitomodus

2. **Verifiser routing**:
   - Besøk www.snakkaz.com
   - Sjekk om login/register-siden vises
   - Prøv å manuelt navigere til /login eller /register
   - Sjekk at URL-en kan deles og fortsatt fungerer

3. **Sjekk statiske ressurser**:
   - Kontroller at alle bilder vises
   - Verifiser at stiler lastes riktig
   - Kontroller at JavaScript-bundles lastes

## Vanlige løsninger

1. **Service Worker-problemer**:
   ```javascript
   // I nettleserkonsollen:
   navigator.serviceWorker.getRegistrations().then(function(registrations) {
     for(let registration of registrations) {
       registration.unregister();
     }
   });
   ```

2. **Hente .env-verdier**:
   ```bash
   # Opprett en .env.production.local fil i public_html med riktige verdier:
   VITE_SUPABASE_URL=https://din-supabase-url.supabase.co
   VITE_SUPABASE_ANON_KEY=din-supabase-anon-nøkkel
   ```

3. **Hard oppdatering**:
   ```javascript
   // I nettleserkonsollen:
   caches.keys().then(cacheNames => {
     cacheNames.forEach(cacheName => {
       caches.delete(cacheName);
     });
   });
   ```
