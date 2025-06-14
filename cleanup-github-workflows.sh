#!/bin/bash

# ================================================
# GITHUB ACTIONS CLEANUP SCRIPT
# Juni 14, 2025 - Rydder opp i workflow-konflikter
# ================================================

echo "🧹 RYDDER OPP I GITHUB ACTIONS WORKFLOWS"
echo "========================================"

# Deaktiver alle gamle/konfliktskapende workflows
echo "🛑 Deaktiverer gamle workflows..."

# 1. Flytt gamle workflows til backup
mkdir -p .github/workflows/backup
mv .github/workflows/deploy.yml .github/workflows/backup/ 2>/dev/null || true
mv .github/workflows/deploy-unified.yml .github/workflows/backup/ 2>/dev/null || true
mv .github/workflows/deploy-corrected-ftp.yml .github/workflows/backup/ 2>/dev/null || true
mv .github/workflows/supabase-preview.yml .github/workflows/backup/ 2>/dev/null || true

echo "✅ Gamle workflows flyttet til backup/"

# 2. Behold kun den hovedsakelige unified workflow
echo "✅ Beholder kun: deploy-unified-final.yml"

# 3. Rens gamle deployment-scripts
echo "🧹 Renser gamle deployment-scripts..."
rm -f emergency-*.lftp 2>/dev/null || true
rm -f deploy-*.sh 2>/dev/null || true
rm -f *deploy.lftp 2>/dev/null || true
rm -f corrected-*.lftp 2>/dev/null || true

echo "✅ Gamle scripts renset"

# 4. List aktive workflows
echo ""
echo "📋 AKTIVE WORKFLOWS:"
ls -la .github/workflows/

echo ""
echo "🎯 CLEANUP FULLFØRT!"
echo "==================="
echo "✅ Kun ÉN workflow aktiv: deploy-unified-final.yml"
echo "✅ Alle konfliktskapende workflows deaktivert"
echo "✅ Gamle scripts renset"
echo ""
echo "🚀 Neste: Commit endringene for å stoppe kaotiske workflows"
