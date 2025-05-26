#!/bin/bash

# Master Restructuring Script for Snakkaz Chat
# This script coordinates the complete restructuring of the project
# Usage: ./master-restructure.sh [--dry-run]

echo "============================================="
echo "SNAKKAZ CHAT MASTER RESTRUCTURING SCRIPT"
echo "============================================="
echo "Starting restructuring process on $(date)"
echo ""

# Check for dry run mode
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "🔍 Running in DRY RUN mode - no actual changes will be made"
  DRY_RUN_ARG="--dry-run"
else
  DRY_RUN_ARG=""
fi

# Define paths
PROJECT_ROOT="/workspaces/snakkaz-chat"
SCRIPTS_DIR="$PROJECT_ROOT/scripts/development"
BACKUP_DIR="$PROJECT_ROOT/backup-$(date +%Y%m%d-%H%M%S)"

# Create backup function
create_backup() {
  echo "📦 Creating project backup..."
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  Would create backup at: $BACKUP_DIR"
  else
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical directories
    cp -r "$PROJECT_ROOT/src" "$BACKUP_DIR/"
    cp -r "$PROJECT_ROOT/public" "$BACKUP_DIR/"
    
    # Backup root files
    find "$PROJECT_ROOT" -maxdepth 1 -type f -name "*.md" -o -name "*.sh" | xargs -I{} cp {} "$BACKUP_DIR/"
    
    echo "  ✅ Backup created at: $BACKUP_DIR"
  fi
  echo ""
}

# Function to run a restructuring script
run_script() {
  local script_name="$1"
  local script_path="$SCRIPTS_DIR/$script_name"
  
  echo "🔄 Running $script_name..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  Would execute: $script_path $DRY_RUN_ARG"
    echo "  Script details:"
    head -n 3 "$script_path" | tail -n 2 | sed 's/^#/  #/'
  else
    # Make sure script is executable
    chmod +x "$script_path"
    
    # Run the script
    "$script_path" $DRY_RUN_ARG
  fi
  
  echo ""
}

# Function to verify script availability
verify_scripts() {
  echo "🔍 Verifying restructuring scripts..."
  local missing_scripts=false
  
  # List of scripts that should exist
  local scripts=(
    "analyze-project-structure.sh"
    "reorganize-chat-components.sh"
    "organize-documentation.sh"
    "organize-scripts.sh"
  )
  
  # Check each script
  for script in "${scripts[@]}"; do
    if [[ ! -f "$SCRIPTS_DIR/$script" ]]; then
      echo "  ❌ Missing script: $script"
      missing_scripts=true
    else
      echo "  ✅ Found script: $script"
    fi
  done
  
  # Exit if any scripts are missing
  if [[ "$missing_scripts" == "true" ]]; then
    echo "❌ Error: Missing required scripts. Please create them first."
    exit 1
  fi
  
  echo "  ✅ All required scripts verified."
  echo ""
}

