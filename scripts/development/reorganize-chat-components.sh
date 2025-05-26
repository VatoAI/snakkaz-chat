#!/bin/bash

# Reorganize Chat Components Script
# This script helps reorganize chat-related components into a feature-based structure
# Usage: ./reorganize-chat-components.sh

echo "============================================="
echo "SNAKKAZ CHAT COMPONENT REORGANIZER"
echo "============================================="
echo "Starting reorganization on $(date)"
echo ""

# Define paths
PROJECT_ROOT="/workspaces/snakkaz-chat"
SRC_DIR="$PROJECT_ROOT/src"
FEATURES_DIR="$SRC_DIR/features"
CHAT_FEATURE_DIR="$FEATURES_DIR/chat"
CHAT_COMPONENTS_DIRS=("$SRC_DIR/components/chat" 
                      "$SRC_DIR/features/chat/components" 
                      "$SRC_DIR/components/message" 
                      "$SRC_DIR/components/message-list")
BACKUP_DIR="$PROJECT_ROOT/backup-$(date +%Y%m%d-%H%M%S)"

# Function to create backup
create_backup() {
  echo "Creating backup of critical directories..."
  mkdir -p "$BACKUP_DIR"
  
  # Backup chat-related components
  for dir in "${CHAT_COMPONENTS_DIRS[@]}"; do
    if [ -d "$dir" ]; then
      backup_target="$BACKUP_DIR/$(echo $dir | sed "s|$PROJECT_ROOT/||")"
      mkdir -p "$(dirname "$backup_target")"
      cp -r "$dir" "$backup_target"
      echo "Backed up $dir to $backup_target"
    fi
  done
  
  echo "Backup complete at: $BACKUP_DIR"
  echo ""
}

# Function to create feature structure
create_feature_structure() {
  echo "Creating feature-based structure for chat components..."
  
  # Create necessary directories
  mkdir -p "$CHAT_FEATURE_DIR/components/global"
  mkdir -p "$CHAT_FEATURE_DIR/components/private"
  mkdir -p "$CHAT_FEATURE_DIR/components/group"
  mkdir -p "$CHAT_FEATURE_DIR/components/common"
  mkdir -p "$CHAT_FEATURE_DIR/components/interface"
  mkdir -p "$CHAT_FEATURE_DIR/hooks"
  mkdir -p "$CHAT_FEATURE_DIR/services"
  mkdir -p "$CHAT_FEATURE_DIR/utils"
  
  # Create index.ts file
  cat > "$CHAT_FEATURE_DIR/index.ts" << EOL
/**
 * Chat Feature Module
 * Exports all chat-related components, hooks, and utilities
 */

// Components
export * from './components/global';
export * from './components/private';
export * from './components/group';
export * from './components/common';
export * from './components/interface';

// Hooks
export * from './hooks';

// Services
export * from './services';

// Utils
export * from './utils';
EOL

  # Create index.ts files for component subdirs
  for subdir in global private group common interface; do
    cat > "$CHAT_FEATURE_DIR/components/$subdir/index.ts" << EOL
/**
 * Chat $subdir Components
 */

// Export all components from this directory
EOL
  done
  
  echo "Feature structure created successfully!"
  echo ""
}

# Function to identify chat components
identify_chat_components() {
  echo "Identifying chat components across the project..."
  
  # Find all chat-related components
  find "$SRC_DIR" -name "*Chat*.tsx" -o -name "*Message*.tsx" > /tmp/chat_components.txt
  
  echo "Found $(wc -l < /tmp/chat_components.txt) chat-related components."
  echo "Components have been written to /tmp/chat_components.txt"
  echo ""
}

# Function to categorize components
categorize_components() {
  echo "Categorizing components based on naming patterns..."
  
  # Create categorization files
  > /tmp/global_components.txt
  > /tmp/private_components.txt
  > /tmp/group_components.txt
  > /tmp/common_components.txt
  > /tmp/interface_components.txt
  > /tmp/uncategorized_components.txt
  
  # Process each component
  while read -r component; do
    filename=$(basename "$component")
    
    # Categorize based on filename patterns
    if [[ "$filename" == *"Global"* ]]; then
      echo "$component" >> /tmp/global_components.txt
    elif [[ "$filename" == *"Private"* ]]; then
      echo "$component" >> /tmp/private_components.txt
    elif [[ "$filename" == *"Group"* ]]; then
      echo "$component" >> /tmp/group_components.txt
    elif [[ "$filename" == *"Interface"* || "$filename" == *"Container"* ]]; then
      echo "$component" >> /tmp/interface_components.txt
    elif [[ "$filename" == *"Message"* || "$filename" == *"Chat"* ]]; then
      # These are common components used across multiple chat types
      echo "$component" >> /tmp/common_components.txt
    else
      echo "$component" >> /tmp/uncategorized_components.txt
    fi
  done < /tmp/chat_components.txt
  
  # Print summary
  echo "Components categorization summary:"
  echo "- Global chat components: $(wc -l < /tmp/global_components.txt)"
  echo "- Private chat components: $(wc -l < /tmp/private_components.txt)"
  echo "- Group chat components: $(wc -l < /tmp/group_components.txt)"
  echo "- Interface components: $(wc -l < /tmp/interface_components.txt)"
  echo "- Common components: $(wc -l < /tmp/common_components.txt)"
  echo "- Uncategorized components: $(wc -l < /tmp/uncategorized_components.txt)"
  echo ""
}

