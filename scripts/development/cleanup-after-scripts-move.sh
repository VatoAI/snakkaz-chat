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
