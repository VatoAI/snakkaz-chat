/**
 * Enkel MCP Integrasjon for SnakkaZ
 * Kobler sammen eksisterende MCP server med ny funksjonalitet
 */

class SnakkaZMCPIntegration {
    constructor() {
        this.existingServerURL = 'https://mcp.snakkaz.com';
        this.serverID = 'my-mcp-server-0727e508';
        this.isConnected = false;
        this.chatInstance = null;
        
        console.log('🔌 SnakkaZ MCP Integration startet');
        this.init();
    }

    async init() {
        try {
            // Test forbindelse til eksisterende server
            await this.connectToExistingServer();
            
            // Koble til SnakkaZ chat
            this.connectToChat();
            
            // Start integrasjon
            this.startIntegration();
            
        } catch (error) {
            console.error('❌ MCP Integration feil:', error);
            this.fallbackMode();
        }
    }

    async connectToExistingServer() {
        console.log('🔍 Kobler til eksisterende MCP server...');
        
        try {
            const response = await fetch(`${this.existingServerURL}/api/status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Server-ID': this.serverID
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Koblet til eksisterende MCP server:', data);
                this.isConnected = true;
                return data;
            }
        } catch (error) {
            console.log('⚠️ Eksisterende server ikke tilgjengelig, fortsetter med lokal funksjonalitet');
        }
    }

    connectToChat() {
        // Koble til SnakkaZ chat system
        if (window.SnakkaZChat) {
            this.chatInstance = window.SnakkaZChat;
            console.log('✅ Koblet til SnakkaZ Chat');
            
            // Legg til MCP events
            this.setupChatEvents();
        }
    }

    setupChatEvents() {
        if (!this.chatInstance) return;

        // Lyt til nye meldinger
        this.chatInstance.on('message', (data) => {
            this.handleChatMessage(data);
        });

        // Lyt til bruker aktivitet
        this.chatInstance.on('userActivity', (data) => {
            this.handleUserActivity(data);
        });

        console.log('🎧 Chat events satt opp');
    }

    async handleChatMessage(data) {
        console.log('📨 Ny chat melding:', data);

        // Send til eksisterende MCP server hvis tilkoblet
        if (this.isConnected) {
            try {
                await fetch(`${this.existingServerURL}/api/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Server-ID': this.serverID
                    },
                    body: JSON.stringify({
                        message: data.message,
                        user: data.user,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (error) {
                console.log('⚠️ Kunne ikke sende til eksisterende server:', error);
            }
        }

        // Lokal behandling
        this.processMessageLocally(data);
    }

    processMessageLocally(data) {
        // Enkel lokal behandling av meldinger
        if (data.message.includes('@mcp') || data.message.includes('/mcp')) {
            this.handleMCPCommand(data);
        }
    }

    async handleMCPCommand(data) {
        const message = data.message.toLowerCase();
        
        if (message.includes('status')) {
            this.sendChatStatus();
        } else if (message.includes('info')) {
            this.sendServerInfo();
        } else if (message.includes('help')) {
            this.sendHelp();
        }
    }

    sendChatStatus() {
        const status = {
            server: this.isConnected ? 'Tilkoblet' : 'Lokal modus',
            serverID: this.serverID,
            url: this.existingServerURL,
            timestamp: new Date().toLocaleString('no-NO')
        };

        this.sendToChat('🔧 MCP Status: ' + JSON.stringify(status, null, 2));
    }

    sendServerInfo() {
        const info = {
            navn: 'SnakkaZ MCP Integration',
            versjon: '1.0.0',
            eksisterendeServer: this.serverID,
            tilkoblet: this.isConnected,
            funksjoner: ['Chat monitoring', 'Status tracking', 'Message routing']
        };

        this.sendToChat('ℹ️ Server Info: ' + JSON.stringify(info, null, 2));
    }

    sendHelp() {
        const help = `
🔧 SnakkaZ MCP Commands:
- @mcp status - Vis server status
- @mcp info - Vis server informasjon  
- @mcp help - Vis denne hjelpen
- /mcp test - Test forbindelse
        `;

        this.sendToChat(help);
    }

    sendToChat(message) {
        if (this.chatInstance && this.chatInstance.addMessage) {
            this.chatInstance.addMessage({
                user: 'MCP System',
                message: message,
                timestamp: new Date().toISOString(),
                type: 'system'
            });
        } else {
            console.log('📢 MCP:', message);
        }
    }

    async handleUserActivity(data) {
        // Send bruker aktivitet til eksisterende server
        if (this.isConnected) {
            try {
                await fetch(`${this.existingServerURL}/api/activity`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Server-ID': this.serverID
                    },
                    body: JSON.stringify({
                        user: data.user,
                        activity: data.activity,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (error) {
                console.log('⚠️ Activity sync feil:', error);
            }
        }
    }

    startIntegration() {
        console.log('🚀 MCP Integration startet successfully!');
        
        // Send welcome melding
        setTimeout(() => {
            this.sendToChat('🔌 MCP Integration aktiv! Skriv "@mcp help" for kommandoer.');
        }, 2000);

        // Periodisk status sjekk
        setInterval(() => {
            this.healthCheck();
        }, 30000); // Hver 30 sekund
    }

    async healthCheck() {
        if (this.isConnected) {
            try {
                const response = await fetch(`${this.existingServerURL}/api/health`, {
                    method: 'GET',
                    headers: {
                        'X-Server-ID': this.serverID
                    }
                });

                if (!response.ok) {
                    console.log('⚠️ Health check feilet, går til lokal modus');
                    this.isConnected = false;
                }
            } catch (error) {
                console.log('⚠️ Health check error:', error);
                this.isConnected = false;
            }
        }
    }

    fallbackMode() {
        console.log('🔄 Starter i fallback modus (kun lokal funksjonalitet)');
        this.isConnected = false;
        
        // Fortsett med lokal funksjonalitet
        this.connectToChat();
        this.startIntegration();
    }

    // Manuell reconnect funksjon
    async reconnect() {
        console.log('🔄 Prøver å koble til eksisterende server igen...');
        await this.connectToExistingServer();
        
        if (this.isConnected) {
            this.sendToChat('✅ Koblet til eksisterende MCP server igjen!');
        } else {
            this.sendToChat('❌ Kunne ikke koble til eksisterende server');
        }
    }
}

// Auto-start når siden lastes
document.addEventListener('DOMContentLoaded', () => {
    // Vent litt slik at SnakkaZ Chat kan starte først
    setTimeout(() => {
        window.SnakkaZMCP = new SnakkaZMCPIntegration();
    }, 3000);
});

// Eksponer til global scope for debugging
window.SnakkaZMCPIntegration = SnakkaZMCPIntegration;
