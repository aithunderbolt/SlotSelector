-- Fix RLS policies for classes and attendance tables
-- Run this if you already created the tables with the old policies

-- Drop old policies for classes table
DROP POLICY IF EXISTS "Super admins can manage classes" ON classes;
DROP POLICY IF EXISTS "Slot admins can view classes" ON classes;

-- Create new simple policies for classes
CREATE POLICY "Enable read for all users" ON classes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON classes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON classes
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON classes
  FOR DELETE USING (true);

-- Drop old policies for attendance table
DROP POLICY IF EXISTS "Super admins can view all attendance" ON attendance;
DROP POLICY IF EXISTS "Slot admins can manage their slot attendance" ON attendance;

-- Create new simple policies for attendance
CREATE POLICY "Enable read for all users" ON attendance
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON attendance
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON attendance
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON attendance
  FOR DELETE USING (true);
