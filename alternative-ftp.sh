#!/bin/bash

# Alternative FTP upload med ftp-kommando
cd /workspaces/snakkaz-chat/dist

echo "Prøver FTP upload med standard ftp-kommando..."

ftp -n ftp.snakkaz.com << EOF
quote USER snakqsqe
prompt off
binary
cd public_html
mdelete *
mput *
quit
EOF

echo "FTP upload forsøk fullført"
