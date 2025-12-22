-- Update student_info table to support configurable marks and attendance options
-- Run this in your Supabase SQL Editor

-- Step 1: Modify student_info table to change attendance field
ALTER TABLE student_info 
DROP CONSTRAINT IF EXISTS student_info_attendance_check;

ALTER TABLE student_info 
ALTER COLUMN attendance TYPE VARCHAR(20);

ALTER TABLE student_info 
ADD CONSTRAINT student_info_attendance_check 
CHECK (attendance IN ('present', 'absent', 'on_leave'));

-- Update existing data (if any) - convert 1 to 'present', 0 to 'absent'
UPDATE student_info 
SET attendance = CASE 
  WHEN attendance = '1' THEN 'present'
  WHEN attendance = '0' THEN 'absent'
  ELSE 'absent'
END
WHERE attendance IN ('0', '1');

-- Step 2: Add default mark settings for each indicator
-- These can be customized by super admin

-- Homework (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_homework', '1')
ON CONFLICT (key) DO NOTHING;

-- Partner Recitation (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_partner_recitation', '1')
ON CONFLICT (key) DO NOTHING;

-- Jali (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_jali', '1')
ON CONFLICT (key) DO NOTHING;

-- Khafi (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_khafi', '1')
ON CONFLICT (key) DO NOTHING;

-- Akhfa (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_akhfa', '1')
ON CONFLICT (key) DO NOTHING;

-- Tone (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_tone', '1')
ON CONFLICT (key) DO NOTHING;

-- Fluency (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_fluency', '1')
ON CONFLICT (key) DO NOTHING;

-- Discipline (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_discipline', '1')
ON CONFLICT (key) DO NOTHING;

-- Attendance - Present (default: 1)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_attendance_present', '1')
ON CONFLICT (key) DO NOTHING;

-- Attendance - Absent (default: 0)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_attendance_absent', '0')
ON CONFLICT (key) DO NOTHING;

-- Attendance - On Leave (default: 0.5)
INSERT INTO settings (key, value) 
VALUES ('student_info_marks_attendance_on_leave', '0.5')
ON CONFLICT (key) DO NOTHING;

-- Step 3: Create a view for easy querying of student info with calculated marks
CREATE OR REPLACE VIEW student_info_with_marks AS
SELECT 
  si.*,
  r.name as student_name,
  r.fathers_name,
  c.name as class_name,
  s.display_name as slot_name,
  -- Calculate marks based on settings (will be done in application)
  si.homework as homework_checked,
  si.partner_recitation as partner_recitation_checked,
  si.jali as jali_checked,
  si.khafi as khafi_checked,
  si.akhfa as akhfa_checked,
  si.tone as tone_checked,
  si.fluency as fluency_checked,
  si.discipline as discipline_checked,
  si.attendance as attendance_status
FROM student_info si
JOIN registrations r ON si.registration_id = r.id
JOIN classes c ON si.class_id = c.id
JOIN slots s ON si.slot_id = s.id;

-- Grant access to the view
GRANT SELECT ON student_info_with_marks TO authenticated;
