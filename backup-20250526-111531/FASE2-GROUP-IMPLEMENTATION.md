# FASE 2 GRUPPECHAT IMPLEMENTASJONSPLAN

Dette dokumentet beskriver implementasjonsplanen og kodeendringer som trengs for FASE 2 av Snakkaz Chat-prosjektet med fokus på gruppechat-admininstrasjon.

## Analyse av eksisterende kode

Etter å ha gjennomgått koden, har jeg funnet følgende struktur:

1. **GroupChatView.tsx** - Hovedkomponent for gruppechat 
2. **Mangler** - GroupSettingsPanel og GroupInvitePanel
3. **Typer** - Definert i flere filer, inkludert:
   - /src/types/group.ts
   - /src/features/groups/types/group.ts
   - /src/services/api/groupChatService.ts

## Implementasjonsplan

### Steg 1: Opprette nye komponenter
- [x] GroupSettingsPanel.tsx - For å håndtere gruppeinnstillinger
- [x] GroupInvitePanel.tsx - For å håndtere gruppeinvitasjoner

### Steg 2: Integrere med GroupChatView
- [ ] Oppdatere GroupChatView.tsx til å inkludere de nye komponentene
- [ ] Legge til tilstandshåndtering for å vise/skjule paneler
- [ ] Implementere autorisasjonskontroll basert på brukerroller

### Steg 3: Database-oppdateringer
- [ ] Opprette database-migrering for nye kolonner i gruppetabeller
- [ ] Legge til støtte for gruppetillatelser og roller

### Steg 4: Testing
- [ ] Følge GROUP-SETTINGS-TESTING-CHECKLIST.md for å validere funksjonalitet

## Tekniske utfordringer å løse

1. **TypeScript-kompatibilitet** - Få nye komponenter til å jobbe med eksisterende typer
2. **Tillatelseshåndtering** - Implementere rollekontroller for gruppetillatelser
3. **Supabase-integrering** - Sikre at databaseoperasjoner er optimalisert

## Kodeendringer for integrasjon

Det kreves endringer i følgende filer:

1. GroupChatView.tsx - Legge til:
   ```tsx
   const [showSettingsPanel, setShowSettingsPanel] = useState(false);
   const [showInvitePanel, setShowInvitePanel] = useState(false);
   ```

2. Supabase database - Legge til:
   ```sql
   ALTER TABLE group_members ADD COLUMN IF NOT EXISTS permissions TEXT[];
   ALTER TABLE group_settings ADD COLUMN IF NOT EXISTS allow_member_invites BOOLEAN DEFAULT false;
   ```

3. Oppdatere kontekstmenyer i grensesnittet med nye handlinger

## Fremtidige utvidelser

1. Avansert tillatelsessystem
2. Gruppestatistikk og analyser
3. Automatisk moderering for grupper

Dette dokumentet vil bli oppdatert underveis som implementasjonen fortsetter.
