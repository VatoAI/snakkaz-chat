#!/bin/bash

# 🧹 SNAKKAZ CHAT SYSTEMATIC CLEANUP SCRIPT
# Dato: 23. mai 2025
# Formål: Systematisk og sikker opprydding av snakkaz-chat prosjektet

set -e  # Stop on any error

echo "🧹 SNAKKAZ CHAT OPPRYDDING STARTER..."
echo "======================================"

# Sjekk at vi er i riktig mappe
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ FEIL: Kjør dette scriptet fra snakkaz-chat root mappa!"
    exit 1
fi

# FASE 1: SIKKERHET OG BACKUP
echo "📦 FASE 1: Lager sikkerhetskopi..."

# Sjekk git status
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Du har uncommited endringer. Commiter først?"
    read -p "Fortsett likevel? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Avbrutt. Commit endringene først."
        exit 1
    fi
fi

# Lag git tag som backup
git tag -a "backup-pre-cleanup-$(date +%Y%m%d)" -m "Backup før systematisk opprydding $(date)"
echo "✅ Git backup tag opprettet"

# FASE 2: OPPRETT NYE MAPPER
echo "📁 FASE 2: Oppretter nye mappestruktur..."

# Opprett organiserte mapper
mkdir -p docs/{deployment,troubleshooting,api,guides,archive}
mkdir -p scripts/{deployment,build,testing,utils,archive}
mkdir -p config
mkdir -p .archive/{scripts,docs,temp-files,backups}

echo "✅ Nye mapper opprettet"

# FASE 3: FLYTT DOKUMENTASJON
echo "📚 FASE 3: Organiserer dokumentasjon..."

# Flytt deployment docs
mv DEPLOYMENT-*.md docs/deployment/ 2>/dev/null || true
mv *DEPLOY*.md docs/deployment/ 2>/dev/null || true

# Flytt troubleshooting docs  
mv TROUBLESHOOTING-*.md docs/troubleshooting/ 2>/dev/null || true
mv *FEILSØKING*.md docs/troubleshooting/ 2>/dev/null || true
mv BUGFIXES-*.md docs/troubleshooting/ 2>/dev/null || true

# Flytt API docs
mv CPANEL-API-*.md docs/api/ 2>/dev/null || true
mv SUPABASE-*.md docs/api/ 2>/dev/null || true

# Flytt guider
mv GUIDE-*.md docs/guides/ 2>/dev/null || true
mv *GUIDE*.md docs/guides/ 2>/dev/null || true

echo "✅ Dokumentasjon organisert"

# FASE 4: FLYTT SCRIPTS
echo "⚙️ FASE 4: Organiserer scripts..."

# Flytt deployment scripts
mv deploy-*.sh scripts/deployment/ 2>/dev/null || true
mv upload-*.sh scripts/deployment/ 2>/dev/null || true
mv setup-*.sh scripts/deployment/ 2>/dev/null || true

# Flytt build scripts
mv build-*.sh scripts/build/ 2>/dev/null || true
mv fix-build-*.sh scripts/build/ 2>/dev/null || true

# Flytt test scripts
mv test-*.sh scripts/testing/ 2>/dev/null || true
mv verify-*.sh scripts/testing/ 2>/dev/null || true

# Flytt utility scripts
mv analyze-*.sh scripts/utils/ 2>/dev/null || true
mv check-*.sh scripts/utils/ 2>/dev/null || true
mv diagnose-*.sh scripts/utils/ 2>/dev/null || true

echo "✅ Scripts organisert"

# FASE 5: FLYTT KONFIGURASJONSFILER
echo "⚙️ FASE 5: Organiserer konfigurasjon..."

# Flytt env filer til config (behold kopier i root for funksjinalitet)
cp .env* config/ 2>/dev/null || true

# Flytt htaccess relaterte filer
mv *.htaccess config/ 2>/dev/null || true
mv *htaccess*.txt config/ 2>/dev/null || true

