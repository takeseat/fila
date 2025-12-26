-- Update existing users to have isActive = true if NULL
UPDATE users SET isActive = 1 WHERE isActive IS NULL;
