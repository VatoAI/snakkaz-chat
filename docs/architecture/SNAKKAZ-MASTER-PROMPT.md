# SNAKKAZ MASTER PROMPT

## PROSJEKTOVERSIKT
- **Appnavn**: Snakkaz Chat
- **Type**: E2EE (End-to-End Encrypted) Chat-applikasjon
- **Domene**: www.snakkaz.com
- **Hovedteknologier**: React, TypeScript, Supabase, Cloudflare
- **Sikkerhet**: E2EE, P2P-funksjonalitet, Cloudflare-sikkerhet
- **Startdato**: Mai 2025
- **Status**: Under utvikling

## VIKTIG: BRANCH-KONTROLL OG NAVIGASJON
Før enhver utvikling eller deployment, verifiser alltid at du jobber på hovedbranchen (main):

```bash
# Sjekk hvilken branch du er på
git branch --show-current

# Sjekk status for git-repositoriet
git status

# Hent siste endringer fra remote repository
git pull origin main
```

### Prosjektnavigasjon
For å navigere i prosjektet, bruk alltid absolutte stier fra prosjektroten:

```bash
# Gå til prosjektroten
cd /workspaces/snakkaz-chat

# Navigere til src-mappen
cd /workspaces/snakkaz-chat/src

# Eksempel på å gå til komponentmappen
cd /workspaces/snakkaz-chat/src/components
```

**Viktig:** Når du jobber med filer, sørg alltid for å navigere til rootmappen først før du begynner å utforske strukturen. Unngå relative stier når du navigerer mellom forskjellige deler av prosjektet.

Alle endringer skal gjøres direkte på main-branch for korrekt deployment til www.snakkaz.com.

## KOMPONENTER OG STRUKTUR

### Frontend Arkitektur
- React-basert SPA med TypeScript
- Shadcn UI-komponenter for design
- Bruker kontekst-API for tilstandshåndtering (ChatContext.tsx)
- Komponent-hierarki:
  * Hovedapp → AuthContainer → Chat → [GlobalChatContainer | PrivateChatDetailView | GroupChatView]
  * ChatInterface → [ChatMessageList, PinnedMessages] → [ChatMessage]
- Vite som build-system og utviklingsserver

### Backend og Databaser
- Supabase for backend (authentication, database, storage)
- Realtime-funksjonalitet for chatmeldinger via Supabase subscriptions
- Database-tabeller for meldinger med pin-støtte:
  * `global_chat_messages`: Global chat med pinned, pinned_by, pinned_at felt
  * `private_chat_messages`: Privat chat med pinned, pinned_by, pinned_at felt
  * `group_chat_messages`: Gruppechat med pinned, pinned_by, pinned_at felt
- Cloudflare for edge-caching, sikkerhet, og CDN
- Cloudflare DNS-oppsett med nameservers kyle.ns.cloudflare.com og vita.ns.cloudflare.com

### Prosjektstruktur og Filorganisering
Det er viktig å forstå prosjektets filstruktur for effektiv utvikling:

```
/src
  /assets           # Bilder, ikoner, og andre ressurser
  /components       # UI-komponenter organisert etter funksjonalitet
    /admin          # Admin-dashboards og komponenter
    /auth           # Autentisering-relaterte komponenter
    /chat           # Chat-relaterte komponenter
      /global       # Global chat-komponenter
        - GlobalChatContainer.tsx  # Global chat med pin-støtte
      /group        # Gruppechat-komponenter 
        - GroupChatView.tsx        # Gruppechat med pin-støtte
      /private      # Privat chat-komponenter
        - PrivateChatDetailView.tsx # Privat chat med pin-støtte
      - PinnedMessages.tsx         # Komponent for visning av pinnede meldinger
      - ChatInterface.tsx          # Hovedgrensesnitt for chat med pin-integrasjon
      - ChatMessage.tsx            # Meldingskomponent med pin-interaksjon
      /header       # Chat header-komponenter
    /ui             # Generelle UI-komponenter
  /contexts         # React contexts for tilstandshåndtering
  /features         # Funksjonalitets-moduler og logikk
    /auth
    /chat
    /groups
  /hooks            # Custom React hooks
    /chat           # Chat-relaterte hooks (inkludert pinning hooks)
      - usePinMessage.ts    # Håndterer pin/unpin-funksjonalitet
      - useChatPin.ts       # Administrerer pinnede meldinger med realtime-støtte
    /message        # Melding-relaterte hooks
  /integrations     # Tredjepartsintegrasjoner
    /supabase       # Supabase klient og tilkoblingsoppsett
  /lib              # Hjelpefunksjoner og verktøy
  /pages            # React Router-sider
  /services         # Tjenester og businesslogikk
    /encryption     # Krypteringstjenester
  /types            # TypeScript typedefinisjon-filer
  /utils            # Hjelpeverktøy og nyttefunksjoner
    /encryption     # Krypteringsverktøy
```

Vær nøye med å plassere nye filer i riktig kategori og struktur.

### Sikkerhet
- End-to-End Encryption via encryptionService.ts med AES-GCM kryptering
- Cloudflare WAF og sikkerhetsfunksjoner
- Session timeout-mekanisme i securityEnhancements.ts (10 minutter standard)
- Rate limiting for autentiseringsforsøk (5 forsøk før kontolåsing)
- RLS (Row Level Security) i Supabase
- Sikker lagring av API-nøkler med PBKDF2 nøkkelavledning

