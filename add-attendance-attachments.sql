-- Add file attachments column to attendance table
-- Files are stored as base64 in JSONB format
-- Structure: [{"name": "file.jpg", "data": "data:image/jpeg;base64,...", "size": 150000, "type": "image/jpeg"}]

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendance' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE attendance ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Files modified to implement this functionality:
-- 1. src/components/AttendanceTracking.jsx (main implementation)
-- 2. src/components/AttendanceTracking.css (styling for file attachments)
-- 3. add-attendance-attachments.sql (this file - database migration)
