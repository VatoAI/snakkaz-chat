#!/bin/bash

echo "=== EMERGENCY SNAKKAZ CHAT DEPLOYMENT STATUS ==="
echo "Tid: $(date)"
echo ""

echo "1. Sjekker GitHub Actions deployment..."
curl -s https://api.github.com/repos/VatoAI/snakkaz-chat/actions/runs\?status\=in_progress | grep -o '"status":"[^"]*"' | head -5

echo ""
echo "2. Tester snakkaz.com tilkobling..."
curl -I -s --connect-timeout 10 https://www.snakkaz.com | head -3

echo ""
echo "3. Sjekker FTP-server tilkobling..."
timeout 5 telnet ftp.snakkaz.com 21 < /dev/null

echo ""
echo "4. Sjekker lokale filer..."
echo "Dist mappe størrelse: $(du -sh /workspaces/snakkaz-chat/dist 2>/dev/null || echo 'Ikke funnet')"
echo "Index.html finnes: $(test -f /workspaces/snakkaz-chat/dist/index.html && echo 'JA' || echo 'NEI')"

echo ""
echo "=== STATUS RAPPORT FULLFØRT ==="
