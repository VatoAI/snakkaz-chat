# Snakkaz Chat

Snakkaz Chat er en End-to-End Encrypted (E2EE) chat-applikasjon med fokus på sikkerhet, brukervennlighet og moderne funksjoner.

## Project Status

**Status**: Under utvikling og restrukturering (Mai 2025)
**Nettside**: [www.snakkaz.com](https://www.snakkaz.com)

## Project Overview

Snakkaz Chat er en chat-applikasjon som tilbyr:

- End-to-End kryptering for alle meldinger
- Støtte for privat chat, gruppe chat og global chat
- Custom Emoji System med avansert søk og analytics
- Pin-funksjonalitet for viktige meldinger
- Integrert med Supabase og Cloudflare for sikkerhet og ytelse

## Pågående Restrukturering

Prosjektet gjennomgår for øyeblikket en omfattende restrukturering for å forbedre kodeorganisering, redusere duplisering og øke vedlikeholdbarheten. Se følgende filer for mer informasjon:

- [RESTRUCTURING-GUIDE.md](./RESTRUCTURING-GUIDE.md): Detaljert guide om restruktureringsarbeidet
- [RESTRUCTURING-STATUS.md](./RESTRUCTURING-STATUS.md): Gjeldende status for restrukturering
- [SNAKKAZ-MASTER-PROMPT.md](./SNAKKAZ-MASTER-PROMPT.md): Hovedprompt med prosjektdetaljer

### Ny Prosjektstruktur

Den nye standardiserte prosjektstrukturen organiserer koden i følgende hovedmapper:

```
/workspaces/snakkaz-chat/
├── docs/              # All dokumentasjon samlet i én mappe
├── scripts/           # Alle shell scripts og verktøy
├── src/               # Applikasjonskildekode
│   ├── assets/        # Statiske ressurser
│   ├── components/    # React-komponenter (UI)
│   ├── features/      # Feature-moduler med egen struktur
│   ├── hooks/         # React hooks
│   ├── integrations/  # Tredjepartsintegrasjoner
│   ├── pages/         # React Router-sider
│   └── utils/         # Utility-funksjoner
└── bin/               # Symlinks til ofte brukte scripts
```

## Teknologier

- **Frontend**: React, TypeScript, Vite
- **UI**: Shadcn UI komponenter
- **Backend**: Supabase (authentication, database, storage, realtime)
- **Security**: E2EE, Cloudflare for CDN og sikkerhet

## Utvikling

### Oppsett av utviklingsmiljø

```bash
# Klon repositoriet
git clone https://github.com/yourusername/snakkaz-chat.git
cd snakkaz-chat

# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev
```

### Kjøre med lokalt Supabase-miljø

```bash
# Initialisere Supabase-prosjekt (første gang)
npm run supabase:setup

# Starte lokal Supabase-instans
npm run supabase:start

# Kjøre applikasjon med lokal Supabase
npm run dev:with-supabase
```

## Deployment

Se [docs/deployment/](./docs/deployment/) for detaljert informasjon om deployment-prosessen.

## Dokumentasjon

All prosjektdokumentasjon er tilgjengelig i [docs/](./docs/) mappen, organisert etter kategorier:

- [Architecture](./docs/architecture/): Systemarkitektur og design
- [Deployment](./docs/deployment/): Deployment-veiledninger
- [Features](./docs/features/): Feature-spesifikk dokumentasjon
- [Troubleshooting](./docs/troubleshooting/): Feilsøkingsguider

## Kontakt

For spørsmål eller henvendelser om Snakkaz Chat, vennligst kontakt [kontakt@snakkaz.com](mailto:kontakt@snakkaz.com).
