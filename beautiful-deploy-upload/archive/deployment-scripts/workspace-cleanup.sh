#!/bin/bash

# SNAKKAZ WORKSPACE CLEANUP SCRIPT
# Comprehensive cleanup and organization of workspace files

echo "🧹 SNAKKAZ WORKSPACE CLEANUP STARTING..."
echo "Started at: $(date)"
echo ""

# Create backup before cleanup
BACKUP_DIR="workspace-backup-$(date +%Y%m%d-%H%M)"
echo "📦 Creating backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Function to move files safely
move_to_backup() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "  📄 Backing up: $file"
        cp "$file" "$BACKUP_DIR/"
    fi
}

# Function to organize files into directories
organize_files() {
    echo "🗂️ ORGANIZING FILES INTO PROPER STRUCTURE..."
    
    # Create new directory structure
    mkdir -p scripts/{deployment,maintenance,development,monitoring}
    mkdir -p docs/{technical,user,api}
    mkdir -p config/{vite,supabase,deployment}
    mkdir -p logs/{deployment,errors,performance}
    mkdir -p archive/{old-scripts,old-configs,old-docs}
    mkdir -p backups/{database,files,configs}
    
    echo "✅ Created organized directory structure"
}

# Function to categorize and move scripts
organize_scripts() {
    echo "📜 ORGANIZING SCRIPTS..."
    
    # Deployment scripts
    echo "  Moving deployment scripts..."
    for script in *deploy*.sh *upload*.sh *ftp*.sh emergency-*.sh; do
        if [ -f "$script" ]; then
            move_to_backup "$script"
            mv "$script" scripts/deployment/ 2>/dev/null || true
            echo "    → scripts/deployment/$script"
        fi
    done
    
    # Maintenance scripts  
    echo "  Moving maintenance scripts..."
    for script in *cleanup*.sh *fix*.sh *repair*.sh *backup*.sh; do
        if [ -f "$script" ]; then
            move_to_backup "$script"
            mv "$script" scripts/maintenance/ 2>/dev/null || true
            echo "    → scripts/maintenance/$script"
        fi
    done
    
    # Development scripts
    echo "  Moving development scripts..."
    for script in *dev*.sh *test*.sh *debug*.sh *build*.sh; do
        if [ -f "$script" ]; then
            move_to_backup "$script"
            mv "$script" scripts/development/ 2>/dev/null || true
            echo "    → scripts/development/$script"
        fi
    done
    
    # Monitoring scripts
    echo "  Moving monitoring scripts..."
    for script in *monitor*.sh *check*.sh *status*.sh *health*.sh; do
        if [ -f "$script" ]; then
            move_to_backup "$script"
            mv "$script" scripts/monitoring/ 2>/dev/null || true
            echo "    → scripts/monitoring/$script"
        fi
    done
}

# Function to organize documentation
organize_docs() {
    echo "📚 ORGANIZING DOCUMENTATION..."
    
    # Technical docs
    for doc in *FIX*.md *ERROR*.md *SOLUTION*.md *TECH*.md *ANALYSIS*.md; do
        if [ -f "$doc" ]; then
            move_to_backup "$doc"
            mv "$doc" docs/technical/ 2>/dev/null || true
            echo "    → docs/technical/$doc"
        fi
    done
    
    # User docs
    for doc in README*.md GUIDE*.md USER*.md HELP*.md; do
        if [ -f "$doc" ]; then
            move_to_backup "$doc"
            mv "$doc" docs/user/ 2>/dev/null || true
            echo "    → docs/user/$doc"
        fi
    done
    
    # API docs
    for doc in API*.md MCP*.md SUPABASE*.md; do
        if [ -f "$doc" ]; then
            move_to_backup "$doc"
            mv "$doc" docs/api/ 2>/dev/null || true
            echo "    → docs/api/$doc"
        fi
    done
}

# Function to organize config files
organize_configs() {
    echo "⚙️ ORGANIZING CONFIG FILES..."
    
    # LFTP configs
    for config in *.lftp; do
        if [ -f "$config" ]; then
            move_to_backup "$config"
            mv "$config" config/deployment/ 2>/dev/null || true
            echo "    → config/deployment/$config"
        fi
    done
    
    # JSON configs (except important ones)
    for config in *config*.json babel.config.json components.json; do
        if [ -f "$config" ] && [ "$config" != "package.json" ] && [ "$config" != "tsconfig.json" ]; then
            move_to_backup "$config"
            cp "$config" config/vite/ 2>/dev/null || true
            echo "    → config/vite/$config (copied)"
        fi
    done
}