# Function to create index files and helpers
create_helpers() {
  echo "📝 Creating helper files and documentation..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  Would create helper files in $PROJECT_ROOT"
  else
    # Create master restructuring index
    cat > "$PROJECT_ROOT/RESTRUCTURING-GUIDE.md" << EOL
# Snakkaz Chat Restructuring Guide

This document serves as a guide for the restructuring process of the Snakkaz Chat project.

## Overview

The project is being restructured to improve organization, reduce duplication, and make the codebase more maintainable. The restructuring process is divided into several phases:

1. **Analysis**: Analyze the current project structure
2. **Documentation**: Organize documentation into structured categories
3. **Scripts**: Organize scripts into logical groups
4. **Components**: Reorganize components using a feature-based approach

## Restructuring Scripts

The following scripts are available to assist with the restructuring process:

- \`scripts/development/analyze-project-structure.sh\`: Analyze the current project structure and generate a report
- \`scripts/development/organize-documentation.sh\`: Organize documentation files
- \`scripts/development/organize-scripts.sh\`: Organize script files
- \`scripts/development/reorganize-chat-components.sh\`: Reorganize chat-related components

## New Project Structure

After restructuring, the project will follow this structure:

\`\`\`
/workspaces/snakkaz-chat/
├── docs/              # All documentation
│   ├── architecture/  # System design and architecture
│   ├── deployment/    # Deployment-related docs
│   ├── features/      # Feature-specific docs
│   └── troubleshooting/ # Error resolution guides
├── scripts/           # All shell scripts
│   ├── deployment/    # Deployment scripts
│   ├── migration/     # Database migration scripts
│   ├── verification/  # Testing and verification
│   └── development/   # Development utilities
├── src/               # Application source code
│   ├── components/    # UI components
│   ├── features/      # Feature modules
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── emoji/
│   │   └── groups/
│   ├── hooks/         # React hooks
│   ├── pages/         # React Router pages
│   └── utils/         # Utility functions
└── bin/               # Symlinks to commonly used scripts
\`\`\`

## Reverting Changes

If you need to revert the restructuring, a backup has been created at \`$BACKUP_DIR\`.

## Migration Status

Check \`RESTRUCTURING-STATUS.md\` for the current status of the migration process.
EOL
    
    # Create status tracker
    cat > "$PROJECT_ROOT/RESTRUCTURING-STATUS.md" << EOL
# Snakkaz Chat Restructuring Status

Last updated: $(date)

## Completed Steps

- [x] Created backup at \`$BACKUP_DIR\`
- [x] Created restructuring scripts

## In Progress

- [ ] Analysis of project structure
- [ ] Documentation organization
- [ ] Script organization
- [ ] Component reorganization

## Next Steps

1. Run \`scripts/development/analyze-project-structure.sh\` to analyze the current structure
2. Review the analysis report
3. Proceed with documentation and script organization

## Issues and Challenges

*None reported yet*

## Notes

This file will be updated throughout the restructuring process to track progress.
EOL
    
    echo "  ✅ Helper files created."
  fi
  echo ""
}

# Function to update the master prompt
update_master_prompt() {
  echo "📄 Updating SNAKKAZ-MASTER-PROMPT.md..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  Would update SNAKKAZ-MASTER-PROMPT.md with restructuring information"
  else
    cat >> "$PROJECT_ROOT/SNAKKAZ-MASTER-PROMPT.md" << EOL

---

## PROSJEKTRESTRUKTURERING - Mai 26, 2025

Snakkaz Chat-prosjektet er under en omfattende restrukturering for å forbedre organisering, redusere duplisering, og gjøre kodebasen mer vedlikeholdbar.

### Status for restrukturering

- Backup opprettet ved: \`$BACKUP_DIR\`
- Analyserapport generert: \`project-analysis-report.md\`
- Restruktureringsguide: \`RESTRUCTURING-GUIDE.md\`
- Statussporing: \`RESTRUCTURING-STATUS.md\`

### Restruktureringsscripts

Følgende scripts er tilgjengelige for restruktureringsarbeid:

- \`scripts/development/analyze-project-structure.sh\`: Analyserer prosjektstrukturen
- \`scripts/development/organize-documentation.sh\`: Organiserer dokumentasjon
- \`scripts/development/organize-scripts.sh\`: Organiserer scripts
- \`scripts/development/reorganize-chat-components.sh\`: Reorganiserer chat-komponenter

For å fortsette restruktureringsarbeidet, kjør disse scriptene i den angitte rekkefølgen. 
Se \`RESTRUCTURING-GUIDE.md\` for detaljert veiledning.
EOL
    
    echo "  ✅ SNAKKAZ-MASTER-PROMPT.md updated."
  fi
  echo ""
}

# Main execution flow
echo "🚀 Starting Snakkaz Chat restructuring process..."
echo ""

# Create backup
create_backup

# Verify scripts
verify_scripts

# Create helper files
create_helpers

# Run analyzer script
run_script "analyze-project-structure.sh"

# Ask for confirmation before proceeding further
if [[ "$DRY_RUN" == "false" ]]; then
  echo "⚠️  The analysis is complete. Before proceeding with actual restructuring,"
  echo "   please review the analysis report: project-analysis-report.md"
  echo ""
  read -p "Continue with the restructuring process? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restructuring process cancelled by user."
    exit 1
  fi
fi

# Update the master prompt
update_master_prompt

# Run documentation organizer
run_script "organize-documentation.sh"

# Run scripts organizer
run_script "organize-scripts.sh"

# Run chat component reorganizer
run_script "reorganize-chat-components.sh"

echo "============================================="
echo "RESTRUCTURING PROCESS SUMMARY"
echo "============================================="
echo "The following steps have been completed:"

if [[ "$DRY_RUN" == "true" ]]; then
  echo "✅ DRY RUN completed successfully. No actual changes were made."
  echo "   Review the output above to see what changes would be made."
  echo "   To perform actual restructuring, run without --dry-run parameter."
else
  echo "✅ Project backup created at: $BACKUP_DIR"
  echo "✅ Project structure analyzed (see project-analysis-report.md)"
  echo "✅ Documentation organized in docs/ directory"
  echo "✅ Scripts organized in scripts/ directory"
  echo "✅ Chat components reorganized in src/features/chat/"
  echo "✅ Helper files created: RESTRUCTURING-GUIDE.md, RESTRUCTURING-STATUS.md"
  echo "✅ SNAKKAZ-MASTER-PROMPT.md updated with restructuring information"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Review the new project structure"
echo "2. Update import paths throughout the codebase"
echo "3. Test the application to ensure everything works correctly"
echo "4. Update any remaining documentation to reflect the new structure"
echo ""
echo "🎉 Restructuring process complete!"