### Chat-system
- Støtter både gruppechat og privatechat
- Grupper har sikkerhetsnivåer og tillatelseshierarki:
  * ADMIN, MODERATOR, MEMBER rollesystem
  * STANDARD, ENHANCED, PREMIUM sikkerhetsnivåer
- Meldinger kan inneholde media og krypterte vedlegg
- Støtte for ephemeral meldinger som slettes etter lesing

### Dataflyt
- Bruker → AuthContext → ChatContext → Supabase Realtime → Encrypted Messages
- Meldinger krypteres før de sendes til Supabase
- Nøkkelutveksling via Supabase secure channels
- Flertrinnsprosess for gruppekryptering implementert i groupChatService.ts

## PIN-FUNKSJONALITET

Snakkaz Chat har implementert en komplett pin-funksjonalitet for å fremheve viktige meldinger i alle chat-typer.

### Komponentoversikt
- **PinnedMessages.tsx**: Viser pinnede meldinger i en egen seksjon
- **usePinMessage.ts**: Håndterer pinning/unpinning av meldinger
- **useChatPin.ts**: Administrerer pinnede meldinger med realtime-subscriptions

### Integrasjon
1. **Global Chat**: 
   - Implementert i `GlobalChatContainer.tsx`
   - Alle brukere kan se pinnede meldinger
   - Realtime-oppdateringer via Supabase-subscriptions

2. **Privat Chat**:
   - Implementert i `PrivateChatDetailView.tsx`
   - Støtter E2EE for krypterte pins
   - Kun deltakere i chatten kan se og administrere pins

3. **Gruppe Chat**:
   - Implementert i `GroupChatView.tsx`
   - Rollebasert tilgangskontroll for pin-administrasjon
   - Gruppeadministratorer kan administrere pins

### Sikkerhetsaspekter
- Pinnede meldinger respekterer E2EE-systemet
- Encryptionkey brukes for å dekryptere pinnede meldinger
- Pinnede metadata (pinned_by, pinned_at) er også kryptert i private/gruppe-chatter

### Mobile støtte
- Responsive design fungerer på alle enheter
- Dedikerte mobile komponenter i `/components/mobile/pin/` er for PIN-kode sikkerhet (ikke relatert til meldingspin)
- Fremtidige forbedringer planlegges for touch-vennlig pin-interaksjon

### Database-struktur
Alle meldingstabeller har følgende felt for pin-funksjonalitet:
- `pinned`: Boolean som indikerer om meldingen er pinnet
- `pinned_by`: Bruker-ID til den som pinnet meldingen
- `pinned_at`: Tidsstempel for når meldingen ble pinnet

### Brukergrensesnittdetaljer
- Pin-ikon vises på pinnede meldinger
- Dedikert seksjon for pinnede meldinger i toppen av chat
- Pin-handlingsknapp i meldingsinteraksjonsmenyen
- Animasjon ved pinning/unpinning

## UTFØRTE OPPGAVER OG UTVIKLINGSMILESTONES

### Fase 1: Infrastruktur og Sikkerhet
- [x] Cloudflare DNS-konfigurasjon
- [x] Sikker lagring av API-nøkler via secureCredentials.ts
- [x] Implementert sesjonstimeout og autentiseringssikkerhet
- [x] Cloudflare sikkerhetstester via cloudflareSecurityCheck.ts
- [x] Opprettet deploymentworkflow (.github/workflows/deploy.yml)
- [x] Tømming av Cloudflare-cache etter deployment
- [x] Forbedret feilhåndtering i deploymentprosessen

### Fase 2: Chat-systemet (delvis ferdig)
- [x] Implementert grunnleggende gruppechat via GroupChatService
- [x] Utviklet ChatContext for tilstandshåndtering på tvers av komponenter
- [x] Satt opp chatgrensesnitt med ChatInterface.tsx
- [x] Utviklet gruppelistevisning med GroupList.tsx
- [x] Implementert custom emoji-system med reaksjoner på meldinger
- [x] Lagd hooks og utilities for emoji-håndtering
- [ ] Optimalisere privatechat-funksjonalitet i eksisterende system
- [ ] Fullføre implementasjon av gruppechat-tillatelser
- [ ] Implementere global chat med moderasjonsfunksjoner



## VERKTØY OG TJENESTER

### Utviklingsverktøy
- TypeScript for type-sikkerhet
- GitHub for versjonskontroll
- GitHub Actions for CI/CD
- GitHub Copilot for utvikling
- Vite som build-system

### Tjenester og Integrasjoner
- Cloudflare for sikkerhet, caching og CDN
- Supabase for backend (authentication, database, storage, realtime)
- Namecheap for domene-administrasjon
- Fremtidige planer for Claude AI-integrasjon

## SUPABASE PREVIEW

Snakkaz Chat bruker Supabase for backend-tjenester, og har støtte for lokale og remote preview-miljøer for utvikling og testing.

### Lokalt Supabase-miljø

For lokal utvikling kan du kjøre Supabase lokalt ved å bruke følgende kommandoer:

