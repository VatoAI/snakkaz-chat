
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, RefreshCw, Clock, Github, Database, Globe } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSyncStatus, SyncType, SyncStatus as SyncStatusType } from "@/hooks/useSyncStatus";

interface SyncItemProps {
  type: SyncType;
  status: SyncStatusType;
  lastSynced: string | null;
  progress?: number;
  errorMessage?: string;
}

const SyncItem = ({ type, status, lastSynced, progress = 0, errorMessage }: SyncItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'github':
        return <Github size={18} className="text-white" />;
      case 'supabase':
        return <Database size={18} className="text-white" />;
      case 'domain':
        return <Globe size={18} className="text-white" />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'idle':
        return <Clock size={16} className="text-gray-400" />;
      case 'syncing':
        return <RefreshCw size={16} className="text-cyberblue-400 animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-cyberred-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'github':
        return "GitHub Sync";
      case 'supabase':
        return "Supabase Sync";
      case 'domain':
        return "Domain Sync";
    }
  };

  return (
    <div 
      className={`mb-3 p-3 rounded-lg transition-all duration-300 animate-fadeIn
        ${status === 'syncing' ? 'cyber-border animate-dual-glow' : 'border border-gray-700'}
        ${status === 'error' ? 'bg-cyberred-900/30' : 'bg-cyberdark-900/80'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${status === 'syncing' ? 'bg-gradient-to-r from-cyberblue-900 to-cyberred-900' : 'bg-cyberdark-800'}`}>
            {getIcon()}
          </div>
          <h3 className="font-medium text-white">{getTitle()}</h3>
        </div>
        <div className="flex items-center">
          {status === 'syncing' && (
            <span className="text-xs text-cyberblue-400 mr-2">Syncing...</span>
          )}
          {getStatusIcon()}
        </div>
      </div>

      {status === 'syncing' && (
        <div className="mb-2">
          <Progress value={progress} className="h-1" />
        </div>
      )}

      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">
          {lastSynced ? `Last synced: ${new Date(lastSynced).toLocaleString()}` : 'Never synced'}
        </span>
        {status === 'error' && (
          <span className="text-cyberred-400">{errorMessage || 'Sync failed'}</span>
        )}
      </div>
    </div>
  );
};

export const SyncStatus = () => {
  const [syncItems, setSyncItems] = useState<SyncItemProps[]>([
    { type: 'github', status: 'idle', lastSynced: null },
    { type: 'supabase', status: 'idle', lastSynced: null },
    { type: 'domain', status: 'idle', lastSynced: null }
  ]);

  // Get sync events from our hook
  const { events } = useSyncStatus();

  // Update sync items based on events
  useEffect(() => {
    if (events.length > 0) {
      // Create a map of the latest event for each type
      const latestEvents = events.reduce((acc, event) => {
        if (!acc[event.sync_type] || new Date(event.started_at) > new Date(acc[event.sync_type].started_at)) {
          acc[event.sync_type] = event;
        }
        return acc;
      }, {} as Record<SyncType, any>);
      
      // Update sync items with latest status
      setSyncItems(prev => prev.map(item => {
        const latestEvent = latestEvents[item.type];
        if (latestEvent) {
          return {
            ...item,
            status: latestEvent.status,
            lastSynced: latestEvent.completed_at,
            errorMessage: latestEvent.error_message
          };
        }
        return item;
      }));
    }
  }, [events]);

  // Simulate a sync process for demonstration
  const simulateSync = (type: SyncType) => {
    // Set status to syncing with 0 progress
    setSyncItems(prev => prev.map(item => 
      item.type === type 
        ? { ...item, status: 'syncing', progress: 0 } 
        : item
    ));

    // Simulate progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5; // Random progress between 5-20%
      
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
        
        // Simulate success or error (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        setSyncItems(prev => prev.map(item => 
          item.type === type 
            ? { 
                ...item, 
                status: isSuccess ? 'success' : 'error', 
                progress: 100,
                lastSynced: isSuccess ? new Date().toISOString() : item.lastSynced,
                errorMessage: isSuccess ? undefined : 'Connection timeout'
              } 
            : item
        ));
      } else {
        setSyncItems(prev => prev.map(item => 
          item.type === type 
            ? { ...item, progress } 
            : item
        ));
      }
    }, 500);

    return () => clearInterval(interval);
  };

  // For demonstration purposes, simulate syncs at different intervals
  useEffect(() => {
    const githubInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to sync
        simulateSync('github');
      }
    }, 45000); // Check every 45 seconds
    
    const supabaseInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance to sync
        simulateSync('supabase');
      }
    }, 30000); // Check every 30 seconds
    
    const domainInterval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance to sync
        simulateSync('domain');
      }
    }, 60000); // Check every 60 seconds
    
    // Initial sync for demonstration
    setTimeout(() => simulateSync('github'), 2000);
    setTimeout(() => simulateSync('supabase'), 5000);
    setTimeout(() => simulateSync('domain'), 8000);
    
    return () => {
      clearInterval(githubInterval);
      clearInterval(supabaseInterval);
      clearInterval(domainInterval);
    };
  }, []);

  return (
    <div className="cyber-bg p-4 rounded-lg border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 cyber-text">System Synchronization</h2>
      <div>
        {syncItems.map((item) => (
          <SyncItem key={item.type} {...item} />
        ))}
      </div>
    </div>
  );
};
