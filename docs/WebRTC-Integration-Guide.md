# WebRTC Integrasjonsguide for SnakkaZ Chat

Denne guiden viser hvordan du kan integrere WebRTC-funksjonaliteten i SnakkaZ Chat i egne komponenter og sider.

## Grunnleggende integrering

### 1. Importere nødvendige hooks

```tsx
import { useWebRTC, useSignaling } from '@/hooks/webrtc-hooks';
```

### 2. Bruke WebRTC-statuskomponenten

```tsx
import { WebRTCStatus } from '@/components/chat';

// I din komponent:
<WebRTCStatus 
  connectionStatus="p2p" 
  isEncrypted={true} 
  showText={true} 
/>
```

### 3. Integrere den fullstendige chatløsningen

```tsx
import { ChatContainer } from '@/components/chat';

// I din komponent:
<ChatContainer 
  peerId="bruker-id-til-mottaker" 
  onClose={() => { /* Håndtere lukking */ }} 
/>
```

## Avansert integrering

### WebRTC direktemelding-hook

For mer kontroll over WebRTC-funksjonaliteten kan du bruke `useWebRTCDirectMessaging`-hooken:

```tsx
import { useWebRTCDirectMessaging } from '@/hooks/webrtc-hooks';

function MinChatKomponent() {
  const currentUserId = "din-bruker-id";
  const peerId = "mottaker-bruker-id";
  
  const {
    connectionState,
    isEncrypted,
    latency,
    connect,
    sendMessage,
    statusInfo
  } = useWebRTCDirectMessaging(currentUserId, peerId);
  
  const handleSendMessage = async (text) => {
    const success = await sendMessage(text);
    if (success) {
      console.log("Melding sendt!");
    }
  };
  
  return (
    <div>
      <div>Status: {connectionState}</div>
      <div>Kryptert: {isEncrypted ? 'Ja' : 'Nei'}</div>
      <div>Latens: {latency || 'Ukjent'} ms</div>
      
      <button onClick={connect}>Koble til</button>
      <button onClick={() => handleSendMessage("Hei der!")}>Send melding</button>
    </div>
  );
}
```

### Integrert chat med server-fallback

For å kombinere fordelene med WebRTC og server-basert historikk, bruk `useIntegratedChat`-hooken:

```tsx
import { useIntegratedChat } from '@/hooks/webrtc-hooks';

function MinIntegrerteChat({ currentUserId, peerId }) {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    connectionState,
    isEncrypted
  } = useIntegratedChat(currentUserId, peerId, {
    p2pTimeout: 10000,  // 10 sekunder timeout før fallback
    maxRetries: 3       // Maks antall forsøk
  });
  
  if (isLoading) return <div>Laster...</div>;
  if (error) return <div>Feil: {error}</div>;
  
  return (
    <div>
      {/* Vis meldinger */}
      <div>
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.senderId === currentUserId ? 'Du' : 'Andre'}:</strong> 
            {msg.content}
            {msg.isP2P && <span>(P2P)</span>}
          </div>
        ))}
      </div>
      
      {/* Send meldingsform */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        sendMessage(input.value);
        input.value = '';
      }}>
        <input name="message" type="text" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## WebRTC Monitor-verktøyet

For avansert debugging og overvåking, kan du bruke WebRTCMonitor-komponenten:

```tsx
import { useWebRTCMonitoring } from '@/hooks/webrtc-hooks';
import { WebRTCMonitor } from '@/components/chat/WebRTCMonitor';

function MinDebuggingSide() {
  const {
    peerList,
    selectedPeer,
    selectPeer,
    toggleShowStats,
    showStats,
    connectionStats
  } = useWebRTCMonitoring();
  
  return (
    <div>
      <h2>WebRTC Overvåking</h2>
      
      <div>
        <select 
          value={selectedPeer || ''} 
          onChange={(e) => selectPeer(e.target.value)}
        >
          <option value="">Velg peer</option>
          {peerList.map(peer => (
            <option key={peer} value={peer}>{peer}</option>
          ))}
        </select>
        
        <button onClick={toggleShowStats}>
          {showStats ? 'Skjul statistikk' : 'Vis statistikk'}
        </button>
      </div>
      
      {selectedPeer && (
        <WebRTCMonitor 
          peerId={selectedPeer} 
          connectionStats={connectionStats}
          showStats={showStats}
        />
      )}
    </div>
  );
}
```

## Tilpasse WebRTC-konfigurasjonen

Du kan tilpasse ICE-servere og andre konfigurasjonsmuligheter i WebRTCManager:

```tsx
import { useEffect } from 'react';
import { useWebRTC } from '@/hooks/webrtc-hooks';

function MinAppInit() {
  const { webRTCManager } = useWebRTC();
  
  useEffect(() => {
    if (webRTCManager) {
      // Konfigurer egne STUN/TURN-servere
      webRTCManager.setIceServers([
        { urls: 'stun:stun.example.com:19302' },
        {
          urls: 'turn:turn.example.com:3478',
          username: 'brukernavn',
          credential: 'passord'
        }
      ]);
      
      // Sett andre konfigurasjonsalternativer
      webRTCManager.setConfiguration({
        bundlePolicy: 'max-bundle',
        iceCandidatePoolSize: 10
      });
    }
  }, [webRTCManager]);
  
  return null; // Denne komponenten rendrer ingenting
}
```

## Ytelse og feilsøking

- **Latenstesting**: Du kan måle latens mellom to brukere ved å bruke `latency`-verdien fra hooks.
- **Tilkoblingsmonitorering**: Bruk `connectionState` for å overvåke WebRTC-tilkoblingsstatusen.
- **Fallback-deteksjon**: Sjekk når systemet bytter til servermodus ved å lytte på endringer i `connectionState`.
- **Feilhåndtering**: Alle hooks returnerer feilinformasjon som kan brukes til å vise relevant feedback til brukerne.

## Sikkerhet

WebRTC-implementasjonen i SnakkaZ Chat prioriterer sikkerhet med ende-til-ende-kryptering. Du kan bruke `isEncrypted`-statusen for å informere brukere om sikkerhetsnivået på gjeldende tilkobling.

```tsx
function SikkerhetsIndikator({ isEncrypted }) {
  return (
    <div className={`security-indicator ${isEncrypted ? 'secure' : 'not-secure'}`}>
      {isEncrypted ? '🔒 Ende-til-ende-kryptert' : '🔓 Ikke kryptert'}
    </div>
  );
}
```
