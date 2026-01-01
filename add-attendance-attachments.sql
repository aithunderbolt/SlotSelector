-- Add file attachments column to attendance table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendance' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE attendance ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload attendance files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view attendance files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete attendance files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload attendance files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view attendance files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete attendance files" ON storage.objects;

-- Create storage bucket for attendance files (public for easier access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('attendance-files', 'attendance-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for attendance files
CREATE POLICY "Anyone can upload attendance files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attendance-files');

CREATE POLICY "Anyone can view attendance files"
ON storage.objects FOR SELECT
USING (bucket_id = 'attendance-files');

CREATE POLICY "Anyone can delete attendance files"
ON storage.objects FOR DELETE
USING (bucket_id = 'attendance-files');
