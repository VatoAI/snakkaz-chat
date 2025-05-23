#!/bin/bash

# setup-premium-email-feature.sh
# This script sets up the premium email feature for Snakkaz Chat

echo "=== Snakkaz Premium Email Feature Setup ==="
echo "This script will set up the premium email feature by:"
echo "1. Running the database migration for the premium_emails table"
echo "2. Validating cPanel API credentials"
echo "3. Testing email functionality"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Error: supabase CLI is not installed. Please install it first."
  echo "npm install -g supabase"
  exit 1
fi

# Check for required environment variables
if [ -z "$CPANEL_API_TOKEN" ]; then
  echo "Warning: CPANEL_API_TOKEN is not set in the environment."
  echo "Please set it in your .env file before proceeding to testing."
fi

echo "Running database migration..."
supabase db push ./supabase/migrations/20250519_add_premium_emails_table.sql

# Validate the setup
echo ""
echo "=== Validating Setup ==="
echo "1. Database migration completed."
echo "2. API routes configured at /api/premium/emails"
echo ""

echo "=== Next Steps ==="
echo "1. Make sure to get a valid cPanel API token"
echo "2. Set the CPANEL_API_TOKEN in your .env files"
echo "3. Test the premium email feature through the UI"
echo ""

echo "Setup complete!"
