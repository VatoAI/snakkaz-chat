import { supabase } from '@/lib/supabaseClient';

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji_code: string;
  emoji_type: 'unicode' | 'custom' | 'system';
  created_at: string;
  updated_at: string;
}

export interface CustomEmoji {
  id: string;
  name: string;
  code: string;
  image_url: string;
  created_by?: string;
  is_system: boolean;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReactionCount {
  message_id: string;
  emoji_code: string;
  emoji_type: string;
  count: number;
  user_ids: string[];
  last_reacted_at: string;
}

export class MessageReactionsService {
  
  /**
   * Add a reaction to a message
   */
  async addReaction(messageId: string, emojiCode: string, emojiType: 'unicode' | 'custom' | 'system' = 'unicode'): Promise<MessageReaction | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji_code: emojiCode,
          emoji_type: emojiType
        })
        .select()
        .single();

      if (error) {
        // If it's a unique constraint error, the user already reacted with this emoji
        if (error.code === '23505') {
          console.log('User already reacted with this emoji');
          return null;
        }
        throw error;
      }

      console.log('✅ Reaction added successfully');
      return data;
    } catch (error) {
      console.error('❌ Error adding reaction:', error);
      throw error;
    }
  }

  /**
   * Remove a reaction from a message
   */
  async removeReaction(messageId: string, emojiCode: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji_code', emojiCode);

      if (error) throw error;

      console.log('✅ Reaction removed successfully');
      return true;
    } catch (error) {
      console.error('❌ Error removing reaction:', error);
      return false;
    }
  }

  /**
   * Toggle a reaction (add if not exists, remove if exists)
   */
  async toggleReaction(messageId: string, emojiCode: string, emojiType: 'unicode' | 'custom' | 'system' = 'unicode'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if reaction already exists
      const { data: existingReaction } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji_code', emojiCode)
        .single();

      if (existingReaction) {
        // Remove existing reaction
        return await this.removeReaction(messageId, emojiCode);
      } else {
        // Add new reaction
        const reaction = await this.addReaction(messageId, emojiCode, emojiType);
        return reaction !== null;
      }
    } catch (error) {
      console.error('❌ Error toggling reaction:', error);
      return false;
    }
  }

  /**
   * Get reaction counts for a message
   */
  async getMessageReactions(messageId: string): Promise<ReactionCount[]> {
    try {
      const { data, error } = await supabase
        .from('message_reaction_counts')
        .select('*')
        .eq('message_id', messageId)
        .order('count', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('❌ Error getting message reactions:', error);
      return [];
    }
  }

  /**
   * Get reaction counts for multiple messages
   */
  async getMultipleMessageReactions(messageIds: string[]): Promise<Record<string, ReactionCount[]>> {
    try {
      const { data, error } = await supabase
        .from('message_reaction_counts')
        .select('*')
        .in('message_id', messageIds)
        .order('count', { ascending: false });

      if (error) throw error;

      // Group by message_id
      const grouped: Record<string, ReactionCount[]> = {};
      data?.forEach(reaction => {
        if (!grouped[reaction.message_id]) {
          grouped[reaction.message_id] = [];
        }
        grouped[reaction.message_id].push(reaction);
      });

      return grouped;
    } catch (error) {
      console.error('❌ Error getting multiple message reactions:', error);
      return {};
    }
  }

  /**
   * Get user's reactions for a message
   */
  async getUserReactions(messageId: string): Promise<MessageReaction[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', user.id);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('❌ Error getting user reactions:', error);
      return [];
    }
  }

  /**
   * Get popular emojis
   */
  async getPopularEmojis(limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_popular_emojis', { limit_count: limit });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('❌ Error getting popular emojis:', error);
      return [];
    }
  }

  /**
   * Get custom emojis
   */
  async getCustomEmojis(): Promise<CustomEmoji[]> {
    try {
      const { data, error } = await supabase
        .from('custom_emojis')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('❌ Error getting custom emojis:', error);
      return [];
    }
  }

  /**
   * Subscribe to reaction changes for a message
   */
  subscribeToMessageReactions(messageId: string, callback: (reactions: ReactionCount[]) => void) {
    const subscription = supabase
      .channel(`message_reactions:${messageId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${messageId}`,
        },
        async () => {
          // Refresh reaction counts when reactions change
          const reactions = await this.getMessageReactions(messageId);
          callback(reactions);
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Subscribe to reaction changes for multiple messages
   */
  subscribeToMultipleMessageReactions(messageIds: string[], callback: (reactions: Record<string, ReactionCount[]>) => void) {
    const subscription = supabase
      .channel('message_reactions:multiple')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        async (payload) => {
          // Only update if the changed message is in our list
          if (messageIds.includes(payload.new?.message_id || payload.old?.message_id)) {
            const reactions = await this.getMultipleMessageReactions(messageIds);
            callback(reactions);
          }
        }
      )
      .subscribe();

    return subscription;
  }
}

// Export singleton instance
export const messageReactionsService = new MessageReactionsService();