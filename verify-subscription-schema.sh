#!/bin/bash
# Script to verify that the subscription schema tables were properly created

echo "Verifying subscription schema in Supabase..."

# Check if SUPABASE_URL and SUPABASE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "Error: SUPABASE_URL and SUPABASE_KEY must be set as environment variables."
    exit 1
fi

# Function to check if a table exists
check_table_exists() {
    local table_name=$1
    local result=$(curl -s -X GET \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/$table_name?select=count=eq.1&limit=0")
    
    if [[ $result == *"error"* ]]; then
        echo "❌ Table $table_name does not exist"
        return 1
    else
        echo "✅ Table $table_name exists"
        return 0
    fi
}

# Check if the profiles.is_admin column exists
check_is_admin_column() {
    local result=$(curl -s -X POST \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "Content-Type: application/json" \
        -d '{"command": "SELECT column_name FROM information_schema.columns WHERE table_name = '\''profiles'\'' AND column_name = '\''is_admin'\''"}' \
        "$SUPABASE_URL/rest/v1/rpc/supabase_execute")
    
    if [[ $result == *"is_admin"* ]]; then
        echo "✅ Column is_admin exists in profiles table"
        return 0
    else
        echo "❌ Column is_admin does not exist in profiles table"
        return 1
    fi
}

# Check if subscription_plans has data
check_subscription_plans_data() {
    local result=$(curl -s -X GET \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/subscription_plans?select=id")
    
    if [[ $result == "[]" ]]; then
        echo "❌ No data found in subscription_plans table"
        return 1
    else
        echo "✅ subscription_plans table has data: $result"
        return 0
    fi
}

echo "===== Checking Database Schema ====="
check_table_exists "profiles"
check_table_exists "subscription_plans"
check_table_exists "subscriptions"
check_is_admin_column

echo "===== Checking Data ====="
check_subscription_plans_data

echo "===== Verification Complete ====="
