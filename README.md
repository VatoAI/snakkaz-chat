# SnakkaZ Chat

## Hva er SnakkaZ Chat?

SnakkaZ Chat er en moderne, sikker og sosial chat-app bygget for fremtiden. Appen kombinerer avansert kryptering, AI-drevne funksjoner og et unikt cyberpunk-inspirert design for å gi brukerne en trygg, morsom og engasjerende kommunikasjonsopplevelse.

> Sist oppdatert: 19. mai 2025 - Lagt til premium e-postfunksjonalitet med sikker cPanel API-integrasjon. Fullført migrering fra Cloudflare til Namecheap hosting, implementert komplett subdomain-struktur og forbedret sikkerhet

### Hovedfunksjoner
- **Sanntids chat** med støtte for grupper og private meldinger
- **Ende-til-ende kryptering** for maksimal sikkerhet
- **AI-assistert chat** og smarte svar
- **Mediaopplasting** (bilder, video, dokumenter)
- **Premium e-postadresser** for betalende medlemmer
- **Brukerprofiler og tilpasning**
- **Push-varsler** og tilstedeværelse
- **PIN- og tofaktorautentisering**
- **Adminpanel og moderasjonsverktøy**
- **Responsivt cyberpunk-design** med smooth neon-effekter

### Siste forbedringer (19. mai 2025)
- **Lagt til premium e-postfunksjonalitet** - Premium brukere kan nå opprette @snakkaz.com e-postadresser
- **Implementert sikker cPanel API-integrasjon** - Flerlags sikkerhet med operasjonsfiltrering
- **Forbedret autentiseringstjenesten** - Utvidet med rollebasert tilgangskontroll
- **Fullført migrering til Namecheap hosting** - Komplett migrering fra Cloudflare med alle filer og subdomain-struktur
- **Optimalisert server-oppsett** - Konfigurert .htaccess-regler for SPA-routing og sikkerhet
- **Implementert subdomain-routing** - Full støtte for dash.snakkaz.com, business.snakkaz.com, docs.snakkaz.com, osv.
- **Forbedret sikkerhetskonfigurasjon** - Strenge CSP-regler og sikkerhetsheadere
- **Forenklet deploy-prosess** - Ny FTP-opplastingsscript med forbedret feilhåndtering

### Tidligere forbedringer (10. mai 2025)
- **Implementert gruppe-E2EE** - Fullført ende-til-ende kryptering for gruppesamtaler
- **Oppdatert krypteringstjeneste** - Forbedret kryptering og nøkkelhåndtering
- **Fikset Tooltip-implementering** - Løst problemer med brukergrensesnitt
- **Lagring av krypteringsnøkler** - Ny implementasjon for sikker nøkkellagring
- **Forbedret meldingsvisning** - Forbedret håndtering av krypterte meldinger

### Teknologier
- **React** + **TypeScript**
- **Vite**
- **Tailwind CSS** (med custom cyberpunk-palett og animasjoner)
- **shadcn/ui**
- **Supabase** (autentisering, database, lagring)
- **Namecheap** (hosting og domenehåndtering)
- **VS Code + Copilot** (utvikling)

### Domenestruktur
- **snakkaz.com** - Hoveddomenet, landing page
- **www.snakkaz.com** - Hovedapplikasjon
- **dash.snakkaz.com** - Dashboard for administrator
- **business.snakkaz.com** - Business-versjon
- **docs.snakkaz.com** - Dokumentasjon
- **analytics.snakkaz.com** - Analytikk og statistikk
- **mcp.snakkaz.com** - MCP server for AI-integrasjon
- **help.snakkaz.com** - Hjelpesenter og support

### Hvordan komme i gang

```sh
# 1. Klon repoet
 git clone <YOUR_GIT_URL>
 cd snakkaz-chat

# 2. Installer avhengigheter
 npm install

# 3. Start utviklingsserver
 npm run dev
```

### Utviklingsmiljø
- Kodebasen støtter både lokal utvikling og GitHub Codespaces
- Miljøvariabler settes i `.env.development`
- Se `src/config/app-config.ts` for app-innstillinger

### Fremtidsplaner
- Flere AI-funksjoner (chatbots, analyse, anbefalinger)
- Videochat og tale
- Bedre gruppeadministrasjon
- Integrasjon med eksterne tjenester
- Mobilapper (PWA og native)

### Migrering Cloudflare til Namecheap
SnakkaZ Chat har nylig blitt migrert fra Cloudflare til Namecheap hosting. Dette har medført betydelige arkitekturendringer og nye sikkerhetsforbedringer. For mer informasjon om migreringen, se følgende dokumenter:

- `/docs/MIGRATION-COMPLETION-GUIDE.md` - Guide for å fullføre migreringen
- `/docs/MIGRATION-FINAL-STATUS.md` - Nåværende status for migreringen
- `/docs/MIGRATION-PROGRESS-REPORT.md` - Detaljert rapport om migreringen
- `/scripts/verify-subdomain-setup.sh` - Verktøy for å teste subdomain-oppsett
- `/scripts/install-ssl-certificates.sh` - Verktøy for SSL-installasjon

### Premium E-post Sikkerhet
Den nye premium e-postfunksjonen er implementert med en flerlags sikkerhetsarkitektur for å beskytte cPanel API-tilgangen. Denne implementasjonen inkluderer:

- **Operasjonsfiltrering**: Eksplisitt tillattliste for cPanel API-operasjoner
- **Rollebasert tilgangskontroll**: Begrenser hvem som kan utføre hvilke operasjoner
- **Sikker API-wrapper**: All tilgang går gjennom et sikret grensesnitt
- **Omfattende logging**: Alle operasjoner logges for sikkerhetsrevisjon

For mer informasjon om sikkerhetsfunksjonene, se følgende dokumenter:

- `/docs/CPANEL-API-TOKEN-SECURITY.md` - Veiledning for sikker håndtering av cPanel API-tokens
- `/docs/SECURE-EMAIL-API.md` - Detaljer om e-post API-sikkerhetslaget
- `/docs/PREMIUM-EMAIL-DEPLOYMENT.md` - Guide for å deploye e-postfunksjonaliteten
- `/CPANEL-API-SETUP-GUIDE.md` - Detaljert oppsettsprosess for e-postgfunksjonaliteten

### Lisens
SnakkaZ Chat er et åpent prosjekt. Se LICENSE for detaljer.

---

**Nettside:** https://snakkaz.com  
**Subdomener:** www.snakkaz.com, dash.snakkaz.com, business.snakkaz.com, docs.snakkaz.com, analytics.snakkaz.com, mcp.snakkaz.com, help.snakkaz.com

For spørsmål, kontakt teamet på [kontakt@snakkaz.no](mailto:kontakt@snakkaz.no)
# Deployment Test - Sun May 19 14:32:11 UTC 2025
