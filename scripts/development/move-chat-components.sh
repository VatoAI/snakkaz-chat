#!/bin/bash

# Script to move chat components to their new feature-based locations
# Usage: ./move-chat-components.sh [--dry-run]

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in dry run mode (no changes will be made)"
fi

PROJECT_ROOT="/workspaces/snakkaz-chat"
FEATURES_DIR="$PROJECT_ROOT/src/features"
CHAT_FEATURE_DIR="$FEATURES_DIR/chat"

# Function to move a component
move_component() {
  local source="$1"
  local category="$2"
  local target_dir="$CHAT_FEATURE_DIR/components/$category"
  local filename=$(basename "$source")
  local target="$target_dir/$filename"
  
  # Create target directory if it doesn't exist
  if [[ ! -d "$target_dir" && "$DRY_RUN" == "false" ]]; then
    mkdir -p "$target_dir"
  fi
  
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would move $source to $target"
  else
    # Move the file
    mv "$source" "$target"
    echo "Moved $filename to $category category"
    
    # Update the category's index.ts
    echo "export * from './$filename';" >> "$target_dir/index.ts"
  fi
}

echo "Starting component migration..."

# Process global components
while read -r component; do
  if [[ -f "$component" ]]; then
    move_component "$component" "global"
  fi
done < /tmp/global_components.txt

# Process private components
while read -r component; do
  if [[ -f "$component" ]]; then
    move_component "$component" "private"
  fi
done < /tmp/private_components.txt

# Process group components
while read -r component; do
  if [[ -f "$component" ]]; then
    move_component "$component" "group"
  fi
done < /tmp/group_components.txt

# Process interface components
while read -r component; do
  if [[ -f "$component" ]]; then
    move_component "$component" "interface"
  fi
done < /tmp/interface_components.txt

# Process common components
while read -r component; do
  if [[ -f "$component" ]]; then
    move_component "$component" "common"
  fi
done < /tmp/common_components.txt

echo "Component migration complete."
echo "Next step: Update import paths with update-chat-imports.sh script"
