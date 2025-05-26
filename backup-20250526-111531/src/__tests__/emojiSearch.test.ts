import { searchEmojis, groupEmojisByCategory, getMostUsedEmojis, getFavoriteEmojis } from '@/utils/emojiSearchUtils';
import { CustomEmoji } from '@/hooks/useCustomEmojis';

// Mock emoji data for testing
const mockEmojis: CustomEmoji[] = [
  {
    id: '1',
    shortcode: 'party',
    name: 'Party Face',
    url: 'https://example.com/emojis/party.png',
    category: 'Celebrations',
    isAnimated: false,
    isPublic: true,
    createdBy: 'user1',
    createdAt: '2025-05-01',
    usage: 42,
    isFavorite: true,
  },
  {
    id: '2',
    shortcode: 'cool',
    name: 'Cool Face',
    url: 'https://example.com/emojis/cool.png',
    category: 'Faces',
    isAnimated: false,
    isPublic: true,
    createdBy: 'user1',
    createdAt: '2025-05-02',
    usage: 28,
    isFavorite: false,
  },
  {
    id: '3',
    shortcode: 'snakkaz',
    name: 'Snakkaz Logo',
    url: 'https://example.com/emojis/snakkaz.png',
    category: 'Branding',
    isAnimated: true,
    isPublic: true,
    createdBy: 'user2',
    createdAt: '2025-05-03',
    usage: 65,
    isFavorite: true,
  },
  {
    id: '4',
    shortcode: 'heart_eyes',
    name: 'Heart Eyes',
    url: 'https://example.com/emojis/heart_eyes.png',
    category: 'Faces',
    isAnimated: false,
    isPublic: true,
    createdBy: 'user3',
    createdAt: '2025-05-04',
    usage: 31,
    isFavorite: false,
  },
  {
    id: '5',
    shortcode: 'party_popper',
    name: 'Party Popper',
    url: 'https://example.com/emojis/party_popper.png',
    category: 'Celebrations',
    isAnimated: true,
    isPublic: false, // Private emoji
    createdBy: 'user1',
    createdAt: '2025-05-05',
    usage: 19,
    isFavorite: true,
  },
];

describe('Emoji Search Utilities', () => {
  describe('searchEmojis', () => {
    test('searches emojis based on shortcode', () => {
      const results = searchEmojis('party', mockEmojis);
      
      // Should match both 'party' and 'party_popper'
      expect(results.length).toBe(2);
      expect(results[0].emoji.shortcode).toBe('party');
      expect(results[1].emoji.shortcode).toBe('party_popper');
    });

    test('prioritizes exact matches', () => {
      const results = searchEmojis('cool', mockEmojis);
      
      expect(results.length).toBe(1);
      expect(results[0].emoji.shortcode).toBe('cool');
      expect(results[0].score).toBeGreaterThan(50); // Should have high score for exact match
    });

    test('searches by category', () => {
      const results = searchEmojis('faces', mockEmojis);
      
      expect(results.length).toBe(2);
      expect(results.map(r => r.emoji.shortcode)).toContain('cool');
      expect(results.map(r => r.emoji.shortcode)).toContain('heart_eyes');
    });

    test('prioritizes favorites', () => {
      const results = searchEmojis('part', mockEmojis);
      
      expect(results.length).toBe(2);
      // party_popper should be first due to being a favorite, despite lower usage
      expect(results[0].emoji.shortcode).toBe('party');
      expect(results[1].emoji.shortcode).toBe('party_popper');
    });

    test('returns most used emojis when query is empty', () => {
      const results = searchEmojis('', mockEmojis);
      
      // Should return all emojis, sorted by favorite status then usage
      expect(results.length).toBe(5);
      expect(results[0].emoji.shortcode).toBe('snakkaz'); // Favorite with highest usage
      expect(results[1].emoji.shortcode).toBe('party'); // Also a favorite
      expect(results[2].emoji.shortcode).toBe('party_popper'); // Also a favorite
    });
  });

  describe('groupEmojisByCategory', () => {
    test('groups emojis correctly by category', () => {
      const grouped = groupEmojisByCategory(mockEmojis);
      
      expect(Object.keys(grouped).length).toBe(3); // Celebrations, Faces, Branding
      expect(grouped['Celebrations'].length).toBe(2);
      expect(grouped['Faces'].length).toBe(2);
      expect(grouped['Branding'].length).toBe(1);
    });

    test('sorts emojis by usage within each category', () => {
      const grouped = groupEmojisByCategory(mockEmojis);
      
      // In 'Faces' category, 'heart_eyes' (31) should come before 'cool' (28)
      expect(grouped['Faces'][0].shortcode).toBe('heart_eyes');
      expect(grouped['Faces'][1].shortcode).toBe('cool');
      
      // In 'Celebrations' category, 'party' (42) should come before 'party_popper' (19)
      expect(grouped['Celebrations'][0].shortcode).toBe('party');
      expect(grouped['Celebrations'][1].shortcode).toBe('party_popper');
    });
  });

  describe('getMostUsedEmojis', () => {
    test('returns emojis sorted by usage', () => {
      const mostUsed = getMostUsedEmojis(mockEmojis, 3);
      
      expect(mostUsed.length).toBe(3);
      expect(mostUsed[0].shortcode).toBe('snakkaz'); // 65 usages
      expect(mostUsed[1].shortcode).toBe('party'); // 42 usages
      expect(mostUsed[2].shortcode).toBe('heart_eyes'); // 31 usages
    });

    test('respects the limit parameter', () => {
      const mostUsed = getMostUsedEmojis(mockEmojis, 2);
      
      expect(mostUsed.length).toBe(2);
      expect(mostUsed[0].shortcode).toBe('snakkaz');
      expect(mostUsed[1].shortcode).toBe('party');
    });
  });

  describe('getFavoriteEmojis', () => {
    test('returns only favorite emojis', () => {
      const favorites = getFavoriteEmojis(mockEmojis);
      
      expect(favorites.length).toBe(3);
      expect(favorites.every(emoji => emoji.isFavorite)).toBe(true);
      expect(favorites.map(e => e.shortcode)).toContain('party');
      expect(favorites.map(e => e.shortcode)).toContain('snakkaz');
      expect(favorites.map(e => e.shortcode)).toContain('party_popper');
    });
  });
});
