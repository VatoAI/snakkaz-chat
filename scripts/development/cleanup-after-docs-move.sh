#!/bin/bash

# Script to remove original documentation files after verification
# Usage: ./cleanup-after-docs-move.sh [--dry-run]

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in dry run mode (no files will be deleted)"
fi

PROJECT_ROOT="/workspaces/snakkaz-chat"
DOCS_ROOT="$PROJECT_ROOT/docs"

# Function to check if a file exists in docs directory
file_exists_in_docs() {
  local filename=$(basename "$1")
  
  # Find the file in the docs directory tree
  if find "$DOCS_ROOT" -name "$filename" | grep -q .; then
    return 0  # File exists
  else
    return 1  # File doesn't exist
  fi
}

echo "Checking for documentation files that can be removed from root directory..."

# Find all MD files in the root directory
find "$PROJECT_ROOT" -maxdepth 1 -name "*.md" | while read -r doc; do
  filename=$(basename "$doc")
  
  # Skip README.md and other essential files
  if [[ "$filename" == "README.md" || "$filename" == "LICENSE.md" ]]; then
    continue
  fi
  
  # Check if the file exists in docs directory
  if file_exists_in_docs "$doc"; then
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "Would remove $filename from root directory (copy exists in docs)"
    else
      rm "$doc"
      echo "Removed $filename from root directory"
    fi
  else
    echo "WARNING: $filename not found in docs directory, skipping deletion"
  fi
done

echo "Cleanup complete!"
