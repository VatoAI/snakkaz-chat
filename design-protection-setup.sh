#!/bin/bash

# 🌊 SNAKKAZ DESIGN PROTECTION SYSTEM
# Dette scriptet overvåker og beskytter det perfekte Liquid Dream designet

echo "🌊 SNAKKAZ DESIGN PROTECTION - Starter overvåking..."

# Backup av det perfekte designet
PERFECT_DESIGN="/workspaces/snakkaz-chat/clean-design-demo/index.html"
DESIGN_BACKUP="/workspaces/snakkaz-chat/PERFECT-DESIGN-BACKUP.html"

# Lage backup av det perfekte designet
if [ -f "$PERFECT_DESIGN" ]; then
    cp "$PERFECT_DESIGN" "$DESIGN_BACKUP"
    echo "✅ Perfect design backed up to: $DESIGN_BACKUP"
else
    echo "❌ Perfect design not found!"
    exit 1
fi

# Ekstrahere CSS fra perfect design
echo "🎨 Ekstraherer perfect CSS..."
grep -A 1000 "<style>" "$PERFECT_DESIGN" | grep -B 1000 "</style>" > "/workspaces/snakkaz-chat/PERFECT-LIQUID-DREAM.css"

echo "✅ Perfect Liquid Dream CSS ekstrahert!"
echo "📁 Filer opprettet:"
echo "   - $DESIGN_BACKUP (HTML backup)"
echo "   - /workspaces/snakkaz-chat/PERFECT-LIQUID-DREAM.css (CSS extract)"

# Lage design monitoring script
cat > "/workspaces/snakkaz-chat/design-monitor.sh" << 'EOF'
#!/bin/bash
# Design Monitor - Overvåker endringer i CSS filer

echo "👀 Design Monitor - Watching for changes..."

# Watch for changes in CSS files
inotifywait -m -e modify,move,create,delete \
    /workspaces/snakkaz-chat/src/ \
    /workspaces/snakkaz-chat/src/styles/ \
    --format '%w%f %e' | while read file event; do
    
    if [[ "$file" == *.css ]]; then
        echo "⚠️  CSS CHANGE DETECTED: $file ($event)"
        echo "🔍 Verify design is still intact at: http://localhost:4000"
        echo "🛡️  Perfect design backup available at: /workspaces/snakkaz-chat/PERFECT-DESIGN-BACKUP.html"
    fi
done
EOF

chmod +x "/workspaces/snakkaz-chat/design-monitor.sh"

echo ""
echo "🛡️  DESIGN PROTECTION ACTIVE!"
echo "📋 Neste steg:"
echo "   1. Start design monitor: ./design-monitor.sh"
echo "   2. Import perfect CSS til hovedapp"
echo "   3. Build login/register med perfect design"
echo ""
