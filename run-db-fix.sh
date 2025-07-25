#!/bin/bash

# This script sets up the environment variables for database fixes
# IMPORTANT: Do not commit this script with secrets to version control

# Set the required environment variables
export SUPABASE_URL="https://wqpoozpbceucynsojmbk.supabase.co"
export SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTU2ODMwNSwiZXhwIjoyMDU1MTQ0MzA1fQ.pQu0Mn0MlB397_uKmtYKZWe7sZUO9ABpmYEYiHTNZCY"

# Run the database fix script
echo "🔧 Running database schema fix script with service role key..."
bash ./scripts/fix-database-schema.sh

# Clear the environment variables after use for security
unset SUPABASE_URL
unset SUPABASE_SERVICE_KEY

echo "✅ Environment variables cleared for security"
