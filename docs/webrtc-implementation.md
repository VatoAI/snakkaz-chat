# WebRTC i SnakkaZ Chat

Dette dokumentet beskriver WebRTC-implementasjonen i SnakkaZ Chat-applikasjonen og fungerer som teknisk referanse for utvikling og feilsøking.

## Oversikt

SnakkaZ Chat bruker WebRTC (Web Real-Time Communication) for å muliggjøre direktekommunikasjon mellom brukere. Dette gir følgende fordeler:

- **Direkte P2P-kommunikasjon** mellom brukere uten å gå via serveren (når mulig)
- **Ende-til-ende-kryptering (E2EE)** for økt sikkerhet
- **Redusert serverbelastning** da data går direkte mellom brukere
- **Redusert forsinkelse** sammenlignet med server-mediert kommunikasjon

## Arkitektur

WebRTC-implementasjonen i SnakkaZ Chat består av følgende hovedkomponenter:

1. **Signalering** - Via Supabase-realtime kanaler
2. **P2P-tilkobling** - Direkte forbindelse mellom brukere
3. **Fallback-mekanisme** - Tradisjonell server-kommunikasjon når WebRTC ikke fungerer
4. **Ende-til-ende-kryptering** - For sikker meldingsutveksling

### Signalering

For å etablere WebRTC-tilkoblinger, bruker vi en signaleringsmekanisme via Supabase Realtime:

```typescript
// Forenklet eksempel på signaleringslogikk
async function initiateSignaling(targetUserId: string) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  
  // Send tilbudet til målets bruker via Supabase Realtime
  await supabase
    .from('signaling')
    .insert({
      sender_id: currentUserId,
      receiver_id: targetUserId,
      type: 'offer',
      payload: JSON.stringify(offer)
    });
}
```

### P2P-tilkobling

Selve P2P-tilkoblingen håndteres av WebRTC API-er:

```typescript
// Forenklet eksempel på oppretting av P2P-tilkobling
function createPeerConnection(targetUserId: string) {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  });
  
  // Opprett datakanal for chat
  const dataChannel = peerConnection.createDataChannel('chat');
  
  dataChannel.onopen = () => {
    console.log(`Tilkobling etablert med ${targetUserId}`);
    connectionStatus.set('connected');
  };
  
  // Lytt etter meldinger
  dataChannel.onmessage = (event) => {
    const decryptedMessage = decryptMessage(event.data);
    addMessageToConversation(decryptedMessage);
  };
  
  return { peerConnection, dataChannel };
}
```

### Fallback-mekanisme

Hvis WebRTC-tilkoblingen ikke kan opprettes, faller vi tilbake til tradisjonell server-kommunikasjon:

```typescript
// Forenklet eksempel på fallback-logikk
function setupCommunication(targetUserId: string) {
  try {
    // Forsøk WebRTC først
    const { peerConnection, dataChannel } = createPeerConnection(targetUserId);
    
    // Start signaleringssekvensen
    initiateSignaling(targetUserId);
    
    // Sett en timeout for fallback
    const fallbackTimer = setTimeout(() => {
      if (connectionStatus.get() !== 'connected') {
        console.log('WebRTC-tilkobling mislyktes, bruker server-fallback');
        setupServerFallback(targetUserId);
      }
    }, 10000); // 10 sekunder timeout
    
    // Rydd opp timer hvis tilkoblingen lykkes
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        clearTimeout(fallbackTimer);
      }
    };
    
  } catch (error) {
    console.error('WebRTC ikke støttet eller feilet:', error);
    setupServerFallback(targetUserId);
  }
}

function setupServerFallback(targetUserId: string) {
  connectionStatus.set('server-fallback');
  // Bruk tradisjonell Supabase-kommunikasjon istedenfor
  setupSupabaseSubscription(targetUserId);
}
```

### Ende-til-ende-kryptering (E2EE)

For å sikre meldingene, implementerer vi ende-til-ende-kryptering når WebRTC brukes:

```typescript
// Forenklet eksempel på E2EE-implementasjon
async function generateKeyPair() {
  // Generer et krypteringsnøkkelpar
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  
  return keyPair;
}

async function establishSharedSecret(publicKeyFromPartner) {
  // Bruk vår private nøkkel og partnerens offentlige nøkkel
  // for å generere en delt hemmelighet
  const sharedSecret = await window.crypto.subtle.deriveBits(
    {
      name: "ECDH",
      public: publicKeyFromPartner
    },
    myKeyPair.privateKey,
    256
  );
  
  // Konverter den delte hemmeligheten til en krypteringsnøkkel
  const encryptionKey = await window.crypto.subtle.importKey(
    "raw",
    sharedSecret,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
  
  return encryptionKey;
}

async function encryptMessage(message, encryptionKey) {
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  
  // Generer en tilfeldig initialiserings-vektor (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Krypter meldingen
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    encryptionKey,
    encodedMessage
  );
  
  // Kombiner IV og krypterte data for overføring
  const result = new Uint8Array(iv.length + encryptedData.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encryptedData), iv.length);
  
  return result;
}

async function decryptMessage(encryptedMessage, encryptionKey) {
  // Skill IV fra krypterte data
  const iv = encryptedMessage.slice(0, 12);
  const ciphertext = encryptedMessage.slice(12);
  
  // Dekrypter meldingen
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    encryptionKey,
    ciphertext
  );
  
  // Konverter tilbake til tekst
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}
```

## ICE-servere og STUN/TURN

For å håndtere NAT-traversering og brannmurer bruker vi følgende konfigurasjon:

