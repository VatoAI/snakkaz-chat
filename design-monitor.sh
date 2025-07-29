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
