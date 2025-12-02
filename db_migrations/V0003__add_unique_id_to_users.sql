-- Add unique_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS unique_id VARCHAR(16) UNIQUE;

-- Create index on unique_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_unique_id ON users(unique_id);

-- Update existing users with generated unique_id based on their phone
UPDATE users SET unique_id = SUBSTRING(ENCODE(SHA256(REGEXP_REPLACE(phone, '[^0-9]', '', 'g')::bytea), 'hex'), 1, 16) WHERE unique_id IS NULL;