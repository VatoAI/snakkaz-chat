# Snakkaz Chat - cPanel Deployment Guide

## Gjeldende situasjon (Oppdatert 27. juni 2025, 14:42)
✅ snakkaz-dist-latest.zip (12.55 MB) er lastet opp til server root
✅ PostCSS/autoprefixer problemer er løst
✅ Build fungerer perfekt (vite build: 10.29s)
⚠️ Filen må ekstrakteres manuelt for at nettsiden skal fungere korrekt

## Siste endringer:
- ✅ Fikset `autoprefixer` dependency problem
- ✅ Bygget prosjektet uten feil (alle 29 moduler)
- ✅ Lastet opp ny ZIP-fil med fikser
- ⚠️ React runtime error må fortsatt løses

## Trinn-for-trinn instruksjoner:

### 1. Ekstraher ZIP-filen i cPanel

1. **Gå til cPanel File Manager** (du er allerede der)
2. **Naviger til root directory** (du ser snakkaz-dist-latest.zip)
3. **Høyreklikk på snakkaz-dist-latest.zip**
4. **Velg "Extract"**
5. **Bekreft at destinasjonen er root directory**
6. **Klikk "Extract Files"**
7. **Vent til ekstraksjon er ferdig**

### 2. Verifiser at filene er ekstraktert
Du bør se disse nye filene/mappene:
- `index.html` (oppdatert versjon)
- `assets/` (mappe med CSS og JS filer)
- `images/` (bilder)
- `icons/` (ikoner)
- `manifest.json`
- `service-worker.js`
- og flere...

### 3. Slett ZIP-filen

- **Høyreklikk på snakkaz-dist-latest.zip**
- **Velg "Delete"**
- **Bekreft sletting**

### 4. Rydd opp gamle filer (valgfritt)
Du kan også slette disse gamle filene:
- `snakkaz-emergency-upload.zip`
- `snakkaz-rebuild-v2.zip`
- Eventuelle andre gamle ZIP-filer

### 5. Test nettsiden
- **Gå til https://snakkaz.com**
- **Verifiser at siden lastes korrekt**
- **Test chat-funksjonalitet**
- **Sjekk at alle sider fungerer**

## Hvis noe går galt:
1. Sørg for at `index.html` eksisterer i public_html
2. Sjekk at `assets/` mappen inneholder filer
3. Verifiser at alle filer har riktige tillatelser (644 for filer, 755 for mapper)

## Fremtidige deployments:
Bruk kommandoen: `./snakkaz deploy` fra utviklingsmiljøet
- Dette vil bygge, laste opp og gi instruksjoner for ekstraksjon

## Nyttige kommandoer:
- `./snakkaz check` - Sjekk deployment-status
- `./snakkaz cleanup` - Rydd opp gamle filer
- `./snakkaz extract` - Vis ekstraksjons-instruksjoner
