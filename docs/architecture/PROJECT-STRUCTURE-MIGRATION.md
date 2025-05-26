# Migrasjonsplan for Ny Standardisert Prosjektstruktur

## Oversikt
Dette dokumentet beskriver stegene for å migrere Snakkaz Chat prosjektet fra den nåværende strukturen til den nye standardiserte strukturen definert i SNAKKAZ-MASTER-PROMPT.md.

## Mål
1. Redusere filroduplisering
2. Organisere kode basert på funksjonsområder (features)
3. Forbedre vedlikeholdbarheten av prosjektet
4. Implementere en konsistent struktur på tvers av hele prosjektet

## Pre-migrasjonsfase
1. Ta en fullstendig backup av prosjektet
2. Opprett nye hovedmapper som definert i strukturplanen
3. Analyser avhengigheter for å unngå uventede problemer

## Migrasjonsplan i faser

### Fase 1: Dokumentasjon og Scripts
- Prioritet: **Høy**
- Risiko: **Lav** (Minimal risiko for å påvirke funksjonalitet)

1. **Opprett dokumentasjonsmapper**:
   ```bash
   mkdir -p docs/{architecture,deployment,features,troubleshooting,development}
   ```

2. **Flytt alle MD-filer til relevante mapper**:
   ```bash
   # Dokumentasjon for features
   mv CUSTOM-EMOJI-SYSTEM-DOCUMENTATION.md docs/features/
   mv EMOJI-ANALYTICS-DOCUMENTATION.md docs/features/
   mv EMOJI-SYSTEM-ENHANCEMENT-SUMMARY.md docs/features/
   
   # Deployment-dokumentasjon
   mv SNAKKAZ-DEPLOYMENT-ACTION-PLAN.md docs/deployment/
   mv DEPLOYMENT-FIX-STATUS.md docs/deployment/
   mv DEPLOYMENT-FIX-MAY24-2025.md docs/deployment/
   
   # Arkitekturdokumentasjon
   mv SNAKKAZ-MASTER-PROMPT.md docs/architecture/
   cp docs/architecture/SNAKKAZ-MASTER-PROMPT.md SNAKKAZ-MASTER-PROMPT.md  # Behold kopi i rot
   ```

3. **Flytt scripts til scripts-mappen**:
   ```bash
   mkdir -p scripts/{deployment,migration,verification,development}
   
   # Deployment scripts
   mv deploy-to-production.sh scripts/deployment/
   mv check-deployment.js scripts/verification/
   
   # Migrasjonsscripts
   mv apply-custom-emojis-migration.sh scripts/migration/
   mv apply-emoji-analytics-migration.sh scripts/migration/
   mv apply-emoji-pack-migration.sh scripts/migration/
   mv apply-fase2-migration.sh scripts/migration/
   
   # Verifikasjonsscripts
   mv verify-emoji-deployment.sh scripts/verification/
   mv verify-emoji-system.sh scripts/verification/
   mv verify-react-router-fixes.sh scripts/verification/
   ```

### Fase 2: Reorganisering av src-mappen
- Prioritet: **Medium**
- Risiko: **Medium** (Kan påvirke importstier)

1. **Organiser feature-baserte komponenter**:
   ```bash
   # Opprette feature-mapper
   mkdir -p src/features/{auth,chat,emoji,groups}
   mkdir -p src/features/{auth,chat,emoji,groups}/{components,hooks,services,utils}
   touch src/features/{auth,chat,emoji,groups}/types.ts
   touch src/features/{auth,chat,emoji,groups}/index.ts
   ```

2. **Flytt emoji-relaterte filer til features-struktur**:
   ```bash
   # Flytt komponenter
   mv src/components/emoji/EmojiSearch.tsx src/features/emoji/components/
   mv src/components/emoji/EmojiAnalytics.tsx src/features/emoji/components/
   mv src/components/emoji/EmojiPackBrowser.tsx src/features/emoji/components/
   mv src/components/emoji/CustomEmojiManager.tsx src/features/emoji/components/
   mv src/components/emoji/CustomEmojiUploader.tsx src/features/emoji/components/
   
   # Flytt utils
   mv src/utils/emojiSearchUtils.ts src/features/emoji/utils/
   mv src/utils/emojiAnalyticsUtils.ts src/features/emoji/utils/
   mv src/utils/emojiPackUtils.ts src/features/emoji/utils/
   mv src/utils/customEmojiUtils.ts src/features/emoji/utils/
   
   # Eksporter komponentene i index.ts
   echo "export * from './components/EmojiSearch';" >> src/features/emoji/index.ts
   echo "export * from './components/EmojiAnalytics';" >> src/features/emoji/index.ts
   echo "export * from './components/EmojiPackBrowser';" >> src/features/emoji/index.ts
   echo "export * from './utils/emojiSearchUtils';" >> src/features/emoji/index.ts
   echo "export * from './utils/emojiAnalyticsUtils';" >> src/features/emoji/index.ts
   ```