echo "✅ Konfigurasjon organisert"

# FASE 6: ARKIVER GAMLE FILER
echo "🗂️ FASE 6: Arkiverer gamle filer..."

# Arkiver zip filer
mv *.zip .archive/backups/ 2>/dev/null || true

# Arkiver backup filer
mv *.bak .archive/backups/ 2>/dev/null || true

# Arkiver temp tekstfiler
mv *_content.txt .archive/temp-files/ 2>/dev/null || true
mv *test*.txt .archive/temp-files/ 2>/dev/null || true
mv large-images.txt .archive/temp-files/ 2>/dev/null || true
mv serverfiles.txt .archive/temp-files/ 2>/dev/null || true

# Arkiver gamle temp mapper
mv security_scan_* .archive/temp-files/ 2>/dev/null || true
mv performance_results_* .archive/temp-files/ 2>/dev/null || true
mv temp_* .archive/temp-files/ 2>/dev/null || true

echo "✅ Gamle filer arkivert"

# FASE 7: ARKIVER DUPLIKAT SCRIPTS
echo "🔄 FASE 7: Arkiverer duplikat scripts..."

# Arkiver fix scripts som er duplikater
mv fix-*-v2.sh .archive/scripts/ 2>/dev/null || true
mv fix-*-final.sh .archive/scripts/ 2>/dev/null || true
mv fix-*-comprehensive.sh .archive/scripts/ 2>/dev/null || true
mv quick-fix-*.sh .archive/scripts/ 2>/dev/null || true
mv all-in-one-*.sh .archive/scripts/ 2>/dev/null || true

# Arkiver gamle scripts som ikke flyttes til scripts/
mv *.sh .archive/scripts/ 2>/dev/null || true

echo "✅ Duplikat scripts arkivert"

# FASE 8: RYDD I DIST MAPPER
echo "🏗️ FASE 8: Rydder build output..."

# Fjern gamle build outputs (kan regenereres)
rm -rf dist-analyze/ 2>/dev/null || true

echo "✅ Build output ryddet"

# FASE 9: OPPDATER GITIGNORE
echo "📝 FASE 9: Oppdaterer .gitignore..."

# Legg til arkiv mapper i gitignore
cat >> .gitignore << 'EOF'

# Arkiv mapper (auto-generert av cleanup script)
.archive/
*.bak
*.tmp
*_temp/
security_scan_*/
performance_results_*/
EOF

echo "✅ .gitignore oppdatert"

# FASE 10: VALIDERING
echo "🔍 FASE 10: Validerer opprydding..."

# Test at appen fortsatt kan bygges
echo "Testing npm build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build test OK"
else
    echo "⚠️  Build test feilet - sjekk konfigurasjon"
fi

# Tell antall filer før og etter
TOTAL_FILES=$(find . -type f | wc -l)
ARCHIVED_FILES=$(find .archive -type f 2>/dev/null | wc -l || echo "0")

echo ""
echo "🎉 OPPRYDDING FULLFØRT!"
echo "======================"
echo "📊 Totalt filer nå: $TOTAL_FILES"
echo "🗂️ Filer arkivert: $ARCHIVED_FILES"
echo "📁 Nye mapper: docs/, scripts/, config/, .archive/"
echo ""
echo "✅ GEVINSTER:"
echo "   • Ryddigere mappestruktur"
echo "   • Lettere navigering" 
echo "   • Raskere søk"
echo "   • Bedre vedlikehold"
echo ""
echo "📋 NESTE STEG:"
echo "   1. Sjekk at alt fungerer: npm run dev"
echo "   2. Commit endringene: git add . && git commit -m 'Systematic cleanup'"
echo "   3. Les OPPRYDDINGS-ANALYSE.md for detaljer"
echo ""
echo "⚠️  HVIS NOE GIKK GALT:"
echo "   • Gå tilbake: git reset --hard backup-pre-cleanup-$(date +%Y%m%d)"
echo "   • Eller finn filer i .archive/ mappene"
