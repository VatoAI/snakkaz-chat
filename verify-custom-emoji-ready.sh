#!/bin/bash

# Custom Emoji Functionality Verification Script
# Run this after applying the database migration

echo "🎭 SNAKKAZ Custom Emoji Verification"
echo "=================================="

# Check if the development server is running
if ! curl -s http://localhost:5174 > /dev/null; then
    echo "❌ Development server not running on port 5174"
    echo "   Please start with: npm run dev"
    exit 1
fi

echo "✅ Development server is running"

# Check if Node.js dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "❌ Node modules not found"
    echo "   Please run: npm install"
    exit 1
fi

echo "✅ Node modules are installed"

# Check for key custom emoji files
files_to_check=(
    "src/components/emoji/CustomEmojiManager.tsx"
    "src/components/emoji/CustomEmojiUploader.tsx"
    "src/hooks/useCustomEmojis.ts"
    "custom-emojis-safe-migration.sql"
)

missing_files=()

for file in "${files_to_check[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Missing files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All custom emoji files are present"

# Check if TypeScript compilation passes
echo "🔍 Checking TypeScript compilation..."
if npm run type-check > /dev/null 2>&1; then
    echo "✅ TypeScript compilation passes"
else
    echo "⚠️  TypeScript compilation issues detected"
    echo "   Check: npm run type-check"
fi

# Check for Supabase configuration
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️  Environment configuration not found"
    echo "   Please ensure Supabase environment variables are set"
else
    echo "✅ Environment configuration found"
fi

echo ""
echo "🎯 Manual Verification Checklist:"
echo "================================"
echo "□ Apply database migration in Supabase SQL Editor"
echo "□ Open http://localhost:5174 in browser"
echo "□ Log in to the application"
echo "□ Look for sparkles (✨) icon in chat interface"
echo "□ Click sparkles icon to open Custom Emoji Manager"
echo "□ Test browsing existing emojis (if any)"
echo "□ Test uploading a custom emoji in 'Create' tab"
echo "□ Test using custom emoji in message reactions"
echo "□ Verify emoji appears in reactions panel"

echo ""
echo "📋 Database Migration Status:"
echo "============================"
echo "Ready to apply: custom-emojis-safe-migration.sql"
echo ""
echo "🚀 Migration Instructions:"
echo "1. Open Supabase SQL Editor"
echo "2. Copy content from custom-emojis-safe-migration.sql"
echo "3. Paste and run in SQL Editor"
echo "4. Verify tables: custom_emojis, custom_emoji_reactions"
echo ""

# Check if we can connect to database (basic check)
node -e "
const { createClient } = require('@supabase/supabase-js');
const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (url && key) {
  console.log('✅ Supabase configuration variables are set');
} else {
  console.log('⚠️  Supabase configuration variables missing');
}
" 2>/dev/null

echo ""
echo "🎉 Custom Emoji System Status: READY FOR MIGRATION"
echo "📁 See CUSTOM-EMOJI-MIGRATION-STEPS.md for detailed instructions"
