# SNAKKAZ MASTER PROMPT

## PROSJEKTOVERSIKT
- **Appnavn**: Snakkaz Chat
- **Type**: E2EE (End-to-End Encrypted) Chat-applikasjon
- **Domene**: www.snakkaz.com
- **Hovedteknologier**: React, TypeScript, Supabase, Cloudflare
- **Sikkerhet**: E2EE, P2P-funksjonalitet, Cloudflare-sikkerhet
- **Startdato**: [Fyll inn når prosjektet startet]
- **Status**: Under utvikling

## KOMPONENTER OG STRUKTUR

### Frontend Arkitektur
- React-basert SPA med TypeScript
- Shadcn UI-komponenter for design
- Bruker kontekst-API for tilstandshåndtering (ChatContext.tsx)
- Komponent-hierarki:
  * Hovedapp → AuthContainer → Chat → [GroupList | ChatInterface]

### Backend og Databaser
- Supabase for backend (authentication, database, storage)
- Realtime-funksjonalitet for chatmeldinger
- Cloudflare for edge-caching, sikkerhet, og CDN

### Sikkerhet
- End-to-End Encryption via encryptionService.ts
- Cloudflare WAF og sikkerhetsfunksjoner
- Session timeout-mekanisme i securityEnhancements.ts
- RLS (Row Level Security) i Supabase

### Chat-system
- Støtter både gruppechat og privatechat
- Grupper har sikkerhetsnivåer og tillatelseshierarki
- Meldinger kan inneholde media og krypterte vedlegg

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
- [ ] Optimalisere privatechat-funksjonalitet i eksisterende system
- [ ] Fullføre implementasjon av gruppechat-tillatelser
- [ ] Implementere global chat med moderasjonsfunksjoner

## VERKTØY OG TJENESTER

### Utviklingsverktøy
- TypeScript for type-sikkerhet
- GitHub for versjonskontroll
- GitHub Actions for CI/CD

### Tjenester og Integrasjoner
- Cloudflare for sikkerhet, caching og CDN
- Supabase for backend (authentication, database, realtime)
- Fremtidige planer for Claude AI-integrasjon

## DEPLOYMENT

### Deployment-prosess
- Bruk `deploy-snakkaz.sh` for automatisk deployment eller følg manuell prosess
- GitHub Actions workflow (.github/workflows/deploy.yml) håndterer bygging og opplasting
- FTP-opplasting til webserver + Cloudflare-cachetømming

### Verifisering
- Bruk `check-cloudflare-status.sh` for å verifisere Cloudflare-integrasjon
- Se DEPLOYMENT-GUIDE.md for detaljert deploymentveiledning

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

## NØKKELFILER OG DERES FUNKSJONER

### Chat-system
- `ChatContext.tsx`: Provider for chattilstand og funksjoner
- `ChatInterface.tsx`: UI for chattegrensesnitt
- `GroupList.tsx`: Komponentvisning for gruppelister
- `groupChatService.ts`: Tjenesteklasse for gruppechat-funksjonalitet

### Sikkerhet
- `encryptionService.ts`: Håndterer kryptering og dekryptering
- `securityEnhancements.ts`: Sikkerhetsutvidelser som session timeout
- `cloudflareSecurityCheck.ts`: Sjekker Cloudflare-integrasjon
- `systemHealthCheck.ts`: Overvåker systemtilstand og sikkerhetskontroller

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

## KJENTE PROBLEMER OG UTFORDRINGER

- [Liste opp kjente problemer ettersom de oppstår]

## STATUSRAPPORT PER [DAGENS DATO]

[Oppdater med dagens status og fremskritt]

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
