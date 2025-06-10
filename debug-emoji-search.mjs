// Debug script for emoji search
const mockEmojis = [
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

const searchEmojis = (query, emojis, maxResults = 20) => {
  if (!query || query.trim() === '') {
    return emojis
      .sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return b.usage - a.usage;
      })
      .slice(0, maxResults)
      .map(emoji => ({ emoji, score: emoji.isFavorite ? 100 : emoji.usage }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results = [];

  for (const emoji of emojis) {
    if (!emoji.isPublic && !emoji.isFavorite) {
      continue;
    }

    let score = 0;
    const shortcode = emoji.shortcode.toLowerCase();
    const name = emoji.name.toLowerCase();
    const category = emoji.category.toLowerCase();

    console.log(`\nChecking emoji: ${emoji.shortcode}`);
    console.log(`Query: "${normalizedQuery}"`);

    if (shortcode === normalizedQuery) {
      score += 100;
      console.log(`  Exact shortcode match: +100`);
    } else if (shortcode.startsWith(normalizedQuery)) {
      score += 50;
      console.log(`  Shortcode starts with query: +50`);
    } else if (shortcode.includes(normalizedQuery)) {
      score += 30;
      console.log(`  Shortcode contains query: +30`);
    }

    if (name === normalizedQuery) {
      score += 80;
      console.log(`  Exact name match: +80`);
    } else if (name.startsWith(normalizedQuery)) {
      score += 40;
      console.log(`  Name starts with query: +40`);
    } else if (name.includes(normalizedQuery)) {
      score += 20;
      console.log(`  Name contains query: +20`);
    }

    if (category.includes(normalizedQuery)) {
      score += 10;
      console.log(`  Category contains query: +10`);
    }

    if (emoji.isFavorite) {
      score += 25;
      console.log(`  Favorite bonus: +25`);
    }

    const usageBonus = Math.min(emoji.usage, 10);
    score += usageBonus;
    console.log(`  Usage bonus: +${usageBonus}`);

    console.log(`  Total score: ${score}`);

    if (score > 0) {
      results.push({ emoji, score });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
};

console.log('=== Testing search for "party" ===');
const partyResults = searchEmojis('party', mockEmojis);
console.log(`\nFinal results: ${partyResults.length} emojis`);
partyResults.forEach((result, i) => {
  console.log(`${i + 1}. ${result.emoji.shortcode} (score: ${result.score})`);
});

console.log('\n=== Testing search for "cool" ===');
const coolResults = searchEmojis('cool', mockEmojis);
console.log(`\nFinal results: ${coolResults.length} emojis`);
coolResults.forEach((result, i) => {
  console.log(`${i + 1}. ${result.emoji.shortcode} (score: ${result.score})`);
});
