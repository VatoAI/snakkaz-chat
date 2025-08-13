import { useState, useEffect } from 'react';

export enum NetworkSpeedType {
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast',
  UNKNOWN = 'unknown'
}

interface NetworkSpeedInfo {
  type: NetworkSpeedType;
  speed: number | null; // i Mbps
  latency: number | null; // i ms
  offline: boolean;
  saveData: boolean; // Om brukeren har aktivert databesparelse
  lowBandwidth: boolean; // Om nettverket er i lavbåndsbreddemodus
}

/**
 * Hook som detekterer nettverkshastighet for å optimalisere mobilopplevelsen
 * Dette er spesielt nyttig for mobile enheter med begrenset båndbredde
 */
export function useNetworkSpeed(): NetworkSpeedInfo {
  const [networkInfo, setNetworkInfo] = useState<NetworkSpeedInfo>({
    type: NetworkSpeedType.UNKNOWN,
    speed: null,
    latency: null,
    offline: !navigator.onLine,
    saveData: false,
    lowBandwidth: false
  });

  useEffect(() => {
    const updateNetworkInfo = async () => {
      // Oppdater online/offline status
      setNetworkInfo(prev => ({ ...prev, offline: !navigator.onLine }));
      
      try {
        // Sjekk for databesparelse-modus (spesielt på mobil)
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          
          if (connection) {
            const saveData = !!connection.saveData;
            
            // Sjekk nettverkstype
            let networkType: NetworkSpeedType = NetworkSpeedType.UNKNOWN;
            let lowBandwidth = false;
            
            // Beregn type basert på effectiveType
            if (connection.effectiveType === '4g') {
              networkType = NetworkSpeedType.FAST;
            } else if (connection.effectiveType === '3g') {
              networkType = NetworkSpeedType.MEDIUM;
              lowBandwidth = true;
            } else if (['2g', 'slow-2g'].includes(connection.effectiveType)) {
              networkType = NetworkSpeedType.SLOW;
              lowBandwidth = true;
            }
            
            // Oppdater state
            setNetworkInfo(prev => ({
              ...prev,
              type: networkType,
              saveData,
              lowBandwidth
            }));
          }
        }
        
        // Kjør hastighetstest for mer presis måling
        const speedInfo = await measureNetworkSpeed();
        
        setNetworkInfo(prev => ({
          ...prev,
          ...speedInfo
        }));
        
      } catch (error) {
        console.error('Feil ved måling av nettverkshastighet:', error);
      }
    };
    
    // Kjør måling ved oppstart
    updateNetworkInfo();
    
    // Lytt etter endringer i nettverkstilkobling
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);
    
    // Lytt etter endringer i tilkoblingstype hvis tilgjengelig
    if ('connection' in navigator && (navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkInfo);
    }
    
    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
      
      if ('connection' in navigator && (navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return networkInfo;
}

/**
 * Måler nettverkshastighet ved å laste ned en liten testfil
 */
async function measureNetworkSpeed(): Promise<{ type: NetworkSpeedType; speed: number | null; latency: number | null }> {
  try {
    // Mål latency først
    const latencyStart = performance.now();
    await fetch('/favicon.ico', { cache: 'no-store', mode: 'no-cors' });
    const latency = performance.now() - latencyStart;
    
    // Mål nedlastingshastighet med større fil
    const speedTestStart = performance.now();
    const response = await fetch('/snakkaz-logo.png', { 
      cache: 'no-store',
      mode: 'no-cors'
    });
    
    const blob = await response.blob();
    const speedTestEnd = performance.now();
    
    // Beregn hastighet i Mbps
    const fileSizeInBits = blob.size * 8;
    const timeInSeconds = (speedTestEnd - speedTestStart) / 1000;
    const speedMbps = (fileSizeInBits / timeInSeconds) / 1024 / 1024;
    
    // Klassifiser hastigheten
    let type;
    if (speedMbps < 1) {
      type = NetworkSpeedType.SLOW; // Under 1 Mbps
    } else if (speedMbps < 5) {
      type = NetworkSpeedType.MEDIUM; // 1-5 Mbps
    } else {
      type = NetworkSpeedType.FAST; // Over 5 Mbps
    }
    
    return {
      type,
      speed: speedMbps,
      latency
    };
  } catch (error) {
    console.error('Feil ved måling av nettverkshastighet:', error);
    return {
      type: NetworkSpeedType.UNKNOWN,
      speed: null,
      latency: null
    };
  }
}

export default useNetworkSpeed;