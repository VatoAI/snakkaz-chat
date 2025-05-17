#!/bin/bash
# setup-subdomain-htaccess.sh
#
# This script creates necessary .htaccess files for each subdomain

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Setup Subdomain .htaccess Files     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Create subdomain directories if they don't exist
mkdir -p /workspaces/snakkaz-chat/dist/dash
mkdir -p /workspaces/snakkaz-chat/dist/business
mkdir -p /workspaces/snakkaz-chat/dist/docs
mkdir -p /workspaces/snakkaz-chat/dist/analytics
mkdir -p /workspaces/snakkaz-chat/dist/help
mkdir -p /workspaces/snakkaz-chat/dist/mcp

echo -e "${GREEN}Created subdomain directories in dist folder${NC}"
echo

# Create main .htaccess file for the root directory
cat > /workspaces/snakkaz-chat/dist/.htaccess << 'EOF'
# Main .htaccess file for snakkaz.com
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Handle subdomains through subdirectories
    RewriteCond %{HTTP_HOST} ^dash\.snakkaz\.com$ [NC]
    RewriteCond %{REQUEST_URI} !^/dash/
    RewriteRule ^(.*)$ /dash/$1 [L]
    
    RewriteCond %{HTTP_HOST} ^business\.snakkaz\.com$ [NC]
    RewriteCond %{REQUEST_URI} !^/business/
    RewriteRule ^(.*)$ /business/$1 [L]
    
    RewriteCond %{HTTP_HOST} ^docs\.snakkaz\.com$ [NC]
    RewriteCond %{REQUEST_URI} !^/docs/
    RewriteRule ^(.*)$ /docs/$1 [L]
    
    RewriteCond %{HTTP_HOST} ^analytics\.snakkaz\.com$ [NC]
    RewriteCond %{REQUEST_URI} !^/analytics/
    RewriteRule ^(.*)$ /analytics/$1 [L]
    
    RewriteCond %{HTTP_HOST} ^help\.snakkaz\.com$ [NC]
    RewriteCond %{REQUEST_URI} !^/help/
    RewriteRule ^(.*)$ /help/$1 [L]
    
    RewriteCond %{HTTP_HOST} ^mcp\.snakkaz\.com$ [NC]
    RewriteCond %{REQUEST_URI} !^/mcp/
    RewriteRule ^(.*)$ /mcp/$1 [L]
    
    # Handle SPA routes for main site
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Set browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType video/mp4 "access plus 1 year"
    ExpiresByType audio/mp3 "access plus 1 year"
    ExpiresByType audio/ogg "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType text/html "access plus 1 day"
</IfModule>
EOF

echo -e "${GREEN}Created main .htaccess file in dist folder${NC}"
echo

# Create .htaccess file for the dash subdomain
cat > /workspaces/snakkaz-chat/dist/dash/.htaccess << 'EOF'
# .htaccess file for dash.snakkaz.com
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /dash/
    
    # Handle SPA routes
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /dash/index.html [L]
</IfModule>
EOF

# Create index.html for dash subdomain
cat > /workspaces/snakkaz-chat/dist/dash/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snakkaz Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f7f9;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 500px;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Snakkaz Dashboard</h1>
        <p>The dashboard is currently being set up. Please check back soon.</p>
        <p>This is a placeholder page for the dash.snakkaz.com subdomain.</p>
        <a href="https://snakkaz.com">Return to main site</a>
    </div>
</body>
</html>
EOF

echo -e "${GREEN}Created .htaccess and index.html for dash subdomain${NC}"
echo

# Create similar files for other subdomains
for subdomain in business docs analytics help mcp; do
    cat > "/workspaces/snakkaz-chat/dist/$subdomain/.htaccess" << EOF
# .htaccess file for $subdomain.snakkaz.com
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /$subdomain/
    
    # Handle SPA routes
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /$subdomain/index.html [L]
</IfModule>
EOF

    cat > "/workspaces/snakkaz-chat/dist/$subdomain/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snakkaz $(echo $subdomain | tr '[:lower:]' '[:upper:]')</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f7f9;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 500px;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Snakkaz $(echo $subdomain | tr '[:lower:]' '[:upper:]')</h1>
        <p>This section is currently being set up. Please check back soon.</p>
        <p>This is a placeholder page for the $subdomain.snakkaz.com subdomain.</p>
        <a href="https://snakkaz.com">Return to main site</a>
    </div>
</body>
</html>
EOF
    echo -e "${GREEN}Created .htaccess and index.html for $subdomain subdomain${NC}"
done

echo
echo -e "${BLUE}All subdomain configurations have been created.${NC}"
echo -e "${YELLOW}Note: These files will be included in the next deployment.${NC}"
echo -e "${YELLOW}Make sure to update the DNS settings in Namecheap as well.${NC}"
