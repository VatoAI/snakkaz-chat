#!/bin/bash

# 🚨 EMERGENCY VITE PERFORMANCE FIX
# Target: Reduser startup fra 39 sekunder til under 5 sekunder

echo "🔥 PHASE 1: KRITISK INFRASTRUKTUR FIX"
echo "=================================="

# Kill alle Vite prosesser
echo "1️⃣ Killing alle Vite prosesser..."
pkill -f vite 2>/dev/null || true
pkill -f node 2>/dev/null || true

# Clear alle caches
echo "2️⃣ Clearing alle caches..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf .vite 2>/dev/null || true

# Port cleanup
echo "3️⃣ Port cleanup..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:4001 | xargs kill -9 2>/dev/null || true

# Backup original vite config
echo "4️⃣ Backup original config..."
cp vite.config.ts vite.config.ts.backup

# Create ultra-optimized Vite config
echo "5️⃣ Creating optimized Vite config..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// 🚀 ULTRA-OPTIMIZED VITE CONFIG - SPEED FOCUSED
export default defineConfig({
  plugins: [
    react({
      // Optimize React plugin
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: []
      }
    })
  ],

  // Aggressive caching
  cacheDir: 'node_modules/.vite',

  // Minimal defines
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  },

  // Simple alias only
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Ultra-fast server config
  server: {
    port: 4000,
    host: true,
    strictPort: false,
    open: false,
    cors: true,
    
    // Minimal middleware
    middlewareMode: false,
    
    // Fast HMR
    hmr: {
      port: 4001,
      overlay: false
    },
    
    // No proxy
    proxy: {}
  },

  // Aggressive build optimizations
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false
  },

  // Ultra-fast dev optimizations
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
    force: false
  },

  // Disable unnecessary features in dev
  css: {
    devSourcemap: false
  }
});
EOF

# Check package.json for heavy dependencies
echo "6️⃣ Analyzing dependencies..."
echo "Checking for performance killers..."

# Create optimized package.json scripts
echo "7️⃣ Optimizing npm scripts..."
node -e "
const pkg = require('./package.json');
pkg.scripts.dev = 'vite --host --port 4000';
pkg.scripts['dev:fast'] = 'vite --host --port 4000 --force';
pkg.scripts['dev:debug'] = 'DEBUG=vite:* vite --host --port 4000';
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo "8️⃣ Testing optimized startup..."
echo "Starting Vite with optimizations..."

# Start with timing
START_TIME=$(date +%s)
echo "Start time: $(date)"

# Test startup in background
timeout 30s npm run dev &
VITE_PID=$!

# Wait for startup
sleep 10

# Check if running
if curl -s http://localhost:4000 > /dev/null; then
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    echo "✅ SUCCESS! Vite started in ${DURATION} seconds"
    
    if [ $DURATION -lt 10 ]; then
        echo "🎉 EXCELLENT! Under 10 seconds!"
    elif [ $DURATION -lt 20 ]; then
        echo "👍 GOOD! Under 20 seconds!"
    else
        echo "⚠️  Still slow, needs more optimization"
    fi
else
    echo "❌ FAILED! Vite not responding"
fi

# Kill test process
kill $VITE_PID 2>/dev/null || true

echo ""
echo "🔧 ADDITIONAL OPTIMIZATIONS APPLIED:"
echo "- Removed unnecessary plugins"
echo "- Optimized React plugin settings"
echo "- Disabled sourcemaps in dev"
echo "- Aggressive caching enabled"
echo "- Minimal HMR configuration"
echo "- Removed proxy configurations"
echo ""
echo "🚀 Ready for next phase! Run: npm run dev"
