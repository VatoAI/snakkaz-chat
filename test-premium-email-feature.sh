#!/bin/bash

# test-premium-email-feature.sh
# Test script for validating the premium email feature in Snakkaz Chat

echo "=== Snakkaz Premium Email Feature Test ==="
echo "This script will help you test if the premium email feature is properly configured."
echo ""

# Check environment variables
echo "Checking environment variables..."
missing_vars=0

if [ -z "$CPANEL_USERNAME" ]; then
  echo "❌ CPANEL_USERNAME is not set"
  missing_vars=$((missing_vars + 1))
else
  echo "✅ CPANEL_USERNAME is set to: $CPANEL_USERNAME"
fi

if [ -z "$CPANEL_API_TOKEN" ]; then
  echo "❌ CPANEL_API_TOKEN is not set"
  missing_vars=$((missing_vars + 1))
else
  echo "✅ CPANEL_API_TOKEN is set (not showing for security)"
fi

if [ -z "$CPANEL_DOMAIN" ]; then
  echo "❌ CPANEL_DOMAIN is not set"
  missing_vars=$((missing_vars + 1))
else
  echo "✅ CPANEL_DOMAIN is set to: $CPANEL_DOMAIN"
fi

if [ $missing_vars -gt 0 ]; then
  echo ""
  echo "Warning: $missing_vars environment variables are missing."
  echo "Please set them in your .env file before proceeding."
  echo ""
fi

# Check database table
echo ""
echo "Testing database connection..."

if command -v supabase &> /dev/null; then
  echo "✅ Supabase CLI is installed"
  
  # Check if the premium_emails table exists
  echo ""
  echo "Checking if premium_emails table exists in database..."
  
  if supabase db query "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'premium_emails')" --db-url=${SUPABASE_URL} 2>/dev/null | grep -q "t"; then
    echo "✅ premium_emails table exists"
  else
    echo "❌ premium_emails table does not exist"
    echo "Run the migration script: supabase db push ./supabase/migrations/20250519_add_premium_emails_table.sql"
  fi
else
  echo "❌ Supabase CLI is not installed. Cannot check database table."
fi

# Check API routes
echo ""
echo "Testing API routes..."

# Make sure server is running
echo "Checking if server is running on port 8080..."
if nc -z localhost 8080 &>/dev/null; then
  echo "✅ Server is running on port 8080"
  
  # Test the API endpoint (unauthenticated, will get a 401 but confirms route exists)
  echo ""
  echo "Testing API route /api/premium/emails (expecting 401 Unauthorized)..."
  response_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/premium/emails)
  
  if [ "$response_code" == "401" ]; then
    echo "✅ API route exists and returns 401 Unauthorized (expected without authentication)"
  else
    echo "❌ API route not working correctly (got $response_code, expected 401)"
  fi
else
  echo "❌ Server does not appear to be running on port 8080"
  echo "Start the server first with: npm run dev"
fi

echo ""
echo "=== Summary ==="
echo "To fully test the premium email feature:"
echo "1. Start the application: npm run dev"
echo "2. Login as a premium user"
echo "3. Navigate to the premium email management page"
echo "4. Try to create a test email account"
echo "5. Check if the account appears in your account list"
echo ""
echo "For detailed logs, check the browser console and server logs."
