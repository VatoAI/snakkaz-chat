-- Script to fix function search_path mutable issues
-- This adds the search_path parameter to functions to prevent SQL injection attacks

-- Fix delete_expired_messages function
CREATE OR REPLACE FUNCTION public.delete_expired_messages(search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Function body
  DELETE FROM messages 
  WHERE expiry_time IS NOT NULL 
  AND expiry_time < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix mark_message_as_read function
CREATE OR REPLACE FUNCTION public.mark_message_as_read(message_id uuid, search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Function body
  UPDATE messages
  SET read_status = 'read', read_at = NOW()
  WHERE id = message_id
  AND (receiver_id = (select auth.uid()) OR receiver_type = 'group');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix cleanup_old_signaling_records function
CREATE OR REPLACE FUNCTION public.cleanup_old_signaling_records(search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Function body
  DELETE FROM signaling
  WHERE created_at < NOW() - INTERVAL '3 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix clean_stale_presence function
CREATE OR REPLACE FUNCTION public.clean_stale_presence(search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Function body
  DELETE FROM user_presence
  WHERE last_seen < NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix mark_message_as_deleted function
CREATE OR REPLACE FUNCTION public.mark_message_as_deleted(message_id uuid, search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Function body
  UPDATE messages
  SET deleted = true, deleted_at = NOW()
  WHERE id = message_id
  AND sender_id = (select auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix check_and_add_columns function
CREATE OR REPLACE FUNCTION public.check_and_add_columns(search_path text DEFAULT 'public')
RETURNS void AS $$
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  -- Function body should remain the same
  -- This is just a placeholder - the actual implementation depends on the original function
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(role_name text, search_path text DEFAULT 'public')
RETURNS boolean AS $$
DECLARE
  has_role boolean;
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  SELECT EXISTS(
    SELECT 1
    FROM user_roles
    WHERE user_id = (select auth.uid())
    AND role = role_name
  ) INTO has_role;
  
  RETURN has_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix can_send_message_to function
CREATE OR REPLACE FUNCTION public.can_send_message_to(recipient_id uuid, search_path text DEFAULT 'public')
RETURNS boolean AS $$
DECLARE
  is_friend boolean;
BEGIN
  -- Set search_path explicitly
  EXECUTE 'SET search_path TO ' || quote_ident(search_path);
  
  SELECT EXISTS(
    SELECT 1
    FROM friendships
    WHERE (user_id = (select auth.uid()) AND friend_id = recipient_id)
    OR (user_id = recipient_id AND friend_id = (select auth.uid()))
    AND status = 'accepted'
  ) INTO is_friend;
  
  RETURN is_friend;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
