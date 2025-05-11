# Snakkaz Chat Sikkerhet & Kryptering

Dette modulet er utviklet for å løse kritiske problemer i Snakkaz Chat-applikasjonen, med fokus på Content Security Policy (CSP), CORS-feil og TypeScript-kompileringsfeil.

## 🔍 Hovedutfordringer løst

1. **CSP (Content Security Policy) Problemer**
   - Blokkering av kritiske eksterne ressurser
   - Nettverksforespørsler som feiler på grunn av CSP-restriksjoner

2. **CORS-feil**
   - API-forespørsler som blir blokkert av CORS-policy
   - Problemer med tilkobling til Supabase backend

3. **TypeScript kompileringsfeil**
   - KeyUsage enum problemer
   - Type-feil med HTML-elementer
   - Andre TypeScript-relaterte problemer

4. **Nettleserkompatibilitet**
   - Feil i Safari og eldre nettlesere
   - Fallback for manglende funksjoner

5. **DNS og Cloudflare Integrasjon**
   - Automatisk DNS-konfigurasjon gjennom Namecheap API
   - Cloudflare DNS og sikkerhetstiltak
   - E2E-krypterte connections til subdomener

## 🚀 Kom i gang

For å integrere sikkerhet- og krypteringsmodulen i prosjektet ditt:

```typescript
// Importer og initialiser tidlig i applikasjonen
import { setupSnakkazSecurity } from './services/encryption';

// I din app entry point (f.eks. main.ts, App.tsx, etc.)
setupSnakkazSecurity();
```

## 📚 Moduler 

### 1. CSP-konfigurasjon (`cspConfig.ts`)

Setter opp en robust Content Security Policy som tillater alle nødvendige domener og ressurser.

```typescript
import { applyCspPolicy } from './services/encryption';

// Bruk denne tidlig i applikasjonen
applyCspPolicy();
```

### 2. CORS & Ping Fix (`corsTest.ts`)

Løser CORS-problemer og blokkerer unødvendige ping-forespørsler som ofte forårsaker CSP-feil.

```typescript
import { unblockPingRequests } from './services/encryption';

// Bruk for å forhindre CSP-feil fra ping-forespørsler
unblockPingRequests();
```

### 3. Ressurs Fallback (`assetFallback.ts`)

Håndterer tilfeller hvor eksterne ressurser ikke kan lastes og gir fallback til lokale alternativer.

```typescript
import { registerAssetFallbackHandlers } from './services/encryption';

// Registrer fallback-håndtering for nettverksressurser
registerAssetFallbackHandlers();
```

### 4. Diagnostikk (`diagnosticTest.ts`)

Verktøy for å teste og diagnostisere problemer med konfigurasjon og tilkoblinger.

```typescript
import { runFullDiagnostics } from './services/encryption';

// Kjør for å teste alle aspekter av systemet
const results = await runFullDiagnostics();
console.log(results);
```

### 5. Nettleserkompatibilitet (`browserFixes.ts`)

CSS og JavaScript feilrettinger for eldre nettlesere og Safari.

```typescript
import { applyBrowserCompatibilityFixes } from './services/encryption';

// Legg til støtte for eldre nettlesere
applyBrowserCompatibilityFixes();
```

## 🔧 Feilsøking

Hvis du opplever problemer med implementasjonen, kan du kjøre diagnostikktesten:

1. Åpne nettleserkonsollet i applikasjonen
2. Kjør følgende kommando:
   ```javascript
   import('./services/encryption').then(module => module.runFullDiagnostics());
   ```
3. Analyser resultatene for å identifisere og fikse problemer

Alternativt kan du åpne testfilen `csp-test.html` for å kjøre diagnostikk med en visuell grensesnitt.

## 🌐 DNS og Cloudflare Integrasjon

Snakkaz Chat inkluderer en omfattende løsning for DNS-håndtering som integrerer både Namecheap og Cloudflare:

### DNS Manager (`dnsManager.ts`)

En helhetlig løsning for å håndtere DNS-konfigurasjonen:

```typescript
import { getDnsManager } from './services/encryption/dnsManager';

// Initialiser DNS Manager
const dnsManager = getDnsManager();
await dnsManager.initialize('namecheap-api-key', 'cloudflare-api-token');

// Sjekk DNS-helse
const dnsHealth = await dnsManager.performHealthCheck();

// Automatisk løsning av DNS-problemer
if (dnsHealth.status !== 'healthy') {
  const fixResult = await dnsManager.autoFix();
}
```

### Namecheap API Integrasjon (`namecheapApi.ts`)

Integrerer med Namecheap API for å automatisere DNS-oppsett:

```typescript
import { createNamecheapApi, getClientIp } from './services/encryption/namecheapApi';

// Opprett en Namecheap API-instans
const clientIp = await getClientIp();
const namecheapApi = createNamecheapApi('api-user', 'api-key', 'username', clientIp);

// Sett Cloudflare nameservers
await namecheapApi.setCloudflareNameservers();
```

### DNS Status Widget

Legg til en DNS-statuswidget i dashbordet:

```typescript
import { createDnsStatusWidget } from './services/encryption/dnsManager';

// Legg til widget i dashbordet
await createDnsStatusWidget('dns-widget-container', 'namecheap-api-key', 'cloudflare-api-token');
```

### DNS Administrasjonsverktøy (`manage-dns.js`)

Et CLI-verktøy for DNS-administrasjon:

```bash
# Kjør DNS-administrasjonsverktøyet
node src/services/encryption/manage-dns.js
```

### Utvidet Deployment Script (`deploy-snakkaz-with-dns-check.sh`)

En forbedret deploymentscript som inkluderer DNS-sjekk og -fiks:

```bash
# Kjør deployment med DNS-sjekk
./deploy-snakkaz-with-dns-check.sh
```

Se [DNS-README.md](./DNS-README.md) og [DNS-MANAGEMENT-GUIDE.md](./DNS-MANAGEMENT-GUIDE.md) for mer detaljert informasjon.

## 📋 Sjekkliste for implementasjon

- [ ] Legg til `setupSnakkazSecurity()` tidlig i applikasjonens oppstart
- [ ] Forsikre deg om at lokale fallback-ressurser er tilgjengelige 
- [ ] Test at CSP-konfigurasjonen tillater alle nødvendige domener
- [ ] Verfiser at CORS-problemer er løst ved å teste API-tilkoblinger
- [ ] Sjekk at applikasjonen fungerer i forskjellige nettlesere
- [ ] Konfigurer DNS med Namecheap og Cloudflare for sikker tilkobling
- [ ] Bruk DNS-statusindikatoren for å overvåke DNS-helse

## 🔐 E2EE-funksjonalitet

Dette modulet inneholder også forbedringer for ende-til-ende-kryptering:

- Nøkkelgenerering og -lagring
- Meldingskryptering og -dekryptering
- Gruppekrypteringsstøtte

```typescript
import { testGroupE2EE } from './services/encryption';

// Test E2EE-funksjonaliteten
const e2eeResults = await testGroupE2EE();
```

## 🌐 Produksjonsanbefalinger

For produksjonsmiljø bør du:
