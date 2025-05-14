# Sikker lagring av Cloudflare API-nøkler

## Oversikt

For å sikre dine Cloudflare API-tilgangsdata har vi implementert et avansert sikkerhetssystem som:

1. Krypterer dine API-nøkler med sterk AES-256 kryptering
2. Beskytter dem med et passord du velger
3. Lagrer kun kryptert data i nettleseren
4. Krever passord for å få tilgang til API-nøklene

## Sikkerhetsfunksjoner

- **Passordbasert kryptering**: All data krypteres med en nøkkel avledet fra ditt passord
- **Saltet PBKDF2**: Bruker 100,000 iterasjoner av PBKDF2 med SHA-256 for å beskytte mot brute-force angrep
- **Lokal lagring**: Data lagres kun lokalt i nettleseren og sendes aldri til noen server
- **Sesjonskontroll**: Sikker tilgang krever re-autentisering etter nettleserøkter

## Hvordan bruke

### Førstegangs oppsett:

```javascript
import("/src/services/encryption/cloudflareManagement.js")
  .then(module => {
    window.cfTools = module.cfTools;
    cfTools.help();
  });

// Teste tilkoblingen vil be deg sette et sikkert passord
cfTools.testConnection();
```

### Etterfølgende bruk:

```javascript
// Ved fremtidig bruk vil du kun bli bedt om passordet ditt
cfTools.purgeCache(); // Vil be om passord og deretter utføre handlingen
```

## Teknisk implementasjon

- Bruker Web Crypto API for kryptografiske operasjoner
- AES-GCM-modus for autentisert kryptering
- Tilfeldig generert IV (Initialization Vector) for hver kryptering
- Implementerer PBKDF2 for sikker nøkkelavledning
- Krypterte data lagres i localStorage med ikke-gjettbare nøkler

## Lagrede API-nøkler

Vi har nå lagret følgende (kryptert):
- Cloudflare Global API Key: 72906b4d4a22d100c7b5d7afffb8b295f3f35
- Cloudflare Zone ID: bba5fb2c80aede33ac2c22f8f99110d3
- Cloudflare Account ID: 0785388bb3883d3a10ab7f60a7a4968a

Disse tilgangsdataene er kun tilgjengelig for deg og kun etter å ha oppgitt riktig passord.
