import { useState, useEffect, useCallback } from 'react';
import { messageReactionsService, ReactionCount } from '@/services/reactions/MessageReactionsService';

export interface UseMessageReactionsReturn {
  reactions: ReactionCount[];
  userReactions: string[];
  loading: boolean;
  error: string | null;
  addReaction: (emojiCode: string, emojiType?: 'unicode' | 'custom' | 'system') => Promise<boolean>;
  removeReaction: (emojiCode: string) => Promise<boolean>;
  toggleReaction: (emojiCode: string, emojiType?: 'unicode' | 'custom' | 'system') => Promise<boolean>;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing message reactions
 */
export const useMessageReactions = (messageId: string): UseMessageReactionsReturn => {
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reactions data
  const loadReactions = useCallback(async () => {
    try {
      setError(null);
      const [messageReactions, userReactionData] = await Promise.all([
        messageReactionsService.getMessageReactions(messageId),
        messageReactionsService.getUserReactions(messageId)
      ]);
      
      setReactions(messageReactions);
      setUserReactions(userReactionData.map(r => r.emoji_code));
    } catch (err) {
      console.error('Error loading reactions:', err);
      setError('Failed to load reactions');
    }
  }, [messageId]);

  // Initialize and subscribe to changes
  useEffect(() => {
    loadReactions();

    // Subscribe to real-time updates
    const subscription = messageReactionsService.subscribeToMessageReactions(
      messageId,
      (newReactions) => {
        setReactions(newReactions);
        // Reload user reactions to get updated state
        messageReactionsService.getUserReactions(messageId).then(userReactionData => {
          setUserReactions(userReactionData.map(r => r.emoji_code));
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [messageId, loadReactions]);

  // Add reaction
  const addReaction = useCallback(async (
    emojiCode: string, 
    emojiType: 'unicode' | 'custom' | 'system' = 'unicode'
  ): Promise<boolean> => {
    if (loading) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await messageReactionsService.addReaction(messageId, emojiCode, emojiType);
      return result !== null;
    } catch (err) {
      console.error('Error adding reaction:', err);
      setError('Failed to add reaction');
      return false;
    } finally {
      setLoading(false);
    }
  }, [messageId, loading]);

  // Remove reaction
  const removeReaction = useCallback(async (emojiCode: string): Promise<boolean> => {
    if (loading) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await messageReactionsService.removeReaction(messageId, emojiCode);
      return result;
    } catch (err) {
      console.error('Error removing reaction:', err);
      setError('Failed to remove reaction');
      return false;
    } finally {
      setLoading(false);
    }
  }, [messageId, loading]);

  // Toggle reaction
  const toggleReaction = useCallback(async (
    emojiCode: string, 
    emojiType: 'unicode' | 'custom' | 'system' = 'unicode'
  ): Promise<boolean> => {
    if (loading) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await messageReactionsService.toggleReaction(messageId, emojiCode, emojiType);
      return result;
    } catch (err) {
      console.error('Error toggling reaction:', err);
      setError('Failed to toggle reaction');
      return false;
    } finally {
      setLoading(false);
    }
  }, [messageId, loading]);

  // Refresh reactions
  const refresh = useCallback(async () => {
    await loadReactions();
  }, [loadReactions]);

  return {
    reactions,
    userReactions,
    loading,
    error,
    addReaction,
    removeReaction,
    toggleReaction,
    refresh
  };
};

/**
 * Hook for managing reactions for multiple messages
 */
export const useMultipleMessageReactions = (messageIds: string[]) => {
  const [reactions, setReactions] = useState<Record<string, ReactionCount[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReactions = useCallback(async () => {
    if (messageIds.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const messageReactions = await messageReactionsService.getMultipleMessageReactions(messageIds);
      setReactions(messageReactions);
    } catch (err) {
      console.error('Error loading multiple message reactions:', err);
      setError('Failed to load reactions');
    } finally {
      setLoading(false);
    }
  }, [messageIds]);

  useEffect(() => {
    loadReactions();

    // Subscribe to real-time updates
    const subscription = messageReactionsService.subscribeToMultipleMessageReactions(
      messageIds,
      (newReactions) => {
        setReactions(newReactions);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [messageIds, loadReactions]);

  return {
    reactions,
    loading,
    error,
    refresh: loadReactions
  };
};