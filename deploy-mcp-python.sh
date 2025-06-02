#!/bin/bash

# Deploy Python MCP Memory Server to mcp.snakkaz.com
# This script uploads the Python memory server to the MCP subdomain

echo "🚀 Starting MCP Python Server Deployment..."

# Check if memory server exists
if [ ! -f "src/services/mcp/memoryServer.py" ]; then
    echo "❌ Error: Memory server not found"
    exit 1
fi

echo "📦 Preparing MCP Python server package..."

# Create directory for MCP server files
mkdir -p mcp-server-package/
cp -r src/services/mcp/memoryServer.py mcp-server-package/
cp requirements.txt mcp-server-package/ 2>/dev/null || echo "# Python dependencies" > mcp-server-package/requirements.txt

# Create server starter script
cat > mcp-server-package/start-mcp-server.sh << 'EOL'
#!/bin/bash
# Start the MCP Memory Server
cd $(dirname $0)
python3 -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -r requirements.txt
python memoryServer.py
EOL

chmod +x mcp-server-package/start-mcp-server.sh

# Create WSGI file for hosting
cat > mcp-server-package/mcp.wsgi << 'EOL'
import sys
import os

# Add the directory containing your app to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the memory server module
from memoryServer import app as application
EOL

# Create .htaccess for Python app
cat > mcp-server-package/.htaccess << 'EOL'
# Enable WSGI for Python
Options +ExecCGI
AddHandler wsgi-script .wsgi

# MCP API Server Configuration
RewriteEngine On

# Pass API requests to the Python application
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^api/(.*)$ mcp.wsgi/$1 [QSA,L]

# Pass all other requests to the MCP Dashboard
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
EOL

echo "✅ MCP Python server package created"

# Deploy using lftp
echo "🌐 Uploading to mcp.snakkaz.com/api..."

lftp -c "
# Connect to server with correct credentials
open -u SnakkaZ@snakkaz.com,Snakkaz2025! ftp.snakkaz.com

# SSL/TLS settings - disable SSL based on errors
set ssl:verify-certificate no
set ftp:ssl-allow no
set ftp:ssl-protect-data no
set ftp:passive-mode yes

# Network settings
set net:timeout 60
set net:max-retries 3

# Navigate to the MCP subdomain's API directory
cd /home/snakqsqe/public_html/mcp/api

# Create the directory if it doesn't exist
mkdir -p . 2>/dev/null || true

# Upload the Python MCP server files
mirror -R mcp-server-package/ ./ --parallel=2 --verbose

# Set permissions
chmod 755 start-mcp-server.sh
chmod 644 *.py *.wsgi requirements.txt .htaccess

echo 'MCP Python server deployment complete'
quit
"

echo "✅ MCP Python server deployed to mcp.snakkaz.com/api"
echo "🔧 Remember to install dependencies and configure the server on the hosting"

# Clean up
rm -rf mcp-server-package/

echo "🎉 Deployment complete!"