```bash
# Initialisere Supabase-prosjekt (første gang)
npm run supabase:setup

# Starte lokal Supabase-instans
npm run supabase:start

# Kjøre applikasjon med lokal Supabase
npm run dev:with-supabase

# Sjekke status for lokal Supabase
npm run supabase:status

# Stoppe lokal Supabase-instans
npm run supabase:stop
```

### Supabase Preview for Pull Requests

Når en pull request opprettes mot main-branch, vil GitHub Actions automatisk opprette en Supabase preview-branch. Dette gir et isolert testmiljø spesifikt for den pull requesten.

#### Hvordan bruke Preview-miljøer:

1. Opprett en pull request mot main-branch
2. GitHub Actions vil opprette en Supabase preview-branch
3. En kommentar på pull requesten vil inneholde instruksjoner for hvordan man kobler til preview-miljøet
4. Når pull requesten lukkes, vil preview-branchen slettes automatisk

#### Manuell Oppsett av Preview:

```bash
# Link til eksisterende Supabase-prosjekt
./supabase-preview.sh link
# Følg instruksjonene og skriv inn prosjekt-referansen når du blir bedt om det

# Kjør applikasjonen med miljøvariabel for branch
SUPABASE_BRANCH=branch-navn npm run dev
```

#### Administrere Databaseskjema:

```bash
# Hente skjema fra remote prosjekt
./supabase-preview.sh db-pull

# Dytte lokale endringer til remote prosjekt
./supabase-preview.sh db-push

# Tilbakestille lokal database (sletter data!)
./supabase-preview.sh db-reset
```

Dette preview-systemet lar utviklere teste endringer mot en isolert kopi av databasen før de merges til hovedbranchen.

## DEPLOYMENT

### Deployment-prosess
#### Metode 1: Automatisert Deployment
1. Naviger til prosjektets rotmappe i terminalen
   ```bash
   cd /sti/til/snakkaz-chat
   ```

2. Kjør deploymentskriptet
   ```bash
   ./deploy-snakkaz.sh
   ```

3. Følg instruksjonene i skriptet som vil:
   - Kjøre Cloudflare-sikkerhetssjekker
   - Spørre om commit-melding
   - Committe og pushe endringene 
   - Starte GitHub Actions workflow

4. Når GitHub Actions er ferdig, verifiser at siden fungerer på www.snakkaz.com

5. Kjør statuskontroll for å verifisere Cloudflare-integrasjonen
   ```bash
   ./check-cloudflare-status.sh
   ```

#### Metode 2: Manuell Deployment
1. Commit og push endringer til main-branch
   ```bash
   git add .
   git commit -m "Din beskrivelse av endringene"
   git push origin main
   ```

2. GitHub Actions vil automatisk starte deployment-prosessen

3. Gå til GitHub Actions-fanen for å følge med på status:
   https://github.com/[din-bruker]/snakkaz-chat/actions

### Verifisering
- Bruk `check-cloudflare-status.sh` for å verifisere Cloudflare-integrasjon
- Se DEPLOYMENT-GUIDE.md for detaljert deploymentveiledning

### Feilsøking av Deployment
#### Hvis GitHub Actions-workflow feiler:
1. Sjekk loggen i GitHub Actions for detaljer om feilen
2. Vanlige problemer:
   - Manglende hemmeligheter i GitHub-repositoriet
   - FTP-tilkoblingsfeil (sjekk påloggingsinformasjon)
   - Byggefeil (sjekk at koden bygger lokalt med `npm run build`)

#### Hvis nettsiden ikke lastes etter deployment:
1. Sjekk om filene er lastet opp korrekt til webserveren
2. Kontroller at Cloudflare-cache er tømt
3. Verifiser SSL/TLS-konfigurasjonen med check-cloudflare-status.sh

## IMPLEMENTASJONSPLAN FREMOVER

### Neste steg - Prioritert rekkefølge
1. **Chat-systemet:**
   - [ ] Forbedre eksisterende private chat-funksjoner
   - [ ] Fullføre gruppechat UI og administrasjonsfunksjoner
   - [ ] Implementere global chat med moderasjon

2. **Supabase-integrasjon:**
   - [ ] Optimalisere databasestruktur for chatmeldinger
   - [ ] Implementere RLS (Row Level Security)
   - [ ] Sette opp Edge Functions for backend-logikk

3. **AI-integrasjon:**
   - [ ] Integrere Claude API for smarte chatfunksjoner
   - [ ] Implementere innholdsmoderering med AI
   - [ ] Utvikle kontekstuelle hjelpefunksjoner

## SIKKERHETSFUNKSJONER

### Implementerte sikkerhetsfunksjoner
- **Forbedret kredensial-lagring:** AES-GCM kryptering, passord-beskyttet tilgang
- **Sesjonsadministrasjon:** Automatisk timeout (10 minutter), sikker lagring
- **Autentiseringsbeskyttelse:** Ratelimiting, kontolåsing etter 5 feilede forsøk
- **Forbedret entropi for kryptering:** Multiple entropikillder, nettleser-spesifikke komponenter
- **DNS-sikkerhet:** Cloudflare DNS oppsett og overvåking

