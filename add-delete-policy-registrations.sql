-- Add DELETE policy for registrations table
-- This allows slot admins to delete registrations from their assigned slots

-- Create DELETE policy for registrations table
CREATE POLICY "Enable delete for all users" ON registrations
  FOR DELETE USING (true);
