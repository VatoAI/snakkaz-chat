#!/bin/bash

echo "🩺 SnakkaZ Health Check"
echo "======================"

# Check main site
echo "🌐 Checking main site..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/)
if [ "$response" = "200" ]; then
    echo "✅ Main site: OK ($response)"
else
    echo "❌ Main site: FAILED ($response)"
fi

# Check JavaScript files
echo "📄 Checking JavaScript files..."
js_files=(
    "assets/js/vendor-react-core-"
    "assets/js/vendor-react-dom-"
    "assets/js/vendor-misc-"
    "assets/js/index-"
)

for file_prefix in "${js_files[@]}"; do
    # Find actual filename
    actual_file=$(curl -s https://snakkaz.com/ | grep -o "${file_prefix}[a-zA-Z0-9_-]*\.js" | head -1)
    if [ -n "$actual_file" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "https://snakkaz.com/$actual_file")
        mime_type=$(curl -s -I "https://snakkaz.com/$actual_file" | grep -i "content-type" | grep -o "application/javascript")
        
        if [ "$response" = "200" ] && [ -n "$mime_type" ]; then
            echo "✅ $actual_file: OK"
        else
            echo "❌ $actual_file: FAILED (HTTP: $response, MIME: $mime_type)"
        fi
    else
        echo "❌ ${file_prefix}*.js: NOT FOUND"
    fi
done

# Check Supabase connection
echo "🗄️  Checking Supabase connection..."
supabase_response=$(curl -s -o /dev/null -w "%{http_code}" "https://wqpoozpbceucynsojmbk.supabase.co/rest/v1/" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8")

if [ "$supabase_response" = "200" ]; then
    echo "✅ Supabase: OK ($supabase_response)"
else
    echo "❌ Supabase: FAILED ($supabase_response)"
fi

echo
echo "🏁 Health check completed"
