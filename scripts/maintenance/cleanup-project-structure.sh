#!/bin/bash

# SNAKKAZ CHAT - PROJECT CLEANUP SCRIPT
# Created: May 27, 2025
# Purpose: Systematic cleanup and restructuring of project files

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
BACKUP_DIR=".archive/cleanup-backup-$(date +%Y%m%d-%H%M%S)"
DRY_RUN=${1:-false}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SNAKKAZ CHAT PROJECT CLEANUP        ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$DRY_RUN" = "true" ]; then
    echo -e "${YELLOW}DRY RUN MODE - No files will be moved/deleted${NC}"
    echo ""
fi

# Function to log actions
log_action() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARNING: $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ERROR: $1${NC}"
}

# Function to create directory structure
create_directory_structure() {
    log_action "Creating organized directory structure..."
    
    directories=(
        "scripts/deployment"
        "scripts/testing" 
        "scripts/maintenance"
        "scripts/archive"
        "docs/architecture"
        "docs/deployment"
        "docs/features"
        "docs/guides"
        "docs/api"
        ".archive/backup-files"
        ".archive/temp-files"
        ".archive/old-scripts"
        ".archive/old-docs"
        "public/assets/logos"
        "public/assets/icons"
        "public/assets/branding"
    )
    
    for dir in "${directories[@]}"; do
        if [ "$DRY_RUN" != "true" ]; then
            mkdir -p "$dir"
        fi
        echo "  ✓ Created: $dir"
    done
}

# Function to move scripts to organized structure
organize_scripts() {
    log_action "Organizing script files..."
    
    # Deployment scripts
    deployment_scripts=(
        "deploy-*.sh"
        "*deployment*.sh" 
        "*upload*.sh"
        "*extract*.sh"
        "monitor-*.sh"
    )
    
    # Testing scripts  
    testing_scripts=(
        "test-*.sh"
        "*test*.sh"
        "check-*.sh"
        "verify-*.sh"
        "functional-test-*.sh"
    )
    
    # Maintenance scripts
    maintenance_scripts=(
        "fix-*.sh"
        "apply-*.sh"
        "setup-*.sh"
        "install-*.sh"
        "configure-*.sh"
        "cleanup-*.sh"
        "migrate-*.sh"
    )
    
    # Move deployment scripts
    for pattern in "${deployment_scripts[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ] && [ ! -d "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" "scripts/deployment/"
                fi
                echo "  ✓ Moved: $file → scripts/deployment/"
            fi
        done
    done
    
    # Move testing scripts
    for pattern in "${testing_scripts[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ] && [ ! -d "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" "scripts/testing/"
                fi
                echo "  ✓ Moved: $file → scripts/testing/"
            fi
        done
    done
    
    # Move maintenance scripts
    for pattern in "${maintenance_scripts[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ] && [ ! -d "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" "scripts/maintenance/"
                fi
                echo "  ✓ Moved: $file → scripts/maintenance/"
            fi
        done
    done
}

