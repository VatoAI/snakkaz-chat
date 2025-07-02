#!/bin/bash
# SETUP GITHUB ACTIONS FOR SNAKKAZ

echo "🚀 Setting up GitHub Actions..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Run: git init"
    exit 1
fi

# Check if GitHub Actions are already setup
if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions already configured"
else
    echo "❌ GitHub Actions not found. Run workspace cleanup first."
    exit 1
fi

echo "📋 GitHub Actions Setup Complete!"
echo ""
echo "🔐 NEXT STEPS:"
echo "1. Setup repository secrets:"
echo "   ./github/scripts/setup-secrets.sh"
echo ""
echo "2. Commit and push workflows:"
echo "   git add .github/"
echo "   git commit -m 'feat: Add GitHub Actions CI/CD'"
echo "   git push"
echo ""
echo "3. Workflows will trigger automatically on push to main branch"
echo ""
echo "📊 Available workflows:"
echo "   - deploy-production.yml (main branch)"
echo "   - deploy-staging.yml (develop/staging)"
echo "   - code-quality.yml (all branches)"
echo "   - maintenance.yml (weekly)"