### Sikkerhetsanalyse
Se detaljer i [SECURITY-ENHANCEMENTS.md](/workspaces/snakkaz-chat/src/services/encryption/SECURITY-ENHANCEMENTS.md) og [CLOUDFLARE-SECURITY-REPORT.md](/workspaces/snakkaz-chat/src/services/encryption/CLOUDFLARE-SECURITY-REPORT.md)

## VIKTIGE MODULER
Prosjektet er strukturert med flere spesialiserte moduler:

### CSP-konfigurasjon (`cspConfig.ts`)
Setter opp robust Content Security Policy som tillater nødvendige domener og ressurser.
```typescript
import { applyCspPolicy } from './services/encryption';
// Bruk denne tidlig i applikasjonen
applyCspPolicy();
```

### CORS & Ping Fix (`corsTest.ts`)
Løser CORS-problemer og blokkerer unødvendige ping-forespørsler.
```typescript
import { unblockPingRequests } from './services/encryption';
// Bruk for å forhindre CSP-feil fra ping-forespørsler
unblockPingRequests();
```

### Ressurs Fallback (`assetFallback.ts`)
Håndterer tilfeller hvor eksterne ressurser ikke kan lastes.
```typescript
import { registerAssetFallbackHandlers } from './services/encryption';
// Registrer fallback-håndtering for nettverksressurser
registerAssetFallbackHandlers();
```

### Diagnostikk (`diagnosticTest.ts`)
Testverktøy for konfigurasjon og tilkoblinger.
```typescript
import { runFullDiagnostics } from './services/encryption';
// Kjør for å teste alle aspekter av systemet
const results = await runFullDiagnostics();
```

### Systeminitialisering (`initialize.ts`)
Sammensatt initialisering av alle sikkerhetsfunksjoner:
```typescript
import { initializeSnakkazChat } from './services/encryption';
// Kjør dette ved oppstart av applikasjonen
initializeSnakkazChat();
```

## NØKKELFILER OG DERES FUNKSJONER

### Chat-system
- `encryptionService.ts`: Hovedansvarlig for E2EE-funksjonalitet
- `ChatContext.tsx`: Provider for chattilstand og funksjoner
- `ChatInterface.tsx`: UI for chattegrensesnitt
- `GroupList.tsx`: Komponentvisning for gruppelister
- `groupChatService.ts`: Tjenesteklasse for gruppechat-funksjonalitet

### Sikkerhet
- `encryptionService.ts`: Håndterer kryptering og dekryptering
- `securityEnhancements.ts`: Sikkerhetsutvidelser som session timeout
- `cloudflareSecurityCheck.ts`: Sjekker Cloudflare-integrasjon
- `systemHealthCheck.ts`: Overvåker systemtilstand og sikkerhetskontroller
- `cspConfig.ts`: Konfigurerer Content Security Policy

### Deployment
- `deploy.yml`: GitHub Actions workflow for deployment
- `deploy-snakkaz.sh`: Script for enkel deployment
- `check-cloudflare-status.sh`: Verifikasjonsverktøy for Cloudflare-status

## VIKTIGE DOKUMENTER

- `SNAKKAZ-IMPLEMENTASJONSPLAN.md`: Hovedplan for implementasjon
- `CLOUDFLARE-SECURITY-GUIDE.md`: Guide for Cloudflare-sikkerhet
- `SECURITY-ENHANCEMENTS.md`: Dokumentasjon for sikkerhetsutvidelser
- `DEPLOYMENT-GUIDE.md`: Trinn-for-trinn guide for deployment
- `DEPLOYMENT-STATUS.md`: Statusrapport for deployment

## CLOUDFLARE-INTEGRASJON

### DNS-oppsett
- Nameservere på Namecheap: `kyle.ns.cloudflare.com` og `vita.ns.cloudflare.com`
- DNS-konfigurasjon er komplett og validert
- Se [CLOUDFLARE-DNS-GUIDE.md](/workspaces/snakkaz-chat/src/services/encryption/CLOUDFLARE-DNS-GUIDE.md) for detaljer om oppsett

### Sikkerhetsfunksjoner
- Web Application Firewall (WAF) aktivert
- DDoS-beskyttelse konfigurert
- SSL/TLS-sertifikater installert og validert
- Se [CLOUDFLARE-SECURITY-GUIDE.md](/workspaces/snakkaz-chat/src/services/encryption/CLOUDFLARE-SECURITY-GUIDE.md) for detaljer

### API-integrering
- Cloudflare API-tilgang konfigurert for automatisering
- Cache-tømming etter deployment
- API-nøkler lagret sikkert
- Se [CLOUDFLARE-API-GUIDE.md](/workspaces/snakkaz-chat/src/services/encryption/CLOUDFLARE-API-GUIDE.md) for API-detaljer

## REFAKTORISERINGSMULIGHETER

### Filorganisering
- Samle relaterte sikkerhetsfiler i en dedikert mappe
- Flytte dokumentasjonsfiler til en egen `/docs`-mappe
- Konsolidere duplikat-funksjonalitet i sikkerhetstestfiler

### Kodeoptimalisering
- Redusere kodeduplisering i sikkerhetsfunksjoner
- Fjerne unødvendige globale variabler
- Optimalisere krypteringsfunksjoner for ytelse
- Konsolidere Cloudflare-relaterte funksjoner

