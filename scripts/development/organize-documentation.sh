#!/bin/bash

# Documentation Organizer for Snakkaz Chat
# This script organizes documentation files into a structured folder hierarchy
# Usage: ./organize-documentation.sh [--dry-run]

echo "============================================="
echo "SNAKKAZ CHAT DOCUMENTATION ORGANIZER"
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
DOCS_ROOT="$PROJECT_ROOT/docs"

# Function to create directory structure
create_directory_structure() {
  echo "Creating documentation directory structure..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would create the following directories:"
    echo "- $DOCS_ROOT/architecture"
    echo "- $DOCS_ROOT/deployment"
    echo "- $DOCS_ROOT/features"
    echo "- $DOCS_ROOT/features/emoji"
    echo "- $DOCS_ROOT/features/chat"
    echo "- $DOCS_ROOT/troubleshooting"
    echo "- $DOCS_ROOT/development"
  else
    mkdir -p "$DOCS_ROOT/architecture"
    mkdir -p "$DOCS_ROOT/deployment"
    mkdir -p "$DOCS_ROOT/features/emoji"
    mkdir -p "$DOCS_ROOT/features/chat"
    mkdir -p "$DOCS_ROOT/troubleshooting"
    mkdir -p "$DOCS_ROOT/development"
    
    echo "Directory structure created successfully!"
  fi
  echo ""
}

# Function to categorize documentation files
categorize_documentation() {
  echo "Categorizing documentation files..."
  
  # Create categorization files
  > /tmp/emoji_docs.txt
  > /tmp/deployment_docs.txt
  > /tmp/architecture_docs.txt
  > /tmp/troubleshooting_docs.txt
  > /tmp/development_docs.txt
  > /tmp/chat_docs.txt
  > /tmp/uncategorized_docs.txt
  
  # Find all MD files in the root directory
  find "$PROJECT_ROOT" -maxdepth 1 -name "*.md" | while read -r doc; do
    filename=$(basename "$doc")
    
    # Skip README.md - keep it in root
    if [[ "$filename" == "README.md" ]]; then
      continue
    fi
    
    # Categorize based on filename patterns
    if [[ "$filename" == *"EMOJI"* || "$filename" == *"emoji"* || "$filename" == *"CUSTOM-EMOJI"* ]]; then
      echo "$doc" >> /tmp/emoji_docs.txt
    elif [[ "$filename" == *"DEPLOY"* || "$filename" == *"deploy"* || "$filename" == *"UPLOAD"* || "$filename" == *"upload"* ]]; then
      echo "$doc" >> /tmp/deployment_docs.txt
    elif [[ "$filename" == *"ARCHITECTURE"* || "$filename" == *"STRUKTUR"* || "$filename" == *"MASTER"* || "$filename" == *"PROMPT"* ]]; then
      echo "$doc" >> /tmp/architecture_docs.txt
    elif [[ "$filename" == *"FIX"* || "$filename" == *"ERROR"* || "$filename" == *"TROUBLESHOOT"* || "$filename" == *"PROBLEM"* ]]; then
      echo "$doc" >> /tmp/troubleshooting_docs.txt
    elif [[ "$filename" == *"DEV"* || "$filename" == *"IMPLEMENT"* || "$filename" == *"UTVIKLING"* ]]; then
      echo "$doc" >> /tmp/development_docs.txt
    elif [[ "$filename" == *"CHAT"* || "$filename" == *"MESSAGE"* || "$filename" == *"chat"* ]]; then
      echo "$doc" >> /tmp/chat_docs.txt
    else
      echo "$doc" >> /tmp/uncategorized_docs.txt
    fi
  done
  
  # Print summary
  echo "Documentation categorization summary:"
  echo "- Emoji system docs: $(wc -l < /tmp/emoji_docs.txt)"
  echo "- Deployment docs: $(wc -l < /tmp/deployment_docs.txt)"
  echo "- Architecture docs: $(wc -l < /tmp/architecture_docs.txt)"
  echo "- Troubleshooting docs: $(wc -l < /tmp/troubleshooting_docs.txt)"
  echo "- Development docs: $(wc -l < /tmp/development_docs.txt)"
  echo "- Chat system docs: $(wc -l < /tmp/chat_docs.txt)"
  echo "- Uncategorized docs: $(wc -l < /tmp/uncategorized_docs.txt)"
  echo ""
}

