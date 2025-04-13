
import { useState, useRef, useEffect } from "react";
import { Friend } from "./types";
import { WebRTCManager } from "@/utils/webrtc";
import { DecryptedMessage } from "@/types/message";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { encryptMessage } from "@/utils/encryption";

export const useDirectMessage = (
  friend: Friend,
  currentUserId: string,
  webRTCManager: WebRTCManager | null,
  onNewMessage: (message: DecryptedMessage) => void
) => {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionState, setConnectionState] = useState<string>("connecting");
  const [dataChannelState, setDataChannelState] = useState<string>("connecting");
  const [usingServerFallback, setUsingServerFallback] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isManualServerMode, setIsManualServerMode] = useState(false);
  const { toast } = useToast();
  
  const friendId = friend.user_id === currentUserId ? friend.friend_id : friend.user_id;
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeout = useRef<NodeJS.Timeout | null>(null);
  const errorResetTimeout = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 3;

  useEffect(() => {
    if (!webRTCManager || !friendId) return;

    updateConnectionStatus();
    
    statusCheckInterval.current = setInterval(() => {
      updateConnectionStatus();
    }, 2000);

    connectionTimeout.current = setTimeout(() => {
      const connState = webRTCManager.getConnectionState(friendId);
      const dataState = webRTCManager.getDataChannelState(friendId);
      
      if (connState !== 'connected' || dataState !== 'open') {
        console.log('Falling back to server for message delivery');
        setUsingServerFallback(true);
        toast({
          title: "Direkte tilkobling mislyktes",
          description: "Meldinger sendes via server med ende-til-ende-kryptering.",
          variant: "default",
        });
      }
    }, 10000);

    // Check connection health and attempt to reconnect if needed
    const healthCheck = setInterval(() => {
      if (webRTCManager && friendId && !isManualServerMode) {
        const connState = webRTCManager.getConnectionState(friendId);
        if (connState !== 'connected' && connectionAttempts < maxReconnectAttempts) {
          console.log('Connection health check: attempting reconnect');
          handleReconnect();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
      }
      if (errorResetTimeout.current) {
        clearTimeout(errorResetTimeout.current);
      }
      clearInterval(healthCheck);
    };
  }, [webRTCManager, friendId, toast, connectionAttempts]);

  const updateConnectionStatus = () => {
    if (!webRTCManager || !friendId) return;
    
    const connState = webRTCManager.getConnectionState(friendId);
    const dataState = webRTCManager.getDataChannelState(friendId);
    
    setConnectionState(connState);
    setDataChannelState(dataState);
    
    if (connState === 'connected' && dataState === 'open') {
      setUsingServerFallback(false);
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
        connectionTimeout.current = null;
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !friendId || !currentUserId) return;
    
    setIsLoading(true);
    setSendError(null);
    
    try {
      let messageDelivered = false;
      
      const timestamp = new Date().toISOString();
      const localMessage: DecryptedMessage = {
        id: `local-${Date.now()}`,
        content: newMessage,
        sender: {
          id: currentUserId,
          username: null,
          full_name: null
        },
        receiver_id: friendId,
        created_at: timestamp,
        encryption_key: '',
        iv: '',
        is_encrypted: true
      };
      
      // Try WebRTC first if not in manual server mode
      if (webRTCManager && !isManualServerMode && !usingServerFallback) {
        try {
          const connState = webRTCManager.getConnectionState(friendId);
          const dataState = webRTCManager.getDataChannelState(friendId);
          
          if (connState === 'connected' && dataState === 'open') {
            await webRTCManager.sendDirectMessage(friendId, newMessage);
            console.log('Message sent via WebRTC');
            messageDelivered = true;
          } else {
            console.log(`Connection not ready (${connState}/${dataState}), trying to reconnect`);
            await webRTCManager.attemptReconnect(friendId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newConnState = webRTCManager.getConnectionState(friendId);
            const newDataState = webRTCManager.getDataChannelState(friendId);
            
            if (newConnState === 'connected' && newDataState === 'open') {
              await webRTCManager.sendDirectMessage(friendId, newMessage);
              messageDelivered = true;
              console.log('Message sent via WebRTC after reconnection');
            } else {
              console.log(`Reconnect failed (${newConnState}/${newDataState}), falling back to server`);
              setUsingServerFallback(true);
            }
          }
        } catch (error) {
          console.error('Error sending P2P message:', error);
          setUsingServerFallback(true);
        }
      }
      
      // Server fallback if WebRTC fails or is disabled
      if (!messageDelivered) {
        try {
          // Encrypt message for server transmission
          const { encryptedContent, key, iv } = await encryptMessage(newMessage.trim());
          
          const { error } = await supabase
            .from('messages')
            .insert({
              sender_id: currentUserId,
              receiver_id: friendId,
              encrypted_content: encryptedContent,
              encryption_key: key,
              iv: iv,
              is_encrypted: true
            });
          
          if (error) {
            throw error;
          }
          
          messageDelivered = true;
          console.log('Message sent via server with end-to-end encryption');
        } catch (serverError) {
          console.error('Server fallback failed:', serverError);
          throw new Error('Both direct and server message delivery failed');
        }
      }
      
      if (messageDelivered) {
        onNewMessage(localMessage);
        setNewMessage("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError('Kunne ikke sende melding. Prøv igjen senere.');
      
      toast({
        title: "Feil",
        description: "Kunne ikke sende melding. Prøv igjen senere.",
        variant: "destructive",
      });
      
      // Auto-clear error after 5 seconds
      errorResetTimeout.current = setTimeout(() => {
        setSendError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconnect = async () => {
    if (!webRTCManager || !friendId) return;
    
    setConnectionAttempts(prev => prev + 1);
    setUsingServerFallback(false);
    setSendError(null);
    
    toast({
      title: "Kobler til...",
      description: "Forsøker å etablere direkte tilkobling.",
    });
    
    try {
      await webRTCManager.attemptReconnect(friendId);
      
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
      }
      
      connectionTimeout.current = setTimeout(() => {
        const connState = webRTCManager.getConnectionState(friendId);
        const dataState = webRTCManager.getDataChannelState(friendId);
        
        if (connState !== 'connected' || dataState !== 'open') {
          setUsingServerFallback(true);
          toast({
            title: "Direkte tilkobling mislyktes",
            description: "Meldinger sendes via server med ende-til-ende-kryptering.",
          });
        }
      }, 5000);
    } catch (error) {
      console.error('Error reconnecting:', error);
      setUsingServerFallback(true);
    }
  };

  const toggleServerMode = () => {
    setIsManualServerMode(prev => !prev);
    setUsingServerFallback(prev => !prev);
    toast({
      title: isManualServerMode ? "Direkte modus aktivert" : "Server modus aktivert",
      description: isManualServerMode 
        ? "Forsøker å bruke direkte tilkobling når mulig." 
        : "Meldinger sendes via server med ende-til-ende-kryptering.",
    });
  };

  return {
    newMessage,
    setNewMessage,
    isLoading,
    connectionState,
    dataChannelState,
    usingServerFallback,
    connectionAttempts,
    sendError,
    isManualServerMode,
    handleSendMessage,
    handleReconnect,
    toggleServerMode
  };
};
