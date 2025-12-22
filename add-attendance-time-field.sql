-- Add time field to attendance table
ALTER TABLE attendance 
ADD COLUMN attendance_time TIME;

-- Add comment to explain the column
COMMENT ON COLUMN attendance.attendance_time IS 'Time when the class session took place';
