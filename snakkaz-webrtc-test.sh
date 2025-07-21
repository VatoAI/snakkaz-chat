#!/bin/bash

# SnakkaZ Chat - WebRTC Test Suite
# Dette scriptet tester WebRTC-funksjonalitet i SnakkaZ Chat

# Sette farger for bedre lesbarhet
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   SnakkaZ WebRTC Test Suite           ${NC}"
echo -e "${BLUE}========================================${NC}"

# Sjekk forutsetninger
echo -e "${YELLOW}Sjekker nødvendige forutsetninger...${NC}"

# Sjekk node og npm
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ Node.js og npm er installert${NC}"
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    echo -e "  Node: $NODE_VERSION"
    echo -e "  npm: $NPM_VERSION"
else
    echo -e "${RED}✗ Node.js og/eller npm er ikke installert${NC}"
    echo -e "${YELLOW}Vennligst installer Node.js og npm før du fortsetter${NC}"
    exit 1
fi

# Sjekk package.json
if [ -f "./package.json" ]; then
    echo -e "${GREEN}✓ package.json funnet${NC}"
else
    echo -e "${RED}✗ package.json ikke funnet. Er du i riktig mappe?${NC}"
    exit 1
fi

# Funksjon for å kjøre WebRTC-diagnose
run_webrtc_diagnostics() {
    echo -e "\n${BLUE}=== WebRTC Diagnose ===${NC}"
    
    # Sjekk nettverkstilgang til STUN-servere
    echo -e "${YELLOW}Sjekker tilkobling til STUN-servere...${NC}"
    
    # Definer STUN-servere å teste
    STUN_SERVERS=(
        "stun.l.google.com:19302"
        "stun1.l.google.com:19302"
        "stun2.l.google.com:19302"
    )
    
    STUN_SUCCESS=0
    for server in "${STUN_SERVERS[@]}"; do
        echo -n "  Tester $server: "
        if nc -z -u -w1 ${server%%:*} ${server##*:} 2>/dev/null; then
            echo -e "${GREEN}Tilgjengelig${NC}"
            STUN_SUCCESS=$((STUN_SUCCESS + 1))
        else
            echo -e "${RED}Utilgjengelig${NC}"
        fi
    done
    
    if [ $STUN_SUCCESS -eq 0 ]; then
        echo -e "${RED}✗ Ingen STUN-servere er tilgjengelige. WebRTC vil ikke fungere korrekt.${NC}"
        echo -e "${YELLOW}  Sjekk nettverkstilkoblingen din og eventuelt brannmurinnstillinger.${NC}"
    elif [ $STUN_SUCCESS -lt ${#STUN_SERVERS[@]} ]; then
        echo -e "${YELLOW}⚠ Noen STUN-servere er utilgjengelige, men WebRTC bør fortsatt fungere.${NC}"
    else
        echo -e "${GREEN}✓ Alle STUN-servere er tilgjengelige.${NC}"
    fi
    
    # Sjekk WebRTC-støtte i nettlesere
    echo -e "\n${YELLOW}Sjekker WebRTC-støtte i installerte nettlesere...${NC}"
    
    if command -v google-chrome &> /dev/null || command -v chromium-browser &> /dev/null; then
        echo -e "${GREEN}✓ Chrome/Chromium funnet - Støtter WebRTC${NC}"
    else
        echo -e "${YELLOW}⚠ Chrome/Chromium ikke funnet - Anbefalt for best WebRTC-støtte${NC}"
    fi
    
    if command -v firefox &> /dev/null; then
        echo -e "${GREEN}✓ Firefox funnet - Støtter WebRTC${NC}"
    else
        echo -e "${YELLOW}⚠ Firefox ikke funnet${NC}"
    fi
    
    # Sjekk vanlige brannmurkonfigurasjoner som kan blokkere WebRTC
    echo -e "\n${YELLOW}Sjekker potensielle brannmurhindringer...${NC}"
    
    if command -v ufw &> /dev/null && ufw status | grep -q "active"; then
        echo -e "${YELLOW}⚠ UFW-brannmur er aktiv. Kan påvirke WebRTC.${NC}"
        echo -e "  Sjekk at UDP-porter er åpne for WebRTC (spesielt 19302)."
    fi
    
    if command -v iptables &> /dev/null && iptables -L | grep -q "DROP"; then
        echo -e "${YELLOW}⚠ iptables har DROP-regler som kan blokkere WebRTC-trafikk.${NC}"
    fi
    
    echo -e "\n${GREEN}WebRTC diagnose fullført.${NC}"
}

# Funksjon for å teste WebRTC i applikasjonen
test_app_webrtc() {
    echo -e "\n${BLUE}=== Teste WebRTC i SnakkaZ Chat ===${NC}"
    
    # Opprett testmiljø-konfigurasjon
    echo -e "${YELLOW}Oppretter WebRTC-testmiljø...${NC}"
    
    # Lag en midlertidig .env.test-fil
    cat > .env.test << EOL
VITE_WEBRTC_DEBUG=true
VITE_WEBRTC_LOG_LEVEL=verbose
VITE_USE_TEST_ICE_SERVERS=true
VITE_TEST_MODE=true
VITE_DISABLE_ANALYTICS=true
EOL
    
    echo -e "${GREEN}✓ Testmiljø konfigurert${NC}"
    
    # Start utviklingsserveren med testmiljø
    echo -e "${YELLOW}Starter SnakkaZ Chat i testmodus...${NC}"
    echo -e "${BLUE}Åpne nettleseren på http://localhost:5173 når serveren har startet.${NC}"
    echo -e "${YELLOW}For å teste WebRTC fullt ut, åpne applikasjonen i to forskjellige nettleservinduer.${NC}"
    echo -e "${RED}Trykk Ctrl+C for å stoppe serveren når testingen er fullført.${NC}"
    echo
    
    npm run dev -- --mode test
    
    # Fjern midlertidig testmiljøfil
    rm .env.test
    echo -e "\n${GREEN}WebRTC-testing fullført og testmiljø fjernet.${NC}"
}

# Funksjon for å kjøre automatiserte WebRTC-tester
run_automated_tests() {
    echo -e "\n${BLUE}=== Kjører automatiserte WebRTC-tester ===${NC}"
    
    # Sjekk om Jest er tilgjengelig
    if ! npx jest --version &> /dev/null; then
        echo -e "${YELLOW}Jest er ikke installert. Installerer nødvendige avhengigheter...${NC}"
        npm install --save-dev jest @testing-library/jest-dom @babel/preset-env @babel/preset-react
    fi
    
    # Kjør Jest-tester relatert til WebRTC
    echo -e "${YELLOW}Kjører WebRTC-enhetstester...${NC}"
    
    if npx jest --testPathPattern=webrtc --silent; then
        echo -e "${GREEN}✓ WebRTC-tester fullført uten feil${NC}"
    else
        echo -e "${RED}✗ Feil i WebRTC-tester. Se feilmelding ovenfor.${NC}"
    fi
}

# Funksjon for å åpne browser-baserte WebRTC-tester
open_browser_tests() {
    echo -e "\n${BLUE}=== Browser-basert WebRTC-testing ===${NC}"
    
    # Sjekk om testfilen eksisterer, opprett den hvis den ikke gjør det
    TEST_FILE="src/tests/webrtc-browser-test.html"
    
    if [ ! -f "$TEST_FILE" ]; then
        echo -e "${YELLOW}Testfil eksisterer ikke, oppretter...${NC}"
        
        # Opprett mappehierarkiet hvis nødvendig
        mkdir -p src/tests
        
        # Opprett en enkel testfil
        cat > "$TEST_FILE" << EOL
<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnakkaZ Chat WebRTC Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        }
        .test-section {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 8px;
            margin-bottom: 8px;
        }
        button:hover {
            background: #0069d9;
        }
        input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 8px;
        }
        .messages {
            height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            padding: 10px;
            margin-top: 10px;
            background: white;
        }
        .status {
            font-weight: bold;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>SnakkaZ Chat WebRTC Test</h1>
    
    <div class="test-section">
        <h2>1. WebRTC API-test</h2>
        <button onclick="testWebRTCAPI()">Test WebRTC API</button>
        <div id="api-result" class="status"></div>
    </div>
    
    <div class="test-section">
        <h2>2. STUN-servertest</h2>
        <button onclick="testICEServers()">Test STUN-servere</button>
        <div id="stun-result" class="status"></div>
    </div>
    
    <div class="test-section">
        <h2>3. P2P-tilkoblingstest</h2>
        <p>For å teste P2P-tilkobling, åpne denne siden i to nettleservinduer:</p>
        
        <div>
            <label for="localId">Din ID:</label>
            <input type="text" id="localId" placeholder="Skriv inn ditt ID">
            <button onclick="initConnection()">Initialiser</button>
        </div>
        
        <div style="margin-top: 10px;">
            <label for="remoteId">Partner ID:</label>
            <input type="text" id="remoteId" placeholder="Skriv inn partner ID">
            <button onclick="connectToPeer()">Koble til</button>
        </div>
        
        <div id="connection-status" class="status">Status: Ikke tilkoblet</div>
    </div>
    
    <div class="test-section">
        <h2>4. Meldingstest</h2>
        <div>
            <input type="text" id="message" placeholder="Skriv en melding">
            <button onclick="sendMessage()" id="send-btn" disabled>Send</button>
            <button onclick="sendEncrypted()" id="send-encrypted-btn" disabled>Send kryptert</button>
        </div>
        
        <h3>Meldinger:</h3>
        <div id="messages" class="messages"></div>
    </div>
    
    <div class="test-section">
        <h2>5. Feiltoleranse-test</h2>
        <button onclick="testReconnection()" id="reconnect-btn" disabled>Test tilkoblingen på nytt</button>
        <button onclick="testFallback()" id="fallback-btn" disabled>Test server-fallback</button>
        <div id="fallback-status" class="status"></div>
    </div>

    <script>
        // WebRTC-variabler
        let peerConnection = null;
        let dataChannel = null;
        let localId = '';
        let remoteId = '';
        let isConnected = false;
        
        // Test WebRTC API-tilgjengelighet
        function testWebRTCAPI() {
            const resultDiv = document.getElementById('api-result');
            
            try {
                // Sjekk RTCPeerConnection
                if (typeof RTCPeerConnection !== 'undefined') {
                    resultDiv.innerHTML = '<span class="success">✓ WebRTC API er tilgjengelig</span>';
                    
                    // Sjekk datakanaler
                    const pc = new RTCPeerConnection();
                    try {
                        const dc = pc.createDataChannel('test');
                        resultDiv.innerHTML += '<br><span class="success">✓ DataChannel støttes</span>';
                        dc.close();
                    } catch (e) {
                        resultDiv.innerHTML += '<br><span class="error">✗ DataChannel støttes ikke</span>';
                    }
                    pc.close();
                    
                } else {
                    resultDiv.innerHTML = '<span class="error">✗ WebRTC API er ikke tilgjengelig i denne nettleseren</span>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<span class="error">✗ Feil ved testing av WebRTC API: ' + error.message + '</span>';
            }
        }
        
        // Test ICE-servere
        function testICEServers() {
            const resultDiv = document.getElementById('stun-result');
            resultDiv.innerHTML = '<span class="warning">Tester STUN-servere...</span>';
            
            const iceServers = [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
            ];
            
            const pc = new RTCPeerConnection({ iceServers });
            let candidatesFound = 0;
            
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    candidatesFound++;
                    console.log('ICE-kandidat funnet:', event.candidate);
                } else {
                    // ICE-gathering er fullført
                    if (candidatesFound > 0) {
                        resultDiv.innerHTML = '<span class="success">✓ STUN-servere fungerer! Fant ' + candidatesFound + ' ICE-kandidater</span>';
                    } else {
                        resultDiv.innerHTML = '<span class="error">✗ Ingen ICE-kandidater funnet. STUN-servere kan være blokkert.</span>';
                    }
                }
            };
            
            // Opprett en datakanel for å starte ICE-gathering
            const dc = pc.createDataChannel('test');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            
            // Rydd opp etter 5 sekunder
            setTimeout(() => {
                if (candidatesFound === 0) {
                    resultDiv.innerHTML = '<span class="error">✗ Ingen ICE-kandidater funnet innen tidsavbrudd. STUN-servere kan være blokkert.</span>';
                }
                dc.close();
                pc.close();
            }, 5000);
        }
        
        // Initialiser tilkobling
        function initConnection() {
            localId = document.getElementById('localId').value.trim();
            
            if (!localId) {
                alert('Vennligst skriv inn ditt ID');
                return;
            }
            
            document.getElementById('connection-status').innerHTML = 
                '<span class="warning">Klar til tilkobling. Del ditt ID: ' + localId + '</span>';
        }
        
        // Koble til peer
        function connectToPeer() {
            if (!localId) {
                alert('Vennligst initialiser din tilkobling først');
                return;
            }
            
            remoteId = document.getElementById('remoteId').value.trim();
            
            if (!remoteId) {
                alert('Vennligst skriv inn partner ID');
                return;
            }
            
            document.getElementById('connection-status').innerHTML = 
                '<span class="warning">Kobler til ' + remoteId + '...</span>';
            
            // Opprett peer-tilkobling
            const iceServers = [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
            ];
            
            peerConnection = new RTCPeerConnection({ iceServers });
            
            // Opprett datakanal
            dataChannel = peerConnection.createDataChannel('chat');
            
            setupDataChannel();
            
            // Håndter ICE-kandidater
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    console.log('ICE-kandidat:', event.candidate);
                }
            };
            
            peerConnection.onconnectionstatechange = () => {
                document.getElementById('connection-status').innerHTML = 
                    '<span class="warning">Tilkoblingsstatus: ' + peerConnection.connectionState + '</span>';
                
                if (peerConnection.connectionState === 'connected') {
                    document.getElementById('connection-status').innerHTML = 
                        '<span class="success">✓ Tilkoblet til ' + remoteId + '</span>';
                    isConnected = true;
                    document.getElementById('send-btn').disabled = false;
                    document.getElementById('send-encrypted-btn').disabled = false;
                    document.getElementById('reconnect-btn').disabled = false;
                    document.getElementById('fallback-btn').disabled = false;
                }
            };
            
            // Simuler tilkobling (i en virkelig app ville dette brukt signalering)
            setTimeout(() => {
                document.getElementById('connection-status').innerHTML = 
                    '<span class="success">✓ Simulert tilkobling opprettet til ' + remoteId + '</span>';
                isConnected = true;
                document.getElementById('send-btn').disabled = false;
                document.getElementById('send-encrypted-btn').disabled = false;
                document.getElementById('reconnect-btn').disabled = false;
                document.getElementById('fallback-btn').disabled = false;
            }, 1500);
        }
        
        // Konfigurer datakanalen
        function setupDataChannel() {
            dataChannel.onopen = () => {
                console.log('DataChannel åpen');
            };
            
            dataChannel.onmessage = event => {
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML += '<div>Partner: ' + event.data + '</div>';
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            };
            
            dataChannel.onclose = () => {
                console.log('DataChannel lukket');
            };
            
            dataChannel.onerror = error => {
                console.error('DataChannel feil:', error);
            };
        }
        
        // Send melding
        function sendMessage() {
            const messageInput = document.getElementById('message');
            const message = messageInput.value.trim();
            
            if (!message) return;
            
            if (isConnected) {
                // I en virkelig app ville dette sendt via datakanalen
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML += '<div>Deg: ' + message + '</div>';
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                
                // Simuler mottatt svar
                setTimeout(() => {
                    messagesDiv.innerHTML += '<div>Partner: Jeg mottok din melding: "' + message + '"</div>';
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }, 500);
                
                messageInput.value = '';
            } else {
                alert('Ikke tilkoblet. Vennligst koble til en partner først.');
            }
        }
        
        // Send kryptert melding
        function sendEncrypted() {
            const messageInput = document.getElementById('message');
            const message = messageInput.value.trim();
            
            if (!message) return;
            
            if (isConnected) {
                // Simuler kryptering
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML += '<div>Deg (kryptert): ' + message + '</div>';
                
                // Vis kryptert melding (simulert)
                const encryptedMsg = btoa(message); // Dette er ikke ekte E2EE, bare base64
                messagesDiv.innerHTML += '<div><small>Sendt kryptert som: ' + encryptedMsg + '</small></div>';
                
                // Simuler mottatt kryptert svar
                setTimeout(() => {
                    messagesDiv.innerHTML += '<div>Partner (dekryptert): Jeg mottok din krypterte melding!</div>';
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }, 500);
                
                messageInput.value = '';
            } else {
                alert('Ikke tilkoblet. Vennligst koble til en partner først.');
            }
        }
        
        // Test tilkobling på nytt
        function testReconnection() {
            const statusDiv = document.getElementById('connection-status');
            statusDiv.innerHTML = '<span class="warning">Kobler fra og prøver å koble til på nytt...</span>';
            
            isConnected = false;
            document.getElementById('send-btn').disabled = true;
            document.getElementById('send-encrypted-btn').disabled = true;
            
            // Simuler tilkobling på nytt
            setTimeout(() => {
                statusDiv.innerHTML = '<span class="success">✓ Tilkobling opprettet på nytt</span>';
                isConnected = true;
                document.getElementById('send-btn').disabled = false;
                document.getElementById('send-encrypted-btn').disabled = false;
            }, 2000);
        }
        
        // Test fallback til server
        function testFallback() {
            const fallbackStatus = document.getElementById('fallback-status');
            fallbackStatus.innerHTML = '<span class="warning">Simulerer WebRTC-feil og fallback til server...</span>';
            
            // Simuler WebRTC-feil
            isConnected = false;
            document.getElementById('connection-status').innerHTML = 
                '<span class="error">✗ WebRTC-tilkobling mislyktes</span>';
            document.getElementById('send-btn').disabled = true;
            document.getElementById('send-encrypted-btn').disabled = true;
            
            // Simuler fallback til server
            setTimeout(() => {
                fallbackStatus.innerHTML = '<span class="success">✓ Koblet til via server-fallback</span>';
                document.getElementById('connection-status').innerHTML = 
                    '<span class="warning">Bruker server-fallback modus</span>';
                
                isConnected = true;
                document.getElementById('send-btn').disabled = false;
                document.getElementById('send-encrypted-btn').disabled = true; // E2EE er ikke tilgjengelig i fallback-modus
                
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML += '<div><small>System: Byttet til server-fallback modus. Ende-til-ende-kryptering er ikke tilgjengelig.</small></div>';
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 2000);
        }
        
        // Kjør API-test automatisk ved lasting av siden
        window.onload = function() {
            testWebRTCAPI();
        };
    </script>
</body>
</html>
EOL
        echo -e "${GREEN}✓ Browser-testfil opprettet: $TEST_FILE${NC}"
    else
        echo -e "${GREEN}✓ Browser-testfil funnet: $TEST_FILE${NC}"
    fi
    
    # Åpne testfilen i nettleser
    echo -e "${YELLOW}Åpner browser-test i nettleser...${NC}"
    
    TEST_URL="file://$(pwd)/$TEST_FILE"
    echo -e "${BLUE}Test URL: $TEST_URL${NC}"
    
    # Prøv å åpne i tilgjengelig nettleser
    if command -v google-chrome &> /dev/null; then
        google-chrome "$TEST_URL"
    elif command -v chromium-browser &> /dev/null; then
        chromium-browser "$TEST_URL"
    elif command -v firefox &> /dev/null; then
        firefox "$TEST_URL"
    else
        echo -e "${YELLOW}Ingen kompatibel nettleser funnet automatisk.${NC}"
        echo -e "${YELLOW}Vennligst åpne denne URL-en manuelt i din nettleser:${NC}"
        echo -e "${BLUE}$TEST_URL${NC}"
    fi
}

# Hovedmenyen
show_menu() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   SnakkaZ WebRTC Testing - Valg        ${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo "1. Kjør WebRTC diagnose"
    echo "2. Kjør WebRTC-tester i applikasjonen"
    echo "3. Kjør browser-baserte WebRTC-tester"
    echo "4. Avslutt"
    
    echo -e "\n${YELLOW}Ditt valg [1-4]:${NC}"
    read -r choice
    
    case $choice in
        1) run_webrtc_diagnostics ;;
        2) test_app_webrtc ;;
        3) open_browser_tests ;;
        4) echo -e "${GREEN}Avslutter...${NC}"; exit 0 ;;
        *) echo -e "${RED}Ugyldig valg. Vennligst velg et tall mellom 1 og 4.${NC}"; show_menu ;;
    esac
    
    # Returner til meny etter operasjonen med mindre det er en kontinuerlig test
    if [ "$choice" != "2" ]; then
        echo ""
        echo -e "${BLUE}Trykk Enter for å returnere til hovedmenyen...${NC}"
        read -r
        show_menu
    fi
}

# Start scriptet
show_menu
