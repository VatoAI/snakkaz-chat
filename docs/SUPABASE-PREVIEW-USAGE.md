# Supabase Preview Environment Documentation

## Overview

This document explains how to work with Supabase preview environments in the Snakkaz Chat application. Preview environments allow you to test database changes in isolation before merging them to the main branch.

## What is a Supabase Preview Branch?

A Supabase preview branch is a temporary copy of your database that's created for testing purposes. Each pull request can have its own isolated preview branch, allowing developers to test database changes without affecting the main database.

## How Preview Branches are Created

1. **Automatic Creation**: When you create a pull request against the main branch, GitHub Actions will automatically create a Supabase preview branch.
2. **Branch Naming**: Preview branches are named using the pattern `pr-{number}`, where `{number}` is the pull request number.

## Using Preview Environments

### Via GitHub Pull Requests

1. Create a pull request against the main branch
2. GitHub Actions will create a Supabase preview branch
3. A comment on the pull request will contain instructions on how to connect to the preview environment
4. When the pull request is closed, the preview branch will be automatically deleted

### Via URL Parameters

You can access a preview branch by adding a `supabase_branch` parameter to the URL:

```
https://www.snakkaz.com/?supabase_branch=pr-123
```

### Via Developer Tools

In development mode, there's a developer tools panel that can be used to switch between different preview branches:

1. Click the developer tools button in the bottom right corner of the screen
2. Enter the name of the preview branch (e.g., `pr-123`)
3. Click "Switch Branch" to switch to that branch
4. The page will reload with the new preview branch

## Preview Environment Indicators

When you're connected to a preview environment, you'll see:

1. A banner at the bottom of the screen indicating that you're using a preview environment
2. In development mode, the developer tools button will show a pulsing indicator

## Technical Implementation Details

### Files and Components

- `src/utils/supabase/preview-fix.ts` - Core functionality for handling preview branches
- `src/components/preview/PreviewIndicator.tsx` - UI components for indicating preview status
- `src/components/preview/PreviewSwitcher.tsx` - UI component for switching between branches
- `src/components/preview/DeveloperTools.tsx` - Developer tools panel

### Key Functions

- `initializePreview()` - Initialize the preview environment (call at app startup)
- `applyPreviewFixes()` - Apply fixes for preview environments
- `loadPreviewBranch(branchName)` - Load a specific preview branch
- `getPreviewInfo()` - Get information about the current preview branch
- `shouldShowPreviewNotice()` - Check if preview notice should be shown
- `createPreviewUrl(baseUrl)` - Create a URL with the preview branch parameter

## Testing Preview Environments Locally

1. Start your local development server:
   ```bash
   npm run dev
   ```

2. Open your application and access the developer tools panel by clicking the button in the bottom right corner

3. Enter a preview branch name (e.g., `pr-123`) and click "Switch Branch"

4. The page will reload connected to the specified preview branch

## Troubleshooting

### Preview Branch Not Found

If you try to connect to a preview branch that doesn't exist, you'll see an error in the developer tools panel. Make sure the branch exists and that you're using the correct name.

### Connection Issues

If you're having trouble connecting to a preview branch, check:

1. That the branch exists
2. That you have permission to access it
3. That your Supabase configuration is correct
4. That the branch hasn't been deleted (after PR closure)

## Best Practices

1. Always use the developer tools panel to switch between preview branches
2. Test changes thoroughly in preview environments before merging
3. Remember to switch back to the main branch after testing
4. Don't rely on preview branches for production data - they're temporary and will be deleted
