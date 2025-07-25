#!/bin/bash

# Setup Supabase local development for SnakkaZ
# Based on https://supabase.com/docs/guides/database/testing

echo "🚀 Setting up Supabase local development for SnakkaZ"
echo "======================================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚙️ Installing Supabase CLI..."
    npm install supabase --save-dev
else
    echo "✅ Supabase CLI already installed"
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker and try again."
    echo "   Docker Desktop: https://www.docker.com/products/docker-desktop"
    echo "   Rancher Desktop: https://rancherdesktop.io/"
    echo "   Podman: https://podman.io/"
    echo "   OrbStack (macOS): https://orbstack.dev/"
    exit 1
else
    echo "✅ Docker is running"
fi

# Initialize Supabase project if not already initialized
if [ ! -d "supabase" ]; then
    echo "⚙️ Initializing Supabase project..."
    npx supabase init
    echo "✅ Supabase project initialized"
else
    echo "✅ Supabase project already initialized"
fi

# Start Supabase local development
echo "🚀 Starting Supabase local stack..."
npx supabase start

# Show local Supabase dashboard URL
echo ""
echo "✨ Your local Supabase instance is running at: http://localhost:54323"
echo ""
echo "Next steps:"
echo "1. Link your project with: npx supabase link --project-ref wqpoozpbceucynsojmbk"
echo "2. Pull the database schema with: npx supabase db pull"
echo "3. Push local changes with: npx supabase db push"
echo ""
echo "For more commands, run: npx supabase --help"
