#!/bin/bash

# Script Organizer for Snakkaz Chat
# This script organizes shell scripts into a structured folder hierarchy
# Usage: ./organize-scripts.sh [--dry-run]

echo "============================================="
echo "SNAKKAZ CHAT SCRIPT ORGANIZER"
echo "============================================="
echo "Starting organization on $(date)"
echo ""

# Check for dry run mode
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in dry run mode (no changes will be made)"
fi

# Define paths
PROJECT_ROOT="/workspaces/snakkaz-chat"
SCRIPTS_ROOT="$PROJECT_ROOT/scripts"

# Function to create directory structure
create_directory_structure() {
  echo "Creating scripts directory structure..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would create the following directories:"
    echo "- $SCRIPTS_ROOT/deployment"
    echo "- $SCRIPTS_ROOT/migration"
    echo "- $SCRIPTS_ROOT/verification"
    echo "- $SCRIPTS_ROOT/development"
    echo "- $SCRIPTS_ROOT/maintenance"
    echo "- $SCRIPTS_ROOT/testing"
  else
    mkdir -p "$SCRIPTS_ROOT/deployment"
    mkdir -p "$SCRIPTS_ROOT/migration"
    mkdir -p "$SCRIPTS_ROOT/verification"
    mkdir -p "$SCRIPTS_ROOT/development"
    mkdir -p "$SCRIPTS_ROOT/maintenance"
    mkdir -p "$SCRIPTS_ROOT/testing"
    
    echo "Directory structure created successfully!"
  fi
  echo ""
}

# Function to categorize scripts
categorize_scripts() {
  echo "Categorizing script files..."
  
  # Create categorization files
  > /tmp/deployment_scripts.txt
  > /tmp/migration_scripts.txt
  > /tmp/verification_scripts.txt
  > /tmp/development_scripts.txt
  > /tmp/maintenance_scripts.txt
  > /tmp/testing_scripts.txt
  > /tmp/uncategorized_scripts.txt
  
  # Find all shell script files in the root directory
  find "$PROJECT_ROOT" -maxdepth 1 -name "*.sh" | while read -r script; do
    filename=$(basename "$script")
    
    # Categorize based on filename patterns
    if [[ "$filename" == *"deploy"* || "$filename" == *"upload"* || "$filename" == *"publish"* ]]; then
      echo "$script" >> /tmp/deployment_scripts.txt
    elif [[ "$filename" == *"migra"* || "$filename" == *"apply"* || "$filename" == *"db"* ]]; then
      echo "$script" >> /tmp/migration_scripts.txt
    elif [[ "$filename" == *"verify"* || "$filename" == *"check"* || "$filename" == *"monitor"* ]]; then
      echo "$script" >> /tmp/verification_scripts.txt
    elif [[ "$filename" == *"dev"* || "$filename" == *"analyze"* || "$filename" == *"build"* ]]; then
      echo "$script" >> /tmp/development_scripts.txt
    elif [[ "$filename" == *"clean"* || "$filename" == *"fix"* || "$filename" == *"maintain"* ]]; then
      echo "$script" >> /tmp/maintenance_scripts.txt
    elif [[ "$filename" == *"test"* ]]; then
      echo "$script" >> /tmp/testing_scripts.txt
    else
      echo "$script" >> /tmp/uncategorized_scripts.txt
    fi
  done
  
  # Print summary
  echo "Script categorization summary:"
  echo "- Deployment scripts: $(wc -l < /tmp/deployment_scripts.txt)"
  echo "- Migration scripts: $(wc -l < /tmp/migration_scripts.txt)"
  echo "- Verification scripts: $(wc -l < /tmp/verification_scripts.txt)"
  echo "- Development scripts: $(wc -l < /tmp/development_scripts.txt)"
  echo "- Maintenance scripts: $(wc -l < /tmp/maintenance_scripts.txt)"
  echo "- Testing scripts: $(wc -l < /tmp/testing_scripts.txt)"
  echo "- Uncategorized scripts: $(wc -l < /tmp/uncategorized_scripts.txt)"
  echo ""
}

