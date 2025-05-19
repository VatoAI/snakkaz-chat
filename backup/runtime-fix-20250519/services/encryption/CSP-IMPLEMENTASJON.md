# Content Security Policy (CSP) Implementasjon for Snakkaz Chat

Denne dokumentasjonen beskriver hvordan Content Security Policy (CSP) er implementert i Snakkaz Chat-applikasjonen for å løse CORS-problemer og sikre nettapplikasjonen mot ulike angrep.

## Oversikt over CSP

Content Security Policy er en sikkerhetsfunksjon som hjelper med å beskytte nettsider mot XSS-angrep (Cross-Site Scripting) og andre typer code injection-angrep. CSP fungerer ved å spesifisere hvilke ressurser nettleseren kan laste fra hvilke kilder.

## Implementasjonsstrategier i Snakkaz Chat

Vi har implementert CSP på tre ulike måter for maksimal kompatibilitet og fleksibilitet:

### 1. Via Meta-tag i HTML

CSP er primært definert som en meta-tag i `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co *.cloudflareinsights.com static.cloudflareinsights.com;
  connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com 
              *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com
              static.cloudflareinsights.com cloudflareinsights.com *.cloudflareinsights.com
              cdn.gpteng.co https://cdn.gpteng.co;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in;
  font-src 'self' data:;
  media-src 'self' blob:;
  object-src 'none';
  frame-src 'self';
  worker-src 'self' blob:;
">
```

### 2. Via Vite Plugin

For mer avansert kontroll i byggeprosessen, bruker vi en egendefinert Vite-plugin (`snakkazCspPlugin.ts`):

```typescript
// I vite.config.ts
import snakkazCspPlugin from './src/plugins/snakkazCspPlugin';

export default defineConfig({
  plugins: [
    // ...andre plugins
    snakkazCspPlugin(),
  ],
  // ...andre konfigurasjoner
});
```

### 3. Via Post-build Script

For å sikre at CSP alltid er med i det endelige bygget, bruker vi et post-build-script:

```bash
#!/bin/bash
# inject-csp.sh
# Kjøres etter build for å sikre at CSP blir lagt til i dist/index.html

DIST_DIR="/workspaces/snakkaz-chat/dist"
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.gpteng.co *.cloudflareinsights.com static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: *.amazonaws.com storage.googleapis.com *.supabase.co *.supabase.in; font-src 'self' data:; connect-src 'self' *.supabase.co *.supabase.in wss://*.supabase.co *.amazonaws.com storage.googleapis.com *.snakkaz.com dash.snakkaz.com business.snakkaz.com docs.snakkaz.com analytics.snakkaz.com static.cloudflareinsights.com cloudflareinsights.com *.cloudflareinsights.com cdn.gpteng.co https://cdn.gpteng.co; media-src 'self' blob:; object-src 'none'; frame-src 'self'; worker-src 'self' blob:;"

# Injiser CSP i index.html
sed -i 's/<head>/<head>\n    <meta http-equiv="Content-Security-Policy" content="'"$CSP_POLICY"'">/' "$DIST_DIR/index.html"
```

## CSP Direktiver i bruk

### `default-src 'self'`
- Tillater bare ressurser fra samme opprinnelse som standard

### `script-src`
- Tillater skripter fra:
  - Samme opprinnelse (`'self'`)
  - Inline skripter (`'unsafe-inline'`) - nødvendig for noen tredjepartsbiblioteker
  - JavaScript-evalueringer (`'unsafe-eval'`) - nødvendig for noen dynamiske funksjoner
  - Cloudflare Analytics (`*.cloudflareinsights.com`, `static.cloudflareinsights.com`)
  - CDN-tjenester (`cdn.gpteng.co`)

