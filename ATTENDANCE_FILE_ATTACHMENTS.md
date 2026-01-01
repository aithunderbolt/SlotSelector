# Attendance File Attachments

## Overview
Slot admins can attach image files when creating attendance records.

## Requirements
- **Minimum**: 1 file required
- **Maximum**: 3 files per record
- **File types**: Images only (jpg, png, etc.)
- **File size**: Max 200KB per file

## Database Changes
Run `add-attendance-attachments.sql` to:
- Add `attachments` JSONB column to attendance table
- Create `attendance-files` storage bucket
- Set up storage policies

## Features
- Upload 1-3 image files when creating attendance
- Add more files when editing (up to 3 total)
- Delete individual files from existing records
- File validation for type and size
- Preview selected files before submission

## Storage Structure
Files stored in Supabase Storage bucket `attendance-files`:
```
attendance-files/
  {attendance_id}/
    {timestamp}_{random}.{ext}
```

## Implementation
- Component: `src/components/AttendanceTracking.jsx`
- Styles: `src/components/AttendanceTracking.css`
- Migration: `add-attendance-attachments.sql`
