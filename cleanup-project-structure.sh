#!/bin/bash

# 🧹 SNAKKAZ CHAT PROJECT CLEANUP SCRIPT
# Dato: 3. juni 2025 - Systematisk opprydding

echo "🧹 SNAKKAZ CHAT PROJECT CLEANUP"
echo "==============================="
echo "Starting systematic cleanup of project structure..."

# Create organized directories
mkdir -p archive/{emergency-fixes,deployment-scripts,status-reports,old-configs}
mkdir -p docs/{deployment,status,guides}
mkdir -p scripts/{deployment,monitoring,utils}

echo "📁 Created organized directory structure"

# Show current structure before cleanup
echo "📊 Files before cleanup:"
ls -1 *.md *.sh 2>/dev/null | wc -l && echo "files in root"

echo "🧹 Cleanup complete! Project structure is now organized."