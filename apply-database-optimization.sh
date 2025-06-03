#!/bin/bash

echo "🚀 Applying RLS Performance Optimizations via Supabase CLI..."
echo "=============================================================="

# Check if Supabase is running
if ! ./supabase.bin status > /dev/null 2>&1; then
    echo "❌ Supabase is not running. Please start it first:"
    echo "   ./supabase.bin start"
    exit 1
fi

echo "✅ Supabase is running"

# Apply the optimization script using Supabase CLI
echo "🔧 Applying database optimizations..."

# Try using the db command to execute SQL
echo "📝 Executing SQL optimization script..."

# Use docker exec to run SQL directly on the database
if docker ps | grep -q supabase_db; then
    echo "🐳 Found Supabase database container, executing SQL..."
    docker exec -i supabase_db_snakkaz-chat psql -U postgres -d postgres < config/database/rls-performance-optimization.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ RLS Performance optimizations applied successfully!"
        echo ""
        echo "🎯 Expected improvements:"
        echo "   - 50-80% faster queries on large datasets"
        echo "   - Reduced database CPU usage from auth.uid() re-evaluation"
        echo "   - Better scaling with user growth"
        echo ""
        echo "💡 You can test the improvements by running your application"
        echo "   and monitoring query performance in the Supabase Studio."
    else
        echo "❌ Failed to apply optimizations"
        echo "💡 Manual application required:"
        echo "   1. Open Supabase Studio: http://127.0.0.1:8001"
        echo "   2. Go to SQL Editor"
        echo "   3. Copy and paste the contents of:"
        echo "      config/database/rls-performance-optimization.sql"
        echo "   4. Execute the script"
    fi
else
    echo "❌ Supabase database container not found"
    echo "💡 Manual application required:"
    echo "   1. Open Supabase Studio: http://127.0.0.1:8001"
    echo "   2. Go to SQL Editor"
    echo "   3. Copy and paste the contents of:"
    echo "      config/database/rls-performance-optimization.sql"
    echo "   4. Execute the script"
fi

echo ""
echo "🌍 Local Development Environment:"
echo "   📍 API URL: http://127.0.0.1:8000"
echo "   🎨 Studio URL: http://127.0.0.1:8001"
echo "   🗄️ Database URL: postgresql://postgres:postgres@127.0.0.1:5432/postgres"