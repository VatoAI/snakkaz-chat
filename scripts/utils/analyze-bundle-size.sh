#!/bin/bash

# Bundle Size Analysis Script for Snakkaz Chat
# This script builds the application and analyzes the bundle size

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Starting Bundle Size Analysis for Snakkaz Chat${NC}"
echo

# Create a Vite config file for bundle analysis
echo -e "${YELLOW}1️⃣ Creating Vite bundle analyzer config...${NC}"
cat > vite.analyze.config.ts << 'EOF'
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    cssCodeSplit: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-utils': ['date-fns', 'class-variance-authority', 'clsx', 'lucide-react', 'tailwind-merge'],
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'vendor-charts': ['recharts'],
          'vendor-media': ['@uppy/core', '@uppy/react', '@uppy/dashboard'],
          'vendor-security': ['crypto-js', 'tweetnacl', 'tweetnacl-util'],
        },
      }
    }
  }
});
EOF

# Install the visualizer package if it's not already installed
echo -e "${YELLOW}2️⃣ Installing bundle analyzer dependencies if needed...${NC}"
npm install -D rollup-plugin-visualizer

# Build the application with the analyzer
echo -e "${YELLOW}3️⃣ Building the application with bundle analysis...${NC}"
npm run build -- --config vite.analyze.config.ts

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo

# Analyze the bundle size
echo -e "${YELLOW}4️⃣ Analyzing bundle sizes...${NC}"

# Get total size of JS files
TOTAL_SIZE=$(find dist/assets -name "*.js" -exec du -k {} \; | awk '{sum+=$1} END {print sum}')
echo -e "Total JavaScript bundle size: ${GREEN}${TOTAL_SIZE} KB${NC}"

# Get sizes of individual chunks
echo "Main chunks:"
find dist/assets -name "index-*.js" -exec du -h {} \; | sort -hr

echo "Vendor chunks:"
find dist/assets -name "vendor-*.js" -exec du -h {} \; | sort -hr

echo "Dynamic chunks:"
find dist/assets -name "*.js" -not -name "index-*.js" -not -name "vendor-*.js" -exec du -h {} \; | sort -hr

# Count the number of chunks
NUM_CHUNKS=$(find dist/assets -name "*.js" | wc -l)
echo -e "Total number of chunks: ${GREEN}${NUM_CHUNKS}${NC}"

echo
echo -e "${YELLOW}5️⃣ Bundle size report generated${NC}"
echo -e "You can view the detailed visualization in ${GREEN}dist/stats.html${NC}"

# Compare with the previous budget
echo
echo -e "${YELLOW}6️⃣ Checking against bundle size budget${NC}"

BUDGET_TOTAL=800
BUDGET_MAIN=300
BUDGET_VENDOR=500

# Check if we're under budget
if [ "$TOTAL_SIZE" -gt "$BUDGET_TOTAL" ]; then
    echo -e "${RED}⚠️ Total bundle size (${TOTAL_SIZE} KB) exceeds budget (${BUDGET_TOTAL} KB)${NC}"
else
    echo -e "${GREEN}✅ Total bundle size (${TOTAL_SIZE} KB) is under budget (${BUDGET_TOTAL} KB)${NC}"
fi

# Get size of largest chunk
LARGEST_CHUNK=$(find dist/assets -name "*.js" -exec du -k {} \; | sort -nr | head -1 | awk '{print $1}')
LARGEST_CHUNK_NAME=$(find dist/assets -name "*.js" -exec du -k {} \; | sort -nr | head -1 | awk '{print $2}')

if [ "$LARGEST_CHUNK" -gt "500" ]; then
    echo -e "${RED}⚠️ Largest chunk (${LARGEST_CHUNK} KB: ${LARGEST_CHUNK_NAME}) exceeds 500 KB${NC}"
else
    echo -e "${GREEN}✅ Largest chunk (${LARGEST_CHUNK} KB: ${LARGEST_CHUNK_NAME}) is under 500 KB${NC}"
fi

echo
echo -e "${GREEN}Bundle analysis complete!${NC}"
echo -e "View comprehensive documentation in ${GREEN}BUNDLE-SIZE-OPTIMIZATION.md${NC}"
