-- First find the user ID
SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE email = 'jvzoo@gmail.com';

-- Then update with metadata (replace USER_ID with actual ID)
UPDATE auth.users
SET raw_user_meta_data = '{"first_name": "JVZoo", "last_name": "SuperAdmin", "role": "super_admin", "app_context": "smartcrm"}'::jsonb
WHERE email = 'jvzoo@gmail.com';