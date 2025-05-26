#!/bin/bash

# Project Code Analyzer for Snakkaz Chat
# This script analyzes the project for duplicate files, components, and utilities
# Usage: ./analyze-project-structure.sh

echo "============================================="
echo "SNAKKAZ CHAT PROJECT STRUCTURE ANALYSIS TOOL"
echo "============================================="
echo "Starting analysis on $(date)"
echo ""

PROJECT_ROOT="/workspaces/snakkaz-chat"
OUTPUT_FILE="$PROJECT_ROOT/project-analysis-report.md"

# Initialize the report file
cat > "$OUTPUT_FILE" << EOL
# Snakkaz Chat Project Structure Analysis Report
Generated on $(date)

## Overview
This report analyzes the current project structure to identify areas for improvement,
duplicate files, and potential consolidation points.

EOL

# Function to find duplicate file names across the project
find_duplicate_filenames() {
  echo "## Duplicate File Names" >> "$OUTPUT_FILE"
  echo "The following file names appear in multiple locations:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "Finding duplicate file names..."
  find "$PROJECT_ROOT/src" -type f -name "*.tsx" -o -name "*.ts" | sed 's|.*/||' | sort | uniq -c | sort -nr | grep -v "^      1 " > /tmp/duplicate_filenames.txt
  
  if [ -s /tmp/duplicate_filenames.txt ]; then
    echo "| Count | Filename |" >> "$OUTPUT_FILE"
    echo "|-------|----------|" >> "$OUTPUT_FILE"
    while read -r line; do
      count=$(echo "$line" | awk '{print $1}')
      filename=$(echo "$line" | awk '{print $2}')
      echo "| $count | $filename |" >> "$OUTPUT_FILE"
      
      echo "" >> "$OUTPUT_FILE"
      echo "### Locations of '$filename':" >> "$OUTPUT_FILE"
      find "$PROJECT_ROOT/src" -name "$filename" | sort | while read -r filepath; do
        rel_path="${filepath#$PROJECT_ROOT/}"
        echo "- \`$rel_path\`" >> "$OUTPUT_FILE"
      done
      echo "" >> "$OUTPUT_FILE"
    done < /tmp/duplicate_filenames.txt
  else
    echo "No duplicate file names found." >> "$OUTPUT_FILE"
  fi
}

