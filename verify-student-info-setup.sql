-- Verification queries for Student Information feature setup
-- Run these queries to verify the feature is set up correctly

-- 1. Check if student_info table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'student_info'
) AS student_info_table_exists;

-- 2. Check student_info table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'student_info'
ORDER BY ordinal_position;

-- 3. Check indexes on student_info table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'student_info';

-- 4. Check RLS policies on student_info table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'student_info';

-- 5. Check if setting exists
SELECT * FROM settings WHERE key = 'allow_student_info_entry';

-- 6. Check constraints on student_info table
SELECT conname, contype, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'student_info'::regclass;

-- 7. Count existing student_info records (should be 0 initially)
SELECT COUNT(*) as total_records FROM student_info;

-- 8. Sample query: Get student info with student names
SELECT 
  si.*,
  r.name as student_name,
  r.fathers_name,
  c.name as class_name,
  s.display_name as slot_name,
  (si.attendance + si.homework + si.partner_recitation + si.jali + 
   si.khafi + si.akhfa + si.tone + si.fluency + si.discipline) as total_marks
FROM student_info si
JOIN registrations r ON si.registration_id = r.id
JOIN classes c ON si.class_id = c.id
JOIN slots s ON si.slot_id = s.id
LIMIT 10;

-- 9. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'student_info';

-- Expected Results:
-- 1. student_info_table_exists: true
-- 2. Should show 14 columns (id, registration_id, class_id, slot_id, admin_user_id, 9 performance fields, created_at, updated_at)
-- 3. Should show 4 indexes (idx_student_info_registration, idx_student_info_class, idx_student_info_slot, idx_student_info_admin)
-- 4. Should show 4 RLS policies (read, insert, update, delete)
-- 5. Should show one row with key='allow_student_info_entry' and value='false' (or 'true' if enabled)
-- 6. Should show CHECK constraints for each performance field and UNIQUE constraint
-- 7. Should show 0 (or more if data has been entered)
-- 8. Will show sample data if any exists
-- 9. rowsecurity should be true
