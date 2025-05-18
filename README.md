# SnakkaZ Chat

## Hva er SnakkaZ Chat?

SnakkaZ Chat er en moderne, sikker og sosial chat-app bygget for fremtiden. Appen kombinerer avansert kryptering, AI-drevne funksjoner og et unikt cyberpunk-inspirert design for å gi brukerne en trygg, morsom og engasjerende kommunikasjonsopplevelse.

> Sist oppdatert: 19. mai 2025 - Migrert fra Cloudflare til Namecheap hosting, implementert subdomain-struktur og forbedret SSL-sikkerhet

### Hovedfunksjoner
- **Sanntids chat** med støtte for grupper og private meldinger
- **Ende-til-ende kryptering** for maksimal sikkerhet
- **AI-assistert chat** og smarte svar
- **Mediaopplasting** (bilder, video, dokumenter)
- **Brukerprofiler og tilpasning**
- **Push-varsler** og tilstedeværelse
- **PIN- og tofaktorautentisering**
- **Adminpanel og moderasjonsverktøy**
- **Responsivt cyberpunk-design** med smooth neon-effekter

### Siste forbedringer (19. mai 2025)
- **Migrert til Namecheap hosting** - Komplett migrering fra Cloudflare
- **Implementert subdomene-struktur** - Separate subdomener for ulike deler av applikasjonen
- **Forbedret Supabase-integrasjon** - Singleton-pattern og optimaliserte databasespørringer
- **Oppdatert CSS-håndtering** - Erstatet manglende bildefiler med CSS-baserte løsninger
- **Fikset miljøvariabel-håndtering** - Ny robust løsning for process.env i nettleseren

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

### Lisens
SnakkaZ Chat er et åpent prosjekt. Se LICENSE for detaljer.

---

**Nettside:** https://snakkaz.com  
**Subdomener:** www.snakkaz.com, dash.snakkaz.com, business.snakkaz.com, docs.snakkaz.com, analytics.snakkaz.com, mcp.snakkaz.com, help.snakkaz.com

For spørsmål, kontakt teamet på [kontakt@snakkaz.no](mailto:kontakt@snakkaz.no)
# Deployment Test - Sun May 19 14:32:11 UTC 2025
