# Migrering fra Cloudflare til Namecheap DNS

## Oversikt
Dette dokumentet beskriver prosessen for å migrere fra Cloudflare sine tjenester til å bruke Namecheap-hosting direkte for Snakkaz Chat-applikasjonen. Formålet med migreringen er å forenkle teknologistacken, redusere avhengigheter og løse problemer med CSP (Content Security Policy) implementasjonen.

## Tjenester fjernet
Følgende Cloudflare-tjenester er blitt fjernet fra prosjektet:

1. **Cloudflare DNS** - Erstattet med Namecheap DNS-administrasjon
2. **Cloudflare Analytics** - Fjernet (kan erstattes med et annet analyseverktøy senere)
3. **Cloudflare WAF** - Sikkerhet håndteres nå direkte gjennom de innebygde sikkerhetsfunksjonene i Namecheap og Supabase
4. **Cloudflare CDN** - Statisk innhold leveres nå direkte fra hosting

## Endringer utført

### 1. Kodeendringer

#### Fjernet Cloudflare-avhengigheter:
- Fjernet alle Cloudflare-spesifikke domener fra CSP-konfigurasjonen
- Fjernet Cloudflare Analytics-integrasjon fra analyticsLoader.ts
- Oppdatert systemHealthCheck.ts til å fjerne Cloudflare-spesifikke sjekker
- Oppdatert vite.config.ts for å fjerne Cloudflare-referanser
- Oppdatert inject-csp.sh for å fjerne Cloudflare Analytics-injeksjon

#### Omfattende CSP-forbedringer:
- Forenklet CSP-direktivene til kun å inkludere nødvendige domener
- Fjernet alle 'unsafe-*' direktiver der det er mulig for bedre sikkerhet
- Fjernet unødvendige direktiver knyttet til Cloudflare

### 2. DNS-konfigurasjon
Domeneoppsettet er flyttet fra Cloudflare til Namecheap:

1. Gå til Namecheap-kontrollpanelet
2. Velg domenet snakkaz.com
3. Gå til "Advanced DNS"
4. Konfigurer følgende DNS-oppføringer:

| Type  | Vertsnavn | Verdi                           | TTL      |
|-------|-----------|--------------------------------|----------|
| A     | @         | [Serverens IP-adresse]         | Automatic |
| CNAME | www       | snakkaz.com                    | Automatic |
| CNAME | dash      | snakkaz.com                    | Automatic |
| CNAME | business  | snakkaz.com                    | Automatic |
| CNAME | docs      | snakkaz.com                    | Automatic |
| CNAME | analytics | snakkaz.com                    | Automatic |
| TXT   | @         | v=spf1 include:_spf.snakkaz.com ~all | Automatic |

### 3. SSL/TLS-sertifikat
- Aktiver "PositiveSSL Certificate" gjennom Namecheap
- Følg instruksjonene for å generere og installere SSL-sertifikatet

## Filer som er slettet

Følgende filer er ikke lenger nødvendige og kan slettes:

```
/workspaces/snakkaz-chat/src/services/encryption/cloudflareApi.ts
/workspaces/snakkaz-chat/src/services/encryption/cloudflareConfig.ts
/workspaces/snakkaz-chat/src/services/encryption/cloudflareHelper.ts
/workspaces/snakkaz-chat/src/services/encryption/cloudflareManagement.ts
/workspaces/snakkaz-chat/src/services/encryption/cloudflareSecurity.demo.ts
/workspaces/snakkaz-chat/src/services/encryption/cloudflareSecurityCheck.ts
/workspaces/snakkaz-chat/src/services/encryption/configure-cloudflare.js
/workspaces/snakkaz-chat/src/services/encryption/setup-cloudflare.sh
/workspaces/snakkaz-chat/src/services/encryption/validate-cloudflare.js
/workspaces/snakkaz-chat/src/services/encryption/CLOUDFLARE-*.md
/workspaces/snakkaz-chat/src/services/encryption/simple-cf-check.cjs
/workspaces/snakkaz-chat/src/services/encryption/secureCloudflareDemo.js
```

## Filer som er oppdatert

```
/workspaces/snakkaz-chat/src/services/encryption/vitePlugins/snakkazCspPlugin.ts
/workspaces/snakkaz-chat/src/plugins/snakkazCspPlugin.ts
/workspaces/snakkaz-chat/vite.config.ts
/workspaces/snakkaz-chat/src/services/encryption/inject-csp.sh
/workspaces/snakkaz-chat/src/services/encryption/analyticsLoader.ts
/workspaces/snakkaz-chat/src/services/encryption/systemHealthCheck.ts
/workspaces/snakkaz-chat/package.json
```

## Hvordan verifisere migreringen

1. Bygg applikasjonen med den nye CSP-konfigurasjonen:
   ```
   npm run build:nocf
   ```

2. Sjekk at det bygget inneholder korrekt CSP-meta-tag i index.html:
   ```
   grep -A 3 "Content-Security-Policy" dist/index.html
   ```

3. Sjekk at ingen Cloudflare-referanser finnes i det endelige bygget:
   ```
   grep -r "cloudflare" dist/
   ```

## Fordeler med denne migreringen

1. **Forenklet arkitektur** - Færre tjenesteavhengigheter betyr mindre kompleksitet og færre potensielle feilpunkter
2. **Forbedret CSP-håndtering** - Fjernet problematiske CSP-direktiver som var nødvendige for Cloudflare
3. **Bedre kontroll** - Direkte kontroll over alle aspekter av domenet gjennom Namecheap
4. **Reduserte kostnader** - Unngå ekstra kostnader for Cloudflare-tjenester utover grunnleggende plan

## Fremtidige forbedringer

- Vurder å implementere en alternativ analyseløsning som Simple Analytics eller Plausible for personvernvennlig brukeraktivitetssporing
- Vurder å implementere en CDN-løsning om nødvendig for ytelsesoptimalisering
- Forbedre CSP ytterligere ved å implementere nonce-basert sikkerhet i stedet for 'unsafe-inline'
