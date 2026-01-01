-- Drop the storage bucket approach and use database storage instead
-- This avoids RLS policy issues with Supabase Storage

-- The attachments column already exists, we just need to ensure it's properly set up
-- No storage bucket needed - files will be stored as base64 in the database
