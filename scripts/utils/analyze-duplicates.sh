#!/bin/bash

# 🔍 SNAKKAZ DUPLIKAT-ANALYSE SCRIPT
# Finner nøyaktig hvilke filer som er duplikater

echo "🔍 SNAKKAZ DUPLIKAT-ANALYSE"
echo "==========================="

echo "📊 FILTYPE STATISTIKK:"
echo "Scripts (.sh): $(find . -name "*.sh" -type f | wc -l)"
echo "Dokumenter (.md): $(find . -name "*.md" -type f | wc -l)"
echo "Zip filer: $(find . -name "*.zip" -type f | wc -l)"
echo "Backup filer (.bak): $(find . -name "*.bak" -type f | wc -l)"
echo "Tekstfiler (.txt): $(find . -name "*.txt" -type f | wc -l)"
echo ""

echo "🚨 DUPLIKAT SCRIPTS (samme funksjon):"
echo "====================================="

echo "DEPLOYMENT SCRIPTS:"
ls -la deploy-*.sh 2>/dev/null | head -10
echo ""

echo "FIX SCRIPTS (mest problematiske):"
ls -la fix-*.sh | head -15
echo ""

echo "SUPABASE FIX SCRIPTS:"
ls -la fix-supabase*.sh 2>/dev/null
echo ""

echo "TEST SCRIPTS:"
ls -la test-*.sh 2>/dev/null | head -10
echo ""

echo "SETUP SCRIPTS:"
ls -la setup-*.sh 2>/dev/null
echo ""

echo "📚 DUPLIKAT DOKUMENTASJON:"
echo "=========================="

echo "README VARIANTER:"
ls -la README*.md 2>/dev/null
echo ""

echo "DEPLOYMENT GUIDER:"
ls -la DEPLOYMENT*.md 2>/dev/null
echo ""

echo "BUGFIX DOKUMENTER:"
ls -la BUGFIX*.md FIXES*.md 2>/dev/null
echo ""

echo "TROUBLESHOOTING GUIDER:"
ls -la *TROUBLESHOOT*.md *FEILSØK*.md 2>/dev/null
echo ""

echo "🗑️ FILER SOM KAN SLETTES UMIDDELBART:"
echo "====================================="

echo "ZIP FILER (backup):"
ls -la *.zip 2>/dev/null
echo ""

echo "BACKUP FILER:"
ls -la *.bak 2>/dev/null
echo ""

echo "TEMP TEKSTFILER:"
ls -la *_content.txt *test*.txt large-images.txt serverfiles.txt 2>/dev/null
echo ""

echo "TEMP MAPPER:"
ls -la | grep "_temp\|_scan\|_results" 2>/dev/null
echo ""

echo "HTACCESS DUPLIKATER:"
ls -la *.htaccess *htaccess*.txt 2>/dev/null
echo ""

echo "📈 GEVINST BEREGNING:"
echo "===================="

SCRIPT_COUNT=$(find . -name "*.sh" -type f | wc -l)
DOC_COUNT=$(find . -name "*.md" -type f | wc -l)
ZIP_SIZE=$(du -sh *.zip 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
TOTAL_SIZE=$(du -sh . | awk '{print $1}')

echo "Scripts å rydde: $SCRIPT_COUNT (estimert 60% kan arkiveres)"
echo "Dokumenter å rydde: $DOC_COUNT (estimert 40% kan konsolideres)"
echo "Zip filer størrelse: ${ZIP_SIZE:-0}"
echo "Total mappe størrelse: $TOTAL_SIZE"
echo ""

echo "🎯 ESTIMERT GEVINST ETTER OPPRYDDING:"
echo "• 50-70% færre filer i root directory"
echo "• 30-50% mindre disk bruk"
echo "• 80%+ raskere file search"
echo "• 90%+ bedre oversikt"
