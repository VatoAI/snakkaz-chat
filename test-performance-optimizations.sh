#!/bin/bash
#
# Test Performance Optimizations
#

echo "🚀 Testing Performance Optimizations for Snakkaz Chat"
echo "===================================================="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: This script must be run from the project root directory!"
  exit 1
fi

echo "1️⃣ Checking Service Worker Implementation..."
if grep -q "staleWhileRevalidateStrategy" public/service-worker.js; then
  echo "✅ Improved Service Worker is installed!"
else
  echo "❌ Improved Service Worker not found!"
fi

echo "2️⃣ Checking React Lazy Loading Implementation..."
if grep -q "React.lazy" src/AppRouter.tsx; then
  echo "✅ Lazy loading is implemented!"
else
  echo "❌ Lazy loading not implemented in AppRouter!"
fi

echo "3️⃣ Checking API Caching Implementation..."
if [ -f "src/hooks/useApiCache.tsx" ]; then
  echo "✅ API Caching hooks are installed!"
else
  echo "❌ API Caching hooks not found!"
fi

echo "4️⃣ Checking Performance Utilities..."
if [ -d "src/utils/performance" ] && [ -d "src/utils/lazy-loading" ] && [ -d "src/utils/data-fetching" ]; then
  echo "✅ All performance utility directories are created!"
else
  echo "❌ Some performance utility directories are missing!"
fi

echo "5️⃣ Checking Optimized Components..."
if [ -f "src/components/chat/OptimizedChatFriends.tsx" ]; then
  echo "✅ Optimized component example exists!"
else
  echo "❌ Optimized component example is missing!"
fi

echo "6️⃣ Building application to test performance optimizations..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful with performance optimizations!"
else
  echo "❌ Build failed! There might be issues with the performance optimizations."
fi

echo
echo "======================="
echo "🏁 Testing Complete! 🏁"
echo "======================="
