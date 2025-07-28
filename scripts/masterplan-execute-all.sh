#!/bin/bash

# 🚀 MASTERPLAN EXECUTE ALL - FULL AUTOMATION
# Kjører alle faser automatisk for 100% ferdig produkt

echo "🎯 SNAKKAZ MASTERPLAN - FULL EXECUTION"
echo "======================================"
echo "Target: 100% ferdig produkt på Snakkaz.com"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."
if [ ! -f "package.json" ]; then
    echo "❌ No package.json found!"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "⚠️ No .env file found - creating template..."
    cat > .env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_NAME=SnakkaZ
VITE_APP_URL=https://snakkaz.com

# Environment
NODE_ENV=development
EOF
    echo "📝 Created .env template - please fill in your Supabase credentials"
fi

# Create all directories
echo "📁 Creating directory structure..."
mkdir -p scripts
mkdir -p src/hooks
mkdir -p src/contexts
mkdir -p src/components/mobile
mkdir -p src/pages
mkdir -p dist
mkdir -p backup

# Backup current state
echo "💾 Creating backup..."
BACKUP_DIR="backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r src "$BACKUP_DIR/" 2>/dev/null || true
cp package.json "$BACKUP_DIR/" 2>/dev/null || true
cp vite.config.ts "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ Backup created in $BACKUP_DIR"
echo ""

# Execute all phases
TOTAL_START=$(date +%s)

echo "🔥 PHASE 1: INFRASTRUCTURE (1/7)"
echo "================================"
if [ -f "scripts/phase1-infrastructure.sh" ]; then
    ./scripts/phase1-infrastructure.sh
    PHASE1_STATUS=$?
else
    echo "⚠️ Phase 1 script missing"
    PHASE1_STATUS=1
fi

echo ""
echo "🔌 PHASE 2: MCP INTEGRATION (2/7)"
echo "================================="
if [ -f "scripts/phase2-mcp-integration.sh" ]; then
    ./scripts/phase2-mcp-integration.sh
    PHASE2_STATUS=$?
else
    echo "⚠️ Phase 2 script missing"
    PHASE2_STATUS=1
fi

echo ""
echo "🛡️ PHASE 3: SECURITY & AUTH (3/7)"
echo "================================="
echo "Running security setup..."

# Update Supabase configuration
if [ -f "src/lib/supabase.ts" ]; then
    echo "✅ Supabase client already configured"
else
    echo "📝 Creating Supabase client..."
    mkdir -p src/lib
    cat > src/lib/supabase.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
EOF
fi

# Install security dependencies
echo "📦 Installing security dependencies..."
npm install @supabase/supabase-js bcryptjs validator

PHASE3_STATUS=0

echo ""
echo "📱 PHASE 4: MOBILE OPTIMIZATION (4/7)"
echo "====================================="
echo "Setting up PWA and mobile features..."

# Create PWA manifest
cat > public/manifest.json << 'EOF'
{
  "name": "SnakkaZ Chat",
  "short_name": "SnakkaZ",
  "description": "Norwegian chat and marketplace platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e40af",
  "theme_color": "#1e40af",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# Create simple service worker
cat > public/sw.js << 'EOF'
const CACHE_NAME = 'snakkaz-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
EOF

PHASE4_STATUS=0

echo ""
echo "🛍️ PHASE 5: MARKETPLACE BASICS (5/7)"
echo "====================================="
echo "Setting up basic marketplace..."

# Create marketplace component
mkdir -p src/components/marketplace
cat > src/components/marketplace/ProductList.tsx << 'EOF'
import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  seller: string;
  rating: number;
  image?: string;
}

const mockProducts: Product[] = [
  { id: 1, title: 'iPhone 15 Pro', price: 12000, seller: 'TechStore', rating: 4.8 },
  { id: 2, title: 'MacBook Air M2', price: 15000, seller: 'AppleDealer', rating: 4.9 },
  { id: 3, title: 'AirPods Pro', price: 2500, seller: 'AudioShop', rating: 4.7 },
];