# Function to move documentation files
move_documentation() {
  echo "Moving documentation files to their categories..."
  
  # Function to move a single doc
  move_doc() {
    local source="$1"
    local target_dir="$2"
    local filename=$(basename "$source")
    local target="$target_dir/$filename"
    
    if [[ "$DRY_RUN" == "true" ]]; then
      echo "Would move $filename to $target_dir"
    else
      cp "$source" "$target"
      echo "Copied $filename to $target_dir"
    fi
  }
  
  # Move emoji docs
  while read -r doc; do
    if [[ -f "$doc" ]]; then
      move_doc "$doc" "$DOCS_ROOT/features/emoji"
    fi
  done < /tmp/emoji_docs.txt
  
  # Move deployment docs
  while read -r doc; do
    if [[ -f "$doc" ]]; then
      move_doc "$doc" "$DOCS_ROOT/deployment"
    fi
  done < /tmp/deployment_docs.txt
  
  # Move architecture docs
  while read -r doc; do
    if [[ -f "$doc" ]]; then
      move_doc "$doc" "$DOCS_ROOT/architecture"
    fi
  done < /tmp/architecture_docs.txt
  
  # Move troubleshooting docs
  while read -r doc; do
    if [[ -f "$doc" ]]; then
      move_doc "$doc" "$DOCS_ROOT/troubleshooting"
    fi
  done < /tmp/troubleshooting_docs.txt
  
  # Move development docs
  while read -r doc; do
    if [[ -f "$doc" ]]; then
      move_doc "$doc" "$DOCS_ROOT/development"
    fi
  done < /tmp/development_docs.txt
  
  # Move chat docs
  while read -r doc; do
    if [[ -f "$doc" ]]; then
      move_doc "$doc" "$DOCS_ROOT/features/chat"
    fi
  done < /tmp/chat_docs.txt
  
  # Handle uncategorized docs
  if [[ $(wc -l < /tmp/uncategorized_docs.txt) -gt 0 ]]; then
    echo ""
    echo "Uncategorized documentation files:"
    cat /tmp/uncategorized_docs.txt | sed 's/^/- /'
    echo ""
    echo "Please review these files manually and move them to appropriate categories."
  fi
  
  echo ""
}

# Function to create index files
create_index_files() {
  echo "Creating index files for documentation categories..."
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would create index files in each documentation category"
  else
    # Create main index
    cat > "$DOCS_ROOT/README.md" << EOL
# Snakkaz Chat Documentation

This directory contains all documentation for the Snakkaz Chat application, organized by category.

## Categories

- [Architecture](architecture/): System design and architecture documentation
- [Deployment](deployment/): Deployment guides and procedures
- [Features](features/): Documentation for specific features
  - [Emoji System](features/emoji/): Custom emoji system documentation
  - [Chat System](features/chat/): Chat system documentation
- [Troubleshooting](troubleshooting/): Error resolution and troubleshooting guides
- [Development](development/): Developer guides and implementation details

## Using This Documentation

Start by exploring the category most relevant to your current task. If you're looking for information about a specific feature, check the feature-specific documentation first.

For questions about the overall system architecture, refer to the Architecture documentation, particularly the [SNAKKAZ-MASTER-PROMPT.md](architecture/SNAKKAZ-MASTER-PROMPT.md) file.

## Contributing to Documentation

When adding new documentation:

1. Place it in the appropriate category folder
2. Update the relevant index file
3. Use consistent formatting and language
4. Include date and status information when relevant
EOL
    
    # Create category index files
    for category in architecture deployment "features/emoji" "features/chat" troubleshooting development; do
      cat > "$DOCS_ROOT/$category/README.md" << EOL
# $(echo $category | sed 's/^./\u&/; s/\/.*$//') Documentation

Documents in this category:

$(find "$DOCS_ROOT/$category" -maxdepth 1 -name "*.md" ! -name "README.md" | sort | while read -r doc; do
  filename=$(basename "$doc")
  title=$(head -n 1 "$doc" | sed 's/^# //')
  echo "- [$title]($filename)"
done)

## Overview

This directory contains documentation related to $(echo $category | sed 's/features\///')$(echo $category | grep -q "features/" && echo " features").
EOL
    done
    
    echo "Index files created successfully!"
  fi
  echo ""
}

# Function to create a cleanup script
create_cleanup_script() {
  echo "Creating cleanup script for documentation reorganization..."
  
  CLEANUP_SCRIPT="$PROJECT_ROOT/scripts/development/cleanup-after-docs-move.sh"
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would create cleanup script at $CLEANUP_SCRIPT"
  else
    cat > "$CLEANUP_SCRIPT" << 'EOL'
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
EOL
  
    chmod +x "$CLEANUP_SCRIPT"
    echo "Cleanup script created: $CLEANUP_SCRIPT"
    echo "Run with --dry-run first to see what files would be removed"
  fi
  echo ""
}

# Main execution
create_directory_structure
categorize_documentation
move_documentation
create_index_files
create_cleanup_script

echo "============================================="
echo "DOCUMENTATION ORGANIZATION COMPLETE"
echo "============================================="
echo "The following steps have been completed:"
echo "1. Created documentation directory structure"
echo "2. Categorized documentation files"
echo "3. Copied files to their category folders"
echo "4. Created index files for easy navigation"
echo "5. Created cleanup script: scripts/development/cleanup-after-docs-move.sh"
echo ""
echo "Next Steps:"
echo "1. Review the organization and verify all documents are correctly placed"
echo "2. Update any references to documentation files in code or other documents"
echo "3. Run the cleanup script to remove original files after verification"
echo "4. Update the SNAKKAZ-MASTER-PROMPT.md with the new documentation structure"
echo ""
if [[ "$DRY_RUN" == "true" ]]; then
  echo "This was a dry run. To perform the actual organization, run without --dry-run"
fi
