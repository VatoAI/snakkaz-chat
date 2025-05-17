-- Script to enable leaked password protection in Supabase Auth

-- This SQL script enables the leaked password protection feature
-- This must be run with Supabase dashboard or using the CLI on the Auth settings

/*
To enable this feature using the Supabase dashboard:
1. Go to Authentication > Settings
2. Scroll down to the "Security" section
3. Enable "Enable HaveIBeenPwned Digest"
4. Click "Save"

Alternatively, you can use the Supabase CLI:
supabase auth config set --auth.enable_hibp true
*/

-- This SQL update can be used if you have direct access to the auth schema:
-- UPDATE auth.config SET enable_hibp = true;

-- Note: The above SQL command will only work if you have permissions to modify the auth schema.
-- In most cases, you'll need to use the dashboard or CLI methods instead.