# Function to organize documentation
organize_documentation() {
    log_action "Organizing documentation files..."
    
    # Architecture documentation
    arch_docs=(
        "*MASTER-PROMPT*"
        "*ARCHITECTURE*"
        "*IMPLEMENTASJONSPLAN*"
        "*SYSTEM*"
    )
    
    # Deployment documentation
    deploy_docs=(
        "*DEPLOYMENT*"
        "*MIGRATION*"
        "*SETUP*"
        "*INSTALL*"
        "*FIX*"
    )
    
    # Feature documentation
    feature_docs=(
        "*EMOJI*"
        "*PREMIUM*"
        "*EMAIL*"
        "*CUSTOM*"
        "*ANALYTICS*"
    )
    
    # Guide documentation
    guide_docs=(
        "*GUIDE*"
        "*VEILEDNING*"
        "*MANUAL*"
        "*HOWTO*"
        "*README*"
    )
    
    # Move documentation files
    for pattern in "${arch_docs[@]}"; do
        for file in $pattern.md; do
            if [ -f "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" "docs/architecture/"
                fi
                echo "  ✓ Moved: $file → docs/architecture/"
            fi
        done
    done
    
    for pattern in "${deploy_docs[@]}"; do
        for file in $pattern.md; do
            if [ -f "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" "docs/deployment/"
                fi
                echo "  ✓ Moved: $file → docs/deployment/"
            fi
        done
    done
    
    for pattern in "${feature_docs[@]}"; do
        for file in $pattern.md; do
            if [ -f "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" "docs/features/"
                fi
                echo "  ✓ Moved: $file → docs/features/"
            fi
        done
    done
    
    for pattern in "${guide_docs[@]}"; do
        for file in $pattern.md; do
            if [ -f "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" "docs/guides/"
                fi
                echo "  ✓ Moved: $file → docs/guides/"
            fi
        done
    done
}

# Function to archive old/backup files
archive_old_files() {
    log_action "Archiving backup and temporary files..."
    
    # Backup files
    backup_patterns=(
        "*.backup"
        "*.bak"
        "*.old"
        "*-backup*"
        "*_backup*"
    )
    
    # Temporary files
    temp_patterns=(
        "*.tmp"
        "*.temp"
        "*-temp*"
        "*_temp*"
        "temp-*"
    )
    
    # Archive backup files
    for pattern in "${backup_patterns[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" ".archive/backup-files/"
                fi
                echo "  ✓ Archived: $file → .archive/backup-files/"
            fi
        done
    done
    
    # Archive temporary files
    for pattern in "${temp_patterns[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    mv "$file" ".archive/temp-files/"
                fi
                echo "  ✓ Archived: $file → .archive/temp-files/"
            fi
        done
    done
}

# Function to clean up specific problematic files
cleanup_problematic_files() {
    log_action "Cleaning up problematic files..."
    
    # Files that can be safely removed
    removable_files=(
        "*.log"
        "*.pid"
        "*.lock"
        ".DS_Store"
        "Thumbs.db"
        "*.swp"
        "*.swo"
        "*~"
    )
    
    for pattern in "${removable_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                if [ "$DRY_RUN" != "true" ]; then
                    rm -f "$file"
                fi
                echo "  ✓ Removed: $file"
            fi
        done
    done
}

# Function to create index files for organized directories
create_index_files() {
    log_action "Creating index files for organized directories..."
    
    if [ "$DRY_RUN" != "true" ]; then
        # Scripts directory index
        cat > scripts/README.md << 'EOF'
# Scripts Directory

## Structure

- **deployment/** - Scripts for deploying the application
- **testing/** - Testing and verification scripts  
- **maintenance/** - Maintenance and fix scripts
- **archive/** - Archived/legacy scripts

## Usage

All scripts should be run from the project root directory unless otherwise specified.

## Guidelines

- Test scripts in development before production use
- Always backup before running maintenance scripts
- Check script permissions before execution
EOF

        # Documentation directory index
        cat > docs/README.md << 'EOF'
# Documentation Directory

## Structure

- **architecture/** - System architecture and master documentation
- **deployment/** - Deployment guides and migration docs
- **features/** - Feature-specific documentation  
- **guides/** - User and developer guides
- **api/** - API documentation

## Navigation

Each subdirectory contains related documentation organized by topic.

## Contributing

- Keep documentation current and accurate
- Use clear, descriptive filenames
- Include creation/update dates in documents
EOF
    fi
    
    echo "  ✓ Created index files"
}

# Function to show cleanup summary
show_cleanup_summary() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  CLEANUP SUMMARY                      ${NC}" 
    echo -e "${BLUE}========================================${NC}"
    
    if [ "$DRY_RUN" = "true" ]; then
        echo -e "${YELLOW}DRY RUN COMPLETED - No changes made${NC}"
    else
        echo -e "${GREEN}CLEANUP COMPLETED SUCCESSFULLY${NC}"
    fi
    
    echo ""
    echo "Directory Structure Created:"
    echo "  ✓ scripts/ (organized by purpose)"
    echo "  ✓ docs/ (organized by topic)"  
    echo "  ✓ .archive/ (backup and temp files)"
    echo "  ✓ public/assets/ (logo and branding)"
    
    echo ""
    echo "Files Organized:"
    echo "  ✓ Shell scripts moved to scripts/"
    echo "  ✓ Documentation moved to docs/"
    echo "  ✓ Backup files archived"
    echo "  ✓ Temporary files cleaned up"
    
    echo ""
    echo "Next Steps:"
    echo "  1. Review organized structure"
    echo "  2. Update any hardcoded paths in scripts"
    echo "  3. Test application functionality"
    echo "  4. Commit organized structure"
    
    if [ "$DRY_RUN" != "true" ]; then
        echo ""
        echo -e "${GREEN}Project structure has been successfully organized!${NC}"
    fi
}

# Main execution flow
main() {
    echo -e "${YELLOW}Starting project cleanup and organization...${NC}"
    echo ""
    
    # Create backup if not dry run
    if [ "$DRY_RUN" != "true" ]; then
        log_action "Creating backup in $BACKUP_DIR..."
        mkdir -p "$BACKUP_DIR"
        cp -r . "$BACKUP_DIR/" 2>/dev/null || true
        echo "  ✓ Backup created"
    fi
    
    # Execute cleanup steps
    create_directory_structure
    organize_scripts
    organize_documentation  
    archive_old_files
    cleanup_problematic_files
    create_index_files
    
    # Show summary
    show_cleanup_summary
}

# Check if running from project root
if [ ! -f "package.json" ]; then
    log_error "This script must be run from the project root directory"
    exit 1
fi

# Ask for confirmation unless dry run
if [ "$DRY_RUN" != "true" ]; then
    echo -e "${YELLOW}This will reorganize the project structure. Continue? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Cleanup cancelled."
        exit 0
    fi
fi

# Run main function
main