# Function to generate migration plan
generate_migration_plan() {
  echo "Generating migration plan..."
  
  # Create migration plan file
  MIGRATION_PLAN="$PROJECT_ROOT/chat-components-migration-plan.md"
  
  cat > "$MIGRATION_PLAN" << EOL
# Chat Components Migration Plan

This document outlines the plan for migrating chat components to a feature-based structure.

## Component Categories

### Global Chat Components
$(cat /tmp/global_components.txt | sed 's/^/- /')

### Private Chat Components
$(cat /tmp/private_components.txt | sed 's/^/- /')

### Group Chat Components
$(cat /tmp/group_components.txt | sed 's/^/- /')

### Interface Components
$(cat /tmp/interface_components.txt | sed 's/^/- /')

### Common Components
$(cat /tmp/common_components.txt | sed 's/^/- /')

### Uncategorized Components
$(cat /tmp/uncategorized_components.txt | sed 's/^/- /')

## Migration Steps

1. Create feature-based structure in \`src/features/chat\`
2. Move components to appropriate subdirectories
3. Update import paths throughout the codebase
4. Test functionality after migration
5. Remove duplicate components after validating functionality

## Import Path Updates

After moving components, the following import path updates will be needed:

\`\`\`typescript
// Before
import { ChatMessage } from '@/components/chat/ChatMessage';

// After
import { ChatMessage } from '@/features/chat';
\`\`\`

## Manual Review Required

Some components may require manual review to determine their proper categorization:

1. Components marked as "uncategorized"
2. Components that might have dependencies on specific other components
3. Components with duplicate functionality that need to be consolidated

## Implementation Strategy

1. Start with moving the common and interface components
2. Then migrate global, private, and group components
3. Update imports incrementally and test after each set of changes
4. Refactor duplicate functionality into shared components
EOL
  
  echo "Migration plan generated: $MIGRATION_PLAN"
  echo ""
}

# Function to create a script for moving components
create_move_script() {
  echo "Creating script for moving components..."
  
  MOVE_SCRIPT="$PROJECT_ROOT/scripts/development/move-chat-components.sh"
  
  cat > "$MOVE_SCRIPT" << 'EOL'
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
EOL
  
  chmod +x "$MOVE_SCRIPT"
  echo "Move script created: $MOVE_SCRIPT"
  echo "Run with --dry-run first to see what changes would be made"
  echo ""
}

# Function to create a script for updating imports
create_imports_update_script() {
  echo "Creating script for updating imports..."
  
  IMPORTS_SCRIPT="$PROJECT_ROOT/scripts/development/update-chat-imports.sh"
  
  cat > "$IMPORTS_SCRIPT" << 'EOL'
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
COMPONENT_NAMES=$(find "$PROJECT_ROOT/src/features/chat/components" -name "*.tsx" -exec basename {} \; | sed 's/\.tsx$//' | sort | uniq)

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
      if grep -q "$component.tsx" "$PROJECT_ROOT/src/features/chat/components/global/"; then
        category="global"
      elif grep -q "$component.tsx" "$PROJECT_ROOT/src/features/chat/components/private/"; then
        category="private"
      elif grep -q "$component.tsx" "$PROJECT_ROOT/src/features/chat/components/group/"; then
        category="group"
      elif grep -q "$component.tsx" "$PROJECT_ROOT/src/features/chat/components/interface/"; then
        category="interface"
      elif grep -q "$component.tsx" "$PROJECT_ROOT/src/features/chat/components/common/"; then
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
EOL
  
  chmod +x "$IMPORTS_SCRIPT"
  echo "Import update script created: $IMPORTS_SCRIPT"
  echo "Run with --dry-run first to see what changes would be made"
  echo ""
}

# Main execution
create_backup
create_feature_structure
identify_chat_components
categorize_components
generate_migration_plan
create_move_script
create_imports_update_script

echo "============================================="
echo "REORGANIZATION PREPARATION COMPLETE"
echo "============================================="
echo "The following steps have been completed:"
echo "1. Created backup at $BACKUP_DIR"
echo "2. Set up feature-based structure in $CHAT_FEATURE_DIR"
echo "3. Identified and categorized chat components"
echo "4. Generated migration plan: chat-components-migration-plan.md"
echo "5. Created component move script: scripts/development/move-chat-components.sh"
echo "6. Created import update script: scripts/development/update-chat-imports.sh"
echo ""
echo "Next Steps:"
echo "1. Review the migration plan"
echo "2. Run the move script with --dry-run to preview changes"
echo "3. If changes look good, run the move script without --dry-run"
echo "4. Run the import update script with --dry-run to preview changes"
echo "5. If changes look good, run the import update script without --dry-run"
echo "6. Test the application thoroughly"
echo ""
