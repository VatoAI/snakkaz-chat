import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCustomEmojis } from '@/hooks/useCustomEmojis';
import { formatReactionData, isCustomEmoji } from '@/utils/customEmojiUtils';

interface ReactionHookReturn {
  addReaction: (messageId: string, emoji: string, isCustom?: boolean) => Promise<boolean>;
  removeReaction: (messageId: string, emoji: string, isCustom?: boolean) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
}

/**
 * Custom hook for managing emoji reactions on messages
 */
export const useEmojiReactions = (): ReactionHookReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { customEmojis, incrementUsage } = useCustomEmojis();

  /**
   * Add an emoji reaction to a message
   */
  const addReaction = useCallback(async (
    messageId: string, 
    emoji: string, 
    isCustomEmoji = false
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to react to messages',
        variant: 'destructive'
      });
      return false;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Determine if this is a custom emoji based on parameter or by checking the emoji string
      const isCustom = isCustomEmoji || isCustomEmoji(emoji, customEmojis);
      
      // If it's a custom emoji, increment its usage count
      if (isCustom) {
        const customEmoji = customEmojis.find(
          e => e.shortcode === emoji || e.name === emoji || e.id === emoji
        );
        
        if (customEmoji) {
          await incrementUsage(customEmoji.id);
        }
      }
      
      // Format the reaction data for the database
      const reactionData = formatReactionData(messageId, emoji, user.id, isCustom);
      
      // Check if the reaction already exists
      const { data: existingReaction } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('emoji', emoji)
        .eq('user_id', user.id)
        .single();
      
      // If the reaction already exists, we don't need to add it again
      if (existingReaction) {
        setIsProcessing(false);
        return true;
      }
      
      // Insert the new reaction
      const { error: insertError } = await supabase
        .from('message_reactions')
        .insert([reactionData]);
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reaction';
      setError(errorMessage);
      console.error('Error adding reaction:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to add reaction',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user, customEmojis, incrementUsage, toast]);
  
  /**
   * Remove an emoji reaction from a message
   */
  const removeReaction = useCallback(async (
    messageId: string, 
    emoji: string, 
    isCustomEmoji = false
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to manage reactions',
        variant: 'destructive'
      });
      return false;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Delete the reaction
      const { error: deleteError } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('emoji', emoji)
        .eq('user_id', user.id);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove reaction';
      setError(errorMessage);
      console.error('Error removing reaction:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to remove reaction',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user, toast]);
  
  return {
    addReaction,
    removeReaction,
    isProcessing,
    error
  };
};
