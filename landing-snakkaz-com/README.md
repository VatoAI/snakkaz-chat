# SnakkaZ Landing Page - "Under Arbeid" med MCP API Integration

## 🎯 Hva denne siden gjør:

### ✨ **WOW-Faktor Features:**

- **Glassmorphism Design** - Moderne, transparent glass-effekt
- **Animerte Partikler** - Flytende bakgrunnselementer
- **Gradient Animasjoner** - Smooth color transitions
- **Typing Effect** - Tekst som skriver seg selv
- **Hover Effects** - Interaktive elementer
- **Progress Bar** - Visuell utviklingsfremdrift (73%)

### 🔧 **MCP API Integration:**

```javascript
const MCP_API_BASE = 'https://mcp.snakkaz.com/api';

// Beta signup endpoint
POST /api/beta-signup
{
  "name": "string",
  "email": "string",
  "company": "string",
  "timestamp": "ISO date",
  "source": "snakkaz.com-landing",
  "type": "prototype-beta-signup"
}

// Health check
GET /api/health
```

### 📱 **Responsiv Design:**

- Mobile-optimized
- Tablet-friendly
- Desktop wow-factor
- Touch-friendly buttons

### 🎨 **Visual Elements:**

- Animated logo med pulse-effekt
- 4 feature-bokser med hover animations
- Real-time connection status
- Success/error handling
- Smooth form animations

### 🔒 **Data Collection:**

Samler inn:

- Navn
- E-post (required)
- Bedrift (optional)
- Timestamp
- Source tracking

### 📊 **Analytics Ready:**

- Google Analytics integration
- Event tracking for signups
- Conversion tracking
- Error logging

## 🚀 Deployment Instructions:

1. **Opprett mappe på server:**

   ```bash
   mkdir /var/www/snakkaz.com/public_html
   ```

2. **Last opp filen:**

   ```bash
   cp landing-snakkaz-com/index.html /var/www/snakkaz.com/public_html/
   ```

3. **Sett opp MCP API på mcp.snakkaz.com**
4. **Test på https://snakkaz.com**

## 🔗 Dependencies:

- **MCP API** på mcp.snakkaz.com
- **HTTPS** (required for modern features)
- **Modern browsers** (Chrome 60+, Firefox 55+, Safari 12+)

Denne landing page-en gir en profesjonell "kommer snart" opplevelse mens du bygger SnakkaZ chat-systemet! 🎉
