#!/bin/bash

# Enkel MCP Integration Deploy
echo "🔌 Deploying SnakkaZ MCP Integration..."

# Lag dist mappe hvis den ikke finnes
mkdir -p dist/mcp-integration

# Kopier integrasjonsfilen
cp mcp-integration-simple.js dist/mcp-integration/

# Lag enkel HTML test side
cat > dist/mcp-integration/test.html << 'EOF'
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnakkaZ MCP Integration Test</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #1a1a1a; 
            color: #fff; 
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #2a2a2a; 
            border-radius: 10px; 
        }
        button { 
            background: #007bff; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            margin: 5px; 
            border-radius: 5px; 
            cursor: pointer; 
        }
        button:hover { background: #0056b3; }
        .log { 
            background: #000; 
            padding: 10px; 
            border-radius: 5px; 
            margin: 10px 0; 
            font-family: monospace; 
            height: 300px; 
            overflow-y: auto; 
        }
        .status { 
            padding: 10px; 
            border-radius: 5px; 
            margin: 10px 0; 
        }
        .online { background: #28a745; }
        .offline { background: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔌 SnakkaZ MCP Integration Test</h1>
        
        <div id="status" class="status offline">
            ❌ MCP Integration ikke startet
        </div>

        <div>
            <button onclick="startIntegration()">🚀 Start Integration</button>
            <button onclick="testConnection()">🔍 Test Forbindelse</button>
            <button onclick="sendTestMessage()">📨 Send Test Melding</button>
            <button onclick="showStatus()">📊 Vis Status</button>
            <button onclick="reconnect()">🔄 Reconnect</button>
            <button onclick="clearLog()">🗑️ Clear Log</button>
        </div>

        <div class="log" id="log">
            Venter på MCP Integration...
        </div>
    </div>

    <!-- Mock SnakkaZ Chat for testing -->
    <script>
        // Mock SnakkaZ Chat system for testing
        window.SnakkaZChat = {
            messages: [],
            
            on: function(event, callback) {
                console.log('Lytter til event:', event);
                this.callbacks = this.callbacks || {};
                this.callbacks[event] = this.callbacks[event] || [];
                this.callbacks[event].push(callback);
            },
            
            emit: function(event, data) {
                console.log('Sender event:', event, data);
                if (this.callbacks && this.callbacks[event]) {
                    this.callbacks[event].forEach(callback => callback(data));
                }
            },
            
            addMessage: function(data) {
                this.messages.push(data);
                log('💬 Chat: ' + JSON.stringify(data));
            }
        };

        function log(message) {
            const logDiv = document.getElementById('log');
            const time = new Date().toLocaleTimeString('no-NO');
            logDiv.innerHTML += `[${time}] ${message}\n`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        function updateStatus(isOnline, message) {
            const statusDiv = document.getElementById('status');
            statusDiv.className = 'status ' + (isOnline ? 'online' : 'offline');
            statusDiv.innerHTML = (isOnline ? '✅' : '❌') + ' ' + message;
        }

        function startIntegration() {
            log('🚀 Starter MCP Integration...');
            updateStatus(true, 'MCP Integration startet');
            
            // Simuler at integration starter
            setTimeout(() => {
                if (window.SnakkaZMCP) {
                    log('✅ MCP Integration kjører!');
                } else {
                    log('⚠️ MCP Integration ikke funnet i window objekt');
                }
            }, 1000);
        }

        function testConnection() {
            log('🔍 Tester forbindelse til mcp.snakkaz.com...');
            if (window.SnakkaZMCP) {
                window.SnakkaZMCP.connectToExistingServer();
            } else {
                log('❌ MCP Integration ikke startet');
            }
        }

        function sendTestMessage() {
            log('📨 Sender test melding...');
            if (window.SnakkaZChat) {
                window.SnakkaZChat.emit('message', {
                    user: 'TestUser',
                    message: '@mcp status',
                    timestamp: new Date().toISOString()
                });
            }
        }

        function showStatus() {
            log('📊 Viser MCP status...');
            if (window.SnakkaZMCP) {
                window.SnakkaZMCP.sendChatStatus();
            } else {
                log('❌ MCP Integration ikke tilgjengelig');
            }
        }

        function reconnect() {
            log('🔄 Prøver reconnect...');
            if (window.SnakkaZMCP) {
                window.SnakkaZMCP.reconnect();
            } else {
                log('❌ MCP Integration ikke tilgjengelig');
            }
        }

        function clearLog() {
            document.getElementById('log').innerHTML = '';
        }

        // Log når siden er klar
        document.addEventListener('DOMContentLoaded', () => {
            log('📄 Test side lastet');
            log('⏳ Venter på MCP Integration...');
        });
    </script>

    <!-- Last MCP Integration -->
    <script src="mcp-integration-simple.js"></script>
</body>
</html>
EOF

# Lag .htaccess for riktig MIME types
cat > dist/mcp-integration/.htaccess << 'EOF'
# MCP Integration .htaccess
AddType application/javascript .js
AddType text/html .html

# CORS headers for API kall
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, X-Server-ID"

# Cache kontroll
<FilesMatch "\.(js|css|html)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 hour"
</FilesMatch>
EOF

echo "✅ MCP Integration klart for deploy i dist/mcp-integration/"
echo "📁 Filer:"
ls -la dist/mcp-integration/

echo ""
echo "🚀 For å deploye til mcp.snakkaz.com, kjør:"
echo "   ./deploy-mcp-integration.sh"
