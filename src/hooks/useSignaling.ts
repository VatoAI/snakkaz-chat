import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWebRTC } from './useWebRTC.new';
import { useToast } from '@/components/ui/use-toast';
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

interface SignalPayload {
  type: string;
  data: any;
  sender: string;
  target?: string;
}

/**
 * useSignaling - Hook for handling WebRTC signaling via Supabase Realtime
 * 
 * This hook sets up a channel for exchanging WebRTC signaling information between users.
 * It handles the signaling necessary for establishing WebRTC connections with PeerJS.
 */
export const useSignaling = (userId: string | undefined) => {
  const { isConnected, peers } = useWebRTC(userId);
  const [isSignalingReady, setIsSignalingReady] = useState<boolean>(false);
  const signalingChannel = useRef<any>(null);
  const { toast } = useToast();

  // Set up signaling when the component mounts
  useEffect(() => {
    if (!userId) return;
    
    // Clean up previous channel if it exists
    if (signalingChannel.current) {
      signalingChannel.current.unsubscribe();
      signalingChannel.current = null;
    }
    
    // Create a new signaling channel
    try {
      console.log('Setting up signaling channel for user:', userId);
      
      const channel = supabase.channel(`signaling:${userId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: userId },
        },
      });
      
      // Handle incoming signals
      channel
        .on('broadcast', { event: 'signal' }, (payload) => {
          const { type, data, sender } = payload;
          console.log(`Received ${type} signal from ${sender}`);
          
          try {
            // In this implementation, PeerJS handles most of the signaling internally
            // However, we might still receive custom signals like ICE candidates or offers
            // that are sent outside PeerJS's internal signaling
            console.log(`Processing external signal from ${sender}:`, data);
            
            // If we need to process custom signals, we can do it here
          } catch (error) {
            console.error('Error processing incoming signal:', error);
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          
          // Get list of online users
          const onlineUsers = Object.keys(state).filter(id => id !== userId);
          console.log('Online users for signaling:', onlineUsers);
        })
        .subscribe((status) => {
          console.log('Signaling channel subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to signaling channel');
            setIsSignalingReady(true);
            
            // Announce presence to other peers
            channel.track({
              user_id: userId,
              online_at: new Date().toISOString(),
            });
          }
          
          if (
            status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT ||
            status === REALTIME_SUBSCRIBE_STATES.CLOSED ||
            status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR
          ) {
            console.error('Signaling channel subscription failed:', status);
            setIsSignalingReady(false);
            
            toast({
              title: 'Signaleringstilkobling mislyktes',
              description: 'Kunne ikke opprette tilkobling for WebRTC-signalering. Direkte meldinger kan være påvirket.',
              variant: 'destructive',
            });
          }
        });
      
      // Store the channel for later use
      signalingChannel.current = channel;
      
    } catch (error) {
      console.error('Error setting up signaling channel:', error);
      setIsSignalingReady(false);
      
      toast({
        title: 'Signaleringstilkobling mislyktes',
        description: 'Kunne ikke opprette tilkobling for WebRTC-signalering. Direkte meldinger kan være påvirket.',
        variant: 'destructive',
      });
    }
    
    // Cleanup function
    return () => {
      if (signalingChannel.current) {
        console.log('Cleaning up signaling channel');
        signalingChannel.current.unsubscribe();
        signalingChannel.current = null;
      }
    };
  }, [userId, toast]);

  // Function to send a signal to a specific user
  const sendSignal = useCallback((receiverId: string, signal: SignalPayload) => {
    if (!signalingChannel.current) {
      console.error('Cannot send signal: No active signaling channel');
      return false;
    }
    
    try {
      signalingChannel.current.send({
        type: 'broadcast',
        event: 'signal',
        to: receiverId,
        payload: {
          ...signal,
          sender: userId
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to send signal:', error);
      return false;
    }
  }, [userId]);

  return {
    sendSignal,
    isSignalingReady,
    onlinePeers: peers
  };
};
