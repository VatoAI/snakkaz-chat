# SnakkaZ Supabase Integration Guide

This guide provides instructions for working with Supabase in the SnakkaZ chat application.

## Table of Contents

1. [Database Schema](#database-schema)
2. [Local Development](#local-development)
3. [Schema Management](#schema-management)
4. [Security Best Practices](#security-best-practices)
5. [Troubleshooting](#troubleshooting)

## Database Schema

SnakkaZ uses the following key tables in Supabase:

### `chat_rooms` Table

- `id`: UUID (Primary Key)
- `name`: Text (Room name)
- `description`: Text (Optional description)
- `room_type`: Text ('public', 'private', or 'direct')
- `created_by`: UUID (References profiles.id)
- `is_active`: Boolean (Whether the room is active)
- `webrtc_enabled`: Boolean (Whether WebRTC is enabled)
- `e2ee_enabled`: Boolean (Whether end-to-end encryption is enabled)

### `mcp_connections` Table

- `id`: UUID (Primary Key)
- `profile_id`: UUID (References profiles.id)
- `connection_id`: Text (Unique connection identifier)
- `connection_type`: Text ('websocket', 'webrtc', or 'fallback')
- `is_active`: Boolean (Whether the connection is active)
- `server_endpoint`: Text (Server URL)
- `last_heartbeat`: Timestamp (Last activity time)

## Local Development

### Setting Up Local Environment

1. Install the Supabase CLI:

   ```bash
   npm install supabase --save-dev
   ```

2. Run the setup script:

   ```bash
   npm run supabase:setup-local
   ```

3. Access your local Supabase dashboard:

   ```text
   http://localhost:54323
   ```

### Working Locally

Start the local Supabase instance:

```bash
npm run supabase:start
```

Run the application with local Supabase:

```bash
npm run dev:with-supabase
```

Stop the local Supabase instance:

```bash
npm run supabase:stop
```

## Schema Management

### Fix Database Schema Issues

If you encounter issues with missing tables or relationships, run:

```bash
npm run db:fix
```

This script requires the following environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key

### API Schema Setup

For production-grade security, it's recommended to use the `api` schema instead of the `public` schema. To set this up:

1. Run the API schema setup script:

   ```bash
   export SUPABASE_URL="your-project-url"
   export SUPABASE_SERVICE_KEY="your-service-role-key"
   ./scripts/setup-api-schema.sh
   ```

2. In the Supabase dashboard, go to API Settings and:
   - Add 'api' to 'Exposed schemas'
   - Remove 'public' from 'Exposed schemas' (after ensuring your app uses 'api')

### Backup and Restore

Create a database backup:

```bash
npm run db:backup
```

Backups are stored in the `supabase/backups` directory with timestamped filenames.

## Security Best Practices

1. **Never commit API keys to your repository**
   - Use environment variables or secure storage for sensitive keys
   - If you accidentally expose a service key, regenerate it immediately

2. **Use Row Level Security (RLS) policies**
   - Ensure all tables have appropriate RLS policies
   - Test policies thoroughly to prevent data leakage

3. **Schema Security**
   - Use the 'api' schema instead of 'public' for production
   - Control which tables are exposed through the API

4. **Regular Security Audits**
   - Periodically review table permissions
   - Check for exposed sensitive data

## Troubleshooting

### Common Issues

1. **Missing Tables Error**
   - Error: `relation "public.chat_rooms" does not exist`
   - Solution: Run `npm run db:fix` to create missing tables

2. **Relationship Error**
   - Error: `Could not find a relationship between 'chat_rooms' and 'created_by'`
   - Solution: Ensure proper foreign keys are set up

3. **Authentication Issues**
   - Check if your Supabase URL and anon key are correctly configured
   - Verify your user has appropriate permissions

4. **Local Development Issues**
   - Ensure Docker is running
   - Check if ports 54321-54323 are available
   - Run `npx supabase status` to check service health

For additional help, refer to the [official Supabase documentation](https://supabase.com/docs).