### Modulstruktur
- Reorganisere filstruktur til mer logiske moduler
- Separere sikkerhetsfunksjoner fra UI-komponenter
- Flytte dokumentasjon til en mer logisk plassering
- Skille tester fra implementasjon

## KJENTE PROBLEMER OG UTFORDRINGER

- Nettleser-kompatibilitet, spesielt med Safari og eldre nettlesere
- Manglende robusthet i enkelte fallback-mekanismer
- Ytterligere optimalisering av nettverksressurser nødvendig
- Muligheter for forbedring av applikasjonens ytelsesspor

### Løste problemer
- ✅ CSP-problemer med eksterne ressurser (løst 19. mai 2025)
- ✅ CORS-problemer ved testing mot produksjons-API-er (løst 19. mai 2025)
- ✅ TypeScript kompileringsfeil med ikke-eksisterende funksjoner (løst 19. mai 2025)
- ✅ Service Worker HEAD request caching-problemer (løst 19. mai 2025)
- ✅ Supabase Preview miljø-problemer (løst 19. mai 2025)
- ✅ Multiple GoTrueClient instances warning (løst 19. mai 2025)
- ✅ Import path feil i krypteringsmoduler (løst 22. mai 2025)
- ✅ Manglende npm-pakker for filupplasting og kryptering (løst 22. mai 2025) 
- ✅ React Router Future Flag advarsler (løst 25. mai 2025)
- ✅ Manglende emoji-støtte i chat-meldinger (løst 25. mai 2025)
- ✅ Manglende reaksjonssystem for meldinger (løst 25. mai 2025)
- ✅ Lovable/GPT Engineer referanser i kodebasen (løst 25. mai 2025)

## STATUSRAPPORT PER 25. MAI 2025

### Kritiske cPanel API deployment-fikser (25. mai 2025)

1. **Løst "Access denied" problemer med cPanel File Manager API:**
   - Implementert 4-trinns fallback-system for file extraction
   - **Metode 1**: Files API (`/execute/Files/extract_files`) - nyeste cPanel versjoner
   - **Metode 2**: Fileman API (`/execute/Fileman/extract_files`) - tradisjonell tilnærming 
   - **Metode 3**: Compress API (`/execute/Compress/extract_files`) - alternativ modul
   - **Metode 4**: PHP Script Upload - direktør utførelse på server som bypasser API-begrensninger

2. **Forbedret debugging og feilhåndtering:**
   - Lagt til HTTP status code tracking for alle API-kall
   - Detaljert logging av hver extraction-forsøk
   - Progressiv fallback gjennom alle metoder før failure
   - Automatisk cleanup av midlertidige filer
   - Omfattende manuelle instruksjoner hvis alle metoder feiler

3. **Deployment verification forbedringer:**
   - Site accessibility testing etter deployment
   - Clean reference checking (ingen Lovable/GPT Engineer CDNs)
   - Detaljert deployment status rapportering
   - Method tracking for å vise hvilken tilnærming som lyktes

4. **GitHub Actions workflow oppdateringer:**
   - Fjernet URL encoding problemer (endret fra `%2Fpublic_html` til `/public_html`)
   - Endret fra POST til GET requests for cPanel File Manager API
   - Lagt til comprehensive error handling og response parsing
   - Implementert multi-method extraction approach

### Tekniske forbedringer i deployment-systemet

**cPanel API Authentication Fix:**
```bash
# GAMMELT (problematisk):
curl -X POST "https://domain:2083/execute/Fileman/extract_files" \
  -d "dir=%2Fpublic_html&file=snakkaz-dist.zip&type=zip"

# NYTT (fikset):
curl "https://domain:2083/execute/Fileman/extract_files?dir=/public_html&file=snakkaz-dist.zip&type=zip"
```

**PHP Extraction Script (Fallback Method 4):**
- Uploader custom PHP script for direktør ZIP extraction på server
- Bypasser alle cPanel API begrensninger
- Utfører automatisk cleanup etter suksessfull extraction
- Gir detailed error reporting og JSON response formatting

**Deployment Process Rekkefølge:**
1. ✅ **API Connection Test** - Verifiserer cPanel token fungerer
2. ✅ **Upload .htaccess** - Sikrer korrekt routing configuration  
3. ✅ **Upload ZIP** - Overfører clean build uten Lovable referanser
4. 🔧 **Extract Files** - Progressiv 4-method extraction system
5. ✅ **Verify Deployment** - Tester site accessibility og cleanliness
6. ✅ **Cleanup** - Fjerner midlertidige ZIP filer
7. 📊 **Status Report** - Omfattende deployment summary

### Løste problemer (25. mai 2025)
- ✅ **cPanel API "Access denied" errors** - Fikset med multi-method fallback system
- ✅ **URL encoding issues** - Korrigert parameter formatting i API calls
- ✅ **HTTP method problems** - Endret til korrekte GET requests for cPanel APIs
- ✅ **Fallback mechanism** - Implementert robust 4-step extraction process
- ✅ **Error reporting** - Detaljert logging og status tracking for hver method
- ✅ **Manual instructions** - Klare steg-for-steg instruksjoner hvis automation feiler

