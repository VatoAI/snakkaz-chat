# Snakkaz Chat

En end-to-end kryptert (E2EE) chatapplikasjon med fokus på sikkerhet, brukervennlighet og fremragende ytelse.

## Oversikt

Snakkaz Chat er en moderne chatteplattform som tilbyr:
- End-to-end kryptert kommunikasjon
- Støtte for både private chatter og gruppesamtaler
- Persistent lagring med Supabase
- Høy sikkerhet gjennom moderne web-standarder

## Funksjoner

- **Sikkerhet først:** End-to-end kryptering av alle meldinger
- **Brukerautentisering:** Sikker innlogging og registrering via Supabase Auth
- **Realtime Chat:** Umiddelbar levering av meldinger
- **Offline støtte:** Service Worker for caching og offline-funksjonalitet
- **Moderne UI:** Responsivt design med Shadcn UI-komponenter
- **Gruppechat:** Støtte for gruppekommunikasjon
- **Pinned Messages:** Mulighet for å feste viktige meldinger

## Teknisk stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Sikkerhet:** Moderne CSP-implementasjon, E2EE
- **Utvikling:** CI/CD via GitHub Actions

## Utvikling

### Forutsetninger

- Node.js 18+ 
- npm eller yarn
- Supabase-konto (for utvikling mot remote)

### Kom i gang

1. Klon repositoriet
   ```bash
   git clone https://github.com/your-username/snakkaz-chat.git
   cd snakkaz-chat
   ```

2. Installer avhengigheter
   ```bash
   npm install
   ```

3. Start utviklingsserveren
   ```bash
   npm run dev
   ```

## Nylige oppdateringer (Mai 2025)

### Feilrettinger

1. **Build Error Fix**
   - Løst problem med manglende encryptionService import i SecureMessageViewer.tsx
   - Korrigert feilaktige importstier i groupChatService.ts
   - Se `BUILD-FIX-DOCUMENTATION.md` for detaljer

2. **Subdomain Root Access Fix**
   - Løst 404-feil ved direkte forespørsler til subdomain-røtter
   - Implementert komplett løsning for både /ping-stier og direkte subdomain-tilgang
   - Se `SUBDOMAIN-ROOT-ACCESS-FIX.md` for mer informasjon

### Distribusjon

For å distribuere de nylige oppdateringene:

1. Bygg applikasjonen
   ```bash
   npm run build
   ```

2. Deploy til produksjonsserveren
   ```bash
   ./deploy-fixed-application.sh
   ```

3. Verifiser at alle endringene fungerer korrekt
   - Test subdomain-røtter direkte (f.eks. https://analytics.snakkaz.com/)
   - Test ping-endpoints (f.eks. https://analytics.snakkaz.com/ping)
   ```bash
   npm run dev
   ```

4. For utvikling med lokal Supabase
   ```bash
   npm run dev:with-supabase
   ```

### Nyttige kommandoer

- **Bygg for produksjon:**
  ```bash
  npm run build
  ```

- **Lokal preview av produksjonsbygg:**
  ```bash
  npm run preview
  ```

- **Lint koden:**
  ```bash
  npm run lint
  ```

- **Test applikasjonen:**
  ```bash
  npm test
  ```

- **Kjør med Supabase Preview:**
  ```bash
  SUPABASE_BRANCH=branch-navn npm run dev
  ```

## Deployment

Snakkaz Chat er konfigurert for automatisk deployment til www.snakkaz.com via GitHub Actions. Se [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detaljer.

## Dokumentasjon

- [SNAKKAZ-MASTER-PROMPT.md](./SNAKKAZ-MASTER-PROMPT.md) - Hovedoversikt og arkitektur
- [DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md) - Status for nåværende deployment
- [README-SUPABASE-PREVIEW.md](./README-SUPABASE-PREVIEW.md) - Guide for Supabase Preview
- [FIXES-SUMMARY.md](./FIXES-SUMMARY.md) - Oversikt over nylige feilrettinger

## Siste oppdateringer (19. mai 2025)

- Fikset Service Worker HEAD request caching-problemer
- Løst CSP-advarsler
- Eliminert "Multiple GoTrueClient instances" advarsler
- Fikset TypeScript-kompileringsfeil
- Forbedret Supabase Preview-funksjonalitet

For fullstendig detaljer om feilrettingene, se [BUGFIXES-MAY19-2025.md](./BUGFIXES-MAY19-2025.md).

## Lisens

Dette prosjektet er lisensiert under MIT-lisensen - se [LICENSE](LICENSE)-filen for detaljer.

## Sikkerhet

Hvis du oppdager sikkerhetsproblemer, vennligst rapporter dem til sikkerhetsteamet i stedet for å opprette offentlige GitHub-issues. Se [SECURITY.md](./SECURITY.md) for detaljer.

---

Bygget med ❤️ av Snakkaz-teamet.

## Ytelsesoptimalisering (19. mai 2025)

Snakkaz Chat er optimalisert for høy ytelse med følgende teknikker:

### 1. Bildeoptimlisering
- Responsive bilder med srcset for ulike skjermstørrelser
- WebP-format for moderne nettlesere
- Lazy loading av bilder som ikke er i viewport

### 2. Code Splitting og Lazy Loading
- Route-basert code splitting
- Lazy loading av tunge komponenter
- Suspense for bedre lasting

### 3. State Management
- Optimalisert rendering med memoization
- Forbedret useCallback og useMemo med dyp sammenligning
- Throttling av callback-funksjoner for å redusere rerendering

### 4. Nettverksoptimalisering
- API response caching
- SWR-basert datahenting med automatisk revalidering
- Prefetching av kritiske data

### 5. Forbedret Service Worker
- Strategibasert caching for ulike ressurstyper
- Offline støtte med IndexedDB
- Background syncing for offline-handlinger

Ved å bruke disse teknikkene oppnår vi raskere lasting, bedre responsivitet og en mer robust brukeropplevelse.
