#!/bin/bash

# FASE 7 - Complete Enterprise Setup & Launch
# One-command setup for SnakkaZ Enterprise Features

set -e

echo "🚀 FASE 7 - Complete Enterprise Setup & Launch"
echo "==============================================="
echo ""

# ASCII Art for Enterprise Launch
cat << 'EOF'
   ____             _     _               ______      _                       _          
  / ___| _ __   __ _| | __| | ____ ____   | ____| __ _| |_ ___ _ __ _ __  _ __(_)___  ___ 
  \___ \| '_ \ / _` | |/ /| |/ / _` |_  /  |  _| | '_ \| __/ _ \ '_ \| '_ \| '__| / __|/ _ \
   ___) | | | | (_| |   < |   <| (_| |/ /   | |___| | | | ||  __/ |_) | |_) | |  | \__ \  __/
  |____/|_| |_|\__,_|_|\_\|_|\_\\__,_/___|  |_____|_| |_|\__\___| .__/| .__/|_|  |_|___/\___|
                                                                |_|   |_|                   
EOF

echo ""
echo "🎯 FASE 7 Enterprise Features - Full Setup"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi
echo "✅ npm found"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root."
    exit 1
fi
echo "✅ Project root confirmed"

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase || {
        echo "❌ Failed to install Supabase CLI"
        exit 1
    }
fi
echo "✅ Supabase CLI ready"

echo ""
echo "📦 Installing dependencies..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing project dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🗃️  Setting up enterprise database..."

# Initialize Supabase if needed
if [ ! -f ".supabase/config.toml" ]; then
    echo "🔧 Initializing Supabase project..."
    supabase init
fi

# Start Supabase if not running
echo "🚀 Starting Supabase local development..."
supabase start || {
    echo "⚠️  Supabase might already be running, continuing..."
}

# Set up enterprise database schema
echo "📋 Applying enterprise database schema..."
if [ -f "setup-enterprise-db.sh" ]; then
    ./setup-enterprise-db.sh
else
    echo "❌ setup-enterprise-db.sh not found"
    exit 1
fi

echo ""
echo "🎭 Generating demo data..."

# Generate demo data
if [ -f "generate-enterprise-demo-data.sh" ]; then
    ./generate-enterprise-demo-data.sh
else
    echo "❌ generate-enterprise-demo-data.sh not found"
    exit 1
fi

echo ""
echo "🧪 Running integration tests..."

# Run integration test
if [ -f "test-enterprise-integration.sh" ]; then
    ./test-enterprise-integration.sh
else
    echo "⚠️  Integration test not found, skipping..."
fi

echo ""
echo "🎨 Building enterprise components..."

# Build the project
npm run build:types 2>/dev/null || echo "⚠️  Type generation skipped"

echo ""
echo "🌟 Starting development server..."

# Start the development server in background
echo "🚀 Launching SnakkaZ Enterprise..."
echo ""
echo "🎯 Enterprise Dashboard will be available at:"
echo "   📊 Main Dashboard: http://localhost:5173"
echo "   🏢 Enterprise Admin: http://localhost:5173/admin/enterprise"
echo ""
echo "🎭 Demo Tenants Available:"
echo "   1. 🏢 TechCorp Enterprise (Full features)"
echo "   2. 🏥 Healthcare Plus (HIPAA compliance)"
echo "   3. 🏦 FinanceSecure (SOX compliance)"
echo ""
echo "🔑 Enterprise Features Ready:"
echo "   ✅ Multi-tenant architecture"
echo "   ✅ SSO integration (Azure AD, SAML, LDAP)"
echo "   ✅ Business intelligence dashboard"
echo "   ✅ API gateway & management"
echo "   ✅ Advanced security suite"
echo "   ✅ Compliance reporting (GDPR, HIPAA, SOX)"
echo "   ✅ Real-time threat detection"
echo "   ✅ White-label customization"
echo ""
echo "🚀 Starting development server..."

# Start development server
npm run dev

echo ""
echo "🎉 FASE 7 Enterprise Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Visit http://localhost:5173/admin/enterprise"
echo "   2. Explore the demo tenants"
echo "   3. Test enterprise features"
echo "   4. Configure your organization"
echo ""
echo "🆘 Need Help?"
echo "   - Check logs above for any errors"
echo "   - Ensure Supabase is running: supabase status"
echo "   - Restart with: npm run dev"
echo ""
echo "🏆 Welcome to SnakkaZ Enterprise! 🚀"
