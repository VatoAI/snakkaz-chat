import { CustomEmoji } from '@/hooks/useCustomEmojis';

/**
 * Search and filter utilities for custom emojis
 */

/**
 * Interface for search result with relevance score
 */
export interface EmojiSearchResult {
  emoji: CustomEmoji;
  score: number;
}

/**
 * Search for custom emojis based on query text
 * 
 * @param query - Search query text
 * @param emojis - Array of custom emojis to search through
 * @param maxResults - Maximum number of results to return (default: 20)
 * @returns Array of emoji search results sorted by relevance
 */
export const searchEmojis = (
  query: string,
  emojis: CustomEmoji[],
  maxResults = 20
): EmojiSearchResult[] => {
  if (!query || query.trim() === '') {
    // If no query, return emojis sorted by usage, with favorites first
    return emojis
      .sort((a, b) => {
        // Sort by favorite status first
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        // Then sort by usage
        return b.usage - a.usage;
      })
      .slice(0, maxResults)
      .map(emoji => ({ emoji, score: emoji.isFavorite ? 100 : emoji.usage }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: EmojiSearchResult[] = [];

  // Search through emojis
  for (const emoji of emojis) {
    // Skip private emojis the user doesn't own unless they are favorites
    if (!emoji.isPublic && !emoji.isFavorite) {
      continue;
    }

    // Calculate relevance score based on different matching criteria
    let score = 0;
    let hasMatch = false;
    const shortcode = emoji.shortcode.toLowerCase();
    const name = emoji.name.toLowerCase();
    const category = emoji.category.toLowerCase();

    // Exact shortcode match (highest priority)
    if (shortcode === normalizedQuery) {
      score += 100;
      hasMatch = true;
    }
    // Shortcode starts with query
    else if (shortcode.startsWith(normalizedQuery)) {
      score += 50;
      hasMatch = true;
    }
    // Shortcode contains query
    else if (shortcode.includes(normalizedQuery)) {
      score += 30;
      hasMatch = true;
    }

    // Name exact match
    if (name === normalizedQuery) {
      score += 80;
      hasMatch = true;
    }
    // Name starts with query
    else if (name.startsWith(normalizedQuery)) {
      score += 40;
      hasMatch = true;
    }
    // Name contains query
    else if (name.includes(normalizedQuery)) {
      score += 20;
      hasMatch = true;
    }

    // Category match
    if (category.includes(normalizedQuery)) {
      score += 10;
      hasMatch = true;
    }

    // Only add bonuses if there's actually a match
    if (hasMatch) {
      // Bonus for favorites
      if (emoji.isFavorite) {
        score += 25;
      }

      // Bonus for frequently used emojis
      score += Math.min(emoji.usage, 10); // Cap usage bonus at 10

      results.push({ emoji, score });
    }
  }

  // Sort by score (descending) and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};

/**
 * Group emojis by category
 * 
 * @param emojis - Array of custom emojis to group
 * @returns Object with categories as keys and emoji arrays as values
 */
export const groupEmojisByCategory = (
  emojis: CustomEmoji[]
): Record<string, CustomEmoji[]> => {
  const grouped: Record<string, CustomEmoji[]> = {};
  
  // Group by category
  emojis.forEach(emoji => {
    const category = emoji.category || 'Uncategorized';
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push(emoji);
  });
  
  // Sort emojis within each category by usage (descending)
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => b.usage - a.usage);
  });
  
  return grouped;
};

/**
 * Get user's most used emojis
 * 
 * @param emojis - Array of all custom emojis
 * @param limit - Maximum number of emojis to return
 * @returns Array of most used emojis
 */
export const getMostUsedEmojis = (
  emojis: CustomEmoji[],
  limit = 10
): CustomEmoji[] => {
  return [...emojis]
    .sort((a, b) => b.usage - a.usage)
    .slice(0, limit);
};

/**
 * Get user's favorite emojis
 * 
 * @param emojis - Array of all custom emojis
 * @returns Array of favorite emojis
 */
export const getFavoriteEmojis = (
  emojis: CustomEmoji[]
): CustomEmoji[] => {
  return emojis.filter(emoji => emoji.isFavorite);
};
