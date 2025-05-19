#!/bin/bash
# update-dependencies-for-email.sh
#
# Dette skriptet oppdaterer package.json med nødvendige avhengigheter
# for e-postfunksjonaliteten

echo "Installerer nødvendige avhengigheter for e-postfunksjonalitet..."

# Installer Express og relaterte pakker
npm install --save express body-parser cors

# Installer validerings-bibliotek
npm install --save check-password-strength

echo "Avhengigheter installert!"
echo "Server.js er oppdatert til å bruke Express for API-endepunkter."
echo "Neste steg: Kjør serveren og test e-postfunksjonaliteten."
