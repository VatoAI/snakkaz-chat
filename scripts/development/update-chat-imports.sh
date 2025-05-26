#!/bin/bash

# Script to update import paths for chat components
# Usage: ./update-chat-imports.sh [--dry-run]

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "Running in dry run mode (no changes will be made)"
fi

PROJECT_ROOT="/workspaces/snakkaz-chat"
SRC_DIR="$PROJECT_ROOT/src"

# Find all possible component names that have been moved
COMPONENT_NAMES=$(find "$PROJECT_ROOT/src/features/chat/components" -type f -name "*.tsx" -exec basename {} \; | sed 's/\.tsx$//' | sort | uniq)

# Function to update imports in a file
update_imports() {
  local file="$1"
  local changed=false
  
  for component in $COMPONENT_NAMES; do
    # Check for imports from the old locations
    if grep -q "import.*from.*components\/chat\/$component" "$file" || \
       grep -q "import.*from.*components\/message\/$component" "$file" || \
       grep -q "import.*from.*features\/chat\/components\/$component" "$file"; then
      
      # Determine if this component is now in a specific category
      local category=""
      if [ -f "$PROJECT_ROOT/src/features/chat/components/global/$component.tsx" ]; then
        category="global"
      elif [ -f "$PROJECT_ROOT/src/features/chat/components/private/$component.tsx" ]; then
        category="private"
      elif [ -f "$PROJECT_ROOT/src/features/chat/components/group/$component.tsx" ]; then
        category="group"
      elif [ -f "$PROJECT_ROOT/src/features/chat/components/interface/$component.tsx" ]; then
        category="interface"
      elif [ -f "$PROJECT_ROOT/src/features/chat/components/common/$component.tsx" ]; then
        category="common"
      fi
      
      if [[ -n "$category" ]]; then
        if [[ "$DRY_RUN" == "true" ]]; then
          echo "Would update imports for $component in $file to @/features/chat"
        else
          # Replace the import path
          sed -i "s|import.*from.*\(components\/chat\|components\/message\|features\/chat\/components\)\/$component.*|import { $component } from '@/features/chat';|" "$file"
          changed=true
        fi
      fi
    fi
  done
  
  if [[ "$changed" == "true" ]]; then
    echo "Updated imports in $file"
  fi
}

echo "Updating import paths for chat components..."

# Find all TypeScript/React files
find "$SRC_DIR" -type f -name "*.ts" -o -name "*.tsx" | while read -r file; do
  update_imports "$file"
done

echo "Import path updates complete."
echo "Next step: Test the application to ensure everything works correctly"