# Function to move scripts
move_scripts() {
  echo "Moving scripts to their categories..."
  
  # Function to move a single script
  move_script() {
    local source="$1"
    local target_dir="$2"
    local filename=$(basename "$source")
    local target="$target_dir/$filename"
    
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "Would move $filename to $target_dir"
    else
      cp "$source" "$target"
      chmod +x "$target"
      echo "Copied $filename to $target_dir"
    fi
  }
  
  # Move deployment scripts
  while read -r script; do
    if [[ -f "$script" ]]; then
      move_script "$script" "$SCRIPTS_ROOT/deployment"
    fi
  done < /tmp/deployment_scripts.txt
  
  # Move migration scripts
  while read -r script; do
    if [[ -f "$script" ]]; then
      move_script "$script" "$SCRIPTS_ROOT/migration"
    fi
  done < /tmp/migration_scripts.txt
  
  # Move verification scripts
  while read -r script; do
    if [[ -f "$script" ]]; then
      move_script "$script" "$SCRIPTS_ROOT/verification"
    fi
  done < /tmp/verification_scripts.txt
  
  # Move development scripts
  while read -r script; do
    if [[ -f "$script" ]]; then
      move_script "$script" "$SCRIPTS_ROOT/development"
    fi
  done < /tmp/development_scripts.txt
  
  # Move maintenance scripts
  while read -r script; do
    if [[ -f "$script" ]]; then
      move_script "$script" "$SCRIPTS_ROOT/maintenance"
    fi
  done < /tmp/maintenance_scripts.txt
  
  # Move testing scripts
  while read -r script; do
    if [[ -f "$script" ]]; then
      move_script "$script" "$SCRIPTS_ROOT/testing"
    fi
  done < /tmp/testing_scripts.txt
  
  # Handle uncategorized scripts
  if [[ $(wc -l < /tmp/uncategorized_scripts.txt) -gt 0 ]]; then
    echo ""
    echo "Uncategorized scripts:"
    cat /tmp/uncategorized_scripts.txt | sed 's/^/- /'
    echo ""
    echo "Please review these scripts manually and move them to appropriate categories."
  fi
  
  echo ""
}

