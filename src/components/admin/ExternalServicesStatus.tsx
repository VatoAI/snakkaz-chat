import React, { useEffect, useState } from 'react';
import { 
  ServiceName, 
  connectToService, 
  getAllServiceStatuses 
} from '../../utils/serviceConnector';

/**
 * Component that displays the status of external SnakkaZ services
 * and manages connection attempts
 */
export const ExternalServicesStatus: React.FC = () => {
  const [serviceStatuses, setServiceStatuses] = useState<Record<ServiceName, boolean>>(
    getAllServiceStatuses()
  );
  const [loading, setLoading] = useState<Record<ServiceName, boolean>>({
    'SnakkaZ Business Analyser': false,
    'SnakkaZ Secure Docs': false,
    'AI Dash Hub': false,
    'SnakkaZ Analytics Hub': false
  });
  const [isDevMode] = useState(() => import.meta.env.DEV);

  // Service URL mapping
  const serviceUrls: Record<ServiceName, string> = {
    'SnakkaZ Business Analyser': import.meta.env.VITE_SNAKKAZ_BUSINESS_ANALYSER_URL || '',
    'SnakkaZ Secure Docs': import.meta.env.VITE_SNAKKAZ_SECURE_DOCS_URL || '',
    'AI Dash Hub': import.meta.env.VITE_AI_DASH_HUB_URL || '',
    'SnakkaZ Analytics Hub': import.meta.env.VITE_SNAKKAZ_ANALYTICS_HUB_URL || ''
  };

  // Connect to services on component mount if enabled
  useEffect(() => {
    const enableExternalServices = import.meta.env.VITE_ENABLE_EXTERNAL_SERVICES === 'true';
    
    if (enableExternalServices) {
      const services = Object.keys(serviceStatuses) as ServiceName[];
      
      services.forEach(async (service) => {
        // Only attempt connection if we have a URL configured
        if (serviceUrls[service]) {
          await attemptConnection(service);
        }
      });
    } else if (isDevMode) {
      console.info('[Dev] External services are disabled in development mode');
    }
  }, []);

  // Attempt to connect to a service
  const attemptConnection = async (service: ServiceName) => {
    if (!serviceUrls[service]) {
      return;
    }
    
    setLoading(prev => ({ ...prev, [service]: true }));
    
    try {
      const { success } = await connectToService(service, serviceUrls[service]);
      setServiceStatuses(prev => ({ ...prev, [service]: success }));
    } finally {
      setLoading(prev => ({ ...prev, [service]: false }));
    }
  };

  // If services are disabled in development, show simplified UI
  if (isDevMode && import.meta.env.VITE_ENABLE_EXTERNAL_SERVICES !== 'true') {
    return (
      <div className="bg-slate-100 p-4 rounded-lg mb-4">
        <h3 className="font-medium text-lg mb-2">External Services</h3>
        <div className="text-sm text-slate-600">
          <p>External services are disabled in development mode.</p>
          <p className="mt-1">
            To enable them, set <code className="bg-slate-200 px-1 py-0.5 rounded">VITE_ENABLE_EXTERNAL_SERVICES=true</code> in your <code className="bg-slate-200 px-1 py-0.5 rounded">.env.development</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="font-medium text-lg mb-4">External Services Status</h3>
      <div className="space-y-3">
        {Object.entries(serviceStatuses).map(([service, connected]) => (
          <div key={service} className="flex items-center justify-between">
            <span className="font-medium">{service}</span>
            <div className="flex items-center">
              {loading[service as ServiceName] ? (
                <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mr-2" />
              ) : (
                <span 
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    connected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              )}
              <span className={connected ? 'text-green-600' : 'text-red-600'}>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
              {!connected && !loading[service as ServiceName] && (
                <button
                  onClick={() => attemptConnection(service as ServiceName)}
                  className="ml-2 text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {isDevMode && (
        <div className="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
          <p>Note: Connection failures in development are expected and won't affect functionality.</p>
        </div>
      )}
    </div>
  );
};

export default ExternalServicesStatus;