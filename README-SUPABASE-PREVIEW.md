# Supabase Preview for Snakkaz Chat

Dette dokumentet gir informasjon om hvordan man bruker Supabase preview-miljøer for lokal utvikling og testing.

## Lokal utvikling med Supabase

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

## Preview-miljøer for Pull Requests

Når en pull request opprettes mot main-branch, vil GitHub Actions automatisk opprette en Supabase preview-branch. Dette gir et isolert testmiljø spesifikt for den pull requesten.

### Hvordan bruke Preview-miljøer:

1. Opprett en pull request mot main-branch
2. GitHub Actions vil opprette en Supabase preview-branch
3. En kommentar på pull requesten vil inneholde instruksjoner for hvordan man kobler til preview-miljøet
4. Når pull requesten lukkes, vil preview-branchen slettes automatisk

### Manuell oppsett av Preview:

```bash
# Link til eksisterende Supabase-prosjekt
./supabase-preview.sh link
# Følg instruksjonene og skriv inn prosjekt-referansen når du blir bedt om det

# Kjør applikasjonen med miljøvariabel for branch
SUPABASE_BRANCH=branch-navn npm run dev
```

### Administrere databaseskjema:

```bash
# Hente skjema fra remote prosjekt
./supabase-preview.sh db-pull

# Dytte lokale endringer til remote prosjekt
./supabase-preview.sh db-push

# Tilbakestille lokal database (sletter data!)
./supabase-preview.sh db-reset
```

## Nødvendige GitHub Secrets

For at Supabase preview-workflowen skal fungere ordentlig, må følgende secrets være satt i GitHub-repositoriet:

- `SUPABASE_ACCESS_TOKEN`: Din Supabase-tilgangstoken
- `SUPABASE_PROJECT_ID`: Din Supabase-prosjekt-ID

Du kan finne disse i Supabase-dashbordet ditt.

## Feilsøking

Hvis du støter på problemer med Supabase preview:

1. Sørg for at Docker kjører (nødvendig for lokal Supabase)
2. Sjekk at alle nødvendige GitHub-secrets er konfigurert
3. Verifiser at Supabase CLI er kjørbar (`chmod +x supabase`)
4. Prøv å kjøre `./supabase-preview.sh status` for å sjekke nåværende tilstand

For mer hjelp, se [Supabase CLI-dokumentasjonen](https://supabase.com/docs/reference/cli).
