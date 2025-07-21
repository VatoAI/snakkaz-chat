# MCP og WebRTC Integrasjon for SnakkaZ

## Oversikt

Denne dokumentasjonen beskriver hvordan vi kan integrere Model Context Protocol (MCP) med vårt eksisterende WebRTC-system for å skape en mer robust, sikker og skalerbar kommunikasjonsplattform.

## Hva er MCP?

Model Context Protocol (MCP) er en protokoll for å strukturere kommunikasjon mellom AI-modeller og applikasjoner. Den gir en standardisert måte for å sende kontekst, kommandoer, og resultater mellom klient og server.

## Fordeler med MCP + WebRTC Integrasjon

1. **Strukturert kommunikasjon med AI-modeller**:
   - MCP gir en strukturert måte å kommunisere med AI-modeller som kan være integrert i SnakkaZ-plattformen.
   - Standardisert protokoll for å sende kontekst og motta resultater.

2. **Sikkerhet**:
   - MCP kan støtte krypterte meldinger som komplement til vårt WebRTC E2EE-lag.
   - Autentiseringsprotokoller i MCP kan forsterke brukervalidering.

3. **Skalerbarhet**:
   - MCP tilbyr en strukturert måte å håndtere modellkontekst på tvers av flere samtaler.
   - Bedre håndtering av AI-assisterte samtaler i stor skala.

4. **Robusthet**:
   - MCP kan brukes til å implementere fallback-mekanismer for WebRTC-kommunikasjon.
   - Sikre konsistent meldingshåndtering selv ved nettverksproblemer.

## Implementasjonsstrategi

### 1. MCP Server Integration

Vi bør sette opp en dedikert MCP-server som kan fungere som:

- Backup for WebRTC-kommunikasjon
- AI-modellintegrasjon for intelligente chatfunksjoner
- Sikkerhetslag for autentisering og autorisasjon

```typescript
// src/services/mcp/mcpServer.ts
import { createMCPServer } from '@mcp/server';
import { MCPMessageHandler } from './mcpMessageHandler';
import { securityMiddleware } from '../security/middleware';

export function initializeMCPServer() {
  const mcpServer = createMCPServer({
    port: process.env.MCP_PORT || 3001,
    middleware: [securityMiddleware],
    handlers: {
      message: MCPMessageHandler,
      // Andre handlers her
    },
    fallbackOptions: {
      webRTCFallback: true,
      maxRetries: 5,
      retryDelay: 1000
    }
  });
  
  return mcpServer;
}
```

### 2. WebRTC + MCP Integration Hook

```typescript
// src/hooks/useMCPWebRTC.ts
import { useWebRTC } from './useWebRTC';
import { useWebRTCDirectMessaging } from './useWebRTCDirectMessaging';
import { useMCP } from './useMCP';

export function useMCPWebRTC(userId: string, peerId: string) {
  const webrtc = useWebRTC();
  const directMessaging = useWebRTCDirectMessaging(userId, peerId);
  const mcp = useMCP();
  
  // Kombinert meldingsfunksjon som kan bruke MCP eller WebRTC
  const sendMessage = async (content: string, options = {}) => {
    try {
      // Forsøk WebRTC først
      if (directMessaging.connectionState === 'p2p') {
        const success = await directMessaging.sendMessage(content);
        if (success) return { success: true, method: 'webrtc-p2p' };
      }
      
      // Fallback til MCP hvis WebRTC mislykkes
      const mcpResult = await mcp.sendMessage({
        to: peerId,
        from: userId,
        content,
        metadata: {
          originalMethod: 'webrtc-fallback',
          timestamp: Date.now(),
          ...options
        }
      });
      
      return { success: true, method: 'mcp', result: mcpResult };
    } catch (error) {
      console.error('Failed to send message via both WebRTC and MCP:', error);
      return { success: false, error };
    }
  };
  
  return {
    ...directMessaging,
    sendMessageWithMCP: sendMessage,
    mcpStatus: mcp.status,
    mcpReady: mcp.isReady
  };
}
```

### 3. Sikker MCP Hook for AI-samtaler

```typescript
// src/hooks/useMCP.ts
import { useEffect, useState } from 'react';
import { MCPClient } from '@mcp/client';
import { useAuth } from './useAuth';
import { encryptMessage, decryptMessage } from '../utils/crypto';

export function useMCP() {
  const { user } = useAuth();
  const [client, setClient] = useState<MCPClient | null>(null);
  const [status, setStatus] = useState('disconnected');
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const mcpClient = new MCPClient({
      url: process.env.MCP_SERVER_URL,
      userId: user.id,
      authToken: user.token,
      onConnect: () => {
        setStatus('connected');
        setIsReady(true);
      },
      onDisconnect: () => {
        setStatus('disconnected');
        setIsReady(false);
      },
      onError: (error) => {
        console.error('MCP connection error:', error);
        setStatus('error');
      }
    });
    
    mcpClient.connect();
    setClient(mcpClient);
    
    return () => {
      mcpClient.disconnect();
    };
  }, [user]);
  
  const sendMessage = async (messageData: any) => {
    if (!client || !isReady) {
      throw new Error('MCP client not ready');
    }
    
    // Krypter meldingen før sending hvis nødvendig
    const secureMessage = messageData.encrypted 
      ? { ...messageData, content: encryptMessage(messageData.content, messageData.to) }
      : messageData;
    
    return client.sendMessage(secureMessage);
  };
  
  return {
    client,
    status,
    isReady,
    sendMessage
  };
}
```

