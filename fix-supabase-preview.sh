#!/bin/bash
#
# Fix and Integrate Supabase Preview for Snakkaz Chat
#
# This script will:
# 1. Clean up Supabase configuration
# 2. Install/update the Supabase CLI 
# 3. Initialize Supabase project structure
# 4. Create Supabase preview workflow
# 5. Update project documentation
#

echo "🔄 Snakkaz Chat - Supabase Preview Integration 🔄"
echo "=================================================="
echo

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: You must run this script from the project's root directory!"
  echo "   Navigate to the root directory and try again."
  exit 1
fi

# Backup existing Supabase CLI (if it exists)
if [ -f "supabase" ]; then
  echo "📦 Backing up existing Supabase CLI..."
  mv supabase supabase.bak
fi

# Download the latest Supabase CLI
echo "📥 Downloading the latest Supabase CLI..."
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
chmod +x supabase

# Create Supabase project structure
echo "🏗️ Setting up Supabase project structure..."
mkdir -p supabase/{functions,migrations,seed}

# Initialize Supabase project if not already initialized
if [ ! -f "supabase/config.toml" ]; then
  echo "🚀 Initializing Supabase project..."
  ./supabase init
else
  echo "✅ Supabase project already initialized."
fi

# Create supabase-preview script
echo "📝 Creating Supabase preview script..."
cat > supabase-preview.sh << 'EOF'
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
EOF

chmod +x supabase-preview.sh

# Create GitHub workflows
echo "🔧 Creating GitHub workflows for Supabase preview..."

mkdir -p .github/workflows

# Create Supabase preview workflow
cat > .github/workflows/supabase-preview.yml << 'EOF'
name: Supabase Preview

