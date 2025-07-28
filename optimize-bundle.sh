#!/bin/bash

# 🌊 SnakkaZ Bundle Optimizer
# Removes unused dependencies and optimizes bundle size

echo "🔧 Optimizing SnakkaZ Bundle..."

# Remove unused dependencies
echo "📦 Removing unused dependencies..."

npm uninstall \
  @chatui/core \
  @headlessui/react \
  @modelcontextprotocol/sdk \
  @radix-ui/react-icons \
  @react-spring/web \
  @sentry/vite-plugin \
  @supabase/auth-ui-react \
  @supabase/auth-ui-shared \
  @types/speakeasy \
  @uppy/core \
  @uppy/dashboard \
  @uppy/react \
  csurf \
  race-event \
  react-aria \
  react-error-boundary \
  react-hot-toast \
  react-swipeable \
  react-window \
  tweetnacl \
  tweetnacl-util \
  use-sync-external-store \
  web-streams-polyfill \
  workbox-core \
  workbox-precaching \
  workbox-routing \
  workbox-strategies \
  workbox-webpack-plugin

# Remove unused dev dependencies
echo "🛠️ Removing unused dev dependencies..."

npm uninstall -D \
  @tailwindcss/typography \
  @vitejs/plugin-react-swc \
  autoprefixer \
  babel-jest \
  imagemin \
  imagemin-mozjpeg \
  imagemin-pngquant \
  imagemin-svgo \
  imagemin-webp \
  imapflow \
  jest-environment-jsdom \
  postcss \
  puppeteer \
  rimraf \
  ts-jest \
  vite-plugin-html \
  vite-plugin-pwa

echo "✅ Bundle optimization complete!"
echo "🏗️ Now rebuilding optimized bundle..."

npm run build
