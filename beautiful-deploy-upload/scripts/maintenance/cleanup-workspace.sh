#!/bin/bash
# SNAKKAZ WORKSPACE CLEANUP
echo "🧹 Starting workspace cleanup..."
cd "$(dirname "$0")/../.."
# Remove temporary files
find . -name "*.tmp" -delete
find . -name ".DS_Store" -delete
find . -name "*.backup.*" -mtime +7 -delete
echo "✅ Workspace cleanup completed"