on:
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  supabase-preview:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Validate required secrets
        env:
          SUPABASE_ACCESS_TOKEN_CHECK: ${{ secrets.SUPABASE_ACCESS_TOKEN != '' }}
          SUPABASE_PROJECT_ID_CHECK: ${{ secrets.SUPABASE_PROJECT_ID != '' }}
        run: |
          if [[ "$SUPABASE_ACCESS_TOKEN_CHECK" != "true" ]]; then
            echo "Error: SUPABASE_ACCESS_TOKEN secret is missing"
            missing_secrets=true
          fi
          
          if [[ "$SUPABASE_PROJECT_ID_CHECK" != "true" ]]; then
            echo "Error: SUPABASE_PROJECT_ID secret is missing"
            missing_secrets=true
          fi
          
          if [[ "$missing_secrets" == "true" ]]; then
            echo "Missing required secrets. Cannot create preview branch."
            echo "You need to set the following secrets in GitHub repository settings:"
            echo "- SUPABASE_ACCESS_TOKEN: Access token from Supabase"
            echo "- SUPABASE_PROJECT_ID: Your Supabase project ID"
            exit 1
          fi
          
          echo "All required secrets are available."
      
      - name: Install Supabase CLI
        run: |
          curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
          chmod +x supabase
      
      - name: Create and Deploy Preview Branch
        id: create-preview
        run: |
          # Set Supabase access token
          ./supabase login --token ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          
          # Get the PR number or use a timestamp for workflow dispatch
          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            BRANCH_ID="pr-${{ github.event.pull_request.number }}"
          else
            BRANCH_ID="manual-$(date +%Y%m%d%H%M%S)"
          fi
          
          # Create a Supabase branch
          echo "Creating Supabase preview branch: $BRANCH_ID"
          PREVIEW_URL=$(./supabase db branch create "$BRANCH_ID" --project-id ${{ secrets.SUPABASE_PROJECT_ID }} --no-verify-jwt)
          
          # Extract the DB connection string
          if [[ $PREVIEW_URL =~ "Connection string: "(postgres:[^\']*) ]]; then
            DB_URL="${BASH_REMATCH[1]}"
            echo "db_url=$DB_URL" >> $GITHUB_OUTPUT
            echo "branch_id=$BRANCH_ID" >> $GITHUB_OUTPUT
            echo "Preview branch created successfully: $BRANCH_ID"
            echo "Connection string: $DB_URL"
          else
            echo "Failed to extract connection string from output"
            exit 1
          fi
      
      - name: Run Migrations on Preview Branch
        run: |
          # Apply migrations to the preview branch
          echo "Applying migrations to preview branch..."
          ./supabase db push --db-url "${{ steps.create-preview.outputs.db_url }}"
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v5
        with:
          script: |
            const branchId = '${{ steps.create-preview.outputs.branch_id }}';
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🔵 Supabase Preview Branch Created
              
              A Supabase preview branch has been created for this PR: \`${branchId}\`
              
              ### How to use this preview:
              
              1. Run this command to link to the preview branch:
              ```bash
              ./supabase-preview.sh link
              ```
              
              2. When prompted, enter your Supabase project reference ID
              
              3. Run your application with the preview environment:
              ```bash
              SUPABASE_BRANCH=${branchId} npm run dev
              ```
              
              The preview branch will be automatically deleted when this PR is closed.`
            });
      
      - name: Output Preview URL (for workflow_dispatch)
        if: github.event_name == 'workflow_dispatch'
        run: |
          echo "## 🔵 Supabase Preview Branch Created" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "Branch ID: \`${{ steps.create-preview.outputs.branch_id }}\`" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### How to use this preview:" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "1. Run this command to link to the preview branch:" >> $GITHUB_STEP_SUMMARY
          echo "```bash" >> $GITHUB_STEP_SUMMARY
          echo "./supabase-preview.sh link" >> $GITHUB_STEP_SUMMARY
          echo "```" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "2. When prompted, enter your Supabase project reference ID" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "3. Run your application with the preview environment:" >> $GITHUB_STEP_SUMMARY
          echo "```bash" >> $GITHUB_STEP_SUMMARY
          echo "SUPABASE_BRANCH=${{ steps.create-preview.outputs.branch_id }} npm run dev" >> $GITHUB_STEP_SUMMARY
          echo "```" >> $GITHUB_STEP_SUMMARY
EOF

# Create cleanup workflow
cat > .github/workflows/cleanup-supabase-preview.yml << 'EOF'
name: Cleanup Supabase Preview

on:
  pull_request:
    types: [closed]

jobs:
  cleanup-preview:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Validate required secrets
        env:
          SUPABASE_ACCESS_TOKEN_CHECK: ${{ secrets.SUPABASE_ACCESS_TOKEN != '' }}
          SUPABASE_PROJECT_ID_CHECK: ${{ secrets.SUPABASE_PROJECT_ID != '' }}
        run: |
          if [[ "$SUPABASE_ACCESS_TOKEN_CHECK" != "true" || "$SUPABASE_PROJECT_ID_CHECK" != "true" ]]; then
            echo "Missing required secrets. Cannot delete preview branch."
            exit 1
          fi
          
          echo "All required secrets are available."
      
      - name: Install Supabase CLI
        run: |
          curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
          chmod +x supabase
      
      - name: Delete Preview Branch
        run: |
          # Set Supabase access token
          ./supabase login --token ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          
          # Get the branch ID from PR number
          BRANCH_ID="pr-${{ github.event.pull_request.number }}"
          
          echo "Deleting Supabase preview branch: $BRANCH_ID"
          ./supabase db branch delete "$BRANCH_ID" --project-id ${{ secrets.SUPABASE_PROJECT_ID }} --no-verify-jwt
          
          echo "Preview branch deleted: $BRANCH_ID"
      
      - name: Comment on PR
        uses: actions/github-script@v5
        with:
          script: |
            const branchId = 'pr-${{ github.event.pull_request.number }}';
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🧹 Supabase Preview Branch Deleted
              
              The Supabase preview branch \`${branchId}\` has been deleted as this PR is now closed.`
            });
EOF