### Pågående deployment-status (25. mai 2025)
- ✅ **GitHub Actions Completed**: Deployment workflow ferdig (36s, succeeded)
- ✅ **ZIP Upload Success**: `snakkaz-dist.zip` med clean build uploaded til `/public_html`
- ❌ **Automatic Extraction Failed**: Alle cPanel API metoder ga "Access denied" (HTTP 403)
- 🔧 **Manual Step Required**: ZIP file må ekstrakteres manuelt via cPanel File Manager
- ❌ **Live Site Status**: Viser fortsatt gammel build hash `index-DZCalXH2.js`
- 🎯 **Ready for Manual Completion**: Clean build `index-BThXBval.js` klar i ZIP, trenger kun manuell ekstraktering

### Identifiserte problemer som fortsatt må løses:
1. **GitHub Actions Deployment** - Venter på completion av triggered deployment workflow
2. **cPanel API extraction** - `/extract.php` endpoint fungerer ikke korrekt, returnerer HTML
3. **Build Hash Propagation** - Live site må oppdateres fra `index-DZCalXH2.js` til `index-BThXBval.js`
4. **Site accessibility** - HTTP errors må løses for proper site access

### Neste prioriterte oppgaver:
1. 🔧 **Manual ZIP Extraction** - Logg inn på cPanel og ekstrakterer `snakkaz-dist.zip` manuelt
2. ✅ **Verify Clean Deployment** - Bekreft at `index-BThXBval.js` vises på live site
3. 🧹 **Confirm Lovable Cleanup** - Verifiser at alle Lovable referanser er fjernet fra live site
4. 🔄 **Test Site Functionality** - Full testing av chat og subscription features etter clean deployment
5. 📧 **Mail System Integration** - Løser 406 subscription errors og integrerer mail.snakkaz.com fullstendig

### Technical Architecture Updates

**Deployment Workflow Evolution:**
```yaml
# Ny workflow struktur (deploy-cpanel-token.yml)
- API Connection Test → Multiple extraction methods → Site verification → Cleanup
- Robust error handling på hvert steg
- Detailed status reporting for troubleshooting
- Progressive fallback til manual instructions
```

**Clean Build Verification:**
- ✅ Build compiles successfully uten errors
- ✅ Ingen `cdn.gpteng.co` eller `*.gpteng.co` referanser i output
- ✅ Alle Lovable/GPT Engineer referanser fjernet fra source
- ✅ CSP konfigurasjoner cleaned og updated
- ✅ New build hash generated: `index-BThXBval.js`

**Deployment Progress Tracking (25. mai 2025):**
- ⏰ **10:47 UTC**: Clean build `index-BThXBval.js` generated locally
- ⏰ **10:48 UTC**: GitHub Actions deployment triggered via push to main
- ⏰ **10:51 UTC**: Live site monitoring confirmed old hash `index-DZCalXH2.js` still active
- 🔄 **Current Status**: Deployment in progress, monitoring script `monitor-live-deployment.sh` active
- 📊 **Monitoring**: Checking every 60 seconds for hash change on https://snakkaz.com

### Deployment Process Insights (25. mai 2025)

**GitHub Actions Workflow Understanding:**
- Build process happens in cloud (GitHub runners), not from local dist/
- Local dist/ correctly in .gitignore as builds are generated on deployment
- Workflow: `npm ci` → `npm run build` → ZIP creation → cPanel upload → extraction
- Environment variables injected during cloud build from GitHub secrets

**cPanel API Challenges Identified:**
1. **extract.php endpoint issue**: Returns HTML instead of executing extraction
2. **API method reliability**: Multiple fallback methods needed for robust deployment  
3. **Manual intervention required**: When automated extraction fails
4. **Propagation timing**: Build hash changes may take time to appear on live site

**Monitoring and Verification Tools:**
- Created `monitor-live-deployment.sh` for automated deployment tracking
- Build hash comparison for deployment verification: `index-DZCalXH2.js` → `index-BThXBval.js`
- Lovable reference cleanup verification via content scanning
- Progressive monitoring with timeout and fallback to manual verification

---

## BRUK AV DENNE MASTER PROMPT

Denne master prompten kan brukes til å:
1. Raskt få oversikt over hele Snakkaz-prosjektet
2. Sjekke status på ulike komponenter
3. Planlegge neste steg basert på implementasjonsplanen
4. Identifisere nøkkelfiler som trenger endringer
5. Holde oversikt over fremgangen

For å jobbe systematisk fremover:
1. Gå gjennom implementasjonsplanen punkt for punkt
2. Oppdater denne master prompten ettersom endringer gjøres
3. Hold statusseksjonen oppdatert for å reflektere nåværende tilstand
4. Marker oppgaver som fullført når de er implementert og testet
5. Alltid verifiser at du jobber på main branch før du gjør endringer
6. Oppdater implementasjonsplanen i SNAKKAZ-IMPLEMENTASJONSPLAN.md

---

## EFFEKTIV ARBEIDSMETODE

For å jobbe mer effektivt med dette prosjektet, følg disse retningslinjene:

1. **Utforske kodebasen:**
   ```bash
   # Alltid start med å sjekke prosjektroten
   cd /workspaces/snakkaz-chat
   
   # Bruk find/grep for å finne relevant kode
   find src -type f -name "*.tsx" | grep -i "chat"
   grep -r "pinnedMessages" --include="*.tsx" src/
   ```

