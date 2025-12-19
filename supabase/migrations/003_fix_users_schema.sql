-- Make password_hash nullable since Supabase Auth manages passwords
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

