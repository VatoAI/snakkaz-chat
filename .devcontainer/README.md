# VS Code Dev Container Configuration

Denne mappen inneholder konfigurasjon for VS Code Dev Containers / GitHub Codespaces.

## Hva gjør denne konfigurasjonen?

`.devcontainer/devcontainer.json` bestemmer hvordan utviklingsmiljøet ditt starter opp i Codespaces. 
Den viktigste innstillingen er at kontaineren alltid vil starte i prosjektets rot-katalog:

```json
"workspaceFolder": "/workspaces/snakkaz-chat"
```

## Hvordan bruke dette

Når du åpner prosjektet i GitHub Codespaces, vil denne konfigurasjonen brukes automatisk.
Terminalen vil alltid starte i `/workspaces/snakkaz-chat`, ikke i undermapper.

## Manuell navigering

Hvis du av en eller annen grunn havner i en undermappe, kan du alltid navigere tilbake til roten med:

```bash
cd /workspaces/snakkaz-chat
```

## Utvidelser

Konfigurasjonen installerer automatisk disse utvidelsene:
- ESLint
- Prettier
- GitHub Copilot
