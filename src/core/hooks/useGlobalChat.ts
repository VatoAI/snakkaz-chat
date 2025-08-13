/**
 * Enhanced Global Chat Hook with Full Supabase Integration
 * Provides complete real-time messaging functionality
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { realtimeMessageService, Message, Room } from '@/services/realtimeMessages';
import { useToast } from '@/components/ui/use-toast';

export interface ChatState {
  messages: Message[];
  currentRoom: Room | null;
  loading: boolean;
  sending: boolean;
  connected: boolean;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<boolean>;
  loadMoreMessages: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  joinGlobalRoom: () => Promise<boolean>;
}

export function useGlobalChat(): ChatState & ChatActions {
  const { user, profile, authenticated } = useAuth();
  const { toast } = useToast();

  const [state, setState] = useState<ChatState>({
    messages: [],
    currentRoom: null,
    loading: true,
    sending: false,
    connected: false
  });

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const messagesOffset = useRef(0);
  const hasMoreMessages = useRef(true);

  // Handle new real-time message
  const handleNewMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  // Join global room and set up real-time subscription
  const joinGlobalRoom = useCallback(async (): Promise<boolean> => {
    if (!authenticated || !profile) {
      console.log('Not authenticated, cannot join global room');
      return false;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));

      // Get or create global room
      const globalRoom = await realtimeMessageService.getGlobalRoom();
      if (!globalRoom) {
        toast({
          title: "Error",
          description: "Failed to access global chat room",
          variant: "destructive"
        });
        return false;
      }

      // Join user to room
      const joined = await realtimeMessageService.joinRoom(globalRoom.id, profile.id);
      if (!joined) {
        toast({
          title: "Error", 
          description: "Failed to join global chat room",
          variant: "destructive"
        });
        return false;
      }

      // Load initial messages
      const messages = await realtimeMessageService.getMessages(globalRoom.id, 50, 0);
      
      // Clean up previous subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Subscribe to real-time messages
      const unsubscribe = realtimeMessageService.subscribeToRoom(globalRoom.id, handleNewMessage);
      unsubscribeRef.current = unsubscribe;

      setState(prev => ({
        ...prev,
        messages,
        currentRoom: globalRoom,
        loading: false,
        connected: true
      }));

      messagesOffset.current = messages.length;

      toast({
        title: "Connected",
        description: `Welcome to ${globalRoom.name}!`,
      });

      return true;
    } catch (error) {
      console.error('Failed to join global room:', error);
      setState(prev => ({ ...prev, loading: false }));
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to global chat",
        variant: "destructive"
      });

      return false;
    }
  }, [authenticated, profile, handleNewMessage, toast]);

  // Send message
  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!authenticated || !profile || !state.currentRoom || !content.trim()) {
      return false;
    }

    try {
      setState(prev => ({ ...prev, sending: true }));

      const message = await realtimeMessageService.sendMessage(
        state.currentRoom.id,
        content.trim(),
        profile.id
      );

      if (message) {
        // Message will be received via real-time subscription
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    } finally {
      setState(prev => ({ ...prev, sending: false }));
    }
  }, [authenticated, profile, state.currentRoom, toast]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!state.currentRoom || state.loading || !hasMoreMessages.current) {
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));

      const moreMessages = await realtimeMessageService.getMessages(
        state.currentRoom.id,
        20,
        messagesOffset.current
      );

      if (moreMessages.length === 0) {
        hasMoreMessages.current = false;
      } else {
        setState(prev => ({
          ...prev,
          messages: [...moreMessages, ...prev.messages]
        }));
        messagesOffset.current += moreMessages.length;
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
      toast({
        title: "Error",
        description: "Failed to load more messages",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.currentRoom, state.loading, toast]);

  // Refresh messages
  const refreshMessages = useCallback(async () => {
    if (!state.currentRoom) return;

    try {
      setState(prev => ({ ...prev, loading: true }));

      const messages = await realtimeMessageService.getMessages(state.currentRoom.id, 50, 0);
      
      setState(prev => ({
        ...prev,
        messages,
        loading: false
      }));

      messagesOffset.current = messages.length;
      hasMoreMessages.current = true;
    } catch (error) {
      console.error('Failed to refresh messages:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.currentRoom]);

  // Auto-join global room when user is authenticated
  useEffect(() => {
    if (authenticated && profile && !state.currentRoom) {
      joinGlobalRoom();
    }
  }, [authenticated, profile, state.currentRoom, joinGlobalRoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      realtimeMessageService.cleanup();
    };
  }, []);

  return {
    ...state,
    sendMessage,
    loadMoreMessages,
    refreshMessages,
    joinGlobalRoom
  };
}
