#!/bin/bash
#
# Supabase Preview Script for Snakkaz Chat
#
# This script helps you manage Supabase preview environments for local development and testing.
# It provides functionality to start a local Supabase instance or connect to a remote preview.
#

echo "🔵 Supabase Preview for Snakkaz Chat 🔵"
echo "========================================"
echo

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: You must run this script from the project's root directory!"
  echo "   Navigate to the root directory and try again."
  exit 1
fi

# Check if Supabase CLI is available
if [ ! -f "./supabase" ]; then
  echo "❌ Error: Supabase CLI not found!"
  echo "   Downloading Supabase CLI..."
  curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
  chmod +x supabase
  echo "✅ Supabase CLI downloaded."
fi

# Function to print help
print_help() {
  echo "Usage: ./supabase-preview.sh [command]"
  echo
  echo "Commands:"
  echo "  start         - Start a local Supabase instance for development"
  echo "  stop          - Stop the local Supabase instance"
  echo "  status        - Check the status of your Supabase instance"
  echo "  link          - Link to an existing Supabase project"
  echo "  setup         - Initialize a new Supabase project"
  echo "  db-reset      - Reset the local database (caution: destroys data)"
  echo "  db-push       - Push local database migrations to remote project"
  echo "  db-pull       - Pull schema from remote project to local"
  echo "  help          - Show this help message"
  echo
  echo "Examples:"
  echo "  ./supabase-preview.sh start    - Start local Supabase instance"
  echo "  ./supabase-preview.sh link     - Link to remote Supabase project"
}

# If no command is provided, show help
if [ $# -eq 0 ]; then
  print_help
  exit 0
fi

# Process commands
case "$1" in
  start)
    echo "🚀 Starting local Supabase instance..."
    ./supabase start
    
    if [ $? -eq 0 ]; then
      echo "✅ Supabase is now running locally"
      echo "   Studio URL: http://localhost:54323"
      echo "   API URL: http://localhost:54321"
      echo "   DB URL: postgresql://postgres:postgres@localhost:54322/postgres"
      echo
      echo "Use these environment variables for local development:"
      echo "VITE_SUPABASE_URL=http://localhost:54321"
      echo "VITE_SUPABASE_ANON_KEY=<check output above>"
    else
      echo "❌ Failed to start Supabase"
    fi
    ;;
    
  stop)
    echo "🛑 Stopping local Supabase instance..."
    ./supabase stop
    ;;
    
  status)
    echo "🔍 Checking Supabase status..."
    ./supabase status
    ;;
    
  link)
    echo "🔗 Linking to remote Supabase project..."
    echo "Enter your project reference ID (found in your Supabase dashboard):"
    read -r project_ref
    
    if [ -z "$project_ref" ]; then
      echo "❌ Project reference ID cannot be empty"
      exit 1
    fi
    
    ./supabase link --project-ref "$project_ref"
    
    if [ $? -eq 0 ]; then
      echo "✅ Successfully linked to Supabase project"
    else
      echo "❌ Failed to link to Supabase project"
    fi
    ;;
    
  setup)
    echo "🔧 Initializing Supabase project..."
    ./supabase init
    
    if [ $? -eq 0 ]; then
      echo "✅ Supabase project initialized"
      echo "   You can now run './supabase-preview.sh start' to start a local instance"
    else
      echo "❌ Failed to initialize Supabase project"
    fi
    ;;
    
  db-reset)
    echo "⚠️ WARNING: This will reset your local database and delete all data!"
    echo "Are you sure you want to continue? (y/n)"
    read -r confirm
    
    if [[ $confirm == "y" ]]; then
      echo "🔄 Resetting local database..."
      ./supabase db reset
      
      if [ $? -eq 0 ]; then
        echo "✅ Database reset successfully"
      else
        echo "❌ Failed to reset database"
      fi
    else
      echo "Database reset cancelled."
    fi
    ;;
    
  db-push)
    echo "⬆️ Pushing local schema to remote project..."
    ./supabase db push
    
    if [ $? -eq 0 ]; then
      echo "✅ Database schema pushed successfully"
    else
      echo "❌ Failed to push database schema"
    fi
    ;;
    
  db-pull)
    echo "⬇️ Pulling schema from remote project..."
    ./supabase db pull
    
    if [ $? -eq 0 ]; then
      echo "✅ Database schema pulled successfully"
    else
      echo "❌ Failed to pull database schema"
    fi
    ;;
    
  help)
    print_help
    ;;
    
  *)
    echo "❌ Unknown command: $1"
    print_help
    exit 1
    ;;
esac

echo
echo "Done! 🔵"