### `connect-src`
- Tillater XHR, WebSocket, og andre nettverkstilkoblinger til:
  - Samme opprinnelse (`'self'`)
  - Supabase-tjenester (`*.supabase.co`, `*.supabase.in`, `wss://*.supabase.co`)
  - AWS-ressurser (`*.amazonaws.com`)
  - Google Storage (`storage.googleapis.com`)
  - Snakkaz subdomener (`*.snakkaz.com`, `dash.snakkaz.com`, `business.snakkaz.com`, osv.)
  - Cloudflare-tjenester (`static.cloudflareinsights.com`, `*.cloudflareinsights.com`)

### `style-src`
- Tillater CSS fra:
  - Samme opprinnelse (`'self'`)
  - Inline CSS (`'unsafe-inline'`)

### `img-src`
- Tillater bilder fra:
  - Samme opprinnelse (`'self'`)
  - Data-URLer (`data:`)
  - Blob-URLer (`blob:`)
  - AWS (`*.amazonaws.com`)
  - Google Storage (`storage.googleapis.com`)
  - Supabase-tjenester (`*.supabase.co`, `*.supabase.in`)

### Andre direktiver
- `font-src`: Fonter fra samme opprinnelse og data-URLer
- `media-src`: Media fra samme opprinnelse og blob-URLer
- `object-src 'none'`: Blokkerer <object>, <embed> og <applet> elementer
- `frame-src 'self'`: Tillater iframe kun fra samme opprinnelse
- `worker-src`: Tillater workers fra samme opprinnelse og blob-URLer

## Cloudflare Analytics Spesifikasjoner

Cloudflare Analytics krever spesielle innstillinger:

```html
<script defer crossorigin="anonymous" referrerpolicy="no-referrer-when-downgrade" 
  src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" 
  data-cf-beacon='{"token":"c5bd7bbfe41c47c2a5ec","version":"2023.10.0","spa":true,"spaMode":"auto","cookieDomain":"snakkaz.com","referrerPolicy":"no-referrer-when-downgrade"}'>
</script>
```

Viktige attributter:
- `crossorigin="anonymous"`: Forhindrer deling av legitimasjon
- `referrerpolicy="no-referrer-when-downgrade"`: Kontrollerer referrer-header
- Eksakt URL med versjonshash for å unngå SRI-problemer

## Bruk og Vedlikehold

### Bygge med CSP

Bruk følgende kommando for å bygge applikasjonen med CSP-injisering:

```bash
npm run build:csp
```

Dette vil først kjøre standard produksjonsbygg og deretter injisere CSP-direktivene i det endelige bygget.

### Teste CSP-implementasjonen

1. Åpne utviklerkonsollet i nettleseren
2. Kjør diagnostikkfunksjonen:
   ```javascript
   window.runSnakkazTests()
   ```
3. Sjekk for CSP-relaterte feil i konsollet

### Vedlikehold

Ved endringer i tredjepartsbiblioteker eller nye integrasjoner:

1. Oppdater CSP-direktivene i alle tre implementasjonene:
   - index.html meta-tag
   - snakkazCspPlugin.ts
   - inject-csp.sh
2. Test nøye med utviklerkonsollet åpent
3. Overvåk for CSP-feil i produksjon

## Feilsøking

| Problem | Mulig løsning |
|---------|---------------|
| Blokkerte nettverkskall | Legg til domenet i `connect-src` |
| Blokkerte skripter | Legg til domenet i `script-src` |
| Blokkerte bilder | Legg til domenet i `img-src` |
| Inline skriptfeil | Vurder å flytte inline-kode til eksterne filer eller legg til nonce/hash |

## Sikkerhetsvurderinger

CSP reduserer risikoen for XSS-angrep betydelig, men:

1. Bruk av `unsafe-inline` og `unsafe-eval` reduserer sikkerhetsfordelene
2. Vurder å erstatte disse med nonce eller hash-baserte tilnærminger i fremtiden
3. Hold CSP-direktivene så restriktive som mulig, legg til nye kilder bare ved behov
