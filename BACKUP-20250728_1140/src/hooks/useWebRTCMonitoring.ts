import { useState, useEffect, useCallback } from 'react';
import { useWebRTC, WebRTCConnectionStats } from './useWebRTC.new';

/**
 * Hook for connecting the WebRTCMonitor component to PeerJSManager
 * and providing functionality for monitoring WebRTC connections
 */
export const useWebRTCMonitoring = (userId?: string) => {
  const {
    isConnected,
    peers,
    connectionStats,
    showMonitor,
    toggleMonitor,
    connect,
    disconnect
  } = useWebRTC(userId);
  
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(true); // PeerJS connections are encrypted
  const [detailedStats, setDetailedStats] = useState<any>(null);

  // Update selected peer when peers list changes
  useEffect(() => {
    if (peers.length === 0) {
      setSelectedPeerId(null);
      return;
    }
    
    if (!selectedPeerId || !peers.includes(selectedPeerId)) {
      setSelectedPeerId(peers[0]);
    }
  }, [peers, selectedPeerId]);

  // Update detailed stats for the selected peer
  useEffect(() => {
    if (!selectedPeerId) {
      setDetailedStats(null);
      setIsUsingFallback(false);
      return;
    }
    
    const peerStats = connectionStats[selectedPeerId];
    if (peerStats) {
      setIsUsingFallback(!peerStats.connected);
      setIsEncrypted(true); // PeerJS connections are always encrypted when connected
      
      // Set detailed stats
      setDetailedStats({
        connectionType: peerStats.connectionType || 'Unknown',
        latency: peerStats.latency || 'Unknown',
        reliability: peerStats.reliable ? 'Reliable' : 'Unreliable',
        bytesReceived: peerStats.bytesReceived || 'N/A',
        bytesSent: peerStats.bytesSent || 'N/A'
      });
    } else {
      setIsUsingFallback(true);
      setIsEncrypted(false);
      setDetailedStats(null);
    }
  }, [selectedPeerId, connectionStats]);

  // Handle selecting a peer for detailed monitoring
  const selectPeer = useCallback((peerId: string) => {
    setSelectedPeerId(peerId);
  }, []);

  // Get connection stats summary
  const getConnectionSummary = useCallback(() => {
    const activeCount = Object.values(connectionStats).filter(stat => stat.connected).length;
    
    return {
      activeConnections: activeCount,
      totalPeers: peers.length,
      encryptedConnections: activeCount, // All PeerJS connections are encrypted
      lastUpdate: Date.now()
    };
  }, [connectionStats, peers]);

  // Initiate reconnection to a peer
  const initiateReconnect = useCallback(async () => {
    if (!selectedPeerId) return;
    
    try {
      // Disconnect first to clear any existing connection
      disconnect(selectedPeerId);
      
      // Then reconnect
      await connect(selectedPeerId);
    } catch (error) {
      console.error(`Error reconnecting to peer ${selectedPeerId}:`, error);
    }
  }, [selectedPeerId, connect, disconnect]);

  return {
    isConnected,
    selectedPeerId,
    peers,
    selectPeer,
    isUsingFallback,
    isEncrypted,
    detailedStats,
    connectionSummary: getConnectionSummary(),
    initiateReconnect,
    showMonitor,
    toggleMonitor,
    ready: isConnected
  };
};