# Function to organize logs and temporary files
organize_logs() {
    echo "📊 ORGANIZING LOGS AND TEMPORARY FILES..."
    
    # Log files
    for log in *.log deployment-*.log; do
        if [ -f "$log" ]; then
            move_to_backup "$log"
            mv "$log" logs/deployment/ 2>/dev/null || true
            echo "    → logs/deployment/$log"
        fi
    done
    
    # Archive old files
    for old in *backup* *old* *deprecated* *unused* df; do
        if [ -f "$old" ] || [ -d "$old" ]; then
            move_to_backup "$old" 2>/dev/null || true
            mv "$old" archive/ 2>/dev/null || true
            echo "    → archive/$old"
        fi
    done
}

# Function to create master scripts
create_master_scripts() {
    echo "🚀 CREATING MASTER SCRIPTS..."
    
    # Master deployment script
    cat > scripts/deployment/deploy-production.sh << 'EOF'
#!/bin/bash
# SNAKKAZ MASTER PRODUCTION DEPLOYMENT
echo "🚀 Starting production deployment..."
cd "$(dirname "$0")/../.."
npm run build
./scripts/deployment/emergency-react-fix-deploy.sh
./scripts/monitoring/health-check.sh
echo "✅ Production deployment completed"
EOF
    
    # Master cleanup script
    cat > scripts/maintenance/cleanup-workspace.sh << 'EOF'
#!/bin/bash
# SNAKKAZ WORKSPACE CLEANUP
echo "🧹 Starting workspace cleanup..."
cd "$(dirname "$0")/../.."
# Remove temporary files
find . -name "*.tmp" -delete
find . -name ".DS_Store" -delete
find . -name "*.backup.*" -mtime +7 -delete
echo "✅ Workspace cleanup completed"
EOF
    
    # Master health check script
    cat > scripts/monitoring/health-check.sh << 'EOF'
#!/bin/bash
# SNAKKAZ SYSTEM HEALTH CHECK
echo "🏥 Starting system health check..."
echo "Build status: $([ -d dist ] && echo "✅ Ready" || echo "❌ Missing")"
echo "FTP status: $(timeout 5 lftp -e "open ftp://ftp.snakkaz.com; quit" 2>/dev/null && echo "✅ Connected" || echo "❌ Failed")"
echo "Website status: $(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com)"
echo "✅ Health check completed"
EOF
    
    # Make scripts executable
    chmod +x scripts/deployment/*.sh
    chmod +x scripts/maintenance/*.sh
    chmod +x scripts/monitoring/*.sh
    
    echo "✅ Created master scripts"
}

# Function to generate cleanup report
generate_report() {
    echo "📋 GENERATING CLEANUP REPORT..."
    
    cat > CLEANUP-REPORT-$(date +%Y%m%d-%H%M).md << EOF
# 🧹 SNAKKAZ WORKSPACE CLEANUP REPORT
**Completed at:** $(date)

## 📊 STATISTICS
- **Total files before:** $(find $BACKUP_DIR -type f | wc -l)
- **Scripts organized:** $(find scripts -name "*.sh" | wc -l)
- **Docs organized:** $(find docs -name "*.md" | wc -l)
- **Configs organized:** $(find config -name "*" -type f | wc -l)

## 🗂️ NEW STRUCTURE
\`\`\`
$(tree -L 3 | head -30)
\`\`\`

## 📦 BACKUP LOCATION
All original files backed up to: \`$BACKUP_DIR/\`

## 🚀 MASTER SCRIPTS CREATED
- \`scripts/deployment/deploy-production.sh\` - Full production deployment
- \`scripts/maintenance/cleanup-workspace.sh\` - Regular cleanup
- \`scripts/monitoring/health-check.sh\` - System health check

## 🎯 NEXT STEPS
1. Test master scripts
2. Setup GitHub Actions
3. Create admin dashboard
4. Configure automated backups

## 🔗 QUICK ACCESS
- **Deploy:** \`./scripts/deployment/deploy-production.sh\`
- **Cleanup:** \`./scripts/maintenance/cleanup-workspace.sh\`
- **Health:** \`./scripts/monitoring/health-check.sh\`
EOF
    
    echo "✅ Cleanup report generated"
}

# Main execution
main() {
    echo "🚀 Starting comprehensive workspace cleanup..."
    
    organize_files
    organize_scripts
    organize_docs
    organize_configs
    organize_logs
    create_master_scripts
    generate_report
    
    echo ""
    echo "🎉 WORKSPACE CLEANUP COMPLETED!"
    echo ""
    echo "📊 SUMMARY:"
    echo "  ✅ Files organized into proper structure"
    echo "  ✅ Scripts categorized and moved"
    echo "  ✅ Documentation organized"
    echo "  ✅ Master scripts created"
    echo "  ✅ Backup created: $BACKUP_DIR"
    echo ""
    echo "🚀 NEXT: Setup GitHub Actions"
    echo "   Run: ./scripts/development/setup-github-actions.sh"
    echo ""
    echo "📋 Full report: CLEANUP-REPORT-$(date +%Y%m%d-%H%M).md"
}

# Execute main function
main