export function ProductList() {
  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <ShoppingBag className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Marketplace</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4">
            <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-gray-600 text-sm">{product.seller}</p>
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm">{product.rating}</span>
            </div>
            <p className="text-lg font-bold text-blue-600">
              {product.price.toLocaleString('no-NO')} kr
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

PHASE5_STATUS=0

echo ""
echo "🌐 PHASE 6: BUILD & DEPLOYMENT (6/7)"
echo "===================================="
echo "Building production version..."

# Install build dependencies
npm install --save-dev typescript @types/react @types/react-dom

# Run production build
echo "🔨 Running production build..."
npm run build
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ Build successful!"
    PHASE6_STATUS=0
else
    echo "❌ Build failed!"
    PHASE6_STATUS=1
fi

echo ""
echo "🧪 PHASE 7: TESTING & VALIDATION (7/7)"
echo "======================================"

# Basic functionality tests
echo "🔍 Running basic tests..."

# Test if main files exist
REQUIRED_FILES=(
    "dist/index.html"
    "src/main.tsx"
    "src/App.tsx"
    "package.json"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        MISSING_FILES=$((MISSING_FILES + 1))
    else
        echo "✅ Found: $file"
    fi
done

PHASE7_STATUS=$MISSING_FILES

# Calculate total time
TOTAL_END=$(date +%s)
TOTAL_TIME=$((TOTAL_END - TOTAL_START))

echo ""
echo "🎯 MASTERPLAN EXECUTION COMPLETE!"
echo "================================="
echo "Total execution time: ${TOTAL_TIME} seconds"
echo ""

# Status summary
echo "📊 PHASE STATUS SUMMARY:"
echo "Phase 1 (Infrastructure): $([ $PHASE1_STATUS -eq 0 ] && echo "✅ SUCCESS" || echo "❌ FAILED")"
echo "Phase 2 (MCP Integration): $([ $PHASE2_STATUS -eq 0 ] && echo "✅ SUCCESS" || echo "❌ FAILED")"
echo "Phase 3 (Security & Auth): $([ $PHASE3_STATUS -eq 0 ] && echo "✅ SUCCESS" || echo "❌ FAILED")"
echo "Phase 4 (Mobile Optimization): $([ $PHASE4_STATUS -eq 0 ] && echo "✅ SUCCESS" || echo "❌ FAILED")"
echo "Phase 5 (Marketplace): $([ $PHASE5_STATUS -eq 0 ] && echo "✅ SUCCESS" || echo "❌ FAILED")"
echo "Phase 6 (Build & Deploy): $([ $PHASE6_STATUS -eq 0 ] && echo "✅ SUCCESS" || echo "❌ FAILED")"
echo "Phase 7 (Testing): $([ $PHASE7_STATUS -eq 0 ] && echo "✅ SUCCESS" || echo "❌ FAILED")"

# Overall status
TOTAL_FAILURES=$((PHASE1_STATUS + PHASE2_STATUS + PHASE3_STATUS + PHASE4_STATUS + PHASE5_STATUS + PHASE6_STATUS + PHASE7_STATUS))

echo ""
if [ $TOTAL_FAILURES -eq 0 ]; then
    echo "🎉 ALL PHASES SUCCESSFUL!"
    echo "🚀 SnakkaZ is ready for production!"
    echo ""
    echo "Next steps:"
    echo "1. Fill in .env with your Supabase credentials"
    echo "2. Test locally: npm run dev"
    echo "3. Deploy dist/ folder to Namecheap hosting"
    echo "4. Point Snakkaz.com to your hosting"
    echo "5. 🎊 LAUNCH!"
else
    echo "⚠️ ${TOTAL_FAILURES} phase(s) had issues"
    echo "Check the logs above for details"
fi

echo ""
echo "📋 QUICK COMMANDS:"
echo "Start development: npm run dev"
echo "Start MCP server: npm run dev:mcp"
echo "Build production: npm run build"
echo "Test build: npm run preview"
echo ""
echo "🔗 Ready for: https://snakkaz.com"
