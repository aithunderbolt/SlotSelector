-- Add file attachments column to attendance table
ALTER TABLE attendance 
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- Create storage bucket for attendance files
INSERT INTO storage.buckets (id, name, public)
VALUES ('attendance-files', 'attendance-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for attendance files
CREATE POLICY "Authenticated users can upload attendance files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attendance-files');

CREATE POLICY "Authenticated users can view attendance files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'attendance-files');

CREATE POLICY "Authenticated users can delete attendance files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'attendance-files');
