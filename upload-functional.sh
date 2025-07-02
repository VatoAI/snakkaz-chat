#!/bin/bash
lftp -c "
set ssl:verify-certificate no
set ftp:passive-mode on
open ftp://admin@snakkaz.com:Rompetroll123!@ftp.snakkaz.com
put FUNCTIONAL-EMERGENCY-CHAT.html -o index.html
chmod 644 index.html
ls -la index.html
quit
"