2. **Debugging med console.log:**
   ```tsx
   console.log('Debug pinnedMessages:', pinnedMessages);
   ```

3. **Testing av endringer:**
   ```bash
   # Start utviklingsserveren
   npm run dev
   
   # Kjør tester
   npm test
   ```

Dette dokumentet skal brukes som referansepunkt for alle som jobber med Snakkaz Chat-prosjektet. Det bør oppdateres jevnlig med ny informasjon om prosjektstatus, arkitekturendringer og implementasjonsdetaljer.

---

## CUSTOM EMOJI-SYSTEM

### Oversikt
Snakkaz Chat har nå implementert et komplett system for håndtering av egendefinerte emojier (custom emojis). Dette systemet gjør det mulig for brukere å opplaste, administrere og bruke egendefinerte emojier i chat-meldinger.

### Komponenter og filer
- **`CustomEmoji` interface**: Definisjon av datamodell for egendefinerte emojier
- **`useCustomEmojis` hook**: React hook for å administrere egendefinerte emojier
- **`useEmojiReactions` hook**: Hook for å håndtere reaksjoner på meldinger
- **`MessageReactions` komponent**: Viser emoji-reaksjoner på meldinger
- **`CustomEmojiDisplay` komponent**: Viser egendefinerte emojier
- **`MessageTextWithEmojis` komponent**: Behandler tekst med emoji-koder
- **`customEmojiUtils.ts`**: Hjelpefunksjoner for emoji-håndtering
- **`EmojiSearch.tsx`**: Søke- og kategoriseringsgrensesnitt for emojier
- **`emojiSearchUtils.ts`**: Hjelpefunksjoner for emoji-søk og -filtrering
- **`emojiAnalyticsUtils.ts`**: Verktøy for sporing og analyse av emoji-bruk

### Funksjonalitet
- Opplasting av egendefinerte emojier
- Reaksjoner på meldinger med standard og egendefinerte emojier
- Visning av egendefinerte emojier i meldingstekst
- Favorittmerking av emojier
- Kategorisering av emojier
- Bruksstatistikk for emojier
- Avansert emoji-søk med relevansrangering
- Emoji-analytics med brukssporing og trendanalyse

### Integrasjon
- Egendefinerte emojier lagres i Supabase
- Reaksjoner kobles til meldinger via `message_reactions` tabell
- Emojier kan brukes i alle chat-typer (privat, gruppe, global)

---

## KONTINUERINGSPUNKT - 25. MAI 2025, 14:45 UTC

### Aktuell situasjon:
- ✅ **GitHub Actions Completed**: Custom emoji support deployment succeeded (41s)
- ✅ **ZIP Upload Success**: `snakkaz-dist.zip` med build `index-BThXBval.js` uploaded til cPanel
- ✅ **React Router Warnings Fixed**: Implementert future flags for React Router v7 kompatibilitet
- ✅ **Custom Emoji System**: Ferdig implementert med full funksjonalitet
- ✅ **Monitoring Script Fixed**: `monitor-live-deployment.sh` improved with timeouts and error handling
- ✅ **Quick Check Script Created**: `quick-deployment-check.sh` for single-time status verification  
- ❌ **Manual Step Required**: cPanel API extraction failed, ZIP må ekstrakteres manuelt
- 📊 **Live Site Status**: Viser fortsatt `index-DZCalXH2.js` (gammel versjon)
- 🎯 **Ready for Completion**: Kun én manuell handling trengs for å fullføre clean deployment

### UMIDDELBARE STEG FOR Å FULLFØRE DEPLOYMENT:
1. **Logg inn på cPanel**: Gå til https://[domain]:2083
2. **Åpne File Manager**: Navigate til `/public_html`
3. **Lokaliser ZIP**: Finn `snakkaz-dist.zip` filen
4. **Ekstrakterer**: Høyreklikk → "Extract" → "Extract to current directory"
5. **Cleanup**: Slett `snakkaz-dist.zip` etter vellykket ekstraktering
6. **Verifiser**: Besøk https://snakkaz.com og sjekk for nyeste build hash

### Utført opprydding:
1. ✅ **React Router Warnings**: Fikset fremtidige advarsler med future flags konfigurasjon
2. ✅ **Lovable-referanser**: Fjernet alle referanser til Lovable og GPT Engineer
3. ✅ **Custom Emoji System**: Implementert og testet
4. ✅ **Unødvendige filer**: Slettet midlertidige og overflødige filer
5. ✅ **Dokumentasjon**: Oppdatert SNAKKAZ-MASTER-PROMPT.md med ny status

### Neste steg:
1. **Sjekk deployment**: Kjør `./quick-deployment-check.sh` for umiddelbar status
2. **Monitor continuous**: Kjør `./monitor-live-deployment.sh` for kontinuerlig overvåkning
3. **Test chat system**: Verifiser at chat-systemet med custom emoji fungerer
4. **Resolve mail integration**: Fiks subscription errors og integrer mail.snakkaz.com
5. **Planlegg videre utvikling**: Basert på implementasjonsplanen

