# 🧹 SNAKKAZ WORKSPACE CLEANUP SCRIPT
# Systematisk organisering av workspace

echo "🚀 SNAKKAZ WORKSPACE CLEANUP STARTER..."

# 1. SIKKER CLEANUP - ARKIVERE FØRST
echo "📦 Lager backup av kritiske filer..."
mkdir -p cleanup-backup-$(date +%Y%m%d)

# 2. FLYTTE GAMLE ZIP-FILER
echo "🗂️ Organiserer gamle deployment pakker..."
mkdir -p archive/old-deployment-packages
mv snakkaz-*.zip archive/old-deployment-packages/ 2>/dev/null || echo "Ingen zip filer å flytte"
mv chunk*.zip archive/old-deployment-packages/ 2>/dev/null || echo "Ingen chunk filer å flytte"

# 3. ORGANISERE DEPLOYMENT SCRIPTS
echo "📋 Organiserer deployment scripts..."
mkdir -p deployment-scripts
mv deploy-*.sh deployment-scripts/ 2>/dev/null || echo "Ingen deploy scripts å flytte"
mv emergency-*.sh deployment-scripts/ 2>/dev/null || echo "Ingen emergency scripts å flytte"
mv *deploy*.lftp deployment-scripts/ 2>/dev/null || echo "Ingen lftp scripts å flytte"

# 4. ORGANISERE DOKUMENTASJON
echo "📚 Organiserer dokumentasjon..."
mkdir -p docs/beta-launch
mv BETA-*.md docs/beta-launch/ 2>/dev/null || echo "Ingen beta docs å flytte"
mv *LAUNCH*.md docs/beta-launch/ 2>/dev/null || echo "Ingen launch docs å flytte"

# 5. ORGANISERE EMERGENCY FIXES
echo "🔧 Organiserer emergency fixes..."
mkdir -p emergency-fixes
mv emergency-*.js emergency-fixes/ 2>/dev/null || echo "Ingen emergency js å flytte"
mv *fix*.js emergency-fixes/ 2>/dev/null || echo "Ingen fix files å flytte"

# 6. ORGANISERE TESTING FILER
echo "🧪 Organiserer test filer..."
mkdir -p testing
mv *test*.html testing/ 2>/dev/null || echo "Ingen test html å flytte"
mv comprehensive-*.html testing/ 2>/dev/null || echo "Ingen comprehensive files å flytte"

# 7. LOGO & DESIGN ASSETS
echo "🎨 Organiserer design assets..."
mkdir -p assets/logos
cp logos/* assets/logos/ 2>/dev/null || echo "Logo mappen eksisterer ikke"
cp icons/* assets/logos/ 2>/dev/null || echo "Icons kopiert"

echo "✅ CLEANUP KOMPLETT!"
echo "📊 Ny struktur:"
echo "📁 archive/old-deployment-packages/ - Gamle pakker"
echo "📁 deployment-scripts/ - Deployment scripts"
echo "📁 docs/beta-launch/ - Beta dokumentasjon"
echo "📁 emergency-fixes/ - Emergency fixes"
echo "📁 testing/ - Test filer"
echo "📁 assets/logos/ - Logo system"
echo ""
echo "🎯 Workspace er nå organisert for beta utvikling!"
