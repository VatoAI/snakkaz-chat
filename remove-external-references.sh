#!/bin/bash

# remove-external-references.sh
# Script to remove any remaining references to Lovable and GPT Engineer
# Created: 25 May 2025

echo "🧹 Beginning cleanup of external references..."

# Define directories to search
SRC_DIR="/workspaces/snakkaz-chat/src"
PUBLIC_DIR="/workspaces/snakkaz-chat/public"
DIST_DIR="/workspaces/snakkaz-chat/dist"

# Define terms to search for
TERMS=(
  "lovable\.dev"
  "gpteng\.co"
  "cdn\.gpteng"
  "gpt\-engineer"
  "lovable\/cdn"
)

# Print colorful output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Searching for external references in source files...${NC}"
for term in "${TERMS[@]}"; do
  count=$(grep -r "$term" --include="*.{ts,tsx,js,jsx,html,css,md}" $SRC_DIR | wc -l)
  if [ "$count" -gt 0 ]; then
    echo -e "${RED}Found $count references to $term in source files${NC}"
    grep -r "$term" --include="*.{ts,tsx,js,jsx,html,css,md}" $SRC_DIR
  else
    echo -e "${GREEN}No references to $term found in source files${NC}"
  fi
done

if [ -d "$DIST_DIR" ]; then
  echo -e "\n${BLUE}Searching for external references in build files...${NC}"
  for term in "${TERMS[@]}"; do
    count=$(grep -r "$term" --include="*.{js,html,css}" $DIST_DIR | wc -l)
    if [ "$count" -gt 0 ]; then
      echo -e "${RED}Found $count references to $term in build files${NC}"
      grep -r "$term" --include="*.{js,html,css}" $DIST_DIR
    else
      echo -e "${GREEN}No references to $term found in build files${NC}"
    fi
  done
fi

echo -e "\n${BLUE}Searching for external references in public files...${NC}"
for term in "${TERMS[@]}"; do
  count=$(grep -r "$term" --include="*.{html,js,css}" $PUBLIC_DIR | wc -l)
  if [ "$count" -gt 0 ]; then
    echo -e "${RED}Found $count references to $term in public files${NC}"
    grep -r "$term" --include="*.{html,js,css}" $PUBLIC_DIR
  else
    echo -e "${GREEN}No references to $term found in public files${NC}"
  fi
done

echo -e "\n${BLUE}Checking for external domains in configuration files...${NC}"
config_files=$(find $SRC_DIR -name "*.config.*" -o -name "*.json" | grep -v "node_modules")
for file in $config_files; do
  references=0
  for term in "${TERMS[@]}"; do
    if grep -q "$term" "$file"; then
      echo -e "${RED}Found references to $term in $file${NC}"
      grep "$term" "$file"
      references=1
    fi
  done
  if [ "$references" -eq 0 ]; then
    echo -e "${GREEN}No external references found in $(basename $file)${NC}"
  fi
done

echo -e "\n${YELLOW}===== Summary =====${NC}"
total_references=0
for term in "${TERMS[@]}"; do
  count=$(grep -r "$term" --include="*.{ts,tsx,js,jsx,html,css,md,json}" --exclude-dir="node_modules" /workspaces/snakkaz-chat | wc -l)
  total_references=$((total_references + count))
  if [ "$count" -gt 0 ]; then
    echo -e "${RED}$term: $count references${NC}"
  else
    echo -e "${GREEN}$term: Clean${NC}"
  fi
done

if [ "$total_references" -eq 0 ]; then
  echo -e "\n${GREEN}✅ No external references found in the project!${NC}"
else
  echo -e "\n${RED}❌ Found $total_references external references that should be removed${NC}"
fi

echo -e "\n${BLUE}Cleanup tips:${NC}"
echo "1. For source files, edit them directly to remove references"
echo "2. For build files, clean the references in source and rebuild"
echo "3. Check environment variables for any external URLs"
echo "4. Double-check the CSP configuration"
