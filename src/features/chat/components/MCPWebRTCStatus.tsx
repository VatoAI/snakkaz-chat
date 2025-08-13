import React, { useCallback, useEffect, useState } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { MCPSignalingService, WebRTCMCPMonitor } from '@/utils/webrtc/mcp-integration';

interface MCPWebRTCStatusProps {
  userId: string;
  serverUrl: string;
  authToken?: string;
}

/**
 * MCPWebRTCStatus komponent
 * 
 * Denne komponenten gir en statusvisning for WebRTC og MCP integrasjon.
 * Den viser tilkoblingstilstand, signaleringsstatus og kommunikasjonsstatus.
 */
const MCPWebRTCStatus: React.FC<MCPWebRTCStatusProps> = ({ userId, serverUrl, authToken }) => {
  const [mcpStatus, setMcpStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // WebRTC hook
  const { connectionState, connectedPeers, stats } = useWebRTC(userId);

  // Monitor for statistikk
  const [monitor] = useState(() => new WebRTCMCPMonitor());

  // MCP Signalering
  const [signalingService, setSignalingService] = useState<MCPSignalingService | null>(null);

  // Opprett signalerings-tjeneste
  useEffect(() => {
    const service = new MCPSignalingService(serverUrl, authToken);
    setSignalingService(service);

    return () => {
      service.disconnect();
    };
  }, [serverUrl, authToken]);

  // Koble til MCP
  useEffect(() => {
    if (!signalingService || !userId) return;

    const connectToMCP = async () => {
      try {
        setMcpStatus('connecting');
        const connected = await signalingService.connect(userId);

        if (connected) {
          setMcpStatus('connected');
          monitor.recordMCPConnection();
        } else {
          setMcpStatus('disconnected');
          setError('Kunne ikke koble til MCP-server');
        }
      } catch (err) {
        setMcpStatus('disconnected');
        setError(`MCP tilkoblingsfeil: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    connectToMCP();

    // Oppdater statistikk med jevne mellomrom
    const metricsInterval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 5000);

    return () => {
      clearInterval(metricsInterval);
      signalingService.disconnect();
    };
  }, [signalingService, userId, monitor]);

  // Hjelpefunksjon for å generere statusindikator
  const StatusIndicator = useCallback(({ status }: { status: string }) => {
    const getColor = () => {
      switch (status) {
        case 'connected':
          return 'bg-green-500';
        case 'connecting':
          return 'bg-yellow-500';
        case 'disconnected':
        case 'failed':
        case 'closed':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className={`w-3 h-3 rounded-full ${getColor()} mr-2`} />
    );
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">WebRTC/MCP Status</h2>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <StatusIndicator status={connectionState || 'disconnected'} />
          <span className="text-white">WebRTC: {connectionState || 'disconnected'}</span>
        </div>
        <div className="flex items-center mb-2">
          <StatusIndicator status={mcpStatus} />
          <span className="text-white">MCP Signalering: {mcpStatus}</span>
        </div>
      </div>

      {connectedPeers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Tilkoblede brukere</h3>
          <ul className="text-gray-300">
            {connectedPeers.map(peer => (
              <li key={peer} className="mb-1">{peer}</li>
            ))}
          </ul>
        </div>
      )}

      {metrics && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Statistikk</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            <div>WebRTC-tilkoblinger:</div>
            <div>{metrics.webrtcConnections}</div>
            <div>MCP-tilkoblinger:</div>
            <div>{metrics.mcpConnections}</div>
            <div>Fallback-hendelser:</div>
            <div>{metrics.fallbackCount}</div>
            <div>Meldinger sendt:</div>
            <div>{metrics.messagesSent}</div>
            <div>Meldinger mottatt:</div>
            <div>{metrics.messagesReceived}</div>
            <div>Mislykkede meldinger:</div>
            <div>{metrics.failedMessages}</div>
            <div>Gjennomsnittlig ventetid:</div>
            <div>{metrics.averageLatency.toFixed(2)} ms</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-800 text-white rounded">
          Feil: {error}
        </div>
      )}
    </div>
  );
};

export default MCPWebRTCStatus;
