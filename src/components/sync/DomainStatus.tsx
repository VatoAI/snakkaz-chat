import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wifi, WifiOff, Activity, Clock, CheckCircle2, XCircle } from "lucide-react";

interface DomainStatusProps {
  domains: string[];
}

type StatusType = 'online' | 'offline' | 'degraded' | 'checking';

interface DomainInfo {
  url: string;
  status: StatusType;
  responseTime: number | null;
  lastChecked: Date | null;
  uptime: number; // Percentage
}

export const DomainStatus = ({ domains }: DomainStatusProps) => {
  const [domainStatus, setDomainStatus] = useState<DomainInfo[]>([]);
  
  // Simulate domain status check
  useEffect(() => {
    // Initialize domains with checking status
    setDomainStatus(domains.map(url => ({
      url,
      status: 'checking',
      responseTime: null,
      lastChecked: null,
      uptime: 100
    })));
    
    // Simulate checking each domain
    domains.forEach((url, index) => {
      setTimeout(() => {
        const randomStatus = Math.random();
        let status: StatusType;
        let responseTime: number;
        
        if (randomStatus > 0.9) {
          status = 'offline';
          responseTime = 0;
        } else if (randomStatus > 0.7) {
          status = 'degraded';
          responseTime = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
        } else {
          status = 'online';
          responseTime = Math.floor(Math.random() * 200) + 50; // 50-250ms
        }
        
        // Update status for this domain
        setDomainStatus(prev => prev.map((domain, i) => 
          i === index 
            ? { 
                ...domain, 
                status, 
                responseTime, 
                lastChecked: new Date(),
                uptime: domain.uptime - (status === 'offline' ? Math.random() * 2 : 0)
              } 
            : domain
        ));
      }, (index + 1) * 1000); // Stagger checks for visual effect
    });
    
    // Set up periodic checks
    const interval = setInterval(() => {
      setDomainStatus(prev => prev.map(domain => {
        const randomStatus = Math.random();
        let status: StatusType;
        let responseTime: number;
        
        if (randomStatus > 0.95) {
          status = 'offline';
          responseTime = 0;
        } else if (randomStatus > 0.8) {
          status = 'degraded';
          responseTime = Math.floor(Math.random() * 1000) + 500;
        } else {
          status = 'online';
          responseTime = Math.floor(Math.random() * 200) + 50;
        }
        
        return { 
          ...domain, 
          status, 
          responseTime, 
          lastChecked: new Date(),
          uptime: domain.uptime - (status === 'offline' ? Math.random() * 2 : 0)
        };
      }));
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [domains]);
  
  // Updated domains array to use new domain names
  useEffect(() => {
    if (domains.length === 0) {
      // Default domains if none provided
      domains = [
        'www.snakkaz.com',
        'api.snakkaz.com',
        'chat.snakkaz.com',
        'auth.snakkaz.com'
      ];
    }
    
    // Initialize domains with checking status
    setDomainStatus(domains.map(url => ({
      url,
      status: 'checking',
      responseTime: null,
      lastChecked: null,
      uptime: 100
    })));
    
    // Simulate checking each domain
    domains.forEach((url, index) => {
      setTimeout(() => {
        const randomStatus = Math.random();
        let status: StatusType;
        let responseTime: number;
        
        if (randomStatus > 0.9) {
          status = 'offline';
          responseTime = 0;
        } else if (randomStatus > 0.7) {
          status = 'degraded';
          responseTime = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
        } else {
          status = 'online';
          responseTime = Math.floor(Math.random() * 200) + 50; // 50-250ms
        }
        
        // Update status for this domain
        setDomainStatus(prev => prev.map((domain, i) => 
          i === index 
            ? { 
                ...domain, 
                status, 
                responseTime, 
                lastChecked: new Date(),
                uptime: domain.uptime - (status === 'offline' ? Math.random() * 2 : 0)
              } 
            : domain
        ));
      }, (index + 1) * 1000); // Stagger checks for visual effect
    });
    
    // Set up periodic checks
    const interval = setInterval(() => {
      setDomainStatus(prev => prev.map(domain => {
        const randomStatus = Math.random();
        let status: StatusType;
        let responseTime: number;
        
        if (randomStatus > 0.95) {
          status = 'offline';
          responseTime = 0;
        } else if (randomStatus > 0.8) {
          status = 'degraded';
          responseTime = Math.floor(Math.random() * 1000) + 500;
        } else {
          status = 'online';
          responseTime = Math.floor(Math.random() * 200) + 50;
        }
        
        return { 
          ...domain, 
          status, 
          responseTime, 
          lastChecked: new Date(),
          uptime: domain.uptime - (status === 'offline' ? Math.random() * 2 : 0)
        };
      }));
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [domains]);
  
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 size={14} className="text-green-400" />;
      case 'offline':
        return <XCircle size={14} className="text-cyberred-400" />;
      case 'degraded':
        return <Wifi size={14} className="text-amber-400" />;
      case 'checking':
        return <Activity size={14} className="text-cyberblue-400 animate-pulse" />;
    }
  };
  
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'online':
        return <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/30">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-cyberred-900/20 text-cyberred-400 border-cyberred-500/30">Offline</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-500/30">Degraded</Badge>;
      case 'checking':
        return <Badge variant="outline" className="bg-cyberblue-900/20 text-cyberblue-400 border-cyberblue-500/30 animate-pulse">Checking</Badge>;
    }
  };
  
  return (
    <div className="cyber-bg p-4 rounded-lg border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 cyber-text">Domain Health</h2>
      <div className="space-y-3">
        {domainStatus.map((domain) => (
          <div key={domain.url} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-cyberdark-900/80 border border-gray-700">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <div className={`p-1.5 rounded-md bg-cyberdark-800 ${domain.status === 'online' ? 'shadow-neon-blue' : domain.status === 'offline' ? 'shadow-neon-red' : ''}`}>
                {domain.status === 'online' ? (
                  <Wifi size={18} className="text-green-400" />
                ) : domain.status === 'offline' ? (
                  <WifiOff size={18} className="text-cyberred-400" />
                ) : (
                  <Activity size={18} className="text-amber-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{domain.url}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(domain.status)}
                  {domain.responseTime !== null && domain.status !== 'offline' && (
                    <span className="text-xs text-gray-400">
                      {domain.responseTime}ms
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock size={12} className="mr-1" />
                      {domain.lastChecked ? (
                        new Date(domain.lastChecked).toLocaleTimeString()
                      ) : (
                        'Never'
                      )}
                    </div>
                    <div className="w-20 h-2 bg-cyberdark-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          domain.uptime > 99 ? 'bg-green-500' : 
                          domain.uptime > 95 ? 'bg-amber-500' : 
                          'bg-cyberred-500'
                        }`}
                        style={{ width: `${domain.uptime}%` }}
                      ></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="end">
                  <p className="text-xs">Uptime: {domain.uptime.toFixed(2)}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};
