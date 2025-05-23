#!/bin/bash

# Script to apply subscription tables schema to Supabase database
# Created: May 23, 2025

echo "Applying subscription tables schema to Supabase..."

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI could not be found. Please install it first."
    echo "Installation instructions: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're in a Supabase project with preview enabled
if [ -f ".supabase/preview-db-url" ]; then
    echo "Found Supabase preview DB URL"
    
    # Get DB connection string from preview
    DB_URL=$(cat .supabase/preview-db-url)
    
    # Run the schema SQL against the preview DB
    PGPASSWORD=${DB_URL##*:@} psql "${DB_URL}" -f sql/subscription_tables.sql
    
    echo "Schema applied to preview database successfully!"
else
    echo "No preview DB URL found. Trying to apply schema to local Supabase instance..."
    
    # Try to apply the schema using Supabase CLI
    if supabase status &> /dev/null; then
        # Supabase is running, apply the schema
        supabase db push sql/subscription_tables.sql
        
        echo "Schema applied to local Supabase instance successfully!"
    else
        echo "Error: No active Supabase instance found."
        echo "Please start Supabase using 'supabase start' or configure your remote Supabase instance."
        exit 1
    fi
fi

echo "Done!"
