// Debug script to understand emoji search results
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

// Simulate the search algorithm
function searchEmojis(query, emojis, maxResults = 20) {
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
    // Skip private emojis the user doesn't own unless they are favorites
    if (!emoji.isPublic && !emoji.isFavorite) {
      continue;
    }

    let score = 0;
    const shortcode = emoji.shortcode.toLowerCase();
    const name = emoji.name.toLowerCase();
    const category = emoji.category.toLowerCase();

    // Exact shortcode match (highest priority)
    if (shortcode === normalizedQuery) {
      score += 100;
    }
    // Shortcode starts with query
    else if (shortcode.startsWith(normalizedQuery)) {
      score += 50;
    }
    // Shortcode contains query
    else if (shortcode.includes(normalizedQuery)) {
      score += 30;
    }

    // Name exact match
    if (name === normalizedQuery) {
      score += 80;
    }
    // Name starts with query
    else if (name.startsWith(normalizedQuery)) {
      score += 40;
    }
    // Name contains query
    else if (name.includes(normalizedQuery)) {
      score += 20;
    }

    // Category match
    if (category.includes(normalizedQuery)) {
      score += 10;
    }

    // Bonus for favorites
    if (emoji.isFavorite) {
      score += 25;
    }

    // Bonus for frequently used emojis
    score += Math.min(emoji.usage, 10); // Cap usage bonus at 10

    // If there's any match, add to results
    if (score > 0) {
      results.push({ emoji, score });
    }
  }

  // Sort by score (highest first), then by usage as tiebreaker
  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.emoji.usage - a.emoji.usage;
    })
    .slice(0, maxResults);
}

// Test different queries
try {
  console.log('=== Testing "party" query ===');
  const partyResults = searchEmojis('party', mockEmojis);
  console.log(`Found ${partyResults.length} results:`);
  partyResults.forEach((result, i) => {
    console.log(`${i + 1}. ${result.emoji.shortcode} (score: ${result.score}) - ${result.emoji.name}`);
  });

  console.log('\n=== Testing "cool" query ===');
  const coolResults = searchEmojis('cool', mockEmojis);
  console.log(`Found ${coolResults.length} results:`);
  coolResults.forEach((result, i) => {
    console.log(`${i + 1}. ${result.emoji.shortcode} (score: ${result.score}) - ${result.emoji.name}`);
  });

  console.log('\n=== Testing "faces" query ===');
  const facesResults = searchEmojis('faces', mockEmojis);
  console.log(`Found ${facesResults.length} results:`);
  facesResults.forEach((result, i) => {
    console.log(`${i + 1}. ${result.emoji.shortcode} (score: ${result.score}) - ${result.emoji.name}`);
  });

  console.log('\n=== Testing "part" query ===');
  const partResults = searchEmojis('part', mockEmojis);
  console.log(`Found ${partResults.length} results:`);
  partResults.forEach((result, i) => {
    console.log(`${i + 1}. ${result.emoji.shortcode} (score: ${result.score}) - ${result.emoji.name}`);
  });
} catch (error) {
  console.error('Error during testing:', error);
}
