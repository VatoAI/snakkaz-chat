#!/bin/bash
# setup-subdomain-structure.sh
#
# Dette skriptet oppretter subdomain-strukturen i dist-mappen før opplasting 

# Fargedefinisjoner
GRONN='\033[0;32m'
GUL='\033[1;33m'
ROD='\033[0;31m'
BLA='\033[0;34m'
INGEN='\033[0m'

echo -e "${BLA}=====================================${INGEN}"
echo -e "${BLA}   Oppretter subdomain-struktur     ${INGEN}"
echo -e "${BLA}=====================================${INGEN}"
echo

# Verifiser at dist-mappen eksisterer
if [ ! -d "dist" ]; then
  echo -e "${ROD}Feil: 'dist'-mappe mangler!${INGEN}"
  echo "Du må bygge applikasjonen ved å kjøre 'npm run build' først."
  exit 1
fi

# Liste over subdomener som skal opprettes
SUBDOMAINS=("dash" "business" "docs" "analytics" "mcp" "help")

# Opprett subdomain-mapper
for subdomain in "${SUBDOMAINS[@]}"; do
  echo -e "${GUL}Oppretter struktur for subdomain: ${subdomain}${INGEN}"
  
  # Opprett subdomain-mappe hvis den ikke finnes
  mkdir -p "dist/${subdomain}"
  
  # Kopier index.html til subdomain-mappen
  cp "dist/index.html" "dist/${subdomain}/index.html"
  
  # Opprett .htaccess for subdomain
  cat > "dist/${subdomain}/.htaccess" << EOL
# .htaccess for ${subdomain}.snakkaz.com
# This redirects all requests to the SPA

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
EOL
  
  echo -e "${GRONN}✓ Subdomain ${subdomain} opprettet${INGEN}"
done

# Opprett en placeholder index.html for hvert subdomain
for subdomain in "${SUBDOMAINS[@]}"; do
  cat > "dist/${subdomain}/index.html" << EOL
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snakkaz - ${subdomain}</title>
    <script>
        // Dette er en placeholder som vil omdirigere til hovedappen
        // Når SPA-ruting er ferdig konfigurert, vil dette ikke være nødvendig
        window.location.href = "https://www.snakkaz.com";
    </script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0f1014;
            color: #e0e0e0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #ff2b77;
            margin-bottom: 10px;
        }
        p {
            margin: 10px 0;
            max-width: 600px;
            line-height: 1.5;
        }
        .container {
            background-color: #1a1c25;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid #2a2c35;
        }
        .neon {
            text-shadow: 0 0 5px #ff2b77, 0 0 10px #ff2b77;
        }
        .loading {
            margin-top: 20px;
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 43, 119, 0.3);
            border-radius: 50%;
            border-top-color: #ff2b77;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><span class="neon">Snakkaz</span> - ${subdomain}</h1>
        <p>Dette er ${subdomain}-subdomenet til Snakkaz Chat. Du blir omdirigert til hovedapplikasjonen...</p>
        <div class="loading"></div>
    </div>
</body>
</html>
EOL
  
  echo -e "${GRONN}✓ Placeholder for ${subdomain} opprettet${INGEN}"
done

echo
echo -e "${GRONN}Subdomain-struktur opprettet! Neste steg:${INGEN}"
echo "1. Last opp til serveren med './upload-to-namecheap.sh'"
echo "2. Verifiser at subdomener fungerer med './scripts/verify-subdomain-setup.sh'"
echo
