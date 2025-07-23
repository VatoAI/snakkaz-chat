import React, { useState, useEffect } from 'react';
import { useWebRTCMonitoring } from '../../hooks/useWebRTCMonitoring.new';
import { useWebRTC } from '../../hooks/useWebRTC.new';
import { useWebRTCDirectMessaging } from '../../hooks/useWebRTCDirectMessaging.new';
import WebRTCStatus from './WebRTCStatus.new';

interface WebRTCMonitorProps {
  userId: string;
  peerId?: string;
  className?: string;
  compact?: boolean;
}

/**
 * WebRTCMonitor - Component for monitoring and displaying WebRTC connection details
 * 
 * Provides a detailed view of connection statistics, peer info, and connection quality
 * for debugging and transparency in SnakkaZ Chat.
 */
const WebRTCMonitor: React.FC<WebRTCMonitorProps> = ({
  userId,
  peerId,
  className = '',
  compact = false
}) => {
  const webrtc = useWebRTC();
  const monitoring = useWebRTCMonitoring();
  const messaging = useWebRTCDirectMessaging(userId, peerId || '');
  const [expanded, setExpanded] = useState<boolean>(!compact);
  
  // Use connection state from the direct messaging hook
  const connectionState = messaging.connectionState;
  const isEncrypted = messaging.isEncrypted;
  const latency = messaging.latency;

  // Auto-refresh stats every 5 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // This will trigger a re-render with updated stats
      // The actual refreshing happens in the hooks
    }, 5000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const handleRetryConnection = () => {
    if (monitoring.initiateReconnect) {
      monitoring.initiateReconnect().catch(err => {
        console.error("Failed to reconnect WebRTC:", err);
      });
    }
  };

  if (!userId) {
    return null;
  }

  const toggleExpanded = () => setExpanded(!expanded);

  // Extract stats from detailed stats
  const peerStatus = webrtc.peers?.length > 0 ? 'connected' : 'disconnected';
  const statusInfo = messaging.statusInfo ? messaging.statusInfo() : {};
  const bandwidth = statusInfo.bandwidth;
  const packetLoss = statusInfo.packetLoss;
  const cipherInfo = statusInfo.cipher;

  // Basic monitor - just shows connection status with tooltip
  if (compact) {
    return (
      <div className={className}>
        <WebRTCStatus 
          connectionStatus={connectionState}
          isEncrypted={isEncrypted}
          latency={latency}
          onRetryConnection={handleRetryConnection}
        />
      </div>
    );
  }

  // Detailed monitor
  return (
    <div className={`bg-gray-800 rounded-md shadow-lg p-3 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-sm font-medium">WebRTC-tilkobling</h3>
        <WebRTCStatus 
          connectionStatus={connectionState}
          isEncrypted={isEncrypted}
          latency={latency}
          onRetryConnection={handleRetryConnection}
          showDetails={true}
        />
      </div>
      
      {expanded && (
        <div className="text-xs space-y-2 text-gray-300">
          {/* Connection details */}
          <div className="grid grid-cols-2 gap-1">
            <div className="text-gray-400">Status:</div>
            <div>{peerStatus}</div>
            
            <div className="text-gray-400">Type:</div>
            <div>{connectionState}</div>
            
            <div className="text-gray-400">Latens:</div>
            <div>{latency ? `${latency}ms` : 'Måler...'}</div>
            
            {bandwidth !== undefined && (
              <>
                <div className="text-gray-400">Båndbredde:</div>
                <div>{bandwidth < 1000 ? `${bandwidth} Kbps` : `${(bandwidth/1000).toFixed(1)} Mbps`}</div>
              </>
            )}
            
            {packetLoss !== undefined && (
              <>
                <div className="text-gray-400">Pakketap:</div>
                <div>{packetLoss.toFixed(1)}%</div>
              </>
            )}
            
            <div className="text-gray-400">Kryptert:</div>
            <div>{isEncrypted ? 'Ja' : 'Nei'}</div>
            
            {isEncrypted && cipherInfo && (
              <>
                <div className="text-gray-400">Kryptering:</div>
                <div>{cipherInfo}</div>
              </>
            )}
          </div>
          
          {connectionState === 'error' && (
            <button 
              onClick={handleRetryConnection}
              className="mt-2 w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
            >
              Prøv igjen
            </button>
          )}
        </div>
      )}
      
      {/* Expand/collapse toggle for compact mode */}
      <button 
        onClick={toggleExpanded} 
        className="mt-1 w-full text-xs text-gray-400 hover:text-white"
      >
        {expanded ? 'Vis mindre' : 'Vis mer'}
      </button>
    </div>
  );
};

export default WebRTCMonitor;