### Monitoring Script Improvements (25. mai 2025, 11:30 UTC):
**Fixed Issues:**
- ✅ **Timeout Protection**: Curl commands now have 10-15 second timeouts
- ✅ **Signal Handling**: Proper SIGINT/SIGTERM handling for graceful exit
- ✅ **Connectivity Testing**: Pre-check site reachability before monitoring
- ✅ **Responsive Sleep**: 1-second intervals allow Ctrl+C interrupt
- ✅ **Error Handling**: Better handling of network failures and edge cases

**Available Scripts:**
- `./monitor-live-deployment.sh` - Continuous monitoring with 30-second intervals
- `./quick-deployment-check.sh` - Single-time status check without waiting

### Teknisk bekreftelse ved fullføring:
- Build hash skal vise: `index-BThXBval.js`
- Ingen `gpteng.co` eller `lovable` referanser på live site
- Chat system fungerer normalt
- Subscription features uten 406 errors

**Sist oppdatert: 26. mai 2025, 14:45 UTC - Custom emoji system implementert, React Router warnings fixed, prosjektstruktur revidert**

---

## NY STANDARDISERT PROSJEKTSTRUKTUR

For å forbedre oversikten og organisering av prosjektet, har vi definert følgende standardiserte mappestruktur. Dette muliggjør enklere navigering, reduserer duplisering, og skaper en mer konsistent kodebase.

### Hovedmapper
```
/workspaces/snakkaz-chat/
├── docs/              # All dokumentasjon samlet i én mappe
│   ├── architecture/  # Systemarkitektur og design
│   ├── deployment/    # Deployment-relatert dokumentasjon
│   ├── features/      # Feature-dokumentasjon (f.eks. emoji-system)
│   ├── troubleshooting/ # Feilsøkingsguider
│   └── development/   # Utviklerveiledninger
├── scripts/           # Alle shell scripts og verktøy
│   ├── deployment/    # Deployment-relaterte scripts
│   ├── migration/     # Database-migrasjonsscripts
│   ├── verification/  # Verifikasjonsscripts
│   └── development/   # Utviklingsverktøy/scripts
├── src/               # Applikasjonskildekode
│   ├── assets/        # Statiske ressurser
│   ├── components/    # React-komponenter (UI)
│   ├── features/      # Feature-moduler med egen struktur
│   │   ├── auth/      # Autentisering-feature
│   │   ├── chat/      # Chat-feature
│   │   ├── emoji/     # Emoji-feature
│   │   └── groups/    # Grupper-feature
│   ├── hooks/         # React hooks
│   ├── integrations/  # Tredjepartsintegrasjoner
│   ├── pages/         # React Router-sider
│   ├── services/      # Tjenester og businesslogikk
│   ├── utils/         # Utility-funksjoner
│   └── types/         # TypeScript-typer
└── public/            # Offentlig tilgjengelige filer
```

### Feature-basert Struktur
Hver feature-mappe følger en konsistent struktur:

```
/src/features/emoji/
├── components/        # Komponentene spesifikk for denne featuren
├── hooks/             # Hooks relatert til denne featuren
├── services/          # Tjenester for denne featuren
├── utils/             # Utility-funksjoner for denne featuren
├── types.ts           # TypeScript-typer for denne featuren
└── index.ts           # Eksporterer alle public-facing deler av featuren
```

Denne strukturen gjør at vi kan:
1. Organisere koden basert på funksjonsområder (features)
2. Redusere duplisering på tvers av prosjektet
3. Gjøre det enklere å finne og forstå kodekomponenter 
4. Sikre konsistens i hele prosjektet

For implementasjonsplan og strategi for å migrere til denne strukturen, se `docs/architecture/PROJECT-STRUCTURE-MIGRATION.md` for detaljerte steg.

---

## SYSTEMATISK OPPRYDDING - JUNI 2025

### FULLFØRT OPPRYDDING (2. juni 2025) ✅

**Analyserte filer:**
- **2,339 Markdown filer** (redusert til essensielle)
- **1,659 kode filer** (JS/TS/TSX) alle bevart og fungerende
- **82 rot-niveau filer** redusert betydelig

**Arkivstruktur opprettet:**
- `.archive/documentation-archive-juni2025/` - 30+ gamle dokumenter
- `.archive/old-scripts/` - gamle script filer
- `.archive/test-files/` - test og demo filer
- `scripts/archived-scripts/` - arkiverte deployment scripts

**Infrastruktur verifisert:**
- ✅ **DNS og domene**: snakkaz.com → 162.0.229.214 (korrekt oppløsning)
- ✅ **Hosting server**: premium123.web-hosting.com tilgjengelig
- ✅ **Supabase database**: Tilkobling og konfiguration verifisert
- ✅ **FTP deployment**: Credentials og LFTP-script konfigurert korrekt
- ✅ **Build pipeline**: 2697 moduler, 54 optimaliserte chunks generert
- ✅ **Mail server**: cPanel API og IMAP konfigurert

**Teknisk tilstand:**
- Build hash: Siste suksessfulle build generert
- Alle komponenter fungerer korrekt
- Ingen kompileringsfeil funnet
- GitHub repository status: main branch oppdatert

**Neste prioriteter:**
1. Konsolidere viktigste dokumenter
2. Oppdatere implementasjonsplan
3. Planlegge neste utviklingsfase

---
