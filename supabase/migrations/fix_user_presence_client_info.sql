ALTER TABLE user_presence ADD IF NOT EXISTS client_info JSONB DEFAULT '{}'::jsonb;
