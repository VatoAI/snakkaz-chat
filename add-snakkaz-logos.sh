#!/bin/bash
# SnakkaZ Logo Integration Script
# Adds beautiful SnakkaZ logos to the app

echo "🎨 SnakkaZ Logo Integration"
echo "=========================="

SNAKKAZ_DIR="/workspaces/snakkaz-chat/snakkaz-complete-deployment"

# Create directories
mkdir -p "$SNAKKAZ_DIR/icons"
mkdir -p "$SNAKKAZ_DIR/assets/images"

echo "📁 Directories created:"
echo "   ✅ icons/"
echo "   ✅ assets/images/"

echo ""
echo "🎨 MANUAL STEP REQUIRED:"
echo "Please copy your SnakkaZ logo files to these locations:"
echo ""
echo "For PWA icons (recommended sizes):"
echo "   📱 192x192: $SNAKKAZ_DIR/icons/snakkaz-icon-192.png"
echo "   📱 512x512: $SNAKKAZ_DIR/icons/snakkaz-icon-512.png"
echo "   📱 Favicon: $SNAKKAZ_DIR/favicon.ico"
echo ""
echo "For app branding:"
echo "   🎨 Logo: $SNAKKAZ_DIR/assets/images/snakkaz-logo.png"
echo "   🎨 Header: $SNAKKAZ_DIR/assets/images/snakkaz-header.png"
echo ""

# Create temporary placeholder files to prevent 404 errors
echo "🔧 Creating temporary placeholders..."

# Create a simple SVG placeholder
cat > "$SNAKKAZ_DIR/icons/snakkaz-icon-192.png" << 'EOF'
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00aaff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff4488;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="192" height="192" rx="48" fill="url(#gradient)"/>
  <text x="96" y="110" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">SnakkaZ</text>
</svg>
EOF

cp "$SNAKKAZ_DIR/icons/snakkaz-icon-192.png" "$SNAKKAZ_DIR/icons/snakkaz-icon-512.png"
cp "$SNAKKAZ_DIR/icons/snakkaz-icon-192.png" "$SNAKKAZ_DIR/assets/images/snakkaz-logo.png"

echo "   ✅ Temporary placeholders created"

# Update manifest.json with proper icon references
echo "📱 Updating manifest.json..."

cat > "$SNAKKAZ_DIR/manifest.json" << 'EOF'
{
  "name": "SnakkaZ Beta - Sikker Chat",
  "short_name": "SnakkaZ",
  "description": "Sikker end-to-end kryptert chat med moderne design",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#00aaff",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "nb-NO",
  "icons": [
    {
      "src": "/icons/snakkaz-icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/snakkaz-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["social", "communication"],
  "screenshots": [
    {
      "src": "/assets/images/snakkaz-logo.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Start ny chat",
      "short_name": "Ny chat",
      "description": "Start en ny sikker chat",
      "url": "/chat/new",
      "icons": [
        {
          "src": "/icons/snakkaz-icon-192.png",
          "sizes": "192x192"
        }
      ]
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
EOF

echo "   ✅ manifest.json updated with SnakkaZ branding"

# Update index.html with proper meta tags and logo references
echo "🌐 Updating index.html with logo references..."

# Add favicon and meta tags
sed -i '/<title>/a\
    <!-- SnakkaZ Branding -->\
    <link rel="icon" type="image/x-icon" href="/favicon.ico">\
    <link rel="apple-touch-icon" sizes="192x192" href="/icons/snakkaz-icon-192.png">\
    <meta name="theme-color" content="#00aaff">\
    <meta property="og:title" content="SnakkaZ Beta - Sikker Chat">\
    <meta property="og:description" content="Moderne end-to-end kryptert chat app">\
    <meta property="og:image" content="/assets/images/snakkaz-logo.png">\
    <meta property="og:type" content="website">\
    <meta name="twitter:card" content="summary_large_image">\
    <meta name="twitter:title" content="SnakkaZ Beta">\
    <meta name="twitter:description" content="Sikker chat med liquid glass design">\
    <meta name="twitter:image" content="/assets/images/snakkaz-logo.png">
' "$SNAKKAZ_DIR/index.html"

echo "   ✅ index.html updated with meta tags"

# Create CSS for logo integration
echo "🎨 Creating logo CSS integration..."

cat > "$SNAKKAZ_DIR/assets/css/snakkaz-branding.css" << 'EOF'
/* SnakkaZ Branding & Logo Styles */

.snakkaz-logo {
    width: auto;
    height: 40px;
    transition: all 0.3s ease;
}

.snakkaz-logo:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

.snakkaz-header-logo {
    width: auto;
    height: 60px;
    margin-right: 15px;
}

.snakkaz-splash-logo {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 170, 255, 0.3);
}

.snakkaz-favicon {
    width: 24px;
    height: 24px;
    vertical-align: middle;
}

/* Loading screen with logo */
.snakkaz-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
}

.snakkaz-loading .logo {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
}

/* PWA install banner with logo */
.snakkaz-install-banner {
    background: linear-gradient(135deg, #00aaff, #ff4488);
    padding: 15px;
    border-radius: 12px;
    margin: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    box-shadow: 0 4px 20px rgba(0, 170, 255, 0.3);
}

.snakkaz-install-banner .logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
}

/* Chat header with logo */
.snakkaz-chat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    margin-bottom: 20px;
}
EOF

# Add branding CSS to index.html
sed -i '/<\/head>/i\
    <link rel="stylesheet" href="/assets/css/snakkaz-branding.css">
' "$SNAKKAZ_DIR/index.html"

echo "   ✅ Branding CSS created and linked"

echo ""
echo "🎉 LOGO INTEGRATION COMPLETE!"
echo "=============================="
echo ""
echo "✅ Created directories for logos"
echo "✅ Updated manifest.json with SnakkaZ branding"
echo "✅ Added meta tags for social sharing"
echo "✅ Created branding CSS"
echo "✅ Added temporary placeholders"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Replace placeholder files with your actual SnakkaZ logos:"
echo "   - Copy logo as: icons/snakkaz-icon-192.png (192x192)"
echo "   - Copy logo as: icons/snakkaz-icon-512.png (512x512)"
echo "   - Copy logo as: assets/images/snakkaz-logo.png"
echo ""
echo "2. Optional: Update favicon.ico with SnakkaZ icon"
echo ""
echo "3. The app now has proper PWA branding and will show SnakkaZ logos!"
echo ""
echo "💡 TIP: Use the beautiful gradient logos you shared - they'll look amazing!"
echo "   The heart and flower of life designs are perfect for the chat app! 💝🌸"