# Function to create README files
create_readme_files() {
  echo "Creating README files for script categories..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would create README files in each script category"
  else
    # Create main README
    cat > "$SCRIPTS_ROOT/README.md" << EOL
# Snakkaz Chat Scripts

This directory contains all scripts for the Snakkaz Chat application, organized by category.

## Categories

- [Deployment](deployment/): Scripts for deploying the application
- [Migration](migration/): Database migration scripts
- [Verification](verification/): Scripts to verify functionality
- [Development](development/): Development utility scripts
- [Maintenance](maintenance/): System maintenance scripts
- [Testing](testing/): Scripts for testing functionality

## Using These Scripts

Most scripts can be run directly from their respective directories. Make sure they have execute permissions:

\`\`\`bash
chmod +x scripts/category/script-name.sh
\`\`\`

When running scripts, use absolute paths or navigate to the script directory first.

## Adding New Scripts

When adding new scripts:

1. Place them in the appropriate category folder
2. Make sure they have execute permissions
3. Follow the naming conventions of existing scripts
4. Add proper documentation and usage information in the script header
EOL
    
    # Create category README files with script listings
    for category in deployment migration verification development maintenance testing; do
      cat > "$SCRIPTS_ROOT/$category/README.md" << EOL
# $(echo $category | sed 's/^./\u&/') Scripts

Scripts in this category:

$(find "$SCRIPTS_ROOT/$category" -maxdepth 1 -name "*.sh" ! -name "README.md" | sort | while read -r script; do
  filename=$(basename "$script")
  description=$(head -n 10 "$script" | grep -i "description\|purpose\|usage" | head -n 1 | sed 's/^#\s*//' || echo "")
  echo "- [$filename](./$filename): ${description:-No description available}"
done)

## Usage

Scripts should be executed from the project root directory:

\`\`\`bash
./scripts/$category/script-name.sh [options]
\`\`\`

Check each script's header comments for specific usage instructions.
EOL
    done
    
    echo "README files created successfully!"
  fi
  echo ""
}

# Function to create script symlinks
create_symlinks() {
  echo "Creating symlinks for commonly used scripts..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would create symlinks in project root for commonly used scripts"
  else
    # Create symlinks directory
    mkdir -p "$PROJECT_ROOT/bin"
    
    # Identify commonly used scripts (deployment and verification)
    find "$SCRIPTS_ROOT/deployment" -maxdepth 1 -name "*deploy*.sh" -o -name "*publish*.sh" | while read -r script; do
      filename=$(basename "$script")
      ln -sf "../scripts/deployment/$filename" "$PROJECT_ROOT/bin/$filename"
      echo "Created symlink for $filename in bin/"
    done
    
    find "$SCRIPTS_ROOT/verification" -maxdepth 1 -name "*verify*.sh" -o -name "*check*.sh" | while read -r script; do
      filename=$(basename "$script")
      ln -sf "../scripts/verification/$filename" "$PROJECT_ROOT/bin/$filename"
      echo "Created symlink for $filename in bin/"
    done
    
    # Create a README for the bin directory
    cat > "$PROJECT_ROOT/bin/README.md" << EOL
# Snakkaz Chat Shortcut Scripts

This directory contains symlinks to commonly used scripts from various categories.
These symlinks are provided for convenience and can be executed directly from here.

All scripts in this directory are symlinks to their original locations in the \`scripts/\` directory.

## Available Scripts

$(find "$PROJECT_ROOT/bin" -maxdepth 1 -name "*.sh" | sort | while read -r script; do
  filename=$(basename "$script")
  target=$(readlink "$script")
  echo "- [$filename](./$filename): Symlink to \`$target\`"
done)

## Usage

\`\`\`bash
# Navigate to bin directory
cd /workspaces/snakkaz-chat/bin

# Execute a script
./$script_name
\`\`\`

Or from project root:

\`\`\`bash
./bin/$script_name
\`\`\`
EOL
    
    echo "Symlinks created in bin/ directory!"
  fi
  echo ""
}

# Function to create a cleanup script
create_cleanup_script() {
  echo "Creating cleanup script for script reorganization..."
  
  CLEANUP_SCRIPT="$PROJECT_ROOT/scripts/development/cleanup-after-scripts-move.sh"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would create cleanup script at $CLEANUP_SCRIPT"
  else
    cat > "$CLEANUP_SCRIPT" << 'EOL'
#!/bin/bash

# Script to remove original script files after verification
# Usage: ./cleanup-after-scripts-move.sh [--dry-run]

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in dry run mode (no files will be deleted)"
fi

PROJECT_ROOT="/workspaces/snakkaz-chat"
SCRIPTS_ROOT="$PROJECT_ROOT/scripts"

# Function to check if a script exists in scripts directory
script_exists_in_scripts() {
  local filename=$(basename "$1")
  
  # Find the script in the scripts directory tree
  if find "$SCRIPTS_ROOT" -name "$filename" | grep -q .; then
    return 0  # Script exists
  else
    return 1  # Script doesn't exist
  fi
}

echo "Checking for script files that can be removed from root directory..."

# Find all shell script files in the root directory
find "$PROJECT_ROOT" -maxdepth 1 -name "*.sh" | while read -r script; do
  filename=$(basename "$script")
  
  # Check if the script exists in scripts directory
  if script_exists_in_scripts "$script"; then
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "Would remove $filename from root directory (copy exists in scripts)"
    else
      rm "$script"
      echo "Removed $filename from root directory"
    fi
  else
    echo "WARNING: $filename not found in scripts directory, skipping deletion"
  fi
done

echo "Cleanup complete!"
EOL
  
    chmod +x "$CLEANUP_SCRIPT"
    echo "Cleanup script created: $CLEANUP_SCRIPT"
    echo "Run with --dry-run first to see what files would be removed"
  fi
  echo ""
}

# Main execution
create_directory_structure
categorize_scripts
move_scripts
create_readme_files
create_symlinks
create_cleanup_script

echo "============================================="
echo "SCRIPT ORGANIZATION COMPLETE"
echo "============================================="
echo "The following steps have been completed:"
echo "1. Created scripts directory structure"
echo "2. Categorized script files"
echo "3. Copied scripts to their category folders"
echo "4. Created README files for easy navigation"
echo "5. Created symlinks for commonly used scripts in bin/"
echo "6. Created cleanup script: scripts/development/cleanup-after-scripts-move.sh"
echo ""
echo "Next Steps:"
echo "1. Review the organization and verify all scripts are correctly placed"
echo "2. Update any references to script files in code or documentation"
echo "3. Run the cleanup script to remove original files after verification"
echo "4. Update the SNAKKAZ-MASTER-PROMPT.md with the new script structure"
echo ""
if [[ "$DRY_RUN" == "true" ]]; then
  echo "This was a dry run. To perform the actual organization, run without --dry-run"
fi
