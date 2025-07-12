#!/bin/bash
# 🚀 SNAKKAZ CHAT - SYSTEMATIC CLEANUP SCRIPT
# Systematisk cleanup og organisering av workspace

echo "🚀 SNAKKAZ CHAT - STARTER SYSTEMATIC CLEANUP..."
echo "==============================================="

# Opprett cleanup directories hvis de ikke eksisterer
echo "📁 Oppretter organisasjonsstruktur..."

mkdir -p /workspaces/snakkaz-chat/archive/deployment-scripts
mkdir -p /workspaces/snakkaz-chat/archive/emergency-files  
mkdir -p /workspaces/snakkaz-chat/archive/test-html
mkdir -p /workspaces/snakkaz-chat/docs/deployment
mkdir -p /workspaces/snakkaz-chat/docs/emergency-reports
mkdir -p /workspaces/snakkaz-chat/docs/system-analysis

echo "✅ Mapper opprettet!"

# 1. DEPLOYMENT SCRIPTS CLEANUP
echo ""
echo "🔧 FASE 1: Flytter deployment scripts..."

# Flytt alle .sh deployment scripts
find /workspaces/snakkaz-chat/ -maxdepth 1 -name "*deploy*.sh" -type f -exec mv {} /workspaces/snakkaz-chat/archive/deployment-scripts/ \;
find /workspaces/snakkaz-chat/ -maxdepth 1 -name "*upload*.sh" -type f -exec mv {} /workspaces/snakkaz-chat/archive/deployment-scripts/ \;
find /workspaces/snakkaz-chat/ -maxdepth 1 -name "*critical*.sh" -type f -exec mv {} /workspaces/snakkaz-chat/archive/deployment-scripts/ \;
find /workspaces/snakkaz-chat/ -maxdepth 1 -name "*emergency*.sh" -type f -exec mv {} /workspaces/snakkaz-chat/archive/deployment-scripts/ \;
find /workspaces/snakkaz-chat/ -maxdepth 1 -name "*cleanup*.sh" -type f -exec mv {} /workspaces/snakkaz-chat/archive/deployment-scripts/ \;

# Flytt alle .lftp scripts
find /workspaces/snakkaz-chat/ -maxdepth 1 -name "*.lftp" -type f -exec mv {} /workspaces/snakkaz-chat/archive/deployment-scripts/ \;

echo "✅ Deployment scripts flyttet til archive/deployment-scripts/"

# 2. HTML TEST FILES CLEANUP  
echo ""
echo "🗑️ FASE 2: Arkiverer test HTML filer..."

find /workspaces/snakkaz-chat/ -maxdepth 1 -name "*.html" -not -name "index.html" -type f -exec mv {} /workspaces/snakkaz-chat/archive/test-html/ \;

echo "✅ Test HTML filer arkivert!"

# 3. DOCUMENTATION ORGANIZATION
echo ""
echo "📝 FASE 3: Organiserer dokumentasjon..."

# Flytt emergency/deployment rapporter
mv /workspaces/snakkaz-chat/EMERGENCY-*.md /workspaces/snakkaz-chat/docs/emergency-reports/ 2>/dev/null || echo "Ingen emergency MD filer funnet"
mv /workspaces/snakkaz-chat/DEPLOYMENT-*.md /workspaces/snakkaz-chat/docs/deployment/ 2>/dev/null || echo "Ingen deployment MD filer funnet"  
mv /workspaces/snakkaz-chat/CRITICAL-*.md /workspaces/snakkaz-chat/docs/emergency-reports/ 2>/dev/null || echo "Ingen critical MD filer funnet"

# Flytt system documentation
mv /workspaces/snakkaz-chat/SNAKKAZ-COMPLETE-SYSTEM-ANALYSIS-2025.md /workspaces/snakkaz-chat/docs/system-analysis/ 2>/dev/null || echo "System analysis allerede på riktig sted"
mv /workspaces/snakkaz-chat/SNAKKAZ-SYSTEM-OVERVIEW.md /workspaces/snakkaz-chat/docs/system-analysis/ 2>/dev/null || echo "System overview flyttet"
mv /workspaces/snakkaz-chat/SNAKKAZ-MASTER-CLEANUP-PLAN.md /workspaces/snakkaz-chat/docs/system-analysis/ 2>/dev/null || echo "Master cleanup plan flyttet"

echo "✅ Dokumentasjon organisert!"

# 4. ROOT DIRECTORY CLEANUP STATUS
echo ""
echo "📊 FASE 4: Analyserer root directory etter cleanup..."

echo ""
echo "🗂️ GJENSTÅENDE FILER I ROOT:"
ls -la /workspaces/snakkaz-chat/ | grep -E "^-" | wc -l
echo "📁 GJENSTÅENDE MAPPER I ROOT:"  
ls -la /workspaces/snakkaz-chat/ | grep -E "^d" | wc -l

echo ""
echo "🎯 TOP 10 FILER I ROOT ETTER CLEANUP:"
ls -la /workspaces/snakkaz-chat/ | grep -E "^-" | head -10

echo ""
echo "✅ SYSTEMATIC CLEANUP FULLFØRT!"
echo "==============================================="
echo "📋 NESTE STEG:"
echo "1. Review arkiverte filer i archive/"
echo "2. Sjekk docs/ organisering"  
echo "3. Fortsett med kode cleanup i src/"
echo "4. Test at applikasjonen fortsatt fungerer"

echo ""
echo "🚀 SnakkaZ Chat er nå mer organisert! 🎊"
