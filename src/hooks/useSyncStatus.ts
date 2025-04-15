
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SyncType = 'github' | 'supabase' | 'domain';
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncEvent {
  id: string;
  sync_type: SyncType;
  status: SyncStatus;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  metadata: any;
}

export const useSyncStatus = (syncType?: SyncType) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [events, setEvents] = useState<SyncEvent[]>([]);
  
  useEffect(() => {
    const fetchSyncEvents = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('sync_events')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(10);
          
        if (syncType) {
          query = query.eq('sync_type', syncType);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching sync events:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSyncEvents();
    
    // Set up realtime subscription
    const channel = supabase.channel('sync-events-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sync_events',
        filter: syncType ? `sync_type=eq.${syncType}` : undefined
      }, (payload) => {
        const newEvent = payload.new as SyncEvent;
        setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sync_events',
        filter: syncType ? `sync_type=eq.${syncType}` : undefined
      }, (payload) => {
        const updatedEvent = payload.new as SyncEvent;
        setEvents(prev => prev.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        ));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [syncType]);
  
  return { events, loading, error };
};
