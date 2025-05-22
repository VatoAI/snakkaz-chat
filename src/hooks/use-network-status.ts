/**
 * Hook for å overvåke nettverksstatus og håndtere nettverksfeil
 * Del av forbedret feilhåndtering for Snakkaz Chat
 * 
 * Implementert: 22. mai 2025
 */

import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  online: boolean;
  wasOffline: boolean;
  lastOnlineTime: Date | null;
  lastOfflineTime: Date | null;
  reconnecting: boolean;
  retryCount: number;
}

export interface NetworkStatusOptions {
  retryInterval?: number;
  maxRetries?: number;
  onReconnect?: () => void;
  onOffline?: () => void;
  enablePing?: boolean;
  pingUrl?: string;
  pingInterval?: number;
}

const defaultOptions: NetworkStatusOptions = {
  retryInterval: 5000,
  maxRetries: 3,
  enablePing: false,
  pingUrl: '/api/ping',
  pingInterval: 30000,
};

/**
 * Hook for å overvåke og håndtere nettverksstatus
 */
export function useNetworkStatus(options: NetworkStatusOptions = {}) {
  const mergedOptions = { ...defaultOptions, ...options };
  const [status, setStatus] = useState<NetworkStatus>({
    online: navigator.onLine,
    wasOffline: false,
    lastOnlineTime: navigator.onLine ? new Date() : null,
    lastOfflineTime: !navigator.onLine ? new Date() : null,
    reconnecting: false,
    retryCount: 0,
  });

  // Funksjon for å sjekke om serveren er tilgjengelig
  const checkServerConnection = useCallback(async (): Promise<boolean> => {
    if (!mergedOptions.enablePing) return true;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(mergedOptions.pingUrl!, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('Server connection check failed:', error);
      return false;
    }
  }, [mergedOptions.enablePing, mergedOptions.pingUrl]);

  // Funksjon for å håndtere når nettverket kommer tilbake online
  const handleOnline = useCallback(async () => {
    // Sjekk om serveren faktisk er tilgjengelig
    const serverAvailable = await checkServerConnection();
    
    if (serverAvailable) {
      setStatus(prev => ({
        ...prev,
        online: true,
        wasOffline: prev.lastOfflineTime !== null,
        lastOnlineTime: new Date(),
        reconnecting: false,
        retryCount: 0,
      }));
      
      if (mergedOptions.onReconnect) {
        mergedOptions.onReconnect();
      }
    } else {
      // Serveren er ikke tilgjengelig selv om nettverket er online
      setStatus(prev => ({
        ...prev,
        online: false,
        wasOffline: true,
      }));
    }
  }, [checkServerConnection, mergedOptions]);

  // Funksjon for å håndtere når nettverket går offline
  const handleOffline = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      online: false,
      lastOfflineTime: new Date(),
      reconnecting: true,
      retryCount: 0,
    }));
    
    if (mergedOptions.onOffline) {
      mergedOptions.onOffline();
    }
  }, [mergedOptions]);

  // Funksjon for å forsøke å koble til på nytt
  const attemptReconnect = useCallback(async () => {
    if (navigator.onLine) {
      const serverAvailable = await checkServerConnection();
      
      if (serverAvailable) {
        setStatus(prev => ({
          ...prev,
          online: true,
          wasOffline: true,
          lastOnlineTime: new Date(),
          reconnecting: false,
        }));
        
        if (mergedOptions.onReconnect) {
          mergedOptions.onReconnect();
        }
        return;
      }
    }
    
    setStatus(prev => {
      // Stopp rekonnektering hvis maksantall forsøk er nådd
      const newRetryCount = prev.retryCount + 1;
      const shouldContinueRetrying = newRetryCount < (mergedOptions.maxRetries || 3);
      
      return {
        ...prev,
        retryCount: newRetryCount,
        reconnecting: shouldContinueRetrying,
      };
    });
  }, [checkServerConnection, mergedOptions]);

  // Registrer hendelseslyttere for online/offline status
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Håndter rekonnektering når nettverket går offline
  useEffect(() => {
    let reconnectTimer: number | undefined;
    
    if (status.reconnecting) {
      reconnectTimer = window.setTimeout(attemptReconnect, mergedOptions.retryInterval);
    }
    
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [status.reconnecting, status.retryCount, attemptReconnect, mergedOptions.retryInterval]);

  // Periodisk ping for å sjekke serverstatus
  useEffect(() => {
    let pingTimer: number | undefined;
    
    if (mergedOptions.enablePing && status.online) {
      pingTimer = window.setInterval(async () => {
        const serverAvailable = await checkServerConnection();
        
        if (!serverAvailable && status.online) {
          setStatus(prev => ({
            ...prev,
            online: false,
            lastOfflineTime: new Date(),
            reconnecting: true,
            retryCount: 0,
          }));
          
          if (mergedOptions.onOffline) {
            mergedOptions.onOffline();
          }
        }
      }, mergedOptions.pingInterval);
    }
    
    return () => {
      if (pingTimer) {
        clearInterval(pingTimer);
      }
    };
  }, [mergedOptions, status.online, checkServerConnection]);

  // Funksjon for å manuelt tvinge en rekonnektering
  const forceReconnect = useCallback(async () => {
    setStatus(prev => ({
      ...prev,
      reconnecting: true,
      retryCount: 0,
    }));
    
    await attemptReconnect();
  }, [attemptReconnect]);

  return {
    ...status,
    forceReconnect,
  };
}

export default useNetworkStatus;
