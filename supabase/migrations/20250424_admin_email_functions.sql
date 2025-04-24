-- Creates a secure RPC function for fetching user emails
-- Only authenticated admin users can access this function

-- Function to get a user's email (admin only)
create or replace function get_user_email(user_id uuid)
returns text
language plpgsql security definer
as $$
declare
  requester_id uuid;
  is_admin boolean;
  user_email text;
begin
  -- Get the authenticated user's ID
  requester_id := auth.uid();
  
  -- Check if requester is authenticated
  if requester_id is null then
    raise exception 'Not authenticated';
  end if;
  
  -- Check if the requester has admin role
  select exists (
    select 1 
    from user_roles 
    where user_id = requester_id 
    and role = 'admin'
  ) into is_admin;
  
  if not is_admin then
    raise exception 'Access denied: Admin privileges required';
  end if;
  
  -- Get the requested user's email
  select email into user_email
  from auth.users
  where id = user_id;
  
  if user_email is null then
    return 'Ukjent e-post';
  end if;
  
  return user_email;
end;
$$;