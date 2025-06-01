# SNAKKAZ STRUKTUR-REORGANISERING 
*Juni 1, 2025 - Komplett Oppryddingsplan*

## 🚨 NÅVÆRENDE KAOS-TILSTAND

### STATISTIKK:
- **Totalt**: 75,284 filer (66,918 er node_modules)
- **Faktiske prosjektfiler**: 2,655 filer  
- **Filer i rotmappen**: 212 filer (!!!)
- **Markdown dokumenter**: 280 filer spredt overalt
- **Script-filer i rot**: 87 stk

### HOVEDPROBLEMER:
1. **212 filer i rotmappen** - ingen struktur
2. **280 markdown filer** spredt overalt  
3. **87 script-filer** uten organisering
4. **Backup/temp filer** blandet med aktive filer
5. **Ingen klar separation** mellom prod/dev/docs/scripts

---

## 🎯 MÅL: MODERNE, REN STRUKTUR

### ØNSKET SLUTTRESULTAT:
```
/workspaces/snakkaz-chat/
├── 🎯 KJERNEAPP (kun det som trengs for utvikling)
│   ├── src/                 # Kjerneapplikasjon (1005 filer)
│   ├── public/              # Statiske assets
│   ├── docs/                # Organisert dokumentasjon
│   ├── scripts/             # Aktive scripts
│   ├── config/              # Konfigurasjonsfiler
│   └── tests/               # Test-filer
│
├── 📚 ORGANISERT DOKUMENTASJON
│   ├── docs/
│   │   ├── architecture/    # System arkitektur
│   │   ├── api/            # API dokumentasjon
│   │   ├── deployment/     # Deployment guides
│   │   ├── development/    # Utviklingsguider
│   │   └── features/       # Feature dokumentasjon
│
├── 🗄️ ARKIV (gammel/overflødige filer)
│   ├── .archive/
│   │   ├── old-docs/       # Gamle dokumenter
│   │   ├── old-scripts/    # Gamle scripts
│   │   ├── backups/        # Backup filer
│   │   └── temp/           # Temporære filer
│
└── 📦 STANDARD (behold som er)
    ├── node_modules/        # Dependencies
    ├── dist/               # Build output
    └── .git/               # Git historie
```

---

## 📋 SYSTEMATISK PLAN

### FASE 1: BACKUP & SIKKERHET ✅
- [x] Git commit av nåværende tilstand
- [x] Analysedokument opprettet

### FASE 2: DOKUMENTASJONSOPPRYDDING 🔄
- [x] Arkivert 21 overflødige dokumenter
- [ ] Flytt dokumenter til riktige docs/ undermapper
- [ ] Slette/arkivere resterende 259 spredte .md filer

### FASE 3: SCRIPT-REORGANISERING
**Mål**: Fra 87 scripts i rot til organiserte mapper
- [ ] Opprett `scripts/` struktur:
  - `scripts/deployment/` - Deploy scripts
  - `scripts/database/` - DB scripts  
  - `scripts/testing/` - Test scripts
  - `scripts/maintenance/` - Vedlikehold
- [ ] Flytt alle .sh/.js filer til riktige undermapper
- [ ] Arkiver gamle/unused scripts

### FASE 4: ROTMAPPE-OPPRYDDING  
**Mål**: Fra 212 filer til <20 essensielle filer
- [ ] Behold kun essensielle filer i rot:
  - `package.json`, `package-lock.json`
  - `README.md` (hovedfil)
  - `tsconfig.json`, `vite.config.ts`
  - `.env` filer
  - `components.json`
- [ ] Flytt resten til riktige mapper

### FASE 5: CONFIG-REORGANISERING
- [ ] Opprett `config/` mappe for:
  - Database konfig
  - Security konfig  
  - API konfig
  - Deployment konfig

### FASE 6: TEST-REORGANISERING
- [ ] Samle alle test-filer i `tests/`
- [ ] Organiser etter type (unit, integration, e2e)

### FASE 7: FINAL CLEANUP
- [ ] Verifiser at app fungerer
- [ ] Oppdater import paths om nødvendig
- [ ] Opprett ny dokumentasjonsindex
- [ ] Git commit av ren struktur

---

## 🎯 FORVENTET RESULTAT

### FRA:
- 2,655 spredte filer uten struktur
- 212 filer i rotmappen
- Ingen klar organisering

### TIL:
- ~300 kjerneappfiler i riktige mapper
- ~20 essensielle filer i rot
- Klar separation av concerns
- Full oversikt over alt

### GEVINSTER:
1. **Utvikleropplevelse**: Lett å finne filer
2. **Vedlikehold**: Enkel å holde orden
3. **Nye utviklere**: Rask onboarding
4. **Deploy**: Klare skiller mellom prod/dev
5. **Dokumentasjon**: Organisert og findbar

---

*Denne planen vil transformere Snakkaz fra kaos til en moderne, vedlikeholdbar applikasjon med krystallklar struktur.*
