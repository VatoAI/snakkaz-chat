// Simple System Status Component
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Server, Database } from 'lucide-react';

export const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState({
    supabase: 'checking',
    mcp: 'checking',
    network: 'checking'
  });

  useEffect(() => {
    const checkStatus = async () => {
      // Check network first
      try {
        await fetch('https://api.github.com/zen', { method: 'HEAD' });
        setStatus(prev => ({ ...prev, network: 'online' }));
      } catch {
        setStatus(prev => ({ ...prev, network: 'offline' }));
      }

      // Check SupaBase (simple ping)
      try {
        // Replace with your actual SupaBase URL
        const response = await fetch('https://your-project.supabase.co/health', { 
          method: 'HEAD',
          timeout: 3000 
        });
        setStatus(prev => ({ ...prev, supabase: response.ok ? 'online' : 'error' }));
      } catch {
        setStatus(prev => ({ ...prev, supabase: 'offline' }));
      }

      // MCP status (mock for now)
      setStatus(prev => ({ ...prev, mcp: 'ready' }));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (service: string) => {
    const state = status[service as keyof typeof status];
    const baseClass = "w-4 h-4";
    
    switch (state) {
      case 'online':
      case 'ready':
        return <Wifi className={`${baseClass} text-green-400`} />;
      case 'offline':
      case 'error':
        return <WifiOff className={`${baseClass} text-red-400`} />;
      case 'checking':
        return <div className={`${baseClass} animate-pulse bg-yellow-400 rounded-full`} />;
      default:
        return <WifiOff className={`${baseClass} text-gray-400`} />;
    }
  };

  return (
    <div className="flex items-center gap-4 text-xs text-gray-400">
      <div className="flex items-center gap-1">
        {getStatusIcon('network')}
        <span>Network</span>
      </div>
      <div className="flex items-center gap-1">
        <Database className="w-4 h-4" />
        {getStatusIcon('supabase')}
        <span>SupaBase</span>
      </div>
      <div className="flex items-center gap-1">
        <Server className="w-4 h-4" />
        {getStatusIcon('mcp')}
        <span>MCP</span>
      </div>
    </div>
  );
};
