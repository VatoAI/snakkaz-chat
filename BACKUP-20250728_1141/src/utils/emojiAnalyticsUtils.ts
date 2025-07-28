import { supabase } from '@/integrations/supabase/client';
import { CustomEmoji } from '@/hooks/useCustomEmojis';

/**
 * Interface for emoji usage statistics
 */
export interface EmojiUsageStats {
  emojiId: string;
  shortcode: string;
  totalUses: number;
  reactionsCount: number;
  inMessagesCount: number;
  uniqueUsers: number;
  lastUsed: string;
}

/**
 * Interface for emoji analytics over time
 */
export interface EmojiTimeAnalytics {
  date: string; // ISO format date string
  count: number;
}

/**
 * Track emoji usage in messages
 * @param emojiId - ID of the emoji used
 * @param messageId - ID of the message where emoji was used
 * @param userId - ID of the user who used the emoji
 */
export const trackEmojiInMessage = async (
  emojiId: string,
  messageId: string, 
  userId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('emoji_analytics')
      .insert({
        emoji_id: emojiId,
        message_id: messageId,
        user_id: userId,
        usage_type: 'message',
        timestamp: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error tracking emoji in message:', error);
    }
  } catch (err) {
    console.error('Failed to track emoji usage:', err);
  }
};

/**
 * Track emoji usage in reactions
 * @param emojiId - ID of the emoji used
 * @param messageId - ID of the message reacted to
 * @param userId - ID of the user who reacted
 */
export const trackEmojiInReaction = async (
  emojiId: string,
  messageId: string, 
  userId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('emoji_analytics')
      .insert({
        emoji_id: emojiId,
        message_id: messageId,
        user_id: userId,
        usage_type: 'reaction',
        timestamp: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Error tracking emoji in reaction:', error);
    }
  } catch (err) {
    console.error('Failed to track emoji usage:', err);
  }
};

/**
 * Get usage statistics for an emoji
 * @param emojiId - ID of the emoji to get stats for
 * @returns Promise with emoji usage statistics or null
 */
export const getEmojiStats = async (
  emojiId: string
): Promise<EmojiUsageStats | null> => {
  try {
    // Get the emoji details
    const { data: emojiData, error: emojiError } = await supabase
      .from('custom_emojis')
      .select('shortcode')
      .eq('id', emojiId)
      .single();
    
    if (emojiError || !emojiData) {
      console.error('Error fetching emoji data:', emojiError);
      return null;
    }
    
    // Get total uses
    const { count: totalUses, error: totalError } = await supabase
      .from('emoji_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('emoji_id', emojiId);
    
    if (totalError) {
      console.error('Error fetching total uses:', totalError);
      return null;
    }
    
    // Get reaction count
    const { count: reactionsCount, error: reactionsError } = await supabase
      .from('emoji_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('emoji_id', emojiId)
      .eq('usage_type', 'reaction');
    
    if (reactionsError) {
      console.error('Error fetching reactions count:', reactionsError);
      return null;
    }
    
    // Get in-message count
    const { count: inMessagesCount, error: messagesError } = await supabase
      .from('emoji_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('emoji_id', emojiId)
      .eq('usage_type', 'message');
    
    if (messagesError) {
      console.error('Error fetching in-messages count:', messagesError);
      return null;
    }
    
    // Get unique users
    const { data: uniqueUsersData, error: usersError } = await supabase
      .from('emoji_analytics')
      .select('user_id')
      .eq('emoji_id', emojiId)
      .limit(1000); // Limit to avoid excessive data
    
    if (usersError) {
      console.error('Error fetching unique users:', usersError);
      return null;
    }
    
    // Count unique users
    const uniqueUsers = new Set(uniqueUsersData.map(record => record.user_id)).size;
    
    // Get last used timestamp
    const { data: lastUsedData, error: lastUsedError } = await supabase
      .from('emoji_analytics')
      .select('timestamp')
      .eq('emoji_id', emojiId)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (lastUsedError || !lastUsedData?.length) {
      console.error('Error fetching last used:', lastUsedError);
      return null;
    }
    
    return {
      emojiId,
      shortcode: emojiData.shortcode,
      totalUses: totalUses || 0,
      reactionsCount: reactionsCount || 0,
      inMessagesCount: inMessagesCount || 0,
      uniqueUsers,
      lastUsed: lastUsedData[0].timestamp,
    };
  } catch (err) {
    console.error('Failed to get emoji stats:', err);
    return null;
  }
};

/**
 * Get top emojis by usage
 * @param limit - Maximum number of emojis to return
 * @param days - Number of days to look back (0 for all time)
 * @returns Promise with array of emoji usage statistics
 */
export const getTopEmojis = async (
  limit = 10,
  days = 30
): Promise<EmojiUsageStats[]> => {
  try {
    // Get all emojis first
    const { data: emojis, error: emojisError } = await supabase
      .from('custom_emojis')
      .select('id, shortcode');
    
    if (emojisError || !emojis) {
      console.error('Error fetching emojis:', emojisError);
      return [];
    }
    
    // Build date filter if needed
    let dateFilter = '';
    if (days > 0) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      dateFilter = `timestamp > '${date.toISOString()}'`;
    }
    
    // Count uses for each emoji
    const emojiCounts = await Promise.all(emojis.map(async (emoji) => {
      const query = supabase
        .from('emoji_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('emoji_id', emoji.id);
      
      if (dateFilter) {
        query.filter('timestamp', 'gt', dateFilter);
      }
      
      const { count, error } = await query;
      
      if (error) {
        console.error(`Error counting uses for emoji ${emoji.id}:`, error);
        return { ...emoji, count: 0 };
      }
      
      return { ...emoji, count: count || 0 };
    }));
    
    // Sort by count and limit
    const topEmojis = emojiCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    // Get detailed stats for top emojis
    const topEmojiStats = await Promise.all(
      topEmojis.map(emoji => getEmojiStats(emoji.id))
    );
    
    return topEmojiStats.filter((stats): stats is EmojiUsageStats => stats !== null);
  } catch (err) {
    console.error('Failed to get top emojis:', err);
    return [];
  }
};

/**
 * Get emoji usage over time
 * @param emojiId - ID of the emoji to analyze
 * @param days - Number of days to look back
 * @returns Promise with array of daily usage counts
 */
export const getEmojiUsageOverTime = async (
  emojiId: string,
  days = 30
): Promise<EmojiTimeAnalytics[]> => {
  try {
    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all usage records for this emoji in the time period
    const { data, error } = await supabase
      .from('emoji_analytics')
      .select('timestamp')
      .eq('emoji_id', emojiId)
      .gte('timestamp', startDate.toISOString());
    
    if (error || !data) {
      console.error('Error fetching emoji usage data:', error);
      return [];
    }
    
    // Group by date
    const usageByDate: Record<string, number> = {};
    
    // Initialize all dates in the range with zero count
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      usageByDate[dateStr] = 0;
    }
    
    // Count occurrences per day
    data.forEach(record => {
      const dateStr = record.timestamp.split('T')[0];
      usageByDate[dateStr] = (usageByDate[dateStr] || 0) + 1;
    });
    
    // Convert to array and sort by date
    return Object.entries(usageByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error('Failed to get emoji usage over time:', err);
    return [];
  }
};
