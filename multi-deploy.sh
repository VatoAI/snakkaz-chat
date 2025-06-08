#!/bin/bash

echo "=== ALTERNATIVE DEPLOYMENT METODER ==="
echo "Prøver flere deployment-metoder for Snakkaz Chat..."

# Metode 1: SFTP
echo ""
echo "1. Prøver SFTP..."
if command -v sftp >/dev/null 2>&1; then
    echo "SFTP er tilgjengelig, prøver tilkobling..."
    timeout 10 sftp snakqsqe@ftp.snakkaz.com <<EOF
put /workspaces/snakkaz-chat/dist/index.html /public_html/index.html
quit
EOF
else
    echo "SFTP ikke tilgjengelig"
fi

# Metode 2: Rsync over SSH (hvis tilgjengelig)
echo ""
echo "2. Prøver rsync..."
if command -v rsync >/dev/null 2>&1; then
    echo "Rsync er tilgjengelig, prøver SSH-tilkobling..."
    timeout 10 rsync -avz /workspaces/snakkaz-chat/dist/ snakqsqe@ftp.snakkaz.com:/public_html/ 2>&1 || echo "Rsync feilet"
else
    echo "Rsync ikke tilgjengelig"
fi

# Metode 3: cURL POST (hvis server støtter det)
echo ""
echo "3. Prøver cURL upload..."
curl -v --ftp-create-dirs -T /workspaces/snakkaz-chat/dist/index.html ftp://snakqsqe@ftp.snakkaz.com/public_html/index.html 2>&1 | head -10

echo ""
echo "=== DEPLOYMENT FORSØK FULLFØRT ==="
