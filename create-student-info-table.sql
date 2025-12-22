-- Create student_info table for tracking student performance per class
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS student_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Performance indicators (1 = yes/checked, 0 = no/unchecked)
  attendance SMALLINT NOT NULL DEFAULT 0 CHECK (attendance IN (0, 1)),
  homework SMALLINT NOT NULL DEFAULT 0 CHECK (homework IN (0, 1)),
  partner_recitation SMALLINT NOT NULL DEFAULT 0 CHECK (partner_recitation IN (0, 1)),
  jali SMALLINT NOT NULL DEFAULT 0 CHECK (jali IN (0, 1)),
  khafi SMALLINT NOT NULL DEFAULT 0 CHECK (khafi IN (0, 1)),
  akhfa SMALLINT NOT NULL DEFAULT 0 CHECK (akhfa IN (0, 1)),
  tone SMALLINT NOT NULL DEFAULT 0 CHECK (tone IN (0, 1)),
  fluency SMALLINT NOT NULL DEFAULT 0 CHECK (fluency IN (0, 1)),
  discipline SMALLINT NOT NULL DEFAULT 0 CHECK (discipline IN (0, 1)),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per student per class
  UNIQUE(registration_id, class_id)
);

-- Enable RLS
ALTER TABLE student_info ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated operations (app handles authorization)
CREATE POLICY "Enable read for all users" ON student_info
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON student_info
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON student_info
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON student_info
  FOR DELETE USING (true);

-- Create indexes for faster queries
CREATE INDEX idx_student_info_registration ON student_info(registration_id);
CREATE INDEX idx_student_info_class ON student_info(class_id);
CREATE INDEX idx_student_info_slot ON student_info(slot_id);
CREATE INDEX idx_student_info_admin ON student_info(admin_user_id);

-- Add setting for enabling student info feature
INSERT INTO settings (key, value) 
VALUES ('allow_student_info_entry', 'false')
ON CONFLICT (key) DO NOTHING;