```typescript
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },  // Google STUN-server
  { urls: 'stun:stun1.l.google.com:19302' }, // Backup STUN-server
  { urls: 'stun:stun2.l.google.com:19302' }, // Ytterligere backup
  // TURN-server konfigureres senere for produksjonsmiljøet
  // { urls: 'turn:turn.snakkaz.com', username: 'username', credential: 'password' }
];
```

For produksjonsmiljøet planlegger vi å implementere vår egen TURN-server for å håndtere situasjoner der direkte P2P-tilkoblinger ikke er mulige på grunn av strenge NAT-konfigurasjoner eller brannmurer.

## Feilhåndtering og overvåking

Vi har implementert omfattende feilhåndtering og overvåking for WebRTC:

```typescript
// Forenklet eksempel på feilhåndtering og overvåking
function setupWebRTCMonitoring(peerConnection) {
  peerConnection.oniceconnectionstatechange = () => {
    const state = peerConnection.iceConnectionState;
    console.log(`ICE-tilstandsendring: ${state}`);
    
    switch (state) {
      case 'failed':
        // ICE-tilkobling mislyktes
        console.error('ICE-tilkobling mislyktes');
        triggerFallback();
        break;
      case 'disconnected':
        // Midlertidig tilkoblingsproblem
        console.warn('WebRTC-tilkobling midlertidig brutt');
        startReconnectTimeout();
        break;
      case 'closed':
        // Tilkoblingen ble lukket
        console.log('WebRTC-tilkobling lukket');
        cleanupWebRTC();
        break;
    }
  };
  
  peerConnection.onconnectionstatechange = () => {
    const state = peerConnection.connectionState;
    console.log(`Tilkoblingstilstandsendring: ${state}`);
    
    switch (state) {
      case 'failed':
        console.error('WebRTC-tilkobling mislyktes permanent');
        triggerFallback();
        break;
    }
  };
  
  // Logg statistikk periodisk
  setInterval(() => {
    if (peerConnection.connectionState === 'connected') {
      peerConnection.getStats().then(stats => {
        let bytesReceived = 0;
        let bytesSent = 0;
        let packetsLost = 0;
        
        stats.forEach(report => {
          if (report.type === 'data-channel') {
            bytesReceived += report.bytesReceived || 0;
            bytesSent += report.bytesSent || 0;
          }
          if (report.packetsLost) {
            packetsLost += report.packetsLost;
          }
        });
        
        console.log(`WebRTC-statistikk: Sendt=${bytesSent}B, Mottatt=${bytesReceived}B, Tapte pakker=${packetsLost}`);
      });
    }
  }, 10000); // Hver 10. sekund
}
```

## Skalerbarhet og fremtidig utvikling

WebRTC-implementasjonen vår er designet for å være skalerbar, med følgende hensyn:

1. **Gruppechat-støtte** - Utvidet P2P mesh-nettverk for mindre grupper
2. **Media-deling** - Fremtidig støtte for lyd og video
3. **Custom TURN-server** - Egen server for å forbedre tilkoblingssuksessraten
4. **Optimalisert signaleringsprotokoll** - For raskere tilkoblingsetablering
5. **Adaptiv koderingskvalitet** - Basert på nettverkskvalitet

### Planlagte forbedringer

- Implementere WebTransport som alternativ til WebRTC for nyere nettlesere
- Forbedre krypteringsprotokoller med Signal Protocol for bedre sikkerhet
- Automatisk bytting mellom P2P og server-basert basert på nettverkskvalitet
- Preflight-tester for å vurdere WebRTC-støtte før chatstart

## Testing og validering

For å sikre at WebRTC-implementasjonen fungerer korrekt på tvers av enheter og nettlesere, har vi følgende testprosedyrer:

1. **Automatiserte enhetstester** - Tester individuelle komponenter
2. **Integrasjonstester** - Tester samspill mellom komponenter
3. **End-to-end tester** - Tester hele systemet
4. **Browser-kompatibilitetstester** - Chrome, Firefox, Safari, Edge
5. **Nettverkssimulering** - Tester under forskjellige nettverksforhold

For å kjøre WebRTC-testsuite, bruk følgende kommando:
```
./snakkaz-webrtc-test.sh
```

## Referanser og dokumentasjon

- [WebRTC-API-dokumentasjon](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [WebCrypto-API-dokumentasjon](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [WebRTC-sikkerhetsbetraktninger](https://webrtc-security.github.io/)
- [ICE-protokoll (RFC 8445)](https://tools.ietf.org/html/rfc8445)
- [SDP-protokoll (RFC 4566)](https://tools.ietf.org/html/rfc4566)

## Feilsøking

### Vanlige problemer og løsninger

1. **Tilkobling mislyktes fullstendig**
   - Sjekk at STUN-servere er tilgjengelige
   - Verifiser at nettverkskonfigurasjon tillater UDP
   - Bruk testskriptet for å validere WebRTC-støtte

2. **Tilkobling opprettet men meldinger kommer ikke frem**
   - Sjekk at datakanalen er åpen
   - Verifiser at krypteringsnøkler er korrekt utvekslet
   - Sjekk for feil i dekrypteringsprosessen

3. **Tilkoblingen er ustabil**
   - Sjekk nettverkskvalitet
   - Verifiser ICE-kandidatinnsamlingsprosessen
   - Vurder å justere ICE-timeout-verdier

4. **E2EE fungerer ikke**
   - Sjekk at nettleseren støtter Web Crypto API
   - Verifiser at nøkkelutvekslingsprosessen er fullført
   - Sjekk for feil i krypterings-/dekrypteringsprosessen
