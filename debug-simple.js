console.log("Testing emoji search debug");

const emojis = [
  { shortcode: 'party', name: 'Party Face', category: 'Celebrations', usage: 42, isFavorite: true, isPublic: true },
  { shortcode: 'cool', name: 'Cool Face', category: 'Faces', usage: 28, isFavorite: false, isPublic: true },
  { shortcode: 'snakkaz', name: 'Snakkaz Logo', category: 'Branding', usage: 65, isFavorite: true, isPublic: true },
  { shortcode: 'heart_eyes', name: 'Heart Eyes', category: 'Faces', usage: 31, isFavorite: false, isPublic: true },
  { shortcode: 'party_popper', name: 'Party Popper', category: 'Celebrations', usage: 19, isFavorite: true, isPublic: false }
];

function debugSearch(query) {
  console.log(`\n=== Search for "${query}" ===`);
  let matches = 0;
  
  emojis.forEach(emoji => {
    let score = 0;
    let hasMatch = false;
    const reasons = [];
    
    // Check if private emoji should be skipped
    if (!emoji.isPublic && !emoji.isFavorite) {
      console.log(`${emoji.shortcode}: SKIPPED (private, not favorite)`);
      return;
    }
    
    const q = query.toLowerCase();
    const shortcode = emoji.shortcode.toLowerCase();
    const name = emoji.name.toLowerCase();
    const category = emoji.category.toLowerCase();
    
    // Check matches
    if (shortcode === q) { score += 100; reasons.push('exact shortcode'); hasMatch = true; }
    else if (shortcode.startsWith(q)) { score += 50; reasons.push('shortcode starts'); hasMatch = true; }
    else if (shortcode.includes(q)) { score += 30; reasons.push('shortcode contains'); hasMatch = true; }
    
    if (name === q) { score += 80; reasons.push('exact name'); hasMatch = true; }
    else if (name.startsWith(q)) { score += 40; reasons.push('name starts'); hasMatch = true; }
    else if (name.includes(q)) { score += 20; reasons.push('name contains'); hasMatch = true; }
    
    if (category.includes(q)) { score += 10; reasons.push('category'); hasMatch = true; }
    
    // Only add bonuses if there's actually a match
    if (hasMatch) {
      if (emoji.isFavorite) { score += 25; reasons.push('favorite'); }
      
      const usageBonus = Math.min(emoji.usage, 10);
      score += usageBonus;
      reasons.push(`usage(${usageBonus})`);
      
      matches++;
      console.log(`${emoji.shortcode}: score=${score} (${reasons.join(', ')})`);
    } else {
      console.log(`${emoji.shortcode}: NO MATCH`);
    }
  });
  
  console.log(`Total matches: ${matches}`);
}

debugSearch('party');
debugSearch('cool');
debugSearch('faces');
