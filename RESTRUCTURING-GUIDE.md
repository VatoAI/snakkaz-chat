# Snakkaz Chat Restructuring Guide

This document serves as a guide for the restructuring process of the Snakkaz Chat project.

## Overview

The project is being restructured to improve organization, reduce duplication, and make the codebase more maintainable. The restructuring process is divided into several phases:

1. **Analysis**: Analyze the current project structure
2. **Documentation**: Organize documentation into structured categories
3. **Scripts**: Organize scripts into logical groups
4. **Components**: Reorganize components using a feature-based approach

## Restructuring Scripts

The following scripts are available to assist with the restructuring process:

- `scripts/development/analyze-project-structure.sh`: Analyze the current project structure and generate a report
- `scripts/development/organize-documentation.sh`: Organize documentation files
- `scripts/development/organize-scripts.sh`: Organize script files
- `scripts/development/reorganize-chat-components.sh`: Reorganize chat-related components

## New Project Structure

After restructuring, the project will follow this structure:

```
/workspaces/snakkaz-chat/
├── docs/              # All documentation
│   ├── architecture/  # System design and architecture
│   ├── deployment/    # Deployment-related docs
│   ├── features/      # Feature-specific docs
│   └── troubleshooting/ # Error resolution guides
├── scripts/           # All shell scripts
│   ├── deployment/    # Deployment scripts
│   ├── migration/     # Database migration scripts
│   ├── verification/  # Testing and verification
│   └── development/   # Development utilities
├── src/               # Application source code
│   ├── components/    # UI components
│   ├── features/      # Feature modules
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── emoji/
│   │   └── groups/
│   ├── hooks/         # React hooks
│   ├── pages/         # React Router pages
│   └── utils/         # Utility functions
└── bin/               # Symlinks to commonly used scripts
```

## Reverting Changes

If you need to revert the restructuring, a backup has been created at `/workspaces/snakkaz-chat/backup-20250526-111531`.

## Migration Status

Check `RESTRUCTURING-STATUS.md` for the current status of the migration process.
