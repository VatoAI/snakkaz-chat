/**
 * MCP WebRTC Test Utility
 * 
 * Dette verktøyet tester integrasjonen mellom MCP og WebRTC ved å simulere
 * ulike nettverksforhold og feilscenarier for å validere robusthet og fallback.
 */

import { MCPSignalingService, WebRTCMCPMonitor, createEnhancedPeerManager } from '../utils/webrtc/mcp-integration';
import { ConnectionState } from '../utils/webrtc/peerjs-manager';

// Konfigurasjon for testen
const config = {
  serverUrl: process.env.MCP_SERVER_URL || 'wss://mcp-signaling.snakkaz.com',
  userId1: 'test-user-1',
  userId2: 'test-user-2',
  testDuration: 30000, // 30 sekunder
  messageInterval: 500, // Send melding hvert halve sekund
  simulateDisconnect: true, // Simuler nettverksfeil
  disconnectAfter: 10000, // Simuler nettverksfeil etter 10 sekunder
  reconnectAfter: 15000, // Simuler nettverksgjennoppkobling etter 15 sekunder
};

// Hjelpefunksjon for å vente
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hjelpefunksjon for å simulere WebRTC-tilkobling
async function simulateWebRTCConnection(userId: string, peerId: string): Promise<void> {
  console.log(`[${userId}] Starter simulert WebRTC-tilkobling med ${peerId}`);

  // Opprett forsterket PeerJS Manager
  const peerManager = createEnhancedPeerManager(userId, {
    serverUrl: config.serverUrl,
    enableSignaling: true,
    enableFallback: true,
    enableMetrics: true
  });

  // Monitor for statistikk
  const monitor = new WebRTCMCPMonitor();

  // Meldingsbuffer for å håndtere midlertidig frakobling
  const messageBuffer: { to: string; data: any; timestamp: number }[] = [];

  // Start tilkobling
  try {
    // Registrer lyttere
    peerManager.onConnectionStateChange = (remotePeerId: string, state: ConnectionState) => {
      console.log(`[${userId}] Tilkoblingstilstand endret for ${remotePeerId}: ${state}`);

      if (state === 'connected') {
        monitor.recordWebRTCConnection();
      }

      if (state === 'disconnected' || state === 'failed') {
        console.log(`[${userId}] Fallback til MCP for ${remotePeerId}`);
        monitor.recordFallback();
      }
    };

    peerManager.onData((data) => {
      console.log(`[${userId}] Mottatt fra ${data.peerId}:`, data.data);
      monitor.recordMessageReceived('webrtc');
    });

    // Opprett tilkobling til peer
    console.log(`[${userId}] Forsøker å koble til ${peerId}`);
    await peerManager.connect(peerId);
    console.log(`[${userId}] Tilkoblet til ${peerId}`);

    // Signalerings-tjeneste
    const signalingService = new MCPSignalingService(config.serverUrl);
    await signalingService.connect(userId);
    console.log(`[${userId}] MCP signalerings-tjeneste tilkoblet`);

    // Start meldingssending
    let messageCount = 0;
    const sendInterval = setInterval(async () => {
      const isConnected = peerManager.getConnectionState(peerId) === 'connected';

      if (isConnected) {
        const message = {
          id: `${userId}-${messageCount++}`,
          text: `Test melding fra ${userId}`,
          timestamp: Date.now()
        };

        const success = await peerManager.send(peerId, message);

        if (success) {
          console.log(`[${userId}] Sendt melding til ${peerId}:`, message);
          monitor.recordMessageSent('webrtc');
          monitor.recordLatency(0); // I en ekte implementasjon ville vi måle faktisk ventetid
        } else {
          console.error(`[${userId}] Kunne ikke sende melding til ${peerId}`);
          monitor.recordFailedMessage();
          messageBuffer.push({
            to: peerId,
            data: message,
            timestamp: Date.now()
          });
        }
      } else {
        console.warn(`[${userId}] Ikke tilkoblet ${peerId}, bufrer melding`);
        const message = {
          id: `${userId}-${messageCount++}`,
          text: `Buffret melding fra ${userId}`,
          timestamp: Date.now()
        };

        messageBuffer.push({
          to: peerId,
          data: message,
          timestamp: Date.now()
        });

        monitor.recordFailedMessage();
      }
    }, config.messageInterval);

    // Simuler nettverksfeil hvis aktivert
    if (config.simulateDisconnect) {
      await wait(config.disconnectAfter);
      console.log(`[${userId}] Simulerer nettverksfeil`);

      // Simuler frakobling ved å lukke tilkoblingen
      peerManager.disconnect(peerId);

      // Simuler gjennoppkobling
      await wait(config.reconnectAfter - config.disconnectAfter);
      console.log(`[${userId}] Simulerer nettverksgjennoppkobling`);

      // Prøv å koble til på nytt
      try {
        await peerManager.connect(peerId);
        console.log(`[${userId}] Gjennoppkoblet til ${peerId}`);

        // Send buffrede meldinger
        console.log(`[${userId}] Sender ${messageBuffer.length} buffrede meldinger`);

        for (const msg of messageBuffer) {
          const success = await peerManager.send(msg.to, msg.data);

          if (success) {
            console.log(`[${userId}] Sendte buffret melding til ${msg.to}:`, msg.data);
            monitor.recordMessageSent('webrtc');
          } else {
            console.error(`[${userId}] Kunne ikke sende buffret melding til ${msg.to}`);
            monitor.recordFailedMessage();
          }
        }

        // Tøm bufferet
        messageBuffer.length = 0;
      } catch (err) {
        console.error(`[${userId}] Kunne ikke gjennopprette tilkobling til ${peerId}:`, err);
      }
    }

    // Kjør testen for angitt varighet
    await wait(config.testDuration);

    // Stopp meldingssending
    clearInterval(sendInterval);

    // Vis statistikk
    console.log(`[${userId}] Test fullført, statistikk:`, monitor.getMetrics());

    // Rydd opp
    peerManager.cleanup();
    signalingService.disconnect();

    console.log(`[${userId}] Test avsluttet`);
  } catch (err) {
    console.error(`[${userId}] Test feilet:`, err);
  }
}

// Hovedfunksjon for å kjøre testen
async function runTest(): Promise<void> {
  console.log('Starter MCP-WebRTC integrasjonstest');

  // Kjør begge bruker-simuleringene parallelt
  await Promise.all([
    simulateWebRTCConnection(config.userId1, config.userId2),
    simulateWebRTCConnection(config.userId2, config.userId1)
  ]);

  console.log('MCP-WebRTC integrasjonstest fullført');
}

// Kjør testen hvis dette skriptet kjøres direkte
if (require.main === module) {
  runTest()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Test feilet med feil:', err);
      process.exit(1);
    });
}
