# Supabase Preview for Snakkaz Chat

This document provides information on how to use Supabase preview environments for local development and testing.

## Local Development with Supabase

For local development, you can run Supabase locally using the following commands:

```bash
# Initialize Supabase project (first time only)
npm run supabase:setup

# Start local Supabase instance
npm run supabase:start

# Run the application with local Supabase
npm run dev:with-supabase

# Check status of local Supabase
npm run supabase:status

# Stop local Supabase instance
npm run supabase:stop
```

## Preview Environments for Pull Requests

When a pull request is created against the main branch, GitHub Actions will automatically create a Supabase preview branch. This provides an isolated test environment specific to that pull request.

### How to Use Preview Environments:

1. Create a pull request against the main branch
2. GitHub Actions will create a Supabase preview branch
3. A comment on the pull request will contain instructions on how to connect to the preview environment
4. When the pull request is closed, the preview branch will be automatically deleted

### Manual Setup of Preview:

```bash
# Link to existing Supabase project
./supabase-preview.sh link
# Follow the instructions and enter your project reference ID when prompted

# Run the application with the preview branch environment
SUPABASE_BRANCH=branch-name npm run dev
```

### Managing Database Schema:

```bash
# Pull schema from remote project
./supabase-preview.sh db-pull

# Push local changes to remote project
./supabase-preview.sh db-push

# Reset local database (deletes data!)
./supabase-preview.sh db-reset
```

## Required GitHub Secrets

For the Supabase preview workflow to function properly, the following secrets must be set in your GitHub repository:

- `SUPABASE_ACCESS_TOKEN`: Your Supabase access token
- `SUPABASE_PROJECT_ID`: Your Supabase project ID

You can obtain these from your Supabase dashboard.

## Troubleshooting

If you encounter issues with the Supabase preview:

1. Ensure Docker is running (required for local Supabase)
2. Check that all necessary GitHub secrets are configured
3. Verify that the Supabase CLI is executable (`chmod +x supabase`)
4. Try running `./supabase-preview.sh status` to check the current state

For more help, see the [Supabase CLI documentation](https://supabase.com/docs/reference/cli).
