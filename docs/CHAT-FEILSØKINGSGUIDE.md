# Feilsøkingsguide for Snakkaz Chat-system

## Innledning

Denne guiden hjelper deg med å diagnostisere og løse vanlige problemer med Snakkaz Chat-systemet, spesielt etter migrering fra Cloudflare til Namecheap DNS. Følg denne stegvise tilnærmingen for å identifisere og fikse problemene.

## 1. Verifisere DNS-konfigurasjon

### Kjør DNS-testskript
```bash
./scripts/test-dns-setup.sh
```

### Vanlige problemer og løsninger:
- **Problem**: DNS-oppslag mislyktes
  - **Løsning**: Sjekk at alle DNS-oppføringer er riktig konfigurert i Namecheap-kontrollpanelet
  - **Løsning**: Vent på DNS-propagering (kan ta opptil 48 timer)

- **Problem**: 403 Forbidden feilmeldinger
  - **Løsning**: Sjekk at SSL-sertifikatet dekker alle subdomener
  - **Løsning**: Sjekk web-serverens virtuell host konfigurasjon

## 2. Sjekke Supabase-integrasjon

### Kjør Supabase-integrasjonssjekk
```bash
./scripts/verify-supabase-integration.sh
```

### Vanlige problemer og løsninger:
- **Problem**: Kan ikke koble til Supabase-endepunkt
  - **Løsning**: Sjekk at nettverkstilkoblingen fungerer
  - **Løsning**: Verifiser at Supabase URL er korrekt i .env-filen
  - **Løsning**: Bekreft at egendefinert domene er riktig konfigurert

- **Problem**: Autentiseringsfeil
  - **Løsning**: Verifiser at VITE_SUPABASE_ANON_KEY er korrekt
  - **Løsning**: Generer en ny anonym nøkkel i Supabase-dashbordet hvis nødvendig

## 3. Problemløsning for Chat-komponenter

### Identifisere komponentproblemer
Kjør følgende kommando for å sjekke om chat-komponentene kompilerer uten feil:

```bash
npm run build
```

### Sjekk React DevTools i nettleseren
Åpne nettleserkonsollen og bruk React DevTools for å identifisere hvilke komponenter som ikke laster eller fungerer riktig.

### Vanlige problemer og løsninger:
- **Problem**: Chat-konteksten laster ikke
  - **Løsning**: Sjekk at `supabase`-objektet initialiseres riktig i `client.ts`
  - **Løsning**: Verifiser at ChatContext.tsx importerer supabase-klienten riktig

- **Problem**: Meldinger vises ikke
  - **Løsning**: Sjekk at Supabase Realtime-kanalene er åpne og fungerer
  - **Løsning**: Verifiser at gruppeChat- eller privatChat-servicen er korrekt konfigurert

- **Problem**: Kan ikke sende meldinger
  - **Løsning**: Bekreft at autentisering fungerer riktig
  - **Løsning**: Sjekk om det er problemer med Row Level Security (RLS) i Supabase

## 4. CSP-relaterte (Content Security Policy) problemer

### Verifisere CSP-konfigurasjon
```bash
grep -r "Content-Security-Policy" ./dist
```

### Vanlige problemer og løsninger:
- **Problem**: CSP blokkerer tilkoblinger til Supabase
  - **Løsning**: Oppdater CSP-konfigurasjonen for å tillate tilkoblinger til ditt Supabase-domene:
    ```javascript
    // I cspConfig.ts
    connectSrc: [
      "'self'",
      "https://*.supabase.co",
      "https://your-custom-domain.com",
      // ...andre nødvendige domener
    ]
    ```

- **Problem**: WebSocket-tilkoblinger blokkeres
  - **Løsning**: Legg til `wss://` protokoll for ditt Supabase-domene i CSP-konfigurasjonen

## 5. Miljøvariabler og konfigurasjon

### Sjekk miljøvariabler
```bash
grep -v "^#" .env
```

### Opprett eller oppdater .env fil
```bash
# Basis miljøvariabler
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_CUSTOM_DOMAIN=optional-custom-domain

# For egendefinert domene (valgfritt)
VITE_USE_CUSTOM_DOMAIN=true
```

### Vanlige problemer og løsninger:
- **Problem**: Miljøvariabler lastes ikke
  - **Løsning**: Restart utviklingsserveren etter endringer i .env-filen
  - **Løsning**: Kontroller at .env-filen er plassert i prosjektets rotmappe

## 6. CORS-problemer (Cross-Origin Resource Sharing)

### Åpne nettleserkonsollen og se etter CORS-feil

### Vanlige problemer og løsninger:
- **Problem**: CORS-feil i konsollen
  - **Løsning**: Sjekk Supabase-prosjektets CORS-innstillinger og legg til alle nødvendige domener:
    1. Gå til Supabase-dashbordet
    2. Navigere til Prosjektinnstillinger -> API
    3. Under "CORS (Cross-Origin Resource Sharing)", legg til dine domener:
       - `https://snakkaz.com`
       - `https://www.snakkaz.com`
       - `https://mcp.snakkaz.com` 
       - Andre relevante subdomener

## 7. Supabase Edge Functions og Serverside-komponenter

Hvis du bruker Supabase Edge Functions:

### Sjekk at Edge Functions er tilgjengelige
```bash
curl -I https://your-project-id.supabase.co/functions/v1/your-function-name
```

### Vanlige problemer og løsninger:
- **Problem**: Edge Functions returnerer 404 eller 500
  - **Løsning**: Verifiser at funksjonene er deployert korrekt
  - **Løsning**: Sjekk at CORS-konfigurasjonen i Edge Functions tillater ditt domene

## 8. Generelle feilsøkingstips

1. **Rens hurtigbufferen**: 
   ```bash
   npm run clean && npm run build
   ```

2. **Sjekk loggen**:
   ```bash
   grep -r "error" ./logs
   ```

3. **Test enkeltkomponenter**:
   ```bash
   npm test -- --testPathPattern=ChatInterface
   ```

4. **Verifiser nettleserstøtte**:
   - Sjekk at nettleseren støtter alle API-er som brukes i applikasjonen
   - Bruk polyfills for eldre nettlesere hvis nødvendig

## 9. Kontakt og ytterligere hjelp

Hvis du fortsatt har problemer etter å ha fulgt denne guiden, kan du:

1. Sjekk GitHub Issues for lignende problemer
2. Kontakt utviklingsteamet via Slack eller e-post
3. Rapporter detaljert feilbeskrivelse med følgende informasjon:
   - Hvilke steg du har fulgt fra denne guiden
   - Nøyaktige feilmeldinger fra konsollen
   - Nettleser og operativsystem-informasjon
   - Skjermbilder av eventuelle visuelle feil
