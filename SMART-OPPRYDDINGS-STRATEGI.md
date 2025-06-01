# SMART OPPRYDDINGS-STRATEGI
*Juni 1, 2025*

## EKSISTERENDE ORGANISASJONSSTRUKTUR (FUNNET)

### ✅ ALLEREDE ORGANISERTE MAPPER
1. **`.archive/`** - Systemarkiv med undermapper:
   - `backups/` - Backup filer
   - `docs/` - Arkiverte dokumenter  
   - `scripts/` - Gamle scripts
   - `temp-files/` - Temporære filer

2. **`arkiv/`** - Norsk arkiv med:
   - `potensielt-overflødige-docs/` - Allerede identifiserte overflødige dokumenter

3. **`backup/`** - Strukturerte backups:
   - `cloudflare-files/` - Cloudflare relaterte filer
   - `runtime-fix-20250519/` - Runtime fixes
   - `react-init-fix-20250522/` - React fixes
   - Flere daterte fix-mapper

4. **`docs/`** - Velorganiserte dokumenter:
   - `architecture/` - Arkitekturdokumenter (inkl. SNAKKAZ-MASTER-PROMPT.md)
   - `api/` - API dokumentasjon
   - `deployment/` - Deployment guides
   - `troubleshooting/` - Feilsøking
   - `Security/` - Sikkerhetsdokumenter

## REVIDERT STRATEGI

### FASE 1: ✅ FULLFØRT
- Auth-komponenter opprydding: 12 duplikater slettet
- Bevarte CAPTCHA-integrerte komponenter

### FASE 2: SMART DOKUMENTASJONSOPPRYDDING
**STRATEGI**: Bruk eksisterende `arkiv/potensielt-overflødige-docs/` og flytt filer dit først

#### 2A: IDENTIFISER OVERFLØDIGE I ROTMAPPEN
Rotmappen har 100+ markdown filer som bør vurderes for flytting til arkiv:

**POTENSIELT OVERFLØDIGE** (flytt til arkiv først):
- `CLEANUP-RAPPORT-MAI25-2025.md` (vi har nyere)
- `CLEANUP-SUCCESS-FINAL.md` (vi har nyere)
- `COMPREHENSIVE-CLEANUP-PLAN.md` (vi lager ny plan)
- Multiple emoji dokumenter som overlapper
- Gamle deployment rapporter (behold kun de nyeste)
- Gamle status rapporter fra mai (behold kun kritiske)

**KRITISKE SOM SKAL FORBLI I ROTMAPPEN**:
- `README.md` 
- `README-UPDATED.md`
- `CAPTCHA-IMPLEMENTATION.md`
- `CAPTCHA-INTEGRATION-COMPLETE.md`
- `FINAL-STATUS-REPORT-MAY28-2025.md` (nyeste)
- `DEPLOYMENT-SUMMARY-MAY28-2025.md` (nyeste)
- `PROSJEKT-OPPRYDDING-ANALYSE.md` (vår analyse)
- `VIKTIGE-DOKUMENTER-ANALYSE.md` (sikkerhetsliste)

#### 2B: ORGANISERE docs/ MAPPEN
- Sørg for at `docs/architecture/SNAKKAZ-MASTER-PROMPT.md` er beskyttet
- Organiser loose markdown filer i docs/ til riktige undermapper

### FASE 3: SCRIPT OG BUILD OPPRYDDING
- Flytt gamle scripts til `.archive/scripts/`
- Fjern duplikate build og deploy scripts
- Behold kun aktive scripts

### FASE 4: TEMP OG BUILD ARTIFACTS
- Flytt til `.archive/temp-files/`
- Slett kun hvis vi er sikre på at de er overflødige

## TRYGG TILNÆRMING
1. **FLYTT FØRST** - aldri slett direkte
2. **BRUK EKSISTERENDE ARKIV-STRUKTUR**
3. **TEST ETTER HVER FASE**
4. **COMMIT ETTER HVER FASE**

## KRITISKE BESKYTTEDE DOKUMENTER
Disse skal ALDRI flyttes eller slettes:
- `docs/architecture/SNAKKAZ-MASTER-PROMPT.md` ⚠️ KRITISK
- Alle CAPTCHA dokumenter
- Nyeste deployment og status rapporter
- Database migrasjoner og fixes
- README filer

---
*Denne strategien respekterer eksisterende organisasjon og bruker trygg "flytt først" tilnærming*
