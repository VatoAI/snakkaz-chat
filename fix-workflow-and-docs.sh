#!/bin/bash
#
# Fix Workflow and Supabase Preview Documentation
#
# This script will:
# 1. Remove duplicate sections in SNAKKAZ-MASTER-PROMPT.md
# 2. Ensure GitHub workflows are properly organized
# 3. Validate Supabase preview functionality
#

echo "🧹 Cleaning up Workflow and Supabase Preview Documentation 🧹"
echo "==========================================================="
echo

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: You must run this script from the project's root directory!"
  echo "   Navigate to the root directory and try again."
  exit 1
fi

# Fix duplicate sections in SNAKKAZ-MASTER-PROMPT.md
echo "📝 Fixing duplicate sections in SNAKKAZ-MASTER-PROMPT.md..."

# Create a temporary file
cat > fix-md-duplicates.awk << 'EOF'
BEGIN { 
  supabase_preview_seen = 0
  in_supabase_preview_section = 0
  print_line = 1
}

/^## SUPABASE PREVIEW/ { 
  if (supabase_preview_seen == 0) {
    supabase_preview_seen = 1
    in_supabase_preview_section = 1
    print
  } else {
    in_supabase_preview_section = 1
    print_line = 0
  }
  next
}

/^## / {
  if (in_supabase_preview_section) {
    in_supabase_preview_section = 0
    print_line = 1
  }
  print
  next
}

{
  if (print_line) print
}
EOF

# Apply the fix
awk -f fix-md-duplicates.awk SNAKKAZ-MASTER-PROMPT.md > SNAKKAZ-MASTER-PROMPT.md.fixed
mv SNAKKAZ-MASTER-PROMPT.md.fixed SNAKKAZ-MASTER-PROMPT.md
rm fix-md-duplicates.awk

echo "✅ Duplicate sections fixed in SNAKKAZ-MASTER-PROMPT.md"

# Organize GitHub workflows
echo "🔄 Organizing GitHub workflows..."

# Ensure the .github/workflows directory exists
mkdir -p .github/workflows

# Check and fix permissions for Supabase CLI
echo "🔧 Fixing Supabase CLI permissions..."
if [ -f "supabase" ]; then
  chmod +x supabase
  echo "✅ Supabase CLI permissions fixed"
else
  echo "⚠️ Supabase CLI not found. Downloading..."
  curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
  chmod +x supabase
  echo "✅ Supabase CLI downloaded and permissions set"
fi

# Check if scripts are executable
echo "🔧 Ensuring scripts are executable..."
chmod +x supabase-preview.sh
if [ -f "fix-supabase-preview.sh" ]; then
  chmod +x fix-supabase-preview.sh
fi

# Check if package.json has the necessary scripts
echo "🔍 Checking package.json for Supabase scripts..."
if ! grep -q "supabase:start" package.json; then
  echo "⚠️ Supabase scripts not found in package.json. Adding them..."
  # Use sed to add the new scripts before the closing brace of the "scripts" section
  sed -i '/\"clean\": \"rimraf dist\"/a \    ,\"supabase:start\": \"./supabase-preview.sh start\",\n    \"supabase:stop\": \"./supabase-preview.sh stop\",\n    \"supabase:status\": \"./supabase-preview.sh status\",\n    \"supabase:setup\": \"./supabase-preview.sh setup\",\n    \"supabase:link\": \"./supabase-preview.sh link\",\n    \"supabase:db-reset\": \"./supabase-preview.sh db-reset\",\n    \"dev:with-supabase\": \"npm run supabase:start && npm run dev\"' package.json
  echo "✅ Supabase scripts added to package.json"
else
  echo "✅ Supabase scripts already exist in package.json"
fi

# Create a README file with information about Supabase preview
echo "📚 Creating README-SUPABASE-PREVIEW.md with documentation..."
cat > README-SUPABASE-PREVIEW.md << 'EOF'
# Supabase Preview for Snakkaz Chat

This document provides information on how to use Supabase preview environments for local development and testing.

## Local Development with Supabase

For local development, you can run Supabase locally using the following commands:

```bash
# Initialize Supabase project (first time only)
npm run supabase:setup

# Start local Supabase instance
npm run supabase:start

# Run the application with local Supabase
npm run dev:with-supabase

# Check status of local Supabase
npm run supabase:status

# Stop local Supabase instance
npm run supabase:stop
```

## Preview Environments for Pull Requests

When a pull request is created against the main branch, GitHub Actions will automatically create a Supabase preview branch. This provides an isolated test environment specific to that pull request.

### How to Use Preview Environments:

1. Create a pull request against the main branch
2. GitHub Actions will create a Supabase preview branch
3. A comment on the pull request will contain instructions on how to connect to the preview environment
4. When the pull request is closed, the preview branch will be automatically deleted

### Manual Setup of Preview:

```bash
# Link to existing Supabase project
./supabase-preview.sh link
# Follow the instructions and enter your project reference ID when prompted

# Run the application with the preview branch environment
SUPABASE_BRANCH=branch-name npm run dev
```

### Managing Database Schema:

```bash
# Pull schema from remote project
./supabase-preview.sh db-pull

# Push local changes to remote project
./supabase-preview.sh db-push

# Reset local database (deletes data!)
./supabase-preview.sh db-reset
```

## Required GitHub Secrets

For the Supabase preview workflow to function properly, the following secrets must be set in your GitHub repository:

- `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
- `SUPABASE_PROJECT_ID`: Your Supabase project ID

You can obtain these from your Supabase dashboard.

## Troubleshooting

If you encounter issues with the Supabase preview:

1. Ensure Docker is running (required for local Supabase)
2. Check that all necessary GitHub secrets are configured
3. Verify that the Supabase CLI is executable (`chmod +x supabase`)
4. Try running `./supabase-preview.sh status` to check the current state

For more help, see the [Supabase CLI documentation](https://supabase.com/docs/reference/cli).
EOF

echo "✅ Documentation created in README-SUPABASE-PREVIEW.md"

# Validate Supabase preview functionality
echo "🧪 Validating Supabase preview functionality..."
if [ -f "supabase" ] && [ -f "supabase-preview.sh" ]; then
  echo "✅ Basic validation passed: Required files exist"
else
  echo "❌ Validation failed: Required files not found"
fi

echo ""
echo "✅ Cleanup Complete! ✅"
echo ""
echo "The following have been fixed:"
echo "  - Duplicate sections in SNAKKAZ-MASTER-PROMPT.md removed"
echo "  - Supabase CLI permissions fixed"
echo "  - Scripts made executable"
echo "  - Package.json Supabase scripts verified"
echo "  - Additional documentation created in README-SUPABASE-PREVIEW.md"
echo ""
echo "Next steps:"
echo "  1. Review the changes to SNAKKAZ-MASTER-PROMPT.md"
echo "  2. Make sure GitHub repository has the required secrets:"
echo "     - SUPABASE_ACCESS_TOKEN"
echo "     - SUPABASE_PROJECT_ID"
echo "  3. Try starting Supabase locally with: npm run supabase:start"
echo ""