3. **Reorganisere chat-relaterte komponenter**:
   ```bash
   # Konsolidere chat-komponenter
   mkdir -p src/features/chat/components/{global,private,group,messages,interface}
   
   # Flytt eksisterende filer
   mv src/components/chat/*.tsx src/features/chat/components/
   mv src/features/chat/components/ChatGlobal.tsx src/features/chat/components/global/
   mv src/features/chat/components/PrivateChats.tsx src/features/chat/components/private/
   mv src/features/chat/components/ChatMessageList.tsx src/features/chat/components/messages/
   mv src/features/chat/components/ChatInterface.tsx src/features/chat/components/interface/
   
   # Konsolider hooks
   mv src/hooks/chat/*.ts src/features/chat/hooks/
   ```

### Fase 3: Oppdatering av Importstier
- Prioritet: **Høy**
- Risiko: **Høy** (Kan forårsake kjøretids- og byggefeil)

1. **Automatisert oppdatering av importstier**:
   ```bash
   # Utvikle script for å oppdatere importstier
   echo '#!/bin/bash
   
   # Mønster for å oppdatere emoji-importer
   find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|import { .* } from '\''@/components/emoji/.*'\''|import { ... } from '\''@/features/emoji'\''|g"
   find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|import { .* } from '\''@/utils/emojiSearchUtils'\''|import { ... } from '\''@/features/emoji'\''|g"
   
   # Mønster for å oppdatere chat-importer
   find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|import { .* } from '\''@/components/chat/.*'\''|import { ... } from '\''@/features/chat'\''|g"
   ' > scripts/development/update-import-paths.sh
   
   chmod +x scripts/development/update-import-paths.sh
   ```

2. **Manuell oppdatering av importstier som gjenstår**:
   - Identifiser gjenværende feil med bygging etter at det automatiserte scriptet er kjørt
   - Oppdater importstier manuelt for spesialtilfeller

3. **Enhancers for VS Code**:
   - Konfigurer VS Code med tillegg for å gjøre det lettere å jobbe med importstier
   ```json
   {
     "typescript.preferences.importModuleSpecifier": "non-relative",
     "typescript.preferences.importModuleSpecifierEnding": "js"
   }
   ```

## Testing og Verifisering etter hver fase
1. Kjør applikasjonen lokalt for å sikre at alt fungerer
2. Kjør alle enhetstester
3. Kjør de relevante verifikasjonsscriptene

## Oppdatering av SNAKKAZ-MASTER-PROMPT.md
Oppdater master-prompten etter hver fase for å reflektere gjeldende status for migrasjonsarbeidet.

## Rulletilbakeplan
I tilfelle kritiske problemer oppstår, følg disse stegene for å rulle tilbake endringene:

1. Behold original backup av prosjektet
2. Hvis det er problemer med en spesifikk fase:
   ```bash
   # Eksempel for å rulle tilbake Fase 1
   git reset --hard HEAD~1  # Rulle tilbake siste commit
   git clean -fd  # Fjerner nye filer som ikke er sporet
   ```

3. For å rulle tilbake alle endringer og begynne på nytt:
   ```bash
   # Alternativ 1: Bruk git
   git reset --hard <commit-id-før-migrasjonen>
   
   # Alternativ 2: Gjenopprette fra backup
   rm -rf /workspaces/snakkaz-chat
   cp -r /path/to/backup/snakkaz-chat /workspaces/
   ```

## Følgende Steg etter Migrering
1. Oppdater CI/CD-pipelines for å reflektere den nye strukturen
2. Oppdater dokumentasjon med referanser til de nye stistrukturene
3. Ha en gjennomgang av prosjektet med teamet for å sikre forståelse av den nye strukturen