### 4. MCP Sikkerhet og Kryptering

```typescript
// src/services/security/mcpSecurity.ts
import { MCPEncryptionProvider } from '@mcp/security';
import { generateKeyPair, deriveSharedKey } from '../crypto/keyManagement';

export class SnakkazMCPSecurity implements MCPEncryptionProvider {
  private keyPairs = new Map<string, CryptoKeyPair>();
  private sharedKeys = new Map<string, CryptoKey>();
  
  async initialize(userId: string) {
    if (!this.keyPairs.has(userId)) {
      const keyPair = await generateKeyPair();
      this.keyPairs.set(userId, keyPair);
    }
    return this;
  }
  
  async establishSecureChannel(userId: string, peerId: string, peerPublicKey: JsonWebKey) {
    const myKeyPair = this.keyPairs.get(userId);
    if (!myKeyPair) throw new Error('No key pair available');
    
    const importedPeerKey = await crypto.subtle.importKey(
      'jwk',
      peerPublicKey,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );
    
    const sharedKey = await deriveSharedKey(myKeyPair.privateKey, importedPeerKey);
    const channelId = [userId, peerId].sort().join('-');
    
    this.sharedKeys.set(channelId, sharedKey);
    return true;
  }
  
  async encryptMessage(message: string, fromUserId: string, toUserId: string): Promise<string> {
    const channelId = [fromUserId, toUserId].sort().join('-');
    const sharedKey = this.sharedKeys.get(channelId);
    
    if (!sharedKey) {
      throw new Error('Secure channel not established');
    }
    
    // Implementer faktisk kryptering her
    // Dette er en forenklet representasjon
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sharedKey,
      data
    );
    
    // Kombiner IV og kryptert data
    const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
    encryptedArray.set(iv, 0);
    encryptedArray.set(new Uint8Array(encryptedData), iv.length);
    
    return btoa(String.fromCharCode(...encryptedArray));
  }
  
  async decryptMessage(encryptedMessage: string, fromUserId: string, toUserId: string): Promise<string> {
    const channelId = [fromUserId, toUserId].sort().join('-');
    const sharedKey = this.sharedKeys.get(channelId);
    
    if (!sharedKey) {
      throw new Error('Secure channel not established');
    }
    
    // Dekoder base64-strengen
    const encryptedBytes = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
    
    // Hent IV og kryptert data
    const iv = encryptedBytes.slice(0, 12);
    const encryptedData = encryptedBytes.slice(12);
    
    // Dekrypter dataene
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      sharedKey,
      encryptedData
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }
}
```

## Integrasjon med eksisterende WebRTC-komponenter

For å integrere MCP med våre eksisterende WebRTC-komponenter, kan vi oppdatere vår `chat-integration.ts` fil:

```typescript
// src/utils/webrtc/chat-integration.ts
import { useMCPWebRTC } from '../../hooks/useMCPWebRTC';
import { useWebRTCMonitoring } from '../../hooks/useWebRTCMonitoring';

export function useEnhancedChatIntegration(userId: string, peerId: string) {
  const mcpWebRTC = useMCPWebRTC(userId, peerId);
  const monitoring = useWebRTCMonitoring();
  
  return {
    ...mcpWebRTC,
    monitoring,
    isSecure: mcpWebRTC.isEncrypted || mcpWebRTC.mcpStatus === 'secure',
    connectionType: mcpWebRTC.connectionState === 'p2p' 
      ? 'peer-to-peer' 
      : mcpWebRTC.mcpReady ? 'mcp-server' : 'disconnected',
    sendMessage: mcpWebRTC.sendMessageWithMCP
  };
}
```

## Fordeler ved denne implementasjonen

1. **Robust kommunikasjon**: Ved å kombinere WebRTC og MCP får vi to separate kommunikasjonskanaler. Hvis WebRTC svikter, kan vi falle tilbake på MCP.

2. **Økt sikkerhet**: Ved å implementere ende-til-ende-kryptering på både WebRTC- og MCP-nivå, får vi et ekstra sikkerhetslag.

3. **AI-integrering**: MCP gjør det enkelt å integrere AI-modeller i chatten, som kan brukes til å tilby intelligente funksjoner som oversettelse, sammendrag, og anbefalinger.

4. **Bedre feilhåndtering**: Med to kommunikasjonssystemer kan vi håndtere nettverksavbrudd og andre feil mer elegant.

5. **Skalerbarhet**: MCP-serveren kan håndtere tung trafikk og komplekse operasjoner, som avlaster enhetene til brukerne.

## Neste steg

1. Sett opp en MCP-server for SnakkaZ
2. Implementer MCP-hooks og integrasjon
3. Oppdater WebRTC-fallback til å bruke MCP
4. Test med ulike nettverksforhold og brukere
5. Overvåk ytelsen og gjør nødvendige justeringer