# Update package.json with Supabase scripts
echo "📝 Updating package.json with Supabase scripts..."
if ! grep -q "supabase:start" package.json; then
  # Use sed to add the new scripts before the closing brace of the "scripts" section
  sed -i '/\"clean\": \"rimraf dist\"/a \    ,\"supabase:start\": \"./supabase-preview.sh start\",\n    \"supabase:stop\": \"./supabase-preview.sh stop\",\n    \"supabase:status\": \"./supabase-preview.sh status\",\n    \"supabase:setup\": \"./supabase-preview.sh setup\",\n    \"supabase:link\": \"./supabase-preview.sh link\",\n    \"supabase:db-reset\": \"./supabase-preview.sh db-reset\",\n    \"dev:with-supabase\": \"npm run supabase:start && npm run dev\"' package.json
fi

# Create a Supabase section in the SNAKKAZ-MASTER-PROMPT.md file
echo "📚 Updating documentation with Supabase preview information..."
cat > supabase-preview-docs.md << 'EOF'
## SUPABASE PREVIEW

Snakkaz Chat bruker Supabase for backend-tjenester, og har støtte for lokale og remote preview-miljøer for utvikling og testing.

### Lokalt Supabase-miljø

For lokal utvikling kan du kjøre Supabase lokalt ved å bruke følgende kommandoer:

```bash
# Initialisere Supabase-prosjekt (første gang)
npm run supabase:setup

# Starte lokal Supabase-instans
npm run supabase:start

# Kjøre applikasjon med lokal Supabase
npm run dev:with-supabase

# Sjekke status for lokal Supabase
npm run supabase:status

# Stoppe lokal Supabase-instans
npm run supabase:stop
```

### Supabase Preview for Pull Requests

Når en pull request opprettes mot main-branch, vil GitHub Actions automatisk opprette en Supabase preview-branch. Dette gir et isolert testmiljø spesifikt for den pull requesten.

#### Hvordan bruke Preview-miljøer:

1. Opprett en pull request mot main-branch
2. GitHub Actions vil opprette en Supabase preview-branch
3. En kommentar på pull requesten vil inneholde instruksjoner for hvordan man kobler til preview-miljøet
4. Når pull requesten lukkes, vil preview-branchen slettes automatisk

#### Manuell Oppsett av Preview:

```bash
# Link til eksisterende Supabase-prosjekt
./supabase-preview.sh link
# Følg instruksjonene og skriv inn prosjekt-referansen når du blir bedt om det

# Kjør applikasjonen med miljøvariabel for branch
SUPABASE_BRANCH=branch-navn npm run dev
```

#### Administrere Databaseskjema:

```bash
# Hente skjema fra remote prosjekt
./supabase-preview.sh db-pull

# Dytte lokale endringer til remote prosjekt
./supabase-preview.sh db-push

# Tilbakestille lokal database (sletter data!)
./supabase-preview.sh db-reset
```

Dette preview-systemet lar utviklere teste endringer mot en isolert kopi av databasen før de merges til hovedbranchen.
EOF

# Insert the Supabase preview section into the master prompt file
awk '/^## DEPLOYMENT/{print ""; system("cat supabase-preview-docs.md"); print ""; print $0; next} {print}' SNAKKAZ-MASTER-PROMPT.md > SNAKKAZ-MASTER-PROMPT.md.new
mv SNAKKAZ-MASTER-PROMPT.md.new SNAKKAZ-MASTER-PROMPT.md
rm supabase-preview-docs.md

echo ""
echo "✅ Supabase Preview Configuration Complete! ✅"
echo ""
echo "The following have been set up:"
echo "  - Supabase CLI installed/updated"
echo "  - supabase-preview.sh script created"
echo "  - GitHub workflows for Supabase preview added"
echo "  - npm scripts for Supabase added to package.json"
echo "  - Documentation updated in SNAKKAZ-MASTER-PROMPT.md"
echo ""
echo "Next steps:"
echo "  1. Add your Supabase project credentials to GitHub repository secrets:"
echo "     - SUPABASE_ACCESS_TOKEN"
echo "     - SUPABASE_PROJECT_ID"
echo "  2. To start using Supabase locally, run: npm run supabase:setup"
echo "  3. To start a local Supabase instance, run: npm run supabase:start"
echo ""
echo "For a complete preview workflow:"
echo "  1. Create a pull request"
echo "  2. GitHub Actions will automatically create a preview branch"
echo "  3. Follow the instructions in the PR comment to use the preview environment"
echo ""