# Function to analyze component prefixes and potential groupings
analyze_component_prefixes() {
  echo "## Component Prefix Analysis" >> "$OUTPUT_FILE"
  echo "Components with similar prefixes that could be grouped together:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "Analyzing component prefixes..."
  # Get all component filenames
  find "$PROJECT_ROOT/src" -name "*.tsx" | sed 's|.*/||' | sort > /tmp/all_components.txt
  
  # Extract common prefixes
  cat /tmp/all_components.txt | sed 's/\([A-Z][a-z]*\)[A-Z].*\.tsx/\1/' | sort | uniq -c | sort -nr > /tmp/component_prefixes.txt
  
  echo "| Prefix | Count | Example Components |" >> "$OUTPUT_FILE"
  echo "|--------|-------|-------------------|" >> "$OUTPUT_FILE"
  
  while read -r line; do
    count=$(echo "$line" | awk '{print $1}')
    prefix=$(echo "$line" | awk '{print $2}')
    
    # Skip if count is 1 or prefix is too short
    if [ "$count" -le 1 ] || [ ${#prefix} -le 2 ]; then
      continue
    fi
    
    # Get example components for this prefix
    examples=$(grep "^$prefix" /tmp/all_components.txt | head -3 | tr '\n' ', ' | sed 's/,$//')
    
    echo "| $prefix | $count | $examples |" >> "$OUTPUT_FILE"
  done < /tmp/component_prefixes.txt
  
  echo "" >> "$OUTPUT_FILE"
}

# Function to detect potential code duplication in chat components
analyze_chat_components() {
  echo "## Chat Component Analysis" >> "$OUTPUT_FILE"
  echo "Analyzing potential duplication in chat-related components:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "Looking for chat components in multiple directories..."
  
  # Find all directories containing chat components
  chat_dirs=$(find "$PROJECT_ROOT/src" -type d -path "*/chat*" -o -path "*/Chat*")
  
  echo "### Chat-related Directories" >> "$OUTPUT_FILE"
  echo "The following directories contain chat-related components:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  for dir in $chat_dirs; do
    rel_dir="${dir#$PROJECT_ROOT/}"
    component_count=$(find "$dir" -name "*.tsx" | wc -l)
    echo "- \`$rel_dir\` ($component_count components)" >> "$OUTPUT_FILE"
  done
  
  echo "" >> "$OUTPUT_FILE"
  echo "### Potential Component Consolidation" >> "$OUTPUT_FILE"
  echo "Components with similar functionality that might be consolidated:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  # List of common chat component patterns to look for
  patterns=("ChatInterface" "ChatMessage" "ChatList" "ChatInput" "MessageList")
  
  for pattern in "${patterns[@]}"; do
    echo "#### $pattern Components" >> "$OUTPUT_FILE"
    find "$PROJECT_ROOT/src" -name "*${pattern}*.tsx" | sort | while read -r filepath; do
      rel_path="${filepath#$PROJECT_ROOT/}"
      echo "- \`$rel_path\`" >> "$OUTPUT_FILE"
    done
    echo "" >> "$OUTPUT_FILE"
  done
}

# Function to analyze emoji system for organization patterns
analyze_emoji_system() {
  echo "## Emoji System Analysis" >> "$OUTPUT_FILE"
  echo "The emoji system appears more organized. This analyzes its structure as a potential model:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "Analyzing emoji system organization..."
  
  echo "### Emoji System Components" >> "$OUTPUT_FILE"
  find "$PROJECT_ROOT/src/components/emoji" -name "*.tsx" | sort | while read -r filepath; do
    rel_path="${filepath#$PROJECT_ROOT/}"
    echo "- \`$rel_path\`" >> "$OUTPUT_FILE"
  done
  echo "" >> "$OUTPUT_FILE"
  
  echo "### Emoji System Utils" >> "$OUTPUT_FILE"
  find "$PROJECT_ROOT/src/utils" -name "*emoji*.ts" | sort | while read -r filepath; do
    rel_path="${filepath#$PROJECT_ROOT/}"
    echo "- \`$rel_path\`" >> "$OUTPUT_FILE"
  done
  echo "" >> "$OUTPUT_FILE"
  
  echo "### Proposed Feature-based Structure for Emoji System" >> "$OUTPUT_FILE"
  echo '```
src/features/emoji/
├── components/
│   ├── EmojiSearch.tsx
│   ├── EmojiAnalytics.tsx
│   ├── EmojiPackBrowser.tsx
│   ├── CustomEmojiManager.tsx
│   └── CustomEmojiUploader.tsx
├── hooks/
│   └── useCustomEmojis.ts
├── utils/
│   ├── emojiSearchUtils.ts
│   ├── emojiAnalyticsUtils.ts
│   ├── emojiPackUtils.ts
│   └── customEmojiUtils.ts
├── types.ts
└── index.ts
```' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
}

# Function to analyze scripts and documentation
analyze_scripts_and_docs() {
  echo "## Scripts and Documentation Analysis" >> "$OUTPUT_FILE"
  echo "Analysis of scripts and documentation files that could be better organized:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "Counting documentation files in root directory..."
  md_count=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*.md" | wc -l)
  
  echo "### Documentation Files" >> "$OUTPUT_FILE"
  echo "There are $md_count documentation (.md) files in the root directory." >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  # Group documentation by content type
  echo "#### Documentation Categories" >> "$OUTPUT_FILE"
  echo "Suggested categories for documentation organization:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "| Category | Files |" >> "$OUTPUT_FILE"
  echo "|----------|-------|" >> "$OUTPUT_FILE"
  
  # Emoji System Docs
  emoji_docs=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*EMOJI*.md" -o -name "*emoji*.md" | wc -l)
  echo "| Emoji System | $emoji_docs files |" >> "$OUTPUT_FILE"
  
  # Deployment Docs
  deployment_docs=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*DEPLOY*.md" -o -name "*deploy*.md" | wc -l)
  echo "| Deployment | $deployment_docs files |" >> "$OUTPUT_FILE"
  
  # Scripts Analysis
  echo "" >> "$OUTPUT_FILE"
  echo "### Scripts Analysis" >> "$OUTPUT_FILE"
  script_count=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*.sh" | wc -l)
  echo "There are $script_count shell scripts (.sh) in the root directory." >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  # Group scripts by functionality
  echo "#### Script Categories" >> "$OUTPUT_FILE"
  echo "Suggested categories for script organization:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "| Category | Files |" >> "$OUTPUT_FILE"
  echo "|----------|-------|" >> "$OUTPUT_FILE"
  
  # Deployment scripts
  deployment_scripts=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*deploy*.sh" -o -name "*upload*.sh" | wc -l)
  echo "| Deployment | $deployment_scripts files |" >> "$OUTPUT_FILE"
  
  # Verification scripts
  verify_scripts=$(find "$PROJECT_ROOT" -maxdepth 1 -name "verify*.sh" -o -name "check*.sh" | wc -l)
  echo "| Verification | $verify_scripts files |" >> "$OUTPUT_FILE"
  
  # Migration scripts
  migration_scripts=$(find "$PROJECT_ROOT" -maxdepth 1 -name "*migrate*.sh" -o -name "*migration*.sh" -o -name "*apply*.sh" | wc -l)
  echo "| Migration | $migration_scripts files |" >> "$OUTPUT_FILE"
}

# Function to provide recommendations
generate_recommendations() {
  echo "## Recommendations" >> "$OUTPUT_FILE"
  echo "Based on the analysis, here are the recommended steps for restructuring:" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "### 1. Consolidate Chat Components" >> "$OUTPUT_FILE"
  echo "Move all chat-related components into a unified structure:" >> "$OUTPUT_FILE"
  echo '```
src/features/chat/
├── components/
│   ├── global/      # Global chat components
│   ├── private/     # Private chat components
│   ├── group/       # Group chat components
│   └── common/      # Shared components
├── hooks/
├── services/
└── utils/
```' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "### 2. Organize Documentation" >> "$OUTPUT_FILE"
  echo "Move documentation to categorized folders:" >> "$OUTPUT_FILE"
  echo '```
docs/
├── architecture/     # System design docs
├── deployment/       # Deployment guides
├── features/         # Feature documentation
│   └── emoji/        # Emoji system docs
└── troubleshooting/  # Error resolution guides
```' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "### 3. Restructure Scripts" >> "$OUTPUT_FILE"
  echo "Organize scripts by their purpose:" >> "$OUTPUT_FILE"
  echo '```
scripts/
├── deployment/      # Deployment scripts
├── migration/       # Database migration scripts
├── verification/    # Verification and testing scripts
└── development/     # Development utility scripts
```' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "### 4. Use the Emoji System as a Model" >> "$OUTPUT_FILE"
  echo "The emoji system's organization can serve as a model for other features:" >> "$OUTPUT_FILE"
  echo "- Clear separation of components, utilities, and hooks" >> "$OUTPUT_FILE"
  echo "- Consistent naming conventions" >> "$OUTPUT_FILE"
  echo "- Feature-based organization" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  echo "### 5. Update Import Paths" >> "$OUTPUT_FILE"
  echo "After restructuring, update import paths throughout the codebase:" >> "$OUTPUT_FILE"
  echo "1. Create a script to handle common path updates" >> "$OUTPUT_FILE"
  echo "2. Test incrementally to avoid breaking functionality" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
}

# Run all analysis functions
echo "Running analysis functions..."
find_duplicate_filenames
analyze_component_prefixes
analyze_chat_components
analyze_emoji_system
analyze_scripts_and_docs
generate_recommendations

echo "Analysis complete! Report saved to: $OUTPUT_FILE"
echo "You can review the report to identify areas for restructuring and consolidation."
