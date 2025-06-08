#!/bin/bash

echo "🔄 SNAKKAZ DEPLOYMENT MONITOR - JUNI 8, 2025"
echo "========================================================"
echo "Overvåker deployment av nye JavaScript bundles..."
echo "Mål: Erstatte gamle bundles med nye emergency-fixed bundles"
echo ""

# Target bundles vi ser etter
TARGET_BUNDLES=("index-CEa86-6h.js" "vendor-misc-npIDrE24.js")
OLD_BUNDLES=("index-DqQAMTdx.js" "vendor-misc-UdhpdGr7.js")

check_deployment() {
    echo "⏰ $(date '+%H:%M:%S') - Sjekker www.snakkaz.com..."
    
    # Hent HTML og søk etter bundles
    html_content=$(curl -s --max-time 10 https://www.snakkaz.com 2>/dev/null)
    
    if [[ -z "$html_content" ]]; then
        echo "❌ Kan ikke nå nettsiden"
        return 1
    fi
    
    # Sjekk for nye bundles
    new_bundles_found=0
    for bundle in "${TARGET_BUNDLES[@]}"; do
        if echo "$html_content" | grep -q "$bundle"; then
            echo "✅ NY BUNDLE FUNNET: $bundle"
            ((new_bundles_found++))
        fi
    done
    
    # Sjekk for gamle bundles
    old_bundles_found=0
    for bundle in "${OLD_BUNDLES[@]}"; do
        if echo "$html_content" | grep -q "$bundle"; then
            echo "⚠️  Gammel bundle fortsatt aktiv: $bundle"
            ((old_bundles_found++))
        fi
    done
    
    echo "📊 Status: $new_bundles_found nye / $old_bundles_found gamle bundles"
    
    # Sjekk om deployment er fullført
    if [[ $new_bundles_found -eq ${#TARGET_BUNDLES[@]} ]] && [[ $old_bundles_found -eq 0 ]]; then
        echo ""
        echo "🎉 DEPLOYMENT FULLFØRT!"
        echo "✅ Alle nye bundles er live"
        echo "✅ Gamle bundles er fjernet" 
        echo "🔗 Test nettsiden: https://www.snakkaz.com"
        return 0
    elif [[ $new_bundles_found -gt 0 ]]; then
        echo "🔄 Delvis deployment - fortsetter overvåking..."
        return 2
    else
        echo "⏳ Venter på deployment..."
        return 1
    fi
}

# Hovedloop
max_checks=40  # 20 minutter med 30 sekunds intervaller
check_count=0

while [[ $check_count -lt $max_checks ]]; do
    ((check_count++))
    
    check_deployment
    result=$?
    
    if [[ $result -eq 0 ]]; then
        echo ""
        echo "🏁 OVERVÅKING FULLFØRT - DEPLOYMENT VELLYKKET!"
        exit 0
    fi
    
    echo "[$check_count/$max_checks] Neste sjekk om 30 sekunder..."
    echo "----------------------------------------"
    sleep 30
done

echo ""
echo "⏰ TIMEOUT: Deployment tok lenger enn forventet"
echo "💡 Sjekk manuelt på https://www.snakkaz.com"
echo "🔧 Eller kjør: curl -s https://www.snakkaz.com | grep -E 'index-|vendor-'"
