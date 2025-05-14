# Cloudflare API Integration Guide - Oppdatert

## Autentiseringsmetoder

Snakkaz Chat-applikasjonen støtter nå to autentiseringsmetoder for Cloudflare API:

1. **API Token** (Anbefalt)
   - Skreddersydde tillatelser
   - Mer sikker tilnærming
   - Kan begrenses til spesifikke ressurser

2. **Global API Key** (Alternativ)
   - Full tilgang til hele kontoen
   - Enklere å sette opp
   - Krever e-post og API-nøkkel

## Hvordan bruke Account-Owned Tokens

Account-owned tokens (kontoeide token) er den anbefalte metoden for autentisering med Cloudflare API. Dette er token som er knyttet til kontoen, ikke til en spesifikk bruker.

### Slik oppretter du en Account-Owned API Token:

1. Gå til [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Klikk på "Account" i toppmenyen
3. Velg "API Tokens" fra venstremenyen
4. Klikk "Create Token"
5. Velg en passende mal eller opprett et egendefinert token med disse tillatelsene:
   - Zone - Cache Purge - Purge
   - Zone - DNS - Edit
   - Zone - Analytics - Read
   - Inkluder sonen: snakkaz.com
6. Angi en passende utløpstid og beskrivelse
7. Klikk "Create Token" og lagre tokenet på et sikkert sted

## Administrasjonsverktøy

Cloudflare-administrasjonsverktøyet er forbedret for å støtte begge autentiseringsmetodene:

### Importer verktøyet i nettleserkonsollen:

```javascript
import("/src/services/encryption/cloudflareManagement.js")
  .then(m => {
    window.cfTools = m.cfTools;
    cfTools.help();
  });
```

### Tilgjengelige kommandoer

- `cfTools.validateCredentials()` - Valider Cloudflare API-påloggingsinformasjon
- `cfTools.testConnection()` - Test Cloudflare-tilkobling og få sonedetaljer
- `cfTools.purgeCache()` - Tøm hele cachen for snakkaz.com
- `cfTools.listDnsRecords()` - List alle DNS-oppføringer for snakkaz.com
- `cfTools.showConfig()` - Vis gjeldende Cloudflare-konfigurasjon
- `cfTools.clearApiCredentials()` - Fjern lagret API-påloggingsinformasjon
- `cfTools.switchAuthMethod("token")` - Bytt til API Token-autentisering
- `cfTools.switchAuthMethod("key")` - Bytt til Global API Key-autentisering

## Eksempel: Bytte autentiseringsmetode

```javascript
// Importer verktøyet
import("/src/services/encryption/cloudflareManagement.js")
  .then(m => window.cfTools = m.cfTools);

// Bytt til Global API Key autentisering
cfTools.switchAuthMethod("key");

// Test tilkoblingen
cfTools.testConnection();
```

## Sikkerhetsmerknad

- API-påloggingsinformasjon lagres kun i nettleserens sesjonslager og slettes når sesjonen avsluttes
- Påloggingsinformasjon kan fjernes manuelt med `cfTools.clearApiCredentials()`
- Unngå å inkludere API-tokens eller API-nøkler i kildekoden

## Oppdatert Konfigurasjon

Zone ID og Account ID er ekstrahert fra Cloudflare Dashboard:

- **Zone ID**: bba5fb2c80aede33ac2c22f8f99110d3
- **Account ID**: 0785388bb3883d3a10ab7f60a7a4968a
